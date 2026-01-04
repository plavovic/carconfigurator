const db = require('./db');

async function checkRelations() {
  try {
    const models = ['Taycan', 'Macan', '911'];

    for (const modelName of models) {
      const res = await db.query(
        `SELECT o.id, o.name, cm.name as model
         FROM car_model_options cmo
         JOIN car_models cm ON cmo.car_model_id = cm.id
         JOIN options o ON cmo.option_id = o.id
         WHERE cm.name = $1 AND o.category = 'Wheels'
         ORDER BY o.name`,
        [modelName]
      );

      console.log(`\nModel: ${modelName} — wheel options found: ${res.rowCount}`);
      for (const row of res.rows) {
        console.log(' ', row.id, '-', row.name);
      }
    }

    // Also show if any wheel options exist without model relations
    const orphan = await db.query(
      `SELECT o.id, o.name
       FROM options o
       LEFT JOIN car_model_options cmo ON o.id = cmo.option_id
       WHERE o.category = 'Wheels' AND cmo.id IS NULL
       ORDER BY o.name`
    );

    console.log(`\nWheels without any model relation: ${orphan.rowCount}`);
    for (const r of orphan.rows) console.log(' ', r.id, '-', r.name);

    process.exit(0);
  } catch (err) {
    console.error('Error checking wheel relations:', err);
    process.exit(1);
  }
}

checkRelations();
