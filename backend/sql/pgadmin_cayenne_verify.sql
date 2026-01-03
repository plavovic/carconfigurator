-- Cayenne: quick verification queries (pgAdmin)

-- 1) Confirm Cayenne model id
SELECT id, name FROM car_models WHERE name = 'Cayenne';

-- 2) Category counts for Cayenne
SELECT o.category, COUNT(*) AS count
FROM car_model_options cmo
JOIN options o ON o.id = cmo.option_id
JOIN car_models cm ON cm.id = cmo.car_model_id
WHERE cm.name = 'Cayenne'
GROUP BY o.category
ORDER BY o.category;

-- 3) List Cayenne wheels
SELECT o.name, o.option_code
FROM car_model_options cmo
JOIN options o ON o.id = cmo.option_id
JOIN car_models cm ON cm.id = cmo.car_model_id
WHERE cm.name = 'Cayenne' AND o.category = 'Wheels'
ORDER BY o.name;

-- 4) List Cayenne technology
SELECT o.name, o.option_code
FROM car_model_options cmo
JOIN options o ON o.id = cmo.option_id
JOIN car_models cm ON cm.id = cmo.car_model_id
WHERE cm.name = 'Cayenne' AND o.category = 'Technology'
ORDER BY o.name;
