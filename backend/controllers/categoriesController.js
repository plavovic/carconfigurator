const pool = require("../db");

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT category
       FROM options
       ORDER BY category`
    );

    res.json(result.rows.map(r => r.category));

  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

module.exports = { getCategories };
