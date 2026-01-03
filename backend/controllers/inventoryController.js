const pool = require("../db");

function normalizeIdArray(ids) {
  if (!Array.isArray(ids)) return [];
  return [...new Set(ids.map((x) => Number(x)).filter((n) => Number.isFinite(n)))]
    .sort((a, b) => a - b);
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * List all inventory units for a model.
 * If selectedOptionIds is provided, includes exactMatch boolean.
 */
async function listAvailableByModel(req, res) {
  const { carModelId, selectedOptionIds } = req.body || {};

  if (!carModelId) {
    return res.status(400).json({ error: "carModelId is required" });
  }

  const requested = normalizeIdArray(selectedOptionIds);

  try {
    const result = await pool.query(
      `SELECT
         iu.id,
         iu.car_model_id,
         iu.dealership_name,
         iu.label,
         iu.status,
         iu.created_at,
         COALESCE(array_agg(iuo.option_id ORDER BY iuo.option_id) FILTER (WHERE iuo.option_id IS NOT NULL), '{}') AS option_ids,
         COALESCE(
           json_agg(
             json_build_object(
               'id', o.id,
               'category', o.category,
               'name', o.name,
               'option_code', o.option_code,
               'price_modifier', o.price_modifier
             )
             ORDER BY o.id
           ) FILTER (WHERE o.id IS NOT NULL),
           '[]'
         ) AS options
       FROM inventory_units iu
       LEFT JOIN inventory_unit_options iuo ON iuo.inventory_unit_id = iu.id
       LEFT JOIN options o ON o.id = iuo.option_id
       WHERE iu.car_model_id = $1
       GROUP BY iu.id
       ORDER BY iu.created_at DESC, iu.id DESC`,
      [carModelId]
    );

    const rows = result.rows.map((row) => {
      const invOptionIds = normalizeIdArray(row.option_ids || []);
      const exactMatch = requested.length > 0 && arraysEqual(invOptionIds, requested);

      return {
        ...row,
        option_ids: invOptionIds,
        exactMatch,
      };
    });

    res.json(rows);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
}

module.exports = {
  listAvailableByModel,
};
