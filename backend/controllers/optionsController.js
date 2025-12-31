const pool = require("../db");
const { generateOptionImage, getPlaceholderImage } = require("../services/imageService");
const taycanImageMap = require("../config/taycanImages");
const modelOptionImages = require("../config/modelOptionImages");

const getOptions = async(req, res) => {
    const { category, modelId } = req.query;

    try{
        let result;

        // Filter by model if provided (uses car_model_options join)
        if (modelId) {
            if (category) {
                result = await pool.query(
                        `SELECT o.id, o.category, o.name, o.description, o.price_modifier, 
                            o.option_code, o.hex_color,
                            cm.model_code, cm.config_code, cm.name AS car_model_name
                     FROM options o
                     JOIN car_model_options cmo ON cmo.option_id = o.id
                     JOIN car_models cm ON cm.id = cmo.car_model_id
                     WHERE cmo.car_model_id = $1 AND o.category = $2
                     ORDER BY o.id`,
                    [modelId, category]
                );
            } else {
                result = await pool.query(
                        `SELECT o.id, o.category, o.name, o.description, o.price_modifier, 
                            o.option_code, o.hex_color,
                            cm.model_code, cm.config_code, cm.name AS car_model_name
                     FROM options o
                     JOIN car_model_options cmo ON cmo.option_id = o.id
                     JOIN car_models cm ON cm.id = cmo.car_model_id
                     WHERE cmo.car_model_id = $1
                     ORDER BY o.category, o.id`,
                    [modelId]
                );
            }
        }
        else if(category){
            result= await pool.query(
            `SELECT id, category, name, description, price_modifier, option_code, hex_color
             FROM options
             WHERE category = $1
             ORDER BY id`,
             [category]
            );
        }
        else{
            result = await pool.query(
           `SELECT id, category, name, description, price_modifier, option_code, hex_color
            FROM options
            ORDER BY category, id`
            );
        }

        // Enhance options with image URLs
        const optionsWithImages = result.rows.map(option => {
            let imageUrl = null;
            const baseName = option.name.replace(/\s*\((Taycan|Carrera)\)\s*$/i, '').trim();
            const modelName = option.car_model_name;
            
            // 1) Exact Taycan map (wheels + Taycan-only names)
            if (taycanImageMap[option.name]) {
                imageUrl = taycanImageMap[option.name];
            }

            // 2) Model-specific overrides for shared options (e.g., HD Matrix / Night Vision)
            if (!imageUrl && modelName && modelOptionImages[modelName] && modelOptionImages[modelName][baseName]) {
                imageUrl = modelOptionImages[modelName][baseName];
            }
            if (!imageUrl && modelOptionImages.Default[baseName]) {
                imageUrl = modelOptionImages.Default[baseName];
            }
            // 3) If we still don't have an image, generate one for supported categories
            // (but never override explicit mappings above).
            if (!imageUrl) {
                if (option.category === 'Exterior Color') {
                    if (option.model_code && option.config_code && option.option_code) {
                        imageUrl = generateOptionImage(option.model_code, option.config_code, option.option_code);
                    }
                } else if (option.category === 'Wheels') {
                    if (option.model_code && option.config_code && option.option_code) {
                        imageUrl = generateOptionImage(option.model_code, option.config_code, option.option_code, 2);
                    }
                } else if (option.category === 'Interior') {
                    if (option.model_code && option.config_code && option.option_code) {
                        imageUrl = generateOptionImage(option.model_code, option.config_code, option.option_code, 5);
                    }
                }
            }

            // 4) Final fallback
            if (!imageUrl) {
                imageUrl = getPlaceholderImage(option.category);
            }

            return {
                id: option.id,
                category: option.category,
                name: baseName,
                description: option.description,
                price_modifier: option.price_modifier,
                option_code: option.option_code,
                hex_color: option.hex_color,
                image_url: imageUrl
            };
        });

        res.json(optionsWithImages);
    }

    catch(error) {
        console.error("Error while fetching options", error);
        res.status(500).json({error:"Failed to fetch options"});
    }
};

module.exports = { getOptions };