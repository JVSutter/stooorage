import os
from typing import Optional

import psycopg2
from fastapi import APIRouter, HTTPException
from log import get_logger
from pydantic import BaseModel

router = APIRouter(prefix="/products", tags=["products"])
db_config = {
    "host": "database",
    "port": 5432,
    "dbname": os.environ.get("POSTGRESQL_DATABASE"),
    "user": os.environ.get("POSTGRESQL_USERNAME"),
    "password": os.environ.get("POSTGRESQL_PASSWORD"),
}


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
    """Insert a new product into the database."""
    logger = get_logger()

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
    logger = get_logger()
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


@router.get("/")
async def get_products(
    product_no: Optional[str] = None, product_name: Optional[str] = None
):
    """Get all products from the database."""

    logger = get_logger()
    logger.debug(
        f"Fetching products with filters: product_no={product_no}, product_name={product_name}"
    )

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                query = "SELECT * FROM product"
                params = []
                conditions = []

                for condition, value in [
                    ("product_no", product_no),
                    ("product_name", product_name),
                ]:
                    if value is not None:
                        conditions.append(f"{condition} = %s")
                        params.append(value)

                if conditions:
                    query += " WHERE " + " AND ".join(conditions)

                cur.execute(query, params)
                products = cur.fetchall()

                return {
                    "products": [
                        {
                            "product_no": row[0],
                            "product_name": row[1],
                            "price": float(row[2]),
                            "quantity": row[3],
                        }
                        for row in products
                    ]
                }

    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.post("/transactions/create")
async def create_transaction(transaction: TransactionCreate):
    """Registers a new sales transaction and updates our product inventory."""

    logger = get_logger()

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
    """Get all sales transactions from the database."""

    logger = get_logger()
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
