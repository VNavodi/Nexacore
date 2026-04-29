CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE PRECISION NOT NULL,
    stock_quantity INTEGER NOT NULL,
    category VARCHAR(100),
    sku VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    cost_price DOUBLE PRECISION,
    selling_price DOUBLE PRECISION,
    tax_rate DOUBLE PRECISION,
    tax_type VARCHAR(50),
    opening_stock INTEGER,
    reorder_level INTEGER,
    warehouse VARCHAR(100),
    unit_of_measure VARCHAR(50),
    custom_attributes JSON
);
    