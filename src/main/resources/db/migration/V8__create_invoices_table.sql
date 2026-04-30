CREATE TABLE invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    grand_total DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    qty INT NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0,
    line_total DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
