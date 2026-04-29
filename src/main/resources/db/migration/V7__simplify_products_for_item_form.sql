ALTER TABLE products
    ADD COLUMN IF NOT EXISTS stock_on_hand INTEGER;

UPDATE products
SET stock_on_hand = COALESCE(stock_on_hand, opening_stock, stock_quantity, 0);

ALTER TABLE products
    ALTER COLUMN stock_on_hand SET NOT NULL;

ALTER TABLE products
    DROP COLUMN IF EXISTS description,
    DROP COLUMN IF EXISTS price,
    DROP COLUMN IF EXISTS stock_quantity,
    DROP COLUMN IF EXISTS tax_rate,
    DROP COLUMN IF EXISTS tax_type,
    DROP COLUMN IF EXISTS opening_stock,
    DROP COLUMN IF EXISTS warehouse,
    DROP COLUMN IF EXISTS unit_of_measure,
    DROP COLUMN IF EXISTS custom_attributes;

ALTER TABLE products
    ALTER COLUMN sku SET NOT NULL;
