CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE PRECISION NOT NULL,
    stock_quantity INTEGER NOT NULL,
    category VARCHAR(100),
    sku VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);