const pool = require("../db");

const getOptions = async(req, res) => {
    const { category } = req.query;

    try{
        let result;

        if(category){
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