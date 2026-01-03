-- Cayenne: insert missing options (safe for existing DB)
-- Run in pgAdmin Query Tool.

BEGIN;

-- 1) Cayenne Wheels (exclusive: ONLY these 3 for Cayenne)
INSERT INTO options (category, name, description, price_modifier, option_code)
SELECT 'Wheels', '20" Standard', 'Cayenne 20 inch standard wheels', 0.00, 'CA20S'
WHERE NOT EXISTS (
  SELECT 1 FROM options WHERE category = 'Wheels' AND name = '20" Standard'
);

INSERT INTO options (category, name, description, price_modifier, option_code)
SELECT 'Wheels', '21" Exclusive', 'Cayenne 21 inch Exclusive wheels', 2000.00, 'CA21E'
WHERE NOT EXISTS (
  SELECT 1 FROM options WHERE category = 'Wheels' AND name = '21" Exclusive'
);

INSERT INTO options (category, name, description, price_modifier, option_code)
SELECT 'Wheels', '22" Sport Design', 'Cayenne 22 inch Sport Design wheels', 3500.00, 'CA22SD'
WHERE NOT EXISTS (
  SELECT 1 FROM options WHERE category = 'Wheels' AND name = '22" Sport Design'
);

-- 2) Cayenne Technology (4 options)
INSERT INTO options (category, name, description, price_modifier, option_code)
SELECT 'Technology', 'LED HD Matrix Headlights', 'LED HD Matrix Headlights for Cayenne', 2800.00, 'CA_M8IU'
WHERE NOT EXISTS (
  SELECT 1 FROM options WHERE category = 'Technology' AND name = 'LED HD Matrix Headlights'
);

INSERT INTO options (category, name, description, price_modifier, option_code)
SELECT 'Technology', 'Rear Axle Steering', 'Rear Axle Steering for Cayenne', 1900.00, 'CA_M0N5'
WHERE NOT EXISTS (
  SELECT 1 FROM options WHERE category = 'Technology' AND name = 'Rear Axle Steering'
);

INSERT INTO options (category, name, description, price_modifier, option_code)
SELECT 'Technology', 'InnoDrive including Active Lane Keeping', 'InnoDrive including Active Lane Keeping for Cayenne', 2500.00, 'CA_PPY3'
WHERE NOT EXISTS (
  SELECT 1 FROM options WHERE category = 'Technology' AND name = 'InnoDrive including Active Lane Keeping'
);

INSERT INTO options (category, name, description, price_modifier, option_code)
SELECT 'Technology', 'Night Vision Assist', 'Night Vision Assist for Cayenne', 2200.00, 'CA_M9R1'
WHERE NOT EXISTS (
  SELECT 1 FROM options WHERE category = 'Technology' AND name = 'Night Vision Assist'
);

COMMIT;
