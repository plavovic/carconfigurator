const db = require('./db');

db.query('SELECT id, name, image_url FROM options WHERE category = $1 ORDER BY id', ['Wheels'], (err, res) => {
  if(err) {
    console.error('Error:', err.message);
  } else {
    console.log('Wheel options:');
    console.log(JSON.stringify(res.rows, null, 2));
  }
  process.exit();
});
