const express = require("express");
const router = express.Router();

const { listAvailableByModel } = require("../controllers/inventoryController");

// Returns all inventory units for the model.
// Includes `exactMatch` if `selectedOptionIds` is provided.
router.post("/available", listAvailableByModel);

module.exports = router;
