-- Small sample inventory seed for Porsche Sarajevo
-- Safe to re-run: it checks for existing units and uses ON CONFLICT DO NOTHING for options.
--
-- This is optional; without inventory rows, the Review-page panel will show "No available cars".

DO $$
DECLARE
	dealership TEXT := 'Porsche Sarajevo';

	model_911 INT;
	model_taycan INT;
	model_cayenne INT;

	unit_id INT;

	-- option ids resolved by option_code (stable)
	opt_jet_black INT;
	opt_miami_blue INT;
	opt_black_leather INT;
	opt_19_std INT;
	opt_21_carrera_s INT;
	opt_ty_21_mission_e INT;
	opt_ca_21_excl INT;
	opt_nv_911 INT;
	opt_hd_911 INT;
	opt_nv_taycan INT;
	opt_hd_taycan INT;
	opt_ca_nv INT;
	opt_ca_ras INT;
BEGIN
	-- Models
	SELECT id INTO model_911 FROM car_models WHERE name ILIKE '%911%' ORDER BY id LIMIT 1;
	SELECT id INTO model_taycan FROM car_models WHERE name ILIKE 'taycan' ORDER BY id LIMIT 1;
	SELECT id INTO model_cayenne FROM car_models WHERE name ILIKE 'cayenne' ORDER BY id LIMIT 1;

	IF model_911 IS NULL THEN
		RAISE EXCEPTION 'Could not find a 911 model in car_models';
	END IF;

	-- Common options
	SELECT id INTO opt_jet_black FROM options WHERE option_code = 'C9X' LIMIT 1;
	SELECT id INTO opt_miami_blue FROM options WHERE option_code = 'C3E' LIMIT 1;
	SELECT id INTO opt_black_leather FROM options WHERE option_code = 'INTB' LIMIT 1;

	-- 911 wheels + tech
	SELECT id INTO opt_19_std FROM options WHERE option_code = 'W19S' LIMIT 1;
	SELECT id INTO opt_21_carrera_s FROM options WHERE option_code = 'W21S' LIMIT 1;
	SELECT id INTO opt_nv_911 FROM options WHERE option_code = 'M9R1_CAR' LIMIT 1;
	SELECT id INTO opt_hd_911 FROM options WHERE option_code = 'M8IU_CAR' LIMIT 1;

	-- Taycan wheels + tech (only if Taycan exists)
	SELECT id INTO opt_ty_21_mission_e FROM options WHERE option_code = 'TY21M' LIMIT 1;
	SELECT id INTO opt_nv_taycan FROM options WHERE option_code = 'M9R1_TY' LIMIT 1;
	SELECT id INTO opt_hd_taycan FROM options WHERE option_code = 'M8IU_TY' LIMIT 1;

	-- Cayenne wheels + tech (only if Cayenne exists)
	SELECT id INTO opt_ca_21_excl FROM options WHERE option_code = 'CA21E' LIMIT 1;
	SELECT id INTO opt_ca_nv FROM options WHERE option_code = 'CA_M9R1' LIMIT 1;
	SELECT id INTO opt_ca_ras FROM options WHERE option_code = 'CA_M0N5' LIMIT 1;

	-- -----------------------------------------------------
	-- 911 inventory (two units)
	-- -----------------------------------------------------
	SELECT id INTO unit_id
	FROM inventory_units
	WHERE car_model_id = model_911 AND dealership_name = dealership AND label = '911 In Stock #1'
	LIMIT 1;

	IF unit_id IS NULL THEN
		INSERT INTO inventory_units (car_model_id, dealership_name, label, status)
		VALUES (model_911, dealership, '911 In Stock #1', 'available')
		RETURNING id INTO unit_id;
	END IF;

	INSERT INTO inventory_unit_options (inventory_unit_id, option_id)
	VALUES
		(unit_id, opt_jet_black),
		(unit_id, opt_black_leather),
		(unit_id, opt_19_std),
		(unit_id, opt_nv_911),
		(unit_id, opt_hd_911)
	ON CONFLICT DO NOTHING;

	unit_id := NULL;
	SELECT id INTO unit_id
	FROM inventory_units
	WHERE car_model_id = model_911 AND dealership_name = dealership AND label = '911 In Stock #2'
	LIMIT 1;

	IF unit_id IS NULL THEN
		INSERT INTO inventory_units (car_model_id, dealership_name, label, status)
		VALUES (model_911, dealership, '911 In Stock #2', 'available')
		RETURNING id INTO unit_id;
	END IF;

	INSERT INTO inventory_unit_options (inventory_unit_id, option_id)
	VALUES
		(unit_id, opt_miami_blue),
		(unit_id, opt_black_leather),
		(unit_id, opt_21_carrera_s)
	ON CONFLICT DO NOTHING;

	-- -----------------------------------------------------
	-- Taycan inventory (one unit) - only if Taycan exists
	-- -----------------------------------------------------
	IF model_taycan IS NOT NULL THEN
		unit_id := NULL;
		SELECT id INTO unit_id
		FROM inventory_units
		WHERE car_model_id = model_taycan AND dealership_name = dealership AND label = 'Taycan In Stock #1'
		LIMIT 1;

		IF unit_id IS NULL THEN
			INSERT INTO inventory_units (car_model_id, dealership_name, label, status)
			VALUES (model_taycan, dealership, 'Taycan In Stock #1', 'available')
			RETURNING id INTO unit_id;
		END IF;

		INSERT INTO inventory_unit_options (inventory_unit_id, option_id)
		VALUES
			(unit_id, opt_jet_black),
			(unit_id, opt_black_leather),
			(unit_id, opt_ty_21_mission_e),
			(unit_id, opt_nv_taycan),
			(unit_id, opt_hd_taycan)
		ON CONFLICT DO NOTHING;
	END IF;

	-- -----------------------------------------------------
	-- Cayenne inventory (one unit) - only if Cayenne exists
	-- -----------------------------------------------------
	IF model_cayenne IS NOT NULL THEN
		unit_id := NULL;
		SELECT id INTO unit_id
		FROM inventory_units
		WHERE car_model_id = model_cayenne AND dealership_name = dealership AND label = 'Cayenne In Stock #1'
		LIMIT 1;

		IF unit_id IS NULL THEN
			INSERT INTO inventory_units (car_model_id, dealership_name, label, status)
			VALUES (model_cayenne, dealership, 'Cayenne In Stock #1', 'available')
			RETURNING id INTO unit_id;
		END IF;

		INSERT INTO inventory_unit_options (inventory_unit_id, option_id)
		VALUES
			(unit_id, opt_jet_black),
			(unit_id, opt_black_leather),
			(unit_id, opt_ca_21_excl),
			(unit_id, opt_ca_nv),
			(unit_id, opt_ca_ras)
		ON CONFLICT DO NOTHING;
	END IF;

	RAISE NOTICE 'Inventory seed completed for %', dealership;
END $$;
