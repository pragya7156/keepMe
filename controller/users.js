require('dotenv').config();

const pool = require('../config/db_config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendmail, verifyEmail, delemail } = require('../utils/mailer');
const SALT = Number(process.env.SALT);

module.exports.REGISTER = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Missing required fields',
                status: 0
            })
        }
        let sql = `SELECT * from users WHERE email=?;`;
        await pool.query(sql, [email], async function (err, results, fields) {
            if (err)
                return res.status(200).json({
                    message: err.message,
                    status: 0
                })
            if (results.length > 0) {
                return res.status(200).json({
                    message: "Email Already Exist",
                    status: 0,
                });
            }
            else {
                const payload = { name: name, mail: email, password: password };
                const JWT_PASS_SECRET = process.env.SECRET + password;
                let token = jwt.sign(payload, JWT_PASS_SECRET);
                console.log(token);
                const link = `${process.env.FRONTEND_URL}/user/first-set-password/verify/${password}/${token}`
                const email_sent = await verifyEmail(name, email, link)
                console.log(link);
                if (email_sent == 1) {
                    return res.status(200).json({
                        message: "Verification link sent to your email id",
                        token,
                        status: 1
                    })
                }
                else {
                    console.log("err:- ",email_sent);
                    return res.status(200).json({
                        message: "Something went wrong",
                        status: 0
                    })
                }
            }
        });

    } catch (error) {
        return res.status(200).json({
            error: error.message,
            status: 0
        })
    }
}

module.exports.VERIFYEMAIL = async (req, res) => {
    try {
        const { pass, confirm_pass, token, password } = req.body;
        if (!password || !confirm_pass || !pass || !token) {
            return res.status(200).json({
                error: "Missing required fields",
                status: 0
            })
        }
        const JWT_PASS_SECRET = process.env.SECRET + password;
        try {
            jwt.verify(token, JWT_PASS_SECRET, async (err, payload) => {
                if (err) {
                    console.log("1st err is", err);
                    return res.status(200).json({
                        message: "Invalid token",
                        status: 0
                    })
                }
                if (pass !== confirm_pass) {
                    return res.status(200).json({
                        message: "Passwords do not match",
                        status: 0
                    })
                }
                else {
                    const name = payload.name;
                    const email = payload.mail;
                    const hashedPassword = await bcrypt.hash(pass, SALT);
                    let sql = `INSERT INTO users(name, email, password, registered_on) VALUES (?,?,?,?);`;
                    pool.query(sql, [name, email, hashedPassword, new Date()], async function (err, results, fields) {
                        if (err) {
                        console.log("2nd err is", err);
                            return res.status(200).json({
                                message: error.message,
                                status: 0
                            })
                        }
                        res.status(200).json({
                            message: "Registered Successfully",
                            status: 1,
                            results
                        })
                    })
                }
            });
        } catch (error) {
            console.log("3rd err is", error);
            return res.status(200).json({
                message: error.message,
                status: 0
            })
        }

    } catch (error) {
        console.log("4th err is", error);
        return res.status(200).json({
            error: error.message,
            status: 0
        })
    }
}

module.exports.LOGIN = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(200).json({
                message: 'Missing required fields',
                status: 0
            })
        }
        let sql_check = `SELECT * from users WHERE email=?;`;
        await pool.query(sql_check, [email], async function (err, results, fields) {
            if (err)
                return res.status(200).json({
                    message: err.message,
                    status: 0
                })
            if (results.length > 0) {
                const checkPass = await bcrypt.compare(password, results[0].password);
                if (checkPass) {
                    const id = results[0].user_id;
                    const payload = { id };
                    let accessToken;
                    accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

                    let sql_query = `UPDATE users SET last_login=?, token=? WHERE user_id='${id}';`;
                    const bind = [new Date(), accessToken];
                    await pool.query(sql_query, bind, async function (err, results, fields) {
                        if (err) {
                            return res.status(200).json({
                                error: err.message,
                                status: 0
                            })
                        }
                        res.status(200).json({
                            message: 'Login Successful',
                            status: 1,
                            accessToken,
                            results
                        })
                    })
                }
                else {
                    res.status(200).json({
                        message: 'Wrong Credentials',
                        status: 0,
                    })
                }
            }
            else {
                return res.status(200).json({
                    message: 'Email does not exist',
                    status: 0
                })
            }
        });
    } catch (error) {
        return res.status(200).json({
            error: error.message,
            status: 0
        })
    }
}

module.exports.LOGOUT_USER = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(200).json({
                message: "Missing field",
                status: 0
            })
        }
        pool.query(
            `UPDATE users SET token = NULL, logout_at=? WHERE user_id = ?;`,
            [new Date(), id],
            async function (err, results) {
                if (err) {
                    console.log("logout unsuccessful", err.sqlMessage);
                    res.status(200).json({
                        status: 0,
                        message: err.sqlMessage,
                    });
                } else {
                    res.status(200).json({
                        status: 1,
                        message: "Successfully logged you out",
                    });
                }
            }
        );
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0,
        });
    }
}

