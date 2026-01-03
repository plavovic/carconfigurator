const pool = require("../db");
const { generateModelImages } = require("../services/imageService");

/**
 * Get all car models with image URLs
 */
const getModels = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, base_price, model_code, config_code,
              zero_to_hundred_km_h, top_speed_km_h, power_hp, power_kw,
              energy_consumption_kWh_per_100km, co2_emissions_g_per_km,
              created_at, updated_at
       FROM car_models
       ORDER BY id`
    );

    // Enhance each model with image URLs
    const modelsWithImages = result.rows.map(model => {
      const images = generateModelImages(model.model_code, model.config_code);
      
      return {
        ...model,
        images: images,
        // Also provide individual image URLs for backward compatibility
        image_url: images.threeQuarter,
        front_image_url: images.front
      };
    });

    res.json(modelsWithImages);
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
};

/**
 * Get a single car model by ID with image URLs
 */
const getModelById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, name, description, base_price, model_code, config_code,
              zero_to_hundred_km_h, top_speed_km_h, power_hp, power_kw,
              energy_consumption_kWh_per_100km, co2_emissions_g_per_km,
              created_at, updated_at
       FROM car_models
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Model not found" });
    }

    const model = result.rows[0];
    const images = generateModelImages(model.model_code, model.config_code);

    const ordered = [
      { id: 1, label: 'Front', url: images.front },
      { id: 2, label: '3/4', url: images.threeQuarter },
      { id: 3, label: 'Side', url: images.side },
      { id: 4, label: 'Rear', url: images.rear },
      { id: 5, label: 'Interior', url: images.interior },
    ].filter(x => !!x.url);

    res.json({
      ...model,
      images: images,
      orderedImages: ordered,
      image_url: images.threeQuarter,
      front_image_url: images.front
    });
  } catch (error) {
    console.error("Error fetching model:", error);
    res.status(500).json({ error: "Failed to fetch model" });
  }
};

/**
 * Get model images with specific configuration
 */
const getModelImages = async (req, res) => {
  const { id } = req.params;
  const { configCode } = req.query;

  try {
    const result = await pool.query(
      `SELECT model_code, config_code FROM car_models WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Model not found" });
    }

    const model = result.rows[0];
    const useConfigCode = configCode || model.config_code;
    const images = generateModelImages(model.model_code, useConfigCode);

    const ordered = [
      { id: 1, label: 'Front', url: images.front },
      { id: 2, label: '3/4', url: images.threeQuarter },
      { id: 3, label: 'Side', url: images.side },
      { id: 4, label: 'Rear', url: images.rear },
      { id: 5, label: 'Interior', url: images.interior },
    ].filter(x => !!x.url);

    res.json({ images, ordered });
  } catch (error) {
    console.error("Error generating model images:", error);
    res.status(500).json({ error: "Failed to generate images" });
  }
};

module.exports = {
  getModels,
  getModelById,
  getModelImages
};
