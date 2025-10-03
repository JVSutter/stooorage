"""AI-related endpoints and logic."""

import pandas as pd
import psycopg2

from fastapi import APIRouter, HTTPException
from prophet import Prophet
from log import logger

from constants import db_config

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/forecast/id/{product_no}")
def forecast_product(product_no: str, periods: int = 8, frequency: str = "month"):
    frequency = frequency.lower()
    frequency = 'week'
    if frequency == "week":
        sql_trunc = 'week'
        prophet_freq = 'W'
        resample_rule = 'W'
        weekly_seasonality = True

    elif frequency == "month":
        sql_trunc = 'month'
        prophet_freq = 'M'
        resample_rule = 'M'
        weekly_seasonality = False
    else:
        raise HTTPException(
            status_code=400,
            detail="Frequência inválida. Use 'week' ou 'month'."
        )

    # Conexão e consulta
    conn = psycopg2.connect(**db_config)
    query = f"""
        SELECT DATE_TRUNC('{sql_trunc}', transaction_date) AS period_start,
               SUM(quantity) AS total_sold
        FROM sales_transaction
        WHERE product_no = %s
        GROUP BY period_start
        ORDER BY period_start;
    """
    df = pd.read_sql(query, conn, params=[product_no])
    conn.close()

    if df.empty:
        raise HTTPException(status_code=404, detail="No sales data found for this product")

    # Preparar dados
    df = df.rename(columns={"period_start": "ds", "total_sold": "y"})
    df["ds"] = pd.to_datetime(df["ds"], utc=True)
    if df["ds"].dt.tz is not None:
        df["ds"] = df["ds"].dt.tz_localize(None)

    # # Datas contínuas
    df = df.set_index("ds").resample(resample_rule).sum().reset_index()
    df["y"] = df["y"].fillna(0)

    # Capacidade máxima para crescimento logístico
    df["cap"] = df["y"].max() * 1.2
    df["floor"] = 0

    # Modelo Prophet
    model = Prophet(
        growth="logistic",
        weekly_seasonality=True,
        yearly_seasonality=False,
    )
    model.fit(df)

    # Dataframe futuro
    future = model.make_future_dataframe(periods=periods, freq=prophet_freq)
    if future['ds'].dt.tz is not None:
        future['ds'] = future['ds'].dt.tz_localize(None)
    future["cap"] = df["cap"].max()
    future["floor"] = 0

    # Previsão
    forecast = model.predict(future)

    logger.info(forecast)
    logger.info("\n")
    logger.info(df)
    # Garantir valores positivos e arredondar
    forecast["yhat"] = forecast["yhat"].clip(lower=0).round(0)
    forecast["yhat_lower"] = forecast["yhat_lower"].clip(lower=0).round(0)
    forecast["yhat_upper"] = forecast["yhat_upper"].clip(lower=0).round(0)

    # Retornar apenas os períodos futuros
    result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(periods)
    result["ds"] = result["ds"].dt.strftime("%Y-%m-%d")

    return result.to_dict(orient="records")

@router.get("/forecast/total/{periods}")
def forecast_total(periods: int = 8, frequency: str = "month"):
    frequency = frequency.lower()
    if frequency == "week":
        sql_trunc = 'week'
        prophet_freq = 'W'
        resample_rule = 'W'
    elif frequency == "month":
        sql_trunc = 'month'
        prophet_freq = 'M'
        resample_rule = 'M'
    else:
        raise HTTPException(
            status_code=400,
            detail="Frequência inválida. Use 'week' (semana) ou 'month' (mês)."
        )

    # Conexão e consulta
    conn = psycopg2.connect(**db_config)
    query = f"""
        SELECT DATE_TRUNC('{sql_trunc}', transaction_date) AS period_start,
               SUM(quantity) AS total_sold
        FROM sales_transaction
        GROUP BY period_start
        ORDER BY period_start;
    """
    df = pd.read_sql(query, conn)
    conn.close()

    if df.empty:
        raise HTTPException(status_code=404, detail="No sales data found for total forecast")

    # Preparar dados
    df = df.rename(columns={"period_start": "ds", "total_sold": "y"})
    df["ds"] = pd.to_datetime(df["ds"], utc=True)
    if df["ds"].dt.tz is not None:
        df["ds"] = df["ds"].dt.tz_localize(None)

    # Datas contínuas
    df = df.set_index("ds").resample(resample_rule).sum().reset_index()
    df["y"] = df["y"].fillna(0)

    # Adicionar capacidade máxima para crescimento logístico
    df["cap"] = df["y"].max() * 1.2  # 20% acima do máximo histórico
    # Opcional: floor
    df["floor"] = 0

    # Modelo Prophet
    model = Prophet(
        growth="logistic",
        weekly_seasonality=(frequency == "week"),
        yearly_seasonality=True,
    )
    model.fit(df)

    # Dataframe futuro
    future = model.make_future_dataframe(periods=periods, freq=prophet_freq)
    if future['ds'].dt.tz is not None:
        future['ds'] = future['ds'].dt.tz_localize(None)
    # Adicionar cap/floor no futuro
    future["cap"] = df["cap"].max()
    future["floor"] = 0

    # Previsão
    forecast = model.predict(future)

    # Garantir valores positivos e arredondar
    forecast["yhat"] = forecast["yhat"].clip(lower=0).round(0)
    forecast["yhat_lower"] = forecast["yhat_lower"].clip(lower=0).round(0)
    forecast["yhat_upper"] = forecast["yhat_upper"].clip(lower=0).round(0)

    # Retornar apenas os períodos futuros
    result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(periods)
    result["ds"] = result["ds"].dt.strftime("%Y-%m-%d")

    return result.to_dict(orient="records")
