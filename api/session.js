require('dotenv').config()
const router = require('express').Router();
const pool = require('../config/db_config');
const jwt = require('jsonwebtoken');

router.post('/', async (req,res) => {
    try{
        const id = req.body.id;
        if(!id){
            return res.status(200).json({
                message: "Missing Field",
                status: 0
            });
        }

        let sql = `SELECT token FROM users WHERE user_id = ? AND token IS NOT NULL`;
        await pool.query(sql,[id], async (err,result) => {
            if(err)
            return res.status(200).json({
                message: "Error",
                status: 0
            })
            if(result.length != 1){
                return res.status(200).json({
                    message: "No tokens",
                    status: 0
                }); 
            }
            await jwt.verify(result[0].token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
                if(err) {
                    return res.status(200).json({
                        message: "Session expired",
                        status: 0
                    })
                }
                res.status(200).json({
                    message: 'Session Present',
                    status: 1
                });
            })
        });

    }catch(err){
        return res.status(200).json({
            message: "Bad SessionId",
            status: 0
        }); 
    }
})

module.exports = router;