require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.IS_AUTHENTICATED = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (typeof authHeader !== 'undefined') {
        const token = authHeader && authHeader.split(' ')[1];
        if (!token)
            return res.status(403).send({
                message: "No token provided",
                status: 0
            })

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                if(err.name === 'JsonWebTokenError') {
                return res.status(400).json({
                    message: "JWT expired",
                    status: 0
                })
            } else {
                return res.status(400).json({
                    message: "Unauthorized",
                    status: 0
                })
            }
            }
                
            req.user = user
            next()
        })
    }
    else {
        return res.status(403).send({
            message: "Something went wrong",
            status: 0
        });
    }
};