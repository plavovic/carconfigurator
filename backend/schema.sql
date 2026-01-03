-- PostgreSQL Database Schema for Car Configurator
-- Created for Porsche Car Configurator Application

-- =====================================================
-- DROP EXISTING TABLES (if they exist)
-- =====================================================
DROP TABLE IF EXISTS configuration_items CASCADE;
DROP TABLE IF EXISTS configurations CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS car_model_options CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS car_models CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- =====================================================
-- USERS TABLE
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

CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- CAR MODELS TABLE
-- =====================================================
CREATE TABLE car_models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  model_code VARCHAR(50), -- Porsche model code for image API
  config_code TEXT, -- Configuration code (can exceed 255 chars) for Porsche image API
  zero_to_hundred_km_h DECIMAL(3, 1),
  top_speed_km_h INTEGER,
  power_hp INTEGER,
  power_kw INTEGER,
  energy_consumption_kWh_per_100km DECIMAL(4, 1),
  co2_emissions_g_per_km DECIMAL(4, 1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_car_models_name ON car_models(name);

-- =====================================================
-- OPTIONS TABLE (Colors, Wheels, Interior, etc.)
-- =====================================================
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_modifier DECIMAL(10, 2) DEFAULT 0,
  option_code VARCHAR(50), -- Porsche option code for image API
  hex_color VARCHAR(7), -- Color hex code for paint colors
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category, name)
);

CREATE INDEX idx_options_category ON options(category);

