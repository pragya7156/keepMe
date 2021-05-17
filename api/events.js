const router = require('express').Router();
const pool = require('../config/db_config');

router.post('/getmem', async (req, res) => {
    try {
        let { id } = req.body;
        if (!id) {
            return res.status(200).json({
                message: "Missing field",
                status: 0
            });
        }
        else {
            const sql = `SELECT COUNT(*) as mem FROM events WHERE userId=?;`;
            const bind = [id];
            const mem = await pool.query(sql, bind);
            return res.status(200).json({
                message: "Count Fetched Successfully",
                status: 1,
                mem: mem[0].mem
            })
        }
    } catch (error) {
        return res.status(200).json({
            status: 0,
            error: error.message
        })
    }

})

router.post('/all', async (req, res) => {
    try {
        const {id} = req.body;
        const sql = `SELECT * FROM events WHERE userId=? ORDER BY event_id DESC;`;
        const result = await pool.query(sql, [id]);
        return res.status(200).json({
            message: "Events Fetched Successfully",
            status: 1,
            result
        })
    } catch (error) {
        return res.status(200).json({
            status: 0,
            error: error.message
        })
    }
})

router.post('/fav', async (req, res) => {
    try {
        const {id} = req.body;
        const sql = `SELECT * FROM events WHERE status=1 AND userId=? ORDER BY event_id DESC;`;
        const result = await pool.query(sql, [id]);
        return res.status(200).json({
            message: "Favourite Events Fetched Successfully",
            status: 1,
            result
        })
    } catch (error) {
        return res.status(200).json({
            status: 0,
            error: error.message
        })
    }

})

module.exports = router;