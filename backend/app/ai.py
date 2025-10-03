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

@router.get("/forecast/all")
def forecast_all(periods: int = 8, frequency: str = "month"):
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
            detail="Frequência inválida. Use 'week' ou 'month'."
        )

    # Conexão e consulta com join para pegar product_name
    conn = psycopg2.connect(**db_config)
    query = f"""
        SELECT st.product_no,
               p.product_name,
               DATE_TRUNC('{sql_trunc}', st.transaction_date) AS period_start,
               SUM(st.quantity) AS total_sold
        FROM sales_transaction st
        JOIN product p ON st.product_no = p.product_no
        GROUP BY st.product_no, p.product_name, period_start
        ORDER BY p.product_name, period_start;
    """
    df = pd.read_sql(query, conn)
    conn.close()

    if df.empty:
        raise HTTPException(status_code=404, detail="No sales data found")

    results = {}

    i = 0
    for product_name, group in df.groupby("product_name"):
        i += 1

        if i > 10:
            break

        # Preparar dados
        temp_df = group.rename(columns={"period_start": "ds", "total_sold": "y"})
        temp_df["ds"] = pd.to_datetime(temp_df["ds"], utc=True)
        if temp_df["ds"].dt.tz is not None:
            temp_df["ds"] = temp_df["ds"].dt.tz_localize(None)

        # Datas contínuas
        temp_df = temp_df.set_index("ds").resample(resample_rule).sum().reset_index()
        temp_df["y"] = temp_df["y"].fillna(0)

        # Verificar se há pelo menos 2 períodos com vendas
        if temp_df["y"].sum() == 0 or len(temp_df) < 2:
            continue

        # Capacidade máxima
        temp_df["cap"] = temp_df["y"].max() * 1.2
        temp_df["floor"] = 0

        # Modelo Prophet
        model = Prophet(
            growth="logistic",
            weekly_seasonality=(frequency == "week"),
            yearly_seasonality=True,
        )
        model.fit(temp_df)

        # Dataframe futuro
        future = model.make_future_dataframe(periods=periods, freq=prophet_freq)
        if future['ds'].dt.tz is not None:
            future['ds'] = future['ds'].dt.tz_localize(None)
        future["cap"] = temp_df["cap"].max()
        future["floor"] = 0

        # Previsão
        forecast = model.predict(future)
        forecast["yhat"] = forecast["yhat"].clip(lower=0).round(0)
        forecast["yhat_lower"] = forecast["yhat_lower"].clip(lower=0).round(0)
        forecast["yhat_upper"] = forecast["yhat_upper"].clip(lower=0).round(0)

        # Apenas períodos futuros
        temp_result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(periods)
        temp_result["ds"] = temp_result["ds"].dt.strftime("%Y-%m-%d")

        # Adicionar ao dict usando o nome do produto como chave
        results[product_name] = temp_result.to_dict(orient="records")

    return results


@router.get("/forecast/total/{periods}")
def forecast_total(periods: int = 8, frequency: str = "month"):
    frequency = frequency.lower()
    frequency = "week"
    periods = 40
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
    # df = df.set_index("ds").resample(resample_rule).sum().reset_index()
    # df["y"] = df["y"].fillna(0)

    # Adicionar capacidade máxima para crescimento logístico
    # df["cap"] = df["y"].max() * 1.2  # 20% acima do máximo histórico
    # # Opcional: floor
    # df["floor"] = 0

    # Modelo Prophet
    model = Prophet(
        # growth="logistic",
        weekly_seasonality=True,
        yearly_seasonality=True,
    )
    model.fit(df)

    # Dataframe futuro
    future = model.make_future_dataframe(periods=periods, freq=prophet_freq)
    if future['ds'].dt.tz is not None:
        future['ds'] = future['ds'].dt.tz_localize(None)
    # Adicionar cap/floor no futuro
    # future["cap"] = df["cap"].max()
    # future["floor"] = 0

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