module.exports.GET_USER = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(200).json({
                message: "User Id should be provided",
                status: 0
            })
        }
        let sql_name = `SELECT * FROM users WHERE user_id=?;`;
        pool.query(sql_name, [id], async (err, resultname) => {
            if(err) {
                return res.status(200).json({
                    message: err.message,
                    status: 0
                })
            }
            res.status(200).json({
                message: "Name extracted",
                status: 1,
                name: resultname[0].name,
                email: resultname[0].email
            })
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error" + err.message,
            status: 0,
        });
    }

}

module.exports.FORGOTPASSWORD = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(200).json({
                message: "Missing email field",
                status: 0
            })
        }
        //checking whether email is registered or not 
        let sql_check = `SELECT * FROM users WHERE email=?;`;
        await pool.query(sql_check, [email], async function (err, results, fields) {
            if (err)
                return res.status(200).json({
                    message: error.message,
                    status: 0
                })
            if (results.length > 0) {
                // user exist and now make a one time password link that is valid for 15 minutes
                const JWT_PASS_SECRET = process.env.SECRET + results[0].password;
                const id = results[0].user_id;
                const name = results[0].name;
                const mail = results[0].email;
                const payload = {
                    email: mail,
                    id: id,
                    for: "password-reset"
                }
                const token = jwt.sign(payload, JWT_PASS_SECRET, { expiresIn: '15m' })
                console.log(token);
                const link = `${process.env.FRONTEND_URL}/user/reset-password/${id}/${token}`
                const email_res = await sendmail(name, link, mail)
                console.log(link);
                if (email_res == 1) {
                    res.status(200).json({
                        message: "Password reset link has been sent to your email",
                        status: 1,
                        token
                    })
                }
                else {
                    console.log(email_res);
                    res.status(200).json({
                        message: "Something went wrong",
                        status: 0,
                        error: email_res
                    })
                }

            }
            else {
                //user not registered
                res.status(200).json({
                    message: "Email does not exist",
                    status: 0
                })
            }
        })
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }

}

module.exports.RESETPASSWORD = async (req, res) => {
    try {
        const { id, token, password, confirm_password } = req.body;
        if (!id || !token || !password || !confirm_password) {
            return res.status(200).json({
                message: "Missing required fields",
                status: 0
            })
        }
        // const JWT_PASS_SECRET = process.env.SECRET + results[0].password;
        // const decode = jwt.verify(token, JWT_PASS_SECRET);
        //check if this id exist in database
        const sql_check = `SELECT * FROM users WHERE user_id=?;`;
        await pool.query(sql_check, [id], async function (err, results, fields) {
            if (err)
                return res.status(200).json({
                    message: error.message,
                    status: 0
                })
            if (results.length > 0) {
                // given id exist. Now verify the token 
                const JWT_PASS_SECRET = process.env.SECRET + results[0].password;
                try {
                    const payload = jwt.verify(token, JWT_PASS_SECRET);
                    //token verified
                    if (password !== confirm_password) {
                        return res.status(200).json({
                            message: "Passwords do not match",
                            status: 0
                        })
                    }
                    else {
                        const hashedPassword = await bcrypt.hash(password, SALT);
                        let sql = `UPDATE users SET password=? WHERE user_id=?;`;
                        await pool.query(sql, [hashedPassword, payload.id], async function (err, results, fields) {
                            if (err)
                                return res.status(200).json({
                                    message: error.message,
                                    status: 0
                                })
                            res.status(200).json({
                                message: "Password changed successfully",
                                status: 1,
                                results
                            })
                        })
                    }
                } catch (error) {
                    return res.status(200).json({
                        message: error.message,
                        status: 0
                    })
                }
            }

            else {
                return res.status(200).json({
                    message: "Invalid ID",
                    status: 0
                })
            }
        })
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }

}

module.exports.DEL_USER = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id)
            return res.status(200).json({
                message: "Failed to delete",
                status: 0
            })
        let sql_query = `SELECT * FROM users WHERE user_id='${id}';`;
        const r = await pool.query(sql_query)
        const mail = r[0].email;
        const name = r[0].name;
        console.log(name);
        console.log(mail);
        const email_del = await delemail(name, mail)
        let sql = `DELETE FROM users WHERE user_id=?;`;
        const result = await pool.query(sql, [id])
        if (email_del == 1) {
            res.status(200).json({
                message: "Account Deleted",
                status: 1,
                result
            })
        } else {
            res.status(200).json({
                message: "Something went wrong",
                status: 0,
            })
        }
    } catch (error) {
        return res.status(200).json({
            message: error.message,
            status: 0
        })
    }

}