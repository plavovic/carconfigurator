const express = require("express");
const cors = require("cors");

require("dotenv").config();
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(results.rows[0]);
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