const db = require('./db');

async function checkWheels() {
  try {
    const res = await db.query("SELECT id, name, image_url FROM options WHERE category = 'Wheels'");
    console.log('Wheels:');
    for (const row of res.rows) {
      console.log(row.id, '-', row.name, '=>', row.image_url);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error querying wheels:', error);
    process.exit(1);
  }
}

checkWheels();
