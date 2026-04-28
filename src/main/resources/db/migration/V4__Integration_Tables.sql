-- V4__Integration_Tables.sql
-- Create tables for webhook integration, stock reservations, conflicts, and sync logs

CREATE TABLE webhook_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idempotency_key VARCHAR(255) NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    payload LONGTEXT NOT NULL,
    source VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    external_order_id VARCHAR(255),
    internal_order_id BIGINT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    processed_at TIMESTAMP,
    last_retry_at TIMESTAMP,
    INDEX idx_idempotency_key (idempotency_key),
    INDEX idx_event_type (event_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

CREATE TABLE stock_reservations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    external_order_id BIGINT,
    internal_order_id BIGINT,
    product_id BIGINT NOT NULL,
    sku VARCHAR(100) NOT NULL,
    reserved_quantity INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    reason VARCHAR(255),
    reserved_at TIMESTAMP NOT NULL,
    confirmed_at TIMESTAMP,
    released_at TIMESTAMP,
    expires_at TIMESTAMP,
    source VARCHAR(50),
    INDEX idx_order_id (external_order_id),
    INDEX idx_status (status),
    INDEX idx_product_id (product_id),
    INDEX idx_sku (sku),
    INDEX idx_expires_at (expires_at)
);

CREATE TABLE sync_conflicts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    webhook_event_id BIGINT NOT NULL,
    conflict_type VARCHAR(100) NOT NULL,
    description LONGTEXT NOT NULL,
    product_id BIGINT,
    sku VARCHAR(100),
    expected_data LONGTEXT,
    actual_data LONGTEXT,
    status VARCHAR(50) NOT NULL,
    resolution VARCHAR(100),
    resolved_by VARCHAR(100),
    detected_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    FOREIGN KEY (webhook_event_id) REFERENCES webhook_events(id),
    INDEX idx_webhook_event_id (webhook_event_id),
    INDEX idx_status (status),
    INDEX idx_product_id (product_id),
    INDEX idx_detected_at (detected_at)
);

CREATE TABLE sync_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    source VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    orders_processed INT DEFAULT 0,
    orders_skipped INT DEFAULT 0,
    conflicts_detected INT DEFAULT 0,
    details LONGTEXT,
    synced_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    duration_ms BIGINT,
    error_summary TEXT,
    INDEX idx_source (source),
    INDEX idx_status (status),
    INDEX idx_synced_at (synced_at)
);

-- Create indexes for common queries
CREATE INDEX idx_webhook_events_status_retry ON webhook_events(status, retry_count);
CREATE INDEX idx_stock_reservations_product_status ON stock_reservations(product_id, status);
CREATE INDEX idx_sync_conflicts_status_type ON sync_conflicts(status, conflict_type);
