const express = require("express");
const cors = require("cors");

require("dotenv").config();
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const optionsRoute = require('./routes/options');
const categoriesRoute = require('./routes/categories');

app.get("/", (req, res) => {    //test performed -- simple server check
  res.send("Backend is running ✅");
});

app.get("/api/test-db", async (req, res) => { //test performed -- database check
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    }

    catch (error) {
        console.log(error);

        res.status(500).json({error: "DB test failed"});
    }
});

app.use("/api/options", optionsRoute);

app.use("/api/categories", categoriesRoute);





const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);