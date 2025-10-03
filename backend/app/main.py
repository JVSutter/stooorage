import os

import psycopg2
import storage
import uvicorn
from fastapi import FastAPI
from log import get_logger

app = FastAPI(
    title="Stooorage Backend",
    description="API para Previsão de Demanda e Otimização de Estoque.",
)

app.include_router(storage.router)


@app.on_event("startup")
async def config():
    """
    Sets up PostgreSQL
    """

    logger = get_logger()
    logger.info("Attempting to connect to PostgreSQL...")
    for i in range(10):
        try:
            conn = psycopg2.connect(
                host="database",
                port=5432,
                dbname=os.environ.get("POSTGRESQL_DATABASE"),
                user=os.environ.get("POSTGRESQL_USERNAME"),
                password=os.environ.get("POSTGRESQL_PASSWORD"),
            )
            conn.close()
            logger.info("PostgreSQL is available.")
            break
        except psycopg2.OperationalError as e:
            logger.warning(f"PostgreSQL not available yet ({e}), retrying in 1 seconds...")
            import time

            time.sleep(1)
    try:
        with psycopg2.connect(
            host="database",
            port=5432,
            dbname=os.environ.get("POSTGRESQL_DATABASE"),
            user=os.environ.get("POSTGRESQL_USERNAME"),
            password=os.environ.get("POSTGRESQL_PASSWORD"),
        ) as conn:
            with conn.cursor() as cur:
                logger.info("Connected to PostgreSQL successfully.")
                logger.info("Setting up the database schema...")

                sql_file_path = "/app/database/schema.sql"
                logger.info(f"Executing SQL file: {sql_file_path}")

                with open(sql_file_path, "r") as sql_file:
                    sql_content = sql_file.read()

                cur.execute(sql_content)
                conn.commit()
                logger.info("Database schema has been set up successfully.")

    except FileNotFoundError:
        logger.error(f"SQL file not found: {sql_file_path}")
    except psycopg2.Error as e:
        logger.error(f"Database error: {e}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")

    logger.info("Database setup completed")


@app.get("/")
async def root():
    """
    Endpoint inicial para testar se a API está online.
    """
    return {"message": "Bem-vindo ao Stooorage! API está operacional."}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
