const pool = require('./db');

const macanTechOptions = [
  {
    category: 'Technology',
    name: 'Led HD Matrix Headlights',
    description: 'HD Matrix LED headlights for Macan',
    price_modifier: 2800.0,
    option_code: 'MA_M8IU',
  },
  {
    category: 'Technology',
    name: 'Power Steering Plus',
    description: 'Power Steering Plus for Macan',
    price_modifier: 300.0,
    option_code: 'MA_M1N3',
  },
  {
    category: 'Technology',
    name: 'Porsche Electric Sport Sound',
    description: 'Porsche Electric Sport Sound for Macan',
    price_modifier: 1200.0,
    option_code: 'MA_MGM3',
  },
  {
    category: 'Technology',
    name: 'Bose Surround Premium System',
    description: 'Bose Surround Sound System for Macan',
    price_modifier: 1500.0,
    option_code: 'MA_M9VL',
  },
  {
    category: 'Technology',
    name: 'Rear-Axle Steering',
    description: 'Rear-Axle Steering for Macan',
    price_modifier: 3500.0,
    option_code: 'MA_M0N5',
  },
];

async function insertIfMissing(option) {
  const exists = await pool.query(
    'SELECT id FROM options WHERE category = $1 AND name = $2 LIMIT 1',
    [option.category, option.name]
  );

  if (exists.rows.length) {
    return { action: 'skipped', name: option.name };
  }

  await pool.query(
    `INSERT INTO options (category, name, description, price_modifier, option_code)
     VALUES ($1, $2, $3, $4, $5)`,
    [option.category, option.name, option.description, option.price_modifier, option.option_code]
  );

  return { action: 'inserted', name: option.name };
}

(async () => {
  try {
    console.log('Inserting Macan Technology options (if missing)...');

    const results = [];
    for (const opt of macanTechOptions) {
      results.push(await insertIfMissing(opt));
    }

    const inserted = results.filter(r => r.action === 'inserted').length;
    const skipped = results.filter(r => r.action === 'skipped').length;

    console.log(`Done. Inserted: ${inserted}, skipped (already existed): ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to insert Macan tech options:', err);
    process.exit(1);
  }
})();
