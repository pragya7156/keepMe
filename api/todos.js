const router = require('express').Router();
const pool = require('../config/db_config');

router.post('/', async (req,res) => {
    try {
        const { id } = req.body;
        let sql = `SELECT * FROM todos WHERE userId=?;`;
        const result = await pool.query(sql,[id])
        res.status(200).json({
            message: "Todo List fetched successfully",
            status: 1,
            result
        })
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }
})

module.exports = router;