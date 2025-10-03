"""AI-related endpoints and logic."""

import pandas as pd
import psycopg2
from fastapi import APIRouter
from prophet import Prophet

from constants import db_config

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/forecast/{product_no}")
def forecast_product(product_no: str, weeks: int = 8):
    conn = psycopg2.connect(**db_config)
    query = f"""
        SELECT DATE_TRUNC('week', transaction_date) AS week_start,
               SUM(quantity) AS total_sold
        FROM sales_transaction
        WHERE product_no = %s
        GROUP BY week_start
        ORDER BY week_start;
    """
    df = pd.read_sql(query, conn, params=[product_no])
    conn.close()

    df['week_start'] = pd.to_datetime(df['week_start'], utc=True)
    if df['week_start'].dt.tz is not None:
        df['week_start'] = df['week_start'].dt.tz_localize(None)

    # Preparar dados para Prophet
    df = df.rename(columns={"week_start": "ds", "total_sold": "y"})

    model = Prophet(weekly_seasonality=True)
    model.fit(df)

    future = model.make_future_dataframe(periods=weeks, freq="W")
    forecast = model.predict(future)

    result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(weeks)
    return result.to_dict(orient="records")
