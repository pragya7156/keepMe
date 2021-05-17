
const router = require('express').Router();
const pool = require('../config/db_config');

module.exports.ADDEVENTS = async (req, res) => {
    try {
        let { event_type, title, description, id } = req.body;
        if (!title || !id) {
            return res.status(200).json({
                message: "Missing field title",
                status: 0
            })
        }
        if(!event_type)
        event_type = 'Daily';

        const status = 0;

        const sql = `INSERT INTO events(event_type, title, status, created_at, modified_on, userId, description) VALUES(?,?,?,?,?,?,?);`;
        const bind = [event_type, title, status, new Date(), new Date(), id, description];

        const result = await pool.query(sql, bind);
        return res.status(200).json({
            message: "Event added successfully",
            status: 1,
            result
        })

        // await pool.query(sql,bind, async function(err,results,fields) {
        //     if(err) {
        //         return res.status(400).json({
        //             message: error.message,
        //             status: 0
        //         }) 
        //     }
        //      res.status(200).json({
        //             message: "Event added successfully",
        //             status: 1,
        //             results,
        //             fields
        //         })
        // })

    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }

};

module.exports.EDITEVENTS = async (req, res) => {
    try {
        let { event_id, event_type, title, description, id } = req.body;
        if (!event_id || !title || !id) {
            return res.status(200).json({
                message: "Missing required fields",
                status: 0
            })
        }
        if(!event_type)
        event_type = 'Daily';

        const sql = `UPDATE events SET title=?, event_type=?, description=?, modified_on=? WHERE event_id=? AND userId=?;`;
        const bind = [title,event_type, description, new Date(), event_id, id];
        const result = await pool.query(sql, bind);
        return res.status(200).json({
            message: "Event edited successfully",
            status: 1,
            result
        })
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }

};

module.exports.FAVEVENTS = async (req, res) => {
    try {
        let { event_id } = req.body;
        if (!event_id)
            return res.status(200).json({
                message: "Missing required field",
                status: 0
            })
        const sql = `UPDATE events SET status = status ^ 1 , modified_on=? WHERE event_id=?;`;
        const bind = [new Date(), event_id];
        const result = await pool.query(sql, bind);
        return res.status(200).json({
            message: "Starred changes done",
            status: 1,
            result
        })
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }
};

module.exports.DELEVENTS = async (req, res) => {
    try {
        let { event_id } = req.body;
        if (!event_id)
            return res.status(200).json({
                message: "Missing required field",
                status: 0
            })
        const sql = `DELETE FROM events WHERE event_id=?;`;
        const bind = [event_id];
        const result = await pool.query(sql, bind);
        return res.status(200).json({
            message: "Event Deleted Successfully",
            status: 1,
            result
        })
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }
};