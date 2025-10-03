"""
Code pertaining to product storage and sales transactions.
"""

import os
from typing import Optional

import psycopg2
from fastapi import APIRouter, HTTPException
from log import logger
from pydantic import BaseModel

from constants import db_config, CURRENT_DATE

router = APIRouter(prefix="/products", tags=["products"])


class ProductCreate(BaseModel):
    """Expected format for creating a new product."""

    product_no: str
    product_name: str
    price: float
    quantity: int


class TransactionCreate(BaseModel):
    """Expected format for creating a new sales transaction."""

    transaction_no: str
    transaction_date: str
    customer_no: int
    country: str
    product_no: str
    quantity: int
    price_at_sale: float


@router.post("/create")
async def create_product(product: ProductCreate):
    """
    Insert a new product into the database.
    @param product: The product to be inserted into our database.
    """

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                insert_query = """
                INSERT INTO product (product_no, product_name, price, quantity)
                VALUES (%s, %s, %s, %s)
                """
                cur.execute(
                    insert_query,
                    (
                        product.product_no,
                        product.product_name,
                        product.price,
                        product.quantity,
                    ),
                )
                conn.commit()
                logger.info(f"Product {product.product_no} inserted successfully")

                return {
                    "message": "Product created successfully",
                    "product": product.dict(),
                }

    except psycopg2.IntegrityError as e:
        logger.error(f"Product {product.product_no} already exists: {e}")
        raise HTTPException(
            status_code=400, detail=f"Product {product.product_no} already exists"
        ) from e
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.get("/in-stock")
async def in_storage():
    """Returns the amount of products currently in stock (quantity > 0)."""

    count = 0
    logger.debug("Fetching the count of products in stock")

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM product WHERE quantity > 0")
                products = cur.fetchall()

                for product in products:
                    count += product[3]
        return {"in_stock": count}

    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.get("/sales/last-months")
