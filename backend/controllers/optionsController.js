const pool = require("../db");

const getOptions = async(req, res) => {
    const { category, modelId } = req.query;

    try{
        let result;

        // Filter by model if provided (uses car_model_options join)
        if (modelId) {
            if (category) {
                result = await pool.query(
                    `SELECT o.id, o.category, o.name, o.description, o.price_modifier, o.image_url
                     FROM options o
                     JOIN car_model_options cmo ON cmo.option_id = o.id
                     WHERE cmo.car_model_id = $1 AND o.category = $2
                     ORDER BY o.id`,
                    [modelId, category]
                );
            } else {
                result = await pool.query(
                    `SELECT o.id, o.category, o.name, o.description, o.price_modifier, o.image_url
                     FROM options o
                     JOIN car_model_options cmo ON cmo.option_id = o.id
                     WHERE cmo.car_model_id = $1
                     ORDER BY o.category, o.id`,
                    [modelId]
                );
            }
        }
        else if(category){
            result= await pool.query(
            `SELECT id, category, name, description, price_modifier, image_url
             FROM options
             WHERE category = $1
             ORDER BY id`,
             [category]
            );
        }
        else{
            result = await pool.query(
           `SELECT id, category, name, description, price_modifier, image_url
            FROM options
            ORDER BY category, id`
            );
        }

        res.json(result.rows);
    }

    catch(error) {
        console.error("Error while fetching options", error);
        res.status(500).json({error:"Failed to fetch options"});
    }
};

module.exports = { getOptions };