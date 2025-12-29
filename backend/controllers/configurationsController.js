const pool = require("../db");
const { generateConfigurationImages, buildConfigCode } = require("../services/imageService");

/**
 * Get user configurations with images
 */
const getUserConfigurations = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT c.id, c.configuration_name, c.total_price, c.is_saved, c.created_at,
              cm.name as model_name, cm.model_code, cm.config_code, cm.base_price,
              json_agg(
                json_build_object(
                  'id', o.id,
                  'category', o.category,
                  'name', o.name,
                  'option_code', o.option_code,
                  'price_modifier', ci.price_at_selection
                )
              ) as selected_options
       FROM configurations c
       JOIN car_models cm ON cm.id = c.car_model_id
       LEFT JOIN configuration_items ci ON ci.configuration_id = c.id
       LEFT JOIN options o ON o.id = ci.option_id
       WHERE c.user_id = $1
       GROUP BY c.id, cm.name, cm.model_code, cm.config_code, cm.base_price
       ORDER BY c.created_at DESC`,
      [userId]
    );

    // Enhance configurations with images
    const configurationsWithImages = result.rows.map(config => {
      const optionCodes = config.selected_options
        .filter(opt => opt.id !== null)
        .map(opt => opt.option_code);
      
      const customConfigCode = buildConfigCode(config.config_code, optionCodes);
      const images = generateConfigurationImages(
        config.model_code, 
        customConfigCode, 
        optionCodes
      );

      return {
        ...config,
        images: images,
        primary_image: images.threeQuarter
      };
    });

    res.json(configurationsWithImages);
  } catch (error) {
    console.error("Error fetching configurations:", error);
    res.status(500).json({ error: "Failed to fetch configurations" });
  }
};

/**
 * Get a single configuration by ID with images
 */
const getConfigurationById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT c.id, c.user_id, c.configuration_name, c.total_price, c.is_saved, c.created_at,
              cm.id as model_id, cm.name as model_name, cm.model_code, cm.config_code, cm.base_price,
              json_agg(
                json_build_object(
                  'id', o.id,
                  'category', o.category,
                  'name', o.name,
                  'option_code', o.option_code,
                  'price_modifier', ci.price_at_selection
                )
              ) as selected_options
       FROM configurations c
       JOIN car_models cm ON cm.id = c.car_model_id
       LEFT JOIN configuration_items ci ON ci.configuration_id = c.id
       LEFT JOIN options o ON o.id = ci.option_id
       WHERE c.id = $1
       GROUP BY c.id, cm.id, cm.name, cm.model_code, cm.config_code, cm.base_price`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Configuration not found" });
    }

    const config = result.rows[0];
    const optionCodes = config.selected_options
      .filter(opt => opt.id !== null)
      .map(opt => opt.option_code);
    
    const customConfigCode = buildConfigCode(config.config_code, optionCodes);
    const images = generateConfigurationImages(
      config.model_code, 
      customConfigCode, 
      optionCodes
    );

    res.json({
      ...config,
      images: images,
      primary_image: images.threeQuarter
    });
  } catch (error) {
    console.error("Error fetching configuration:", error);
    res.status(500).json({ error: "Failed to fetch configuration" });
  }
};

/**
 * Save a new configuration
 */
const saveConfiguration = async (req, res) => {
  const { userId, carModelId, configurationName, selectedOptions, totalPrice } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert configuration
    const configResult = await client.query(
      `INSERT INTO configurations (user_id, car_model_id, configuration_name, total_price, is_saved)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id`,
      [userId, carModelId, configurationName, totalPrice]
    );

    const configId = configResult.rows[0].id;

    // Insert configuration items
    if (selectedOptions && selectedOptions.length > 0) {
      const itemsValues = selectedOptions.map(opt => 
        `(${configId}, ${opt.id}, ${opt.price_modifier || 0})`
      ).join(',');

      await client.query(
        `INSERT INTO configuration_items (configuration_id, option_id, price_at_selection)
         VALUES ${itemsValues}`
      );
    }

    await client.query('COMMIT');

    // Fetch the saved configuration with images
    const savedConfig = await getConfigurationById({ params: { id: configId } }, res);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error saving configuration:", error);
    res.status(500).json({ error: "Failed to save configuration" });
  } finally {
    client.release();
  }
};

/**
 * Generate preview images for a configuration (without saving)
 */
const getConfigurationPreview = async (req, res) => {
  const { modelId, optionIds } = req.body;

  try {
    // Get model info
    const modelResult = await pool.query(
      `SELECT model_code, config_code FROM car_models WHERE id = $1`,
      [modelId]
    );

    if (modelResult.rows.length === 0) {
      return res.status(404).json({ error: "Model not found" });
    }

    const model = modelResult.rows[0];

    // Get option codes
    let optionCodes = [];
    if (optionIds && optionIds.length > 0) {
      const optionsResult = await pool.query(
        `SELECT option_code FROM options WHERE id = ANY($1)`,
        [optionIds]
      );
      optionCodes = optionsResult.rows.map(o => o.option_code);
    }

    const customConfigCode = buildConfigCode(model.config_code, optionCodes);
    const images = generateConfigurationImages(
      model.model_code, 
      customConfigCode, 
      optionCodes
    );

    res.json(images);
  } catch (error) {
    console.error("Error generating preview:", error);
    res.status(500).json({ error: "Failed to generate preview" });
  }
};

module.exports = {
  getUserConfigurations,
  getConfigurationById,
  saveConfiguration,
  getConfigurationPreview
};
