import os

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

    product_no: int
    product_name: str
    price: float
    quantity: int


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


@router.get("/")
async def get_products():
    """Get all products from the database."""

    try:
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM product")
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
        logger = get_logger()
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e
