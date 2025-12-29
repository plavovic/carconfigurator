const pool = require("../db");
const { generateOptionImage, getPlaceholderImage } = require("../services/imageService");

const getOptions = async(req, res) => {
    const { category, modelId } = req.query;

    try{
        let result;

        // Filter by model if provided (uses car_model_options join)
        if (modelId) {
            if (category) {
                result = await pool.query(
                    `SELECT o.id, o.category, o.name, o.description, o.price_modifier, 
                            o.option_code, o.hex_color, o.image_url,
                            cm.model_code, cm.config_code
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
                            o.option_code, o.hex_color, o.image_url,
                            cm.model_code, cm.config_code
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
            `SELECT id, category, name, description, price_modifier, option_code, hex_color, image_url
             FROM options
             WHERE category = $1
             ORDER BY id`,
             [category]
            );
        }
        else{
            result = await pool.query(
           `SELECT id, category, name, description, price_modifier, option_code, hex_color, image_url
            FROM options
            ORDER BY category, id`
            );
        }

        // Enhance options with image URLs
        const optionsWithImages = result.rows.map(option => {
            let imageUrl = option.image_url || null;
            
            // Generate image URL based on category
            if (option.category === 'Exterior Color') {
                // For colors, generate an image showing the car in that color
                if (option.model_code && option.config_code && option.option_code) {
                    imageUrl = generateOptionImage(
                        option.model_code, 
                        option.config_code, 
                        option.option_code
                    );
                }
            } else if (option.category === 'Wheels') {
                // For wheels, similar approach
                if (option.model_code && option.config_code && option.option_code) {
                    imageUrl = generateOptionImage(
                        option.model_code, 
                        option.config_code, 
                        option.option_code,
                        2 // 3/4 view to show wheels better
                    );
                }
            } else if (option.category === 'Interior') {
                // For interior, use interior angle
                if (option.model_code && option.config_code && option.option_code) {
                    imageUrl = generateOptionImage(
                        option.model_code, 
                        option.config_code, 
                        option.option_code,
                        5 // Interior view
                    );
                }
            }
            
            // If DB does not provide image, try generator; still fallback to placeholder
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
                if (!imageUrl) {
                    imageUrl = getPlaceholderImage(option.category);
                }
            }

            return {
                id: option.id,
                category: option.category,
                name: option.name,
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