-- =====================================================
-- CAR_MODEL_OPTIONS (Many-to-Many relationship)
-- =====================================================
CREATE TABLE car_model_options (
  id SERIAL PRIMARY KEY,
  car_model_id INTEGER NOT NULL REFERENCES car_models(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  UNIQUE(car_model_id, option_id)
);

CREATE INDEX idx_car_model_options_car_model_id ON car_model_options(car_model_id);
CREATE INDEX idx_car_model_options_option_id ON car_model_options(option_id);

-- =====================================================
-- CONFIGURATIONS TABLE
-- =====================================================
CREATE TABLE configurations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  car_model_id INTEGER NOT NULL REFERENCES car_models(id) ON DELETE CASCADE,
  configuration_name VARCHAR(255),
  total_price DECIMAL(10, 2),
  is_saved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_configurations_user_id ON configurations(user_id);
CREATE INDEX idx_configurations_car_model_id ON configurations(car_model_id);
CREATE INDEX idx_configurations_created_at ON configurations(created_at);

-- =====================================================
-- CONFIGURATION_ITEMS (Selected options per configuration)
-- =====================================================
CREATE TABLE configuration_items (
  id SERIAL PRIMARY KEY,
  configuration_id INTEGER NOT NULL REFERENCES configurations(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  price_at_selection DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_configuration_items_configuration_id ON configuration_items(configuration_id);
CREATE INDEX idx_configuration_items_option_id ON configuration_items(option_id);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  configuration_id INTEGER REFERENCES configurations(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- =====================================================
-- REVIEWS/RATINGS TABLE
-- =====================================================
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  car_model_id INTEGER NOT NULL REFERENCES car_models(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_car_model_id ON reviews(car_model_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- =====================================================
-- SERVICES TABLE
-- =====================================================
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert Car Models
INSERT INTO car_models (name, description, base_price, model_code, config_code, zero_to_hundred_km_h, top_speed_km_h, power_hp, power_kw, energy_consumption_kWh_per_100km, co2_emissions_g_per_km)
VALUES
  ('Taycan', 'Porsche Taycan is an all-electric sports sedan', 103000.00, 'Y1AEN1', 'N4Igxg9gdgZglgcxALlAQynAtmgLnaAZxQG0BdAGnDSwFMAnNFUOAExRFoA9cBaAGwgB3XjHrQ+-WjFwgqEAA74izEADc09OBlnIQrWoQDWuRSAC+5qrShq44qHSi6W7PQHk0hOMXlKCUMSollT8iAAW+FBIqCBsHAAiAIIAmnIgisqBzCEgCuKsAK5gLnFuIACcFQBMAIwAQtXpmQFBoJCFzvQAngDCEAYcAOpD6VgDtPwptJoo1QAM1QBsfllBJCC1ACoAzOk79XtUAKwV9elLAJJHIADsSQDS6bcA4hXpFQBaAKLp3wCyTSoL1qADF0pchjcAFLfG4AGReWwSACV4el3LV0gAFAAS6QAisckoSUe8qASAGo3ACq2PJIEp8KaZEsVhAhFouCiCDaIBgEHoOF0IAAVgpaEgqLhGIEFJobLoYGh+JzLEA', 3.1, 260, 616, 459, 19.1, 0),
  ('911', 'Iconic Porsche sports car', 95000.00, '992', NULL, 3.2, 320, 580, 430, NULL, NULL),
  ('Cayenne', 'Luxury sport utility vehicle', 85000.00, 'E3', NULL, 3.6, 280, 550, 410, NULL, NULL),
  ('Macan', 'Compact luxury crossover SUV', 65000.00, '95B', NULL, 5.2, 245, 340, 252, NULL, NULL);

-- Insert Options - Exterior Colors
INSERT INTO options (category, name, description, price_modifier, option_code, hex_color)
VALUES
  ('Exterior Color', 'Jet Black', 'Classic black finish', 0.00, 'C9X', '#000000'),
  ('Exterior Color', 'Alpine White', 'Pure white finish', 2500.00, 'C9A', '#FFFFFF'),
  ('Exterior Color', 'Agate Grey', 'Sophisticated grey', 3000.00, 'C9Y', '#505559'),
  ('Exterior Color', 'Miami Blue', 'Vibrant blue finish', 4000.00, 'C3E', '#00B0F0'),
  ('Exterior Color', 'Racing Yellow', 'Bright yellow finish', 3500.00, 'C16', '#FFD700');

-- Insert Options - Wheels (Carrera wheels)
INSERT INTO options (category, name, description, price_modifier, option_code)
VALUES
  ('Wheels', '19" Standard', 'OEM 19 inch wheels', 0.00, 'W19S'),
  ('Wheels', '20" Carrera Classic', '20 inch alloy wheels', 1500.00, 'W20C'),
  ('Wheels', '21" Carrera S', '21 inch performance wheels', 2500.00, 'W21S'),
  ('Wheels', '22" Turbo', '22 inch sport wheels', 3500.00, 'W22T');

-- Insert Options - Wheels (Taycan exclusive wheels)
INSERT INTO options (category, name, description, price_modifier, option_code)
VALUES
  ('Wheels', '19" Standard (Taycan)', 'Taycan 19 inch standard wheels', 0.00, 'TY19S'),
  ('Wheels', '20" Turbo Sport (Taycan)', 'Taycan 20 inch turbo sport wheels', 1500.00, 'TY20T'),
  ('Wheels', '21" Mission E (Taycan)', 'Taycan 21 inch mission e wheels', 2500.00, 'TY21M');

-- Insert Options - Interior
INSERT INTO options (category, name, description, price_modifier, option_code)
VALUES
  ('Interior', 'Black Leather', 'Premium black leather upholstery', 0.00, 'INTB'),
  ('Interior', 'Bordeaux Leather', 'Burgundy leather upholstery', 2000.00, 'INTR'),
  ('Interior', 'Cognac Leather', 'Brown leather upholstery', 2000.00, 'INTC'),
  ('Interior', 'Beige Leather', 'Elegant beige leather upholstery', 1800.00, 'INTBE');

-- Insert Options - Technology
INSERT INTO options (category, name, description, price_modifier, option_code)
VALUES
  ('Technology', 'Premium Sound System', 'Bose premium audio', 1500.00, 'T01'),
  ('Technology', 'Electric slide/tilt sunroof', 'Outwards-opening electric slide/tilt steel sunroof', 2000.00, 'T02'),
  ('Technology', 'Adaptive Air Suspension', 'Air suspension system', 2500.00, 'T03'),
  ('Technology', 'Night Vision Assist (Carrera)', 'Infrared night vision assist', 3500.00, 'M9R1_CAR'),
  ('Technology', 'HD Matrix LED Headlights (Carrera)', 'The high-resolution HD-Matrix LED headlights', 2800.00, 'M8IU_CAR');

-- Insert Options - Taycan exclusive accessories
INSERT INTO options (category, name, description, price_modifier, option_code)
VALUES
  ('Technology', 'Rear-axle steering', 'Advanced rear-axle steering system', 3500.00, 'TY_RAS'),
  ('Technology', 'Porsche Electric Sport Sound', 'Porsche Electric Sport Sound system', 1200.00, 'TY_PESS'),
  ('Technology', 'Night Vision Assist (Taycan)', 'Advanced night vision assist system for Taycan', 2500.00, 'M9R1_TY'),
  ('Technology', 'HD Matrix LED Headlights (Taycan)', 'The high-resolution HD-Matrix LED headlights for Taycan', 2800.00, 'M8IU_TY');

-- Insert Services
INSERT INTO services (name, description, price, image_url)
VALUES
  ('Maintenance Package', 'Comprehensive maintenance coverage', 5000.00, NULL),
  ('Extended Warranty', 'Extended 10-year warranty', 8000.00, NULL),
  ('Premium Roadside Assistance', '24/7 roadside assistance', 2000.00, NULL),
  ('Concierge Service', 'VIP concierge and scheduling', 3000.00, NULL);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_car_models_timestamp
BEFORE UPDATE ON car_models
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_options_timestamp
BEFORE UPDATE ON options
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_configurations_timestamp
BEFORE UPDATE ON configurations
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reviews_timestamp
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_services_timestamp
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
