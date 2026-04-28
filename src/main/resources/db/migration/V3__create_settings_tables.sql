CREATE TABLE IF NOT EXISTS application_settings (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(150),
    default_currency VARCHAR(10),
    language VARCHAR(50),
    timezone VARCHAR(80),
    notification_email VARCHAR(150),
    low_stock_threshold INTEGER,
    low_stock_alerts_enabled BOOLEAN,
    backup_enabled BOOLEAN,
    sync_enabled BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tax_rules (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rate DOUBLE PRECISION NOT NULL,
    applies_to VARCHAR(120),
    active BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

INSERT INTO application_settings (
    company_name,
    default_currency,
    language,
    timezone,
    notification_email,
    low_stock_threshold,
    low_stock_alerts_enabled,
    backup_enabled,
    sync_enabled,
    created_at,
    updated_at
) 
SELECT
    'Nexacore', 'LKR', 'en', 'Asia/Colombo', 'admin@nexacore.local', 10, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM application_settings);