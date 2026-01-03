const pool = require('./db');

(async () => {
  const modelsRes = await pool.query('SELECT id, name FROM car_models ORDER BY id');
  console.log('models:', modelsRes.rows);

  const macan = modelsRes.rows.find((m) => m.name === 'Macan');
  if (!macan) {
    console.log('Macan model not found');
    process.exit(0);
  }

  const optionsRes = await pool.query(
    `SELECT o.category, o.name
     FROM options o
     JOIN car_model_options cmo ON cmo.option_id = o.id
     WHERE cmo.car_model_id = $1
     ORDER BY o.category, o.name`,
    [macan.id]
  );

  const counts = optionsRes.rows.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + 1;
    return acc;
  }, {});

  console.log('Macan option category counts:', counts);
  console.log(
    'Macan Technology options:',
    optionsRes.rows.filter((r) => r.category === 'Technology').map((r) => r.name)
  );

  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
