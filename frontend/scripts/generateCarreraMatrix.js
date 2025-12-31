const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'data', 'carrera_image_matrix.csv');
const out = path.join(__dirname, '..', 'src', 'data', 'carreraImageMatrix.json');

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  lines.shift(); // drop header
  const rows = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(';');
    if (parts.length < 5) continue;
    const [model, color, wheelsRaw, angleRaw, urlRaw] = parts;
    const wheels = wheelsRaw.trim().replace(/^"|"$/g, '').replace(/""/g, '"');
    const angleKey = angleRaw.trim() === '3/4' ? 'threeQuarter' : angleRaw.trim().toLowerCase();
    rows.push({
      model: model.trim(),
      color: color.trim(),
      wheels,
      angle: angleKey,
      url: urlRaw.trim(),
    });
  }
  return rows;
}

function buildMatrix(rows) {
  const matrix = {};
  for (const row of rows) {
    if (!matrix[row.color]) matrix[row.color] = {};
    if (!matrix[row.color][row.wheels]) matrix[row.color][row.wheels] = {};
    matrix[row.color][row.wheels][row.angle] = row.url;
  }
  return matrix;
}

const csvText = fs.readFileSync(src, 'utf8');
const rows = parseCsv(csvText);
const matrix = buildMatrix(rows);
fs.writeFileSync(out, JSON.stringify(matrix, null, 2));
console.log(`Wrote ${Object.keys(matrix).length} color entries to ${out}`);
