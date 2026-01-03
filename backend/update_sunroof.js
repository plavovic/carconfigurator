const db = require('./db');

// Update the Panoramic Sunroof option to Electric slide/tilt sunroof
const query = `
  UPDATE options 
  SET name = $1, description = $2
  WHERE name = $3 AND category = $4
`;

const params = [
  'Electric slide/tilt sunroof',
  'Outwards-opening electric slide/tilt steel sunroof',
  'Panoramic Sunroof',
  'Technology'
];

db.query(query, params, (err, result) => {
  if (err) {
    console.error('Error updating sunroof option:', err);
    process.exit(1);
  } else {
    console.log(`Updated ${result.rowCount} row(s)`);
    console.log('Sunroof option successfully updated!');
    process.exit(0);
  }
});
