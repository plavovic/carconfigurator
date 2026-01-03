const express = require("express");
const router = express.Router();
const { getModels, getModelById, getModelImages } = require("../controllers/modelsController");

// Get all models
router.get("/", getModels);

// Get model by ID
router.get("/:id", getModelById);

// Get model images with optional custom config
router.get("/:id/images", getModelImages);

module.exports = router;


