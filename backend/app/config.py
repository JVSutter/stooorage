import os

import psycopg2


def config():
    print("Conectando ao banco de dados PostgreSQL...")

    # Replace with your actual settings
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        dbname=os.environ.get("POSTGRESQL_DATABASE"),
        user=os.environ.get("POSTGRESQL_USER"),
        password=os.environ.get("POSTGRESQL_PASSWORD"),
    )

    cur = conn.cursor()
    cur.execute("SELECT version();")
    print(cur.fetchone())

    cur.close()
    conn.close()
