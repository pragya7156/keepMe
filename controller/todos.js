const router = require('express').Router();
const pool = require('../config/db_config');

module.exports.ADD_TODO = async (req,res) => {
    try {
        const {id, title} = req.body;
    if(!title) {
        return res.status(200).json({
            message: "Title is required",
            status: 0
        })
    }
    let sql = `INSERT INTO todos (title, userId) VALUES (?,?);`;
    const result = await pool.query(sql,[title, id]);
    res.status(200).json({
        message: "Added",
        status: 1,
        result
    })
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }
}

module.exports.DEL_TODO = async (req,res) => {
    try {
        const {todo_id} = req.body;
    if(!todo_id) {
        return res.status(200).json({
            message: "Missing required field",
            status: 0
        })
    }
    let sql = `DELETE FROM todos WHERE todo_id=?;`;
    const result = await pool.query(sql,[todo_id]);
    res.status(200).json({
        message: "Deleted",
        status: 1,
        result
    })
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }
}

module.exports.EDIT_TODO = async (req,res) => {
    try {
        const {todo_id, title} = req.body;
    if(!todo_id || !title) {
        return res.status(200).json({
            message: "Missing required fields",
            status: 0
        })
    }
    let sql = `UPDATE todos SET title=? WHERE todo_id=?;`;
    const result = await pool.query(sql,[title, todo_id]);
    res.status(200).json({
        message: "Edited",
        status: 1,
        result
    })
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }
}