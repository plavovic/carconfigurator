const pool = require('./db');

const seedRelations = async () => {
    try {
        console.log('Starting seed relations...');

        // 1. Get all models
        const modelsRes = await pool.query('SELECT id, name FROM car_models');
        const models = modelsRes.rows;
        console.log(`Found ${models.length} car models.`);

        // 2. Get all options
        const optionsRes = await pool.query('SELECT id, name, category FROM options');
        const options = optionsRes.rows;
        console.log(`Found ${options.length} options.`);

        // 3. Clear existing relations to avoid duplicates (optional, but safe)
        await pool.query('DELETE FROM car_model_options');
        console.log('Cleared existing car_model_options.');

        // 4. Define Taycan exclusive options
        const taycanExclusiveWheels = [
            '19" Standard – Taycan',
            '20" Turbo Sport – Taycan'
        ];

        const taycanExclusiveAccessories = [
            'Rear-axle steering',
            'Porsche Electric Sport Sound',
            'Night Vision Assist (Taycan)',
            'HD Matrix LED Headlights (Taycan)'
        ];

        const carreraExclusiveWheels = [
            '19" Standard – Carrera',
            '20" Carrera Classic',
            '21" Carrera S'
        ];

        const macanExclusiveWheels = [
            '20" Standard – Macan',
            '21" Offroad Style – Macan'
        ];

        const macanExclusiveAccessories = [
            'Led HD Matrix Headlights',
            'Power Steering Plus',
            'Porsche Electric Sport Sound',
            'Bose Surround Premium System',
            'Rear-Axle Steering'
        ];

        const cayenneExclusiveWheels = [
            '20" Standard',
            '21" Exclusive',
            '22" Sport Design'
        ];

        const cayenneExclusiveAccessories = [
            'LED HD Matrix Headlights',
            'Rear Axle Steering',
            'InnoDrive including Active Lane Keeping',
            'Night Vision Assist'
        ];

        const nonTaycanExcluded = [
            'Adaptive Air Suspension'
        ];

        // 5. Insert relations with model-specific rules
        let count = 0;
        for (const model of models) {
            for (const option of options) {
                let shouldAdd = false;

                if (model.name === 'Taycan') {
                    // Taycan ONLY gets:
                    // - Taycan exclusive wheels
                    // - Taycan exclusive accessories
                    // - Shared: colors and interior
                    // NO standard technology options
                    
                    if (taycanExclusiveWheels.includes(option.name)) {
                        shouldAdd = true;
                    } else if (taycanExclusiveAccessories.includes(option.name)) {
                        shouldAdd = true;
                    } else if (macanExclusiveWheels.includes(option.name)) {
                        shouldAdd = false;
                    } else if (option.category === 'Exterior Color') {
                        shouldAdd = true;
                    } else if (option.category === 'Interior') {
                        shouldAdd = true;
                    }
                } else if (model.name === 'Macan') {
                    // Macan ONLY gets:
                    // - Macan wheels
                    // - Colors and interior
                    // - Macan-exclusive Technology options

                    if (macanExclusiveWheels.includes(option.name)) {
                        shouldAdd = true;
                    } else if (option.category === 'Wheels') {
                        shouldAdd = false;
                    } else if (taycanExclusiveWheels.includes(option.name)) {
                        shouldAdd = false;
                    } else if (taycanExclusiveAccessories.includes(option.name) && !macanExclusiveAccessories.includes(option.name)) {
                        // Exclude Taycan-only accessories (but allow shared names like Porsche Electric Sport Sound)
                        shouldAdd = false;
                    } else if (nonTaycanExcluded.includes(option.name)) {
                        shouldAdd = false;
                    } else if (option.category === 'Technology') {
                        shouldAdd = macanExclusiveAccessories.includes(option.name);
                    } else if (option.category === 'Exterior Color' || option.category === 'Interior') {
                        shouldAdd = true;
                    }
                } else {
                    // Other models (e.g. 911, Cayenne) get model-specific wheels.
                    // NO Taycan or Macan exclusive items.

                    // Exclude all Taycan-specific items
                    if (taycanExclusiveWheels.includes(option.name) ||
                        taycanExclusiveAccessories.includes(option.name) ||
                        macanExclusiveWheels.includes(option.name) ||
                        macanExclusiveAccessories.includes(option.name) ||
                        ((model.name !== 'Cayenne') && (cayenneExclusiveWheels.includes(option.name) || cayenneExclusiveAccessories.includes(option.name)))) {
                        shouldAdd = false;
                    }
                    else if (nonTaycanExcluded.includes(option.name)) {
                        shouldAdd = false;
                    } else if (option.category === 'Wheels') {
                        if (model.name === 'Cayenne') {
                            shouldAdd = cayenneExclusiveWheels.includes(option.name);
                        } else {
                            shouldAdd = carreraExclusiveWheels.includes(option.name);
                        }
                    } else if (model.name === 'Cayenne' && option.category === 'Technology') {
                        shouldAdd = cayenneExclusiveAccessories.includes(option.name);
                    } else {
                        shouldAdd = true;
                    }
                }

                if (shouldAdd) {
                    await pool.query(
                        'INSERT INTO car_model_options (car_model_id, option_id) VALUES ($1, $2)',
                        [model.id, option.id]
                    );
                    count++;
                }
            }
        }

        console.log(`Successfully inserted ${count} relations.`);
        console.log('Done!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding relations:', err);
        process.exit(1);
    }
};

seedRelations();
