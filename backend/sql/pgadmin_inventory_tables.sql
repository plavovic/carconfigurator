-- Safe additive migration for inventory tables (no DROPs)
-- Run this once in pgAdmin 4 against your target database.

BEGIN;

CREATE TABLE IF NOT EXISTS inventory_units (
  id SERIAL PRIMARY KEY,
  car_model_id INTEGER NOT NULL REFERENCES car_models(id) ON DELETE CASCADE,
  dealership_name VARCHAR(150),
  label VARCHAR(255),
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_units_car_model_id ON inventory_units(car_model_id);
CREATE INDEX IF NOT EXISTS idx_inventory_units_status ON inventory_units(status);

CREATE TABLE IF NOT EXISTS inventory_unit_options (
  id SERIAL PRIMARY KEY,
  inventory_unit_id INTEGER NOT NULL REFERENCES inventory_units(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  UNIQUE(inventory_unit_id, option_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_unit_options_inventory_unit_id ON inventory_unit_options(inventory_unit_id);
CREATE INDEX IF NOT EXISTS idx_inventory_unit_options_option_id ON inventory_unit_options(option_id);

COMMIT;
