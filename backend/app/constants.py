import os
from datetime import date

db_config = {
    "host": "database",
    "port": 5432,
    "dbname": os.environ.get("POSTGRESQL_DATABASE"),
    "user": os.environ.get("POSTGRESQL_USERNAME"),
    "password": os.environ.get("POSTGRESQL_PASSWORD"),
}

# Para simular a aplicação coerentemente no período do dataset
CURRENT_DATE = date(2019, 7, 27)