async def get_sales_last_months(months: int = 3):
    """
    Get the number of sales and total profit for the last N months.
    @param months: The last N months which we are going to analyze. Default is 3.
    """

    logger.debug(f"Fetching sales and profit for the last {months} months")

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                summary_query = """
                SELECT 
                    COUNT(*) as total_transactions,
                    SUM(st.quantity) as total_quantity_sold,
                    SUM(st.price_at_sale * st.quantity) as total_revenue
                FROM sales_transaction st
                JOIN product p ON st.product_no = p.product_no
                WHERE st.transaction_date < %s
                  AND st.transaction_date >= %s - INTERVAL '%s months'
                """

                cur.execute(summary_query, (CURRENT_DATE, CURRENT_DATE, months))
                summary_result = cur.fetchone()

                monthly_query = """
                SELECT 
                    DATE_TRUNC('month', st.transaction_date) as month_start,
                    COUNT(*) as transactions,
                    SUM(st.quantity) as quantity_sold,
                    SUM(st.price_at_sale * st.quantity) as revenue
                FROM sales_transaction st
                JOIN product p ON st.product_no = p.product_no
                WHERE st.transaction_date < %s
                  AND st.transaction_date >= %s - INTERVAL '%s months'
                GROUP BY DATE_TRUNC('month', st.transaction_date)
                ORDER BY month_start DESC
                """

                cur.execute(monthly_query, (CURRENT_DATE, CURRENT_DATE, months))
                monthly_results = cur.fetchall()

                return {
                    "period": f"Last {months} months",
                    "summary": {
                        "total_transactions": (
                            summary_result[0] if summary_result[0] else 0
                        ),
                        "total_quantity_sold": (
                            summary_result[1] if summary_result[1] else 0
                        ),
                        "total_revenue": (
                            float(summary_result[2]) if summary_result[2] else 0.0
                        ),
                    },
                    "monthly_breakdown": [
                        {
                            "month": row[0].strftime("%Y-%m") if row[0] else None,
                            "month_start": row[0].isoformat() if row[0] else None,
                            "transactions": row[1],
                            "quantity_sold": row[2],
                            "revenue": float(row[3]) if row[3] else 0.0,
                        }
                        for row in monthly_results
                    ],
                }

    except Exception as e:
        logger.error(f"Error fetching sales and profit data: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.get("/")
async def get_products(
    product_no: Optional[str] = None,
    product_name: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
):
    """
    Get all products from the database.
    @param product_no: Optional filter by product number.
    @param product_name: Optional filter by product name.
    @param page: Page number for pagination (default is 1).
    @param page_size: Number of items per page (default is 20, max is 200).
    """

    logger.debug(
        f"Fetching products filters: product_no={product_no}, product_name={product_name}, page={page}, page_size={page_size}"
    )

    if page < 1 or page_size < 1 or page_size > 200:
        raise HTTPException(status_code=400, detail="Invalid page or page_size")

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                base_query = "FROM product"
                params = []
                conditions = []

                for column, value in [
                    ("product_no", product_no),
                    ("product_name", product_name),
                ]:
                    if value is not None:
                        conditions.append(f"{column} = %s")
                        params.append(value)

                where_clause = ""
                if conditions:
                    where_clause = " WHERE " + " AND ".join(conditions)

                # Total count
                count_query = f"SELECT COUNT(*) {base_query}{where_clause}"
                cur.execute(count_query, params)
                total = cur.fetchone()[0]

                # Pagination
                offset = (page - 1) * page_size
                data_query = (
                    f"SELECT product_no, product_name, price, quantity "
                    f"{base_query}{where_clause} "
                    "ORDER BY product_no "
                    "LIMIT %s OFFSET %s"
                )
                cur.execute(data_query, params + [page_size, offset])
                rows = cur.fetchall()

                products = [
                    {
                        "product_no": r[0],
                        "product_name": r[1],
                        "price": float(r[2]),
                        "quantity": r[3],
                    }
                    for r in rows
                ]

                total_pages = (total + page_size - 1) // page_size if total else 0

                return {
                    "products": products,
                    "pagination": {
                        "total": total,
                        "page": page,
                        "page_size": page_size,
                        "total_pages": total_pages,
                        "has_next": page < total_pages,
                        "has_prev": page > 1,
                    },
                }

    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.post("/transactions/create")
async def create_transaction(transaction: TransactionCreate):
    """
    Registers a new sales transaction and updates our product inventory.
    @param transaction: The sales transaction to be created.
    """

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                cur.execute("BEGIN")

                cur.execute(
                    "SELECT quantity FROM product WHERE product_no = %s",
                    (transaction.product_no,),
                )
                result = cur.fetchone()

                if not result:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Product {transaction.product_no} not found",
                    )

                current_quantity = result[0]

                if current_quantity < transaction.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Insufficient inventory. Available: {current_quantity}; requested: {transaction.quantity}",
                    )

                insert_transaction_query = """
                INSERT INTO sales_transaction 
                (transaction_no, transaction_date, customer_no, country, product_no, quantity, price_at_sale)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cur.execute(
                    insert_transaction_query,
                    (
                        transaction.transaction_no,
                        transaction.transaction_date,
                        transaction.customer_no,
                        transaction.country,
                        transaction.product_no,
                        transaction.quantity,
                        transaction.price_at_sale,
                    ),
                )

                update_product_query = """
                UPDATE product 
                SET quantity = quantity - %s 
                WHERE product_no = %s
                """
                cur.execute(
                    update_product_query, (transaction.quantity, transaction.product_no)
                )

                conn.commit()

                logger.info(
                    f"Transaction {transaction.transaction_no} created successfully. Product {transaction.product_no} inventory reduced by {transaction.quantity}"
                )

                return {
                    "message": "Transaction created successfully",
                    "transaction": transaction.dict(),
                    "remaining_inventory": current_quantity - transaction.quantity,
                }

    except psycopg2.IntegrityError as e:
        logger.error(f"Transaction integrity error: {e}")
        raise HTTPException(
            status_code=400, detail="Transaction already exists or invalid data"
        ) from e
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating transaction: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.get("/transactions/")
async def get_transactions(product_no: Optional[str] = None):
    """
    Get all sales transactions from the database.
    @param product_no: Optional filter by product number.
    """

    logger.debug(f"Fetching transactions with filter: product_no={product_no}")

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                query = "SELECT * FROM sales_transaction"
                params = []
                conditions = []

                if product_no is not None:
                    conditions.append("product_no = %s")
                    params.append(product_no)

                if conditions:
                    query += " WHERE " + " AND ".join(conditions)
                cur.execute(query, params)
                transactions = cur.fetchall()

                return {
                    "transactions": [
                        {
                            "transaction_no": row[0],
                            "transaction_date": row[1].isoformat(),
                            "customer_no": row[2],
                            "country": row[3],
                            "product_no": row[4],
                            "quantity": row[5],
                            "price_at_sale": float(row[6]),
                        }
                        for row in transactions
                    ]
                }

    except Exception as e:
        logger.error(f"Error fetching transactions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.get("/stock-alerts")
async def get_stock_alerts():
    """
    Returns count of products with low and critical stock
    """

    logger.debug("Fetching stock alerts for products")

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                # Critical stock (< 20)
                cur.execute("SELECT COUNT(*) FROM product WHERE quantity < 20")
                critical = cur.fetchone()[0]

                # Low stock (>= 20 and < 50)
                cur.execute("SELECT COUNT(*) FROM product WHERE quantity >= 20 AND quantity < 50")
                low = cur.fetchone()[0]

                total_alerts = critical + low

                return {
                    "critical": critical,
                    "low": low,
                    "total_alerts": total_alerts,
                }

    except Exception as e:
        logger.error(f"Error fetching stock alerts: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.get("/sales/growth")
async def get_sales_growth(months: int = 2):
    """
    Calculates the percentage growth of sales between months
    """

    logger.debug(f"Calculating sales growth for the last {months} months")

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                # Fetch sales data for the last N months
                cur.execute(
                    """
                    SELECT 
                        DATE_TRUNC('month', transaction_date) as month,
                        SUM(price_at_sale * quantity) as total_revenue,
                        SUM(quantity) as total_quantity
                    FROM sales_transaction
                    WHERE transaction_date >= CURRENT_DATE - INTERVAL '%s months'
                    GROUP BY DATE_TRUNC('month', transaction_date)
                    ORDER BY month DESC
                    LIMIT %s
                    """,
                    (months, months),
                )
                results = cur.fetchall()

                if len(results) < 2:
                    return {
                        "growth_percentage": 0,
                        "current_month_revenue": results[0][1] if results else 0,
                        "previous_month_revenue": 0,
                    }

                current_month = results[0]
                previous_month = results[1]

                current_revenue = float(current_month[1])
                previous_revenue = float(previous_month[1])

                # Calculate percentage growth
                if previous_revenue > 0:
                    growth = ((current_revenue - previous_revenue) / previous_revenue) * 100
                else:
                    growth = 0

                return {
                    "growth_percentage": round(growth, 1),
                    "current_month_revenue": round(current_revenue, 2),
                    "previous_month_revenue": round(previous_revenue, 2),
                    "current_month": current_month[0].strftime("%Y-%m"),
                    "previous_month": previous_month[0].strftime("%Y-%m"),
                }

    except Exception as e:
        logger.error(f"Error calculating sales growth: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e
