-- =====================================================
-- DROP EXISTING TABLES
-- =====================================================
DROP TABLE IF EXISTS configuration_items CASCADE;
DROP TABLE IF EXISTS configurations CASCADE;
DROP TABLE IF EXISTS inventory_unit_options CASCADE;
DROP TABLE IF EXISTS inventory_units CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS car_model_options CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS car_models CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- CAR MODELS
-- =====================================================
CREATE TABLE car_models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  model_code VARCHAR(50),
  config_code TEXT,
  zero_to_hundred_km_h DECIMAL(3,1),
  top_speed_km_h INTEGER,
  power_hp INTEGER,
  power_kw INTEGER,
  energy_consumption_kWh_per_100km DECIMAL(4,1),
  co2_emissions_g_per_km DECIMAL(4,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- OPTIONS
-- =====================================================
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  option_code VARCHAR(50),
  hex_color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (category, name)
);

-- =====================================================
-- CAR MODEL OPTIONS
-- =====================================================
CREATE TABLE car_model_options (
  id SERIAL PRIMARY KEY,
  car_model_id INTEGER REFERENCES car_models(id) ON DELETE CASCADE,
  option_id INTEGER REFERENCES options(id) ON DELETE CASCADE,
  UNIQUE (car_model_id, option_id)
);

-- =====================================================
-- CONFIGURATIONS
-- =====================================================
CREATE TABLE configurations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  car_model_id INTEGER REFERENCES car_models(id) ON DELETE CASCADE,
  configuration_name VARCHAR(255),
  total_price DECIMAL(10,2),
  is_saved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE configuration_items (
  id SERIAL PRIMARY KEY,
  configuration_id INTEGER REFERENCES configurations(id) ON DELETE CASCADE,
  option_id INTEGER REFERENCES options(id) ON DELETE CASCADE,
  price_at_selection DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INVENTORY
-- =====================================================
CREATE TABLE inventory_units (
  id SERIAL PRIMARY KEY,
  car_model_id INTEGER REFERENCES car_models(id) ON DELETE CASCADE,
  dealership_name VARCHAR(150),
  label VARCHAR(255),
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_unit_options (
  id SERIAL PRIMARY KEY,
  inventory_unit_id INTEGER REFERENCES inventory_units(id) ON DELETE CASCADE,
  option_id INTEGER REFERENCES options(id) ON DELETE CASCADE,
  UNIQUE (inventory_unit_id, option_id)
);

-- =====================================================
-- ORDERS
-- =====================================================
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  configuration_id INTEGER REFERENCES configurations(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  model_name VARCHAR(255),
  color VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REVIEWS
-- =====================================================
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  car_model_id INTEGER REFERENCES car_models(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SERVICES
-- =====================================================
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

INSERT INTO car_models (name, description, base_price, model_code)
VALUES
('Taycan', 'Electric sports sedan', 103000, 'Y1AEN1'),
('911', 'Iconic sports car', 95000, '992'),
('Cayenne', 'Luxury SUV', 85000, 'E3'),
('Macan', 'Compact SUV', 65000, '95B');

-- ===================== OPTIONS ======================

-- Exterior Colors
INSERT INTO options (category, name, price_modifier, option_code, hex_color) VALUES
('Exterior Color', 'Jet Black', 0, 'C9X', '#000000'),
('Exterior Color', 'Alpine White', 2500, 'C9A', '#FFFFFF'),
('Exterior Color', 'Miami Blue', 4000, 'C3E', '#00B0F0');

-- Wheels (UNIQUE NAMES)
INSERT INTO options (category, name, price_modifier, option_code) VALUES
('Wheels', '19" Standard – Carrera', 0, 'W19S'),
('Wheels', '20" Carrera Classic', 1500, 'W20C'),
('Wheels', '21" Carrera S', 2500, 'W21S'),
('Wheels', '20" Standard – Cayenne', 0, 'CA20S'),
('Wheels', '21" Exclusive – Cayenne', 2000, 'CA21E'),
('Wheels', '20" Standard – Macan', 0, 'MA20S'),
('Wheels', '21" Offroad Style – Macan', 1500, 'MA21O'),
('Wheels', '19" Standard – Taycan', 0, 'TY19S'),
('Wheels', '20" Turbo Sport – Taycan', 1500, 'TY20T');

-- Interior
INSERT INTO options (category, name, price_modifier, option_code) VALUES
('Interior', 'Black Leather', 0, 'INTB'),
('Interior', 'Bordeaux Leather', 2000, 'INTR');

-- Technology
INSERT INTO options (category, name, price_modifier, option_code) VALUES
('Technology', 'Premium Sound System', 1500, 'T01'),
('Technology', 'Adaptive Air Suspension', 2500, 'T03'),
('Technology', 'Night Vision Assist – Carrera', 3500, 'M9R1_CAR'),
('Technology', 'Night Vision Assist – Taycan', 2500, 'M9R1_TY');

-- Services
INSERT INTO services (name, price) VALUES
('Maintenance Package', 5000),
('Extended Warranty', 8000);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_models BEFORE UPDATE ON car_models
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_options BEFORE UPDATE ON options
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
