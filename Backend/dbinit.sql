

CREATE DATABASE IF NOT EXISTS stocks;
CREATE TABLE IF NOT EXISTS stocks.batch(
    batch_id UUID NOT NULL PRIMARY KEY,
    batch_name TEXT NOT NULL ,
    product_name TEXT NOT NULL,
    product_id UUID NOT NULL,
    sku TEXT NOT NULL,
    quantity INT8 NOT NULL,
    price INT8 NOT NULL,
    batch_date DATE NOT NULL,
    valid_upto TEXT ,
    manufactured_date DATE NOT NULL,
    vendor TEXT NOT NULL,
    vendor_location TEXT NOT NULL 
);
CREATE TABLE IF NOT EXISTS stocks.product(
    product_id UUID PRIMARY KEY NOT NULL,
    SKU TEXT UNIQUE,
    product_name TEXT UNIQUE,
    summary TEXT,
    category TEXT NOT NULL,
    selling_price INT8 NOT NULL,
    manufacturer TEXT NOT NULL,
    warranty TEXT
);

ALTER TABLE stocks.batch ADD FOREIGN KEY (product_id) REFERENCES product(product_id);

CREATE INDEX product_name_asc ON product (product_name ASC);