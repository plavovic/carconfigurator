const express = require("express");
const cors = require("cors");

require("dotenv").config();
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {    //test performed
  res.send("Backend is running ✅");
});

app.get("/api/options", async (req, res) => { //test performed
  const { category } = req.query; // e.g. ?category=Exterior%20Color

  try {
    let result;

    if (category) {
      result = await pool.query(
        `SELECT id, category, name, description, price_modifier, image_url
         FROM options
         WHERE category = $1
         ORDER BY id`,
        [category]
      );
    } else {
      result = await pool.query(
        `SELECT id, category, name, description, price_modifier, image_url
         FROM options
         ORDER BY category, id`
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ error: "Failed to fetch options" });
  }
});


app.get("/api/test-db", async (req, res) => { //test performed
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    }

    catch (error) {
        console.log(error);

        res.status(500).json({error: "DB test failed"});
    }
});

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${PORT}`)
);