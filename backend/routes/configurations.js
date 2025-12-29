const express = require("express");
const router = express.Router();
const {
  getUserConfigurations,
  getConfigurationById,
  saveConfiguration,
  getConfigurationPreview,
} = require("../controllers/configurationsController");

// Preview configuration images (without saving)
router.post("/preview", getConfigurationPreview);

// Save new configuration
router.post("/", saveConfiguration);

// Get configuration by ID
router.get("/:id", getConfigurationById);

// Get user configurations
router.get("/user/:userId", getUserConfigurations);

module.exports = router;
