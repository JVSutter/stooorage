import os
from typing import Dict

import psycopg2
import uvicorn
from fastapi import FastAPI
from log import get_logger

app = FastAPI(
    title="Stooorage Backend",
    description="API para Previsão de Demanda e Otimização de Estoque.",
)


@app.on_event("startup")
async def config():
    """
    Sets up PostgreSQL
    """

    logger = get_logger()
    logger.info("Attempting to connect to PostgreSQL...")

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


@app.get("/previsao/{sku_code}", response_model=Dict)
async def get_previsao(sku_code: str):
    """
    Retorna a previsão de demanda para um SKU específico nas próximas 4 semanas.

    Esta rota simula a resposta que viria do seu modelo de IA.
    """

    # Simulação da saída da IA (seus dados reais viriam do banco de dados)
    if sku_code.upper() == "PDR_001A":
        previsoes = {
            "sku": sku_code.upper(),
            "unidade": "UN",
            "previsao_semanal": [
                {"semana": 1, "demanda_prevista": 150, "risco": "Baixo"},
                {"semana": 2, "demanda_prevista": 165, "risco": "Baixo"},
                {"semana": 3, "demanda_prevista": 210, "risco": "Medio"},
                {"semana": 4, "demanda_prevista": 180, "risco": "Baixo"},
            ],
            "recomendacao": "Estoque Atual: 120. Sugestão: Pedir 150 unidades hoje.",
        }
        return previsoes

    else:
        return {
            "sku": sku_code,
            "message": "SKU não encontrado ou dados insuficientes para previsão.",
        }


if __name__ == "__main__":
    config()
    uvicorn.run(app, host="0.0.0.0", port=8000)
