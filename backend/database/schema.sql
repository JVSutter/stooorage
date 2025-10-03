-- Product table
CREATE TABLE IF NOT EXISTS product (
    product_no   VARCHAR(10) PRIMARY KEY,
    product_name TEXT NOT NULL,
    price        NUMERIC(10,2) NOT NULL,
    quantity     INT NOT NULL
);


-- Sales transaction table
CREATE TABLE IF NOT EXISTS sales_transaction (
    transaction_no   VARCHAR(10),
    transaction_date DATE,
    customer_no      INT,
    country          TEXT,
    product_no       VARCHAR(10) REFERENCES product(product_no),
    quantity         INT NOT NULL,
    price_at_sale    NUMERIC(10,2) NOT NULL,
    PRIMARY KEY (transaction_no, product_no)
);