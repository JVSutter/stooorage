import os

import ai
import psycopg2
import storage
import uvicorn
from fastapi import FastAPI
from log import logger

app = FastAPI(
    title="Stooorage Backend",
    description="API for Demand Forecasting and Inventory Optimization.",
)

app.include_router(storage.router)
app.include_router(ai.router)


@app.on_event("startup")
def config():
    """
    Sets up PostgreSQL
    """
    sql_file_path = "../database/schema.sql"
    csv_path = "../database/sales_transaction.csv"

    logger.info("Attempting to connect to PostgreSQL...")
    for _ in range(10):
        try:
            conn = psycopg2.connect(**storage.db_config)
            conn.close()
            logger.info("PostgreSQL is available.")
            break
        except psycopg2.OperationalError as e:
            logger.warning(
                f"PostgreSQL not available yet ({e}), retrying in 1 seconds..."
            )
            import time

            time.sleep(1)
    try:
        with psycopg2.connect(**storage.db_config) as conn:
            with conn.cursor() as cur:
                logger.info("Connected to PostgreSQL successfully.")
                logger.info("Setting up the database schema...")

                sql_file_path = "../database/schema.sql"
                logger.info(f"Executing SQL file: {sql_file_path}")

                with open(sql_file_path, "r") as sql_file:
                    sql_content = sql_file.read()

                cur.execute(sql_content)
                conn.commit()
                logger.info("Database schema has been set up successfully.")
                cur.execute("SELECT COUNT(*) FROM product;")
                existing = cur.fetchone()[0]
                if existing > 0:
                    logger.info(
                        f"Skipping population (product table already has {existing} rows)."
                    )
                    return

                # 3. Populate (Python version of populate.sql)
                if not os.path.isfile(csv_path):
                    logger.warning(f"CSV not found, skipping population: {csv_path}")
                    return

                logger.info("Populating database with sample data...")

                # staging table
                cur.execute("DROP TABLE IF EXISTS staging_sales;")
                cur.execute(
                    """
                    CREATE TABLE staging_sales (
                        transaction_no   VARCHAR(10),
                        transaction_date TEXT,
                        product_no       VARCHAR(10),
                        product_name     TEXT,
                        price            NUMERIC(10,2),
                        quantity         INT,
                        customer_no      INT,
                        country          TEXT
                    );
                    """
                )

                copy_sql = """
                COPY staging_sales(transaction_no, transaction_date, product_no, product_name, price, quantity, customer_no, country)
                FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL 'NA')
                """
                with open(csv_path, "r", encoding="utf-8") as f:
                    cur.copy_expert(copy_sql, f)

                # Aggregate into product
                cur.execute(
                    """
                    INSERT INTO product (product_no, product_name, price, quantity)
                    SELECT
                        product_no,
                        product_name,
                        COALESCE(price, 0),
                        COALESCE(SUM(quantity), 0)
                    FROM staging_sales
                    WHERE product_no IS NOT NULL AND product_name IS NOT NULL
                    GROUP BY product_no, product_name, price
                    ON CONFLICT (product_no) DO NOTHING;
                    """
                )

                # Insert sales transactions
                cur.execute(
                    """
                    INSERT INTO sales_transaction (transaction_no, transaction_date, customer_no, country, product_no, quantity, price_at_sale)
                    SELECT
                        transaction_no,
                        TO_DATE(transaction_date, 'MM/DD/YYYY'),
                        customer_no,
                        country,
                        product_no,
                        COALESCE(quantity, 0),
                        COALESCE(price, 0)
                    FROM staging_sales
                    WHERE transaction_no IS NOT NULL AND product_no IS NOT NULL
                    ON CONFLICT (transaction_no, product_no) DO NOTHING;
                    """
                )

                # Cleanup staging
                cur.execute("DROP TABLE staging_sales;")

                # Counts
                cur.execute("SELECT COUNT(*) FROM product;")
                pcount = cur.fetchone()[0]
                cur.execute("SELECT COUNT(*) FROM sales_transaction;")
                scount = cur.fetchone()[0]

                conn.commit()
                logger.info(
                    f"Population complete: product={pcount}, sales_transaction={scount}"
                )

    except FileNotFoundError:
        logger.error(f"SQL file not found: {sql_file_path}")
    except psycopg2.Error as e:
        logger.error(f"Database error: {e}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")

    logger.info("Database setup completed")


@app.get("/")
def root():
    """
    Initial endpoint to verify the API is online
    """
    return {"message": "hello World!"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
