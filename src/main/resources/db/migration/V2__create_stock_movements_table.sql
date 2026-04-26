CREATE TABLE IF NOT EXISTS stock_movements (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(120) NOT NULL UNIQUE,
    source_system VARCHAR(120) NOT NULL,
    event_type VARCHAR(30) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    before_stock INTEGER NOT NULL,
    after_stock INTEGER NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_sku ON stock_movements(sku);
CREATE INDEX IF NOT EXISTS idx_stock_movements_event_id ON stock_movements(event_id);