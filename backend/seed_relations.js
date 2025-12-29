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

        // 4. Insert relations (All models get All options)
        let count = 0;
        for (const model of models) {
            for (const option of options) {
                await pool.query(
                    'INSERT INTO car_model_options (car_model_id, option_id) VALUES ($1, $2)',
                    [model.id, option.id]
                );
                count++;
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
