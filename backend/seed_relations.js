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
            '19" Standard (Taycan)',
            '20" Turbo Sport (Taycan)',
            '21" Mission E (Taycan)'
        ];

        const taycanExclusiveAccessories = [
            'Rear-axle steering',
            'Porsche Electric Sport Sound',
            'Night Vision Assist (Taycan)',
            'HD Matrix LED Headlights (Taycan)'
        ];

        const carreraExclusiveWheels = [
            '19" Standard',
            '20" Carrera Classic',
            '21" Carrera S',
            '22" Turbo'
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
                    } else if (option.category === 'Exterior Color') {
                        shouldAdd = true;
                    } else if (option.category === 'Interior') {
                        shouldAdd = true;
                    }
                } else {
                    // Other models (911, Cayenne, Macan) get:
                    // - Carrera wheels
                    // - Colors and interior
                    // - Standard technology options
                    // NO Taycan exclusive items
                    
                    // Exclude all Taycan-specific items
                    if (taycanExclusiveWheels.includes(option.name) || 
                        taycanExclusiveAccessories.includes(option.name)) {
                        shouldAdd = false;
                    } else if (nonTaycanExcluded.includes(option.name)) {
                        shouldAdd = false;
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
