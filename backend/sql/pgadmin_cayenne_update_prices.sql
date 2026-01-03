-- Cayenne: fix realistic prices for Cayenne-exclusive options in an existing DB
-- Run in pgAdmin Query Tool.
-- Safe to re-run.

BEGIN;

-- Wheels
UPDATE options
SET price_modifier = 0.00
WHERE category = 'Wheels' AND name = '20" Standard' AND (option_code = 'CA20S' OR option_code IS NULL);

UPDATE options
SET price_modifier = 2000.00
WHERE category = 'Wheels' AND name = '21" Exclusive';

UPDATE options
SET price_modifier = 3500.00
WHERE category = 'Wheels' AND name = '22" Sport Design';

-- Technology
UPDATE options
SET price_modifier = 2800.00
WHERE category = 'Technology' AND name = 'LED HD Matrix Headlights';

UPDATE options
SET price_modifier = 1900.00
WHERE category = 'Technology' AND name = 'Rear Axle Steering';

UPDATE options
SET price_modifier = 2500.00
WHERE category = 'Technology' AND name = 'InnoDrive including Active Lane Keeping';

UPDATE options
SET price_modifier = 2200.00
WHERE category = 'Technology' AND name = 'Night Vision Assist';

COMMIT;
