-- V4__Integration_Tables.sql
-- Create tables for webhook integration, stock reservations, conflicts, and sync logs

CREATE TABLE IF NOT EXISTS webhook_events (
    id BIGSERIAL PRIMARY KEY,
    idempotency_key VARCHAR(255) NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    payload TEXT NOT NULL,
    source VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    external_order_id VARCHAR(255),
    internal_order_id BIGINT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    processed_at TIMESTAMP,
    last_retry_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_reservations (
    id BIGSERIAL PRIMARY KEY,
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
    source VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS sync_conflicts (
    id BIGSERIAL PRIMARY KEY,
    webhook_event_id BIGINT NOT NULL,
    conflict_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    product_id BIGINT,
    sku VARCHAR(100),
    expected_data TEXT,
    actual_data TEXT,
    status VARCHAR(50) NOT NULL,
    resolution VARCHAR(100),
    resolved_by VARCHAR(100),
    detected_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_sync_conflicts_webhook_event
        FOREIGN KEY (webhook_event_id) REFERENCES webhook_events(id)
);

CREATE TABLE IF NOT EXISTS sync_logs (
    id BIGSERIAL PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    orders_processed INT DEFAULT 0,
    orders_skipped INT DEFAULT 0,
    conflicts_detected INT DEFAULT 0,
    details TEXT,
    synced_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    duration_ms BIGINT,
    error_summary TEXT
);

