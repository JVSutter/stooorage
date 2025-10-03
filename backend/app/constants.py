import os

db_config = {
    "host": "database",
    "port": 5432,
    "dbname": os.environ.get("POSTGRESQL_DATABASE"),
    "user": os.environ.get("POSTGRESQL_USERNAME"),
    "password": os.environ.get("POSTGRESQL_PASSWORD"),
}