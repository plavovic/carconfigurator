const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'data', 'cayenne_image_matrix_orderedFINAL.csv');
const out = path.join(__dirname, '..', 'src', 'data', 'cayenneImageMatrix.json');

function normalizeAngle(angleRaw) {
  const trimmed = String(angleRaw || '').trim();
  if (trimmed === '3/4' || trimmed.toLowerCase() === '3.tra') return 'threeQuarter';
  return trimmed.toLowerCase();
}

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

    rows.push({
      model: model.trim(),
      color: color.trim(),
      wheels,
      angle: normalizeAngle(angleRaw),
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
