-- Cayenne: rebuild car_model_options so Cayenne shows ONLY the intended options.
-- Run in pgAdmin Query Tool.
-- This assumes the model exists in car_models as name = 'Cayenne'.

BEGIN;

-- Resolve Cayenne model id once
WITH cayenne AS (
  SELECT id AS car_model_id FROM car_models WHERE name = 'Cayenne'
)

-- 1) Clear current relations for Cayenne
DELETE FROM car_model_options
WHERE car_model_id = (SELECT car_model_id FROM cayenne);

-- 2) Re-add shared colors (same set you’ve been using)
INSERT INTO car_model_options (car_model_id, option_id)
SELECT (SELECT id FROM car_models WHERE name = 'Cayenne') AS car_model_id,
       o.id AS option_id
FROM options o
WHERE o.category = 'Exterior Color'
  AND o.name IN ('Jet Black', 'Alpine White', 'Agate Grey', 'Miami Blue', 'Racing Yellow');

-- 3) Re-add shared interior options
INSERT INTO car_model_options (car_model_id, option_id)
SELECT (SELECT id FROM car_models WHERE name = 'Cayenne') AS car_model_id,
       o.id AS option_id
FROM options o
WHERE o.category = 'Interior'
  AND o.name IN ('Black Leather', 'Bordeaux Leather', 'Cognac Leather', 'Beige Leather');

-- 4) Add Cayenne wheels (ONLY these 3)
INSERT INTO car_model_options (car_model_id, option_id)
SELECT (SELECT id FROM car_models WHERE name = 'Cayenne') AS car_model_id,
       o.id AS option_id
FROM options o
WHERE o.category = 'Wheels'
  AND o.name IN ('20" Standard', '21" Exclusive', '22" Sport Design');

-- 5) Add Cayenne Technology (ONLY these 4)
INSERT INTO car_model_options (car_model_id, option_id)
SELECT (SELECT id FROM car_models WHERE name = 'Cayenne') AS car_model_id,
       o.id AS option_id
FROM options o
WHERE o.category = 'Technology'
  AND o.name IN (
    'LED HD Matrix Headlights',
    'Rear Axle Steering',
    'InnoDrive including Active Lane Keeping',
    'Night Vision Assist'
  );

COMMIT;
