from fastapi import APIRouter
import pandas as pd
import psycopg2
from prophet import Prophet

router = APIRouter(prefix="/ai", tags=["ai"])

DB_DSN = (
    "host='DB_HOST' "
    "port='5432' "
    "dbname='DB_NAME' "
    "user='DB_USER' "
    "password='DB_PASSWORD'"
)


@router.get("/forecast/{product_no}")
def forecast_product(product_no: str, weeks: int = 8):
    conn = psycopg2.connect(DB_DSN)
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

    # Preparar dados para Prophet
    df = df.rename(columns={"week_start": "ds", "total_sold": "y"})
    
    model = Prophet(weekly_seasonality=True)
    model.fit(df)

    future = model.make_future_dataframe(periods=weeks, freq="W")
    forecast = model.predict(future)

    result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(weeks)
    return result.to_dict(orient="records")
