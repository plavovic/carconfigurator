const express = require("express");
const router = express.Router();

const { getOptions } = require("../controllers/optionsController")

router.get("/", getOptions);

//console.log("getOptions typeof:", typeof getOptions);

module.exports = router;