const db = require('./db');

async function addColumn() {
  try {
    await db.query('ALTER TABLE options ADD COLUMN IF NOT EXISTS image_url TEXT');
    console.log('Ensured column image_url exists on options table');
    process.exit(0);
  } catch (error) {
    console.error('Error adding column image_url:', error);
    process.exit(1);
  }
}

addColumn();
