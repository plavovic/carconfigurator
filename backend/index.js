const express = require("express");
const cors = require("cors");

require("dotenv").config();
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const optionsRoute = require('./routes/options');
const categoriesRoute = require('./routes/categories');
const chatbotRoute = require('./routes/chatbot');
const modelsRoute = require('./routes/models');
const configurationsRoute = require('./routes/configurations');

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

app.use("/api/models", modelsRoute);

app.use("/api/configurations", configurationsRoute);

app.use("/api", chatbotRoute); //tested in postman





const PORT = process.env.PORT || process.env.API_PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);