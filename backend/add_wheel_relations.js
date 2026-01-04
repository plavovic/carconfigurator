const db = require('./db');

const relations = [
  { model: '911', option: '19\" Standard – Carrera' },
  { model: 'Taycan', option: '19\" Standard – Taycan' },
  { model: 'Cayenne', option: '20\" Standard – Cayenne' },
  { model: 'Macan', option: '20\" Standard – Macan' },
  { model: 'Taycan', option: '20\" Turbo Sport – Taycan' },
  { model: 'Cayenne', option: '21\" Exclusive – Cayenne' },
  { model: 'Macan', option: '21\" Offroad Style – Macan' },
];

async function run() {
  try {
    for (const r of relations) {
      const m = await db.query('SELECT id FROM car_models WHERE name = $1', [r.model]);
      const o = await db.query('SELECT id FROM options WHERE name ILIKE $1 AND category = $2', [r.option, 'Wheels']);
      if (!m.rowCount || !o.rowCount) {
        console.log('Missing model or option:', r); continue;
      }
      const mid = m.rows[0].id, oid = o.rows[0].id;
      await db.query('INSERT INTO car_model_options (car_model_id, option_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [mid, oid]);
      console.log('Linked', r.model, '<->', r.option);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();