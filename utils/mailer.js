require('dotenv').config();

const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const USER = process.env.USER

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

module.exports.sendmail = async(name, link, email) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: `"Pragya Singh" <${USER}>`,
            to: email,
            subject: "Password Reset Link",
            html: `<b>Hello ${name},</b><br/>You have requested for a password change. Please 
            <a href="${link}"> Click here </a> to reset your password. 
            If you can't click on the link please copy & paste the below link in browser<br/> <small>${link}</small><br/><br/>
            If you didn't ask for password reset, you can ignore this email. <br/><br/>  Thanks <br/><br/><br/><br/>
            <center><small>This is a system generated email</small></center>`,
        };
        const result = await transport.sendMail(mailOptions)
        return 1;
    } catch (error) {
        return error
    }
}

module.exports.verifyEmail = async(name, email, link) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: `"Pragya Singh" <${USER}>`,
            to: email,
            subject: "New Registration",
            html: `<b>Hello ${name},</b><br/>You have successfully created your account on Diary!! Now you need to reset your password for verification.
            Please <a href="${link}"> Click here </a> to reset your password. 
            If you can't click on the link please copy & paste the below link in browser<br/> <small>${link}</small> <br/><br/>Thanks <br/><br/><br/><br/>
            <center><small>This is a system generated email</small></center>`,
        };
        const result = await transport.sendMail(mailOptions)
        return 1;
    } catch (error) {
        return error
    }
}

module.exports.delemail = async(name, mail) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: `"Pragya Singh" <${USER}>`,
            to: mail,
            subject: "Account Deletion",
            html: `<b>Hello ${name},</b><br/>You have permanently deleted your account on Diary <br/><br/>Thanks <br/><br/><br/><br/>
            <center><small>This is a system generated email</small></center>`,
        };
        const result = await transport.sendMail(mailOptions)
        return 1;
    } catch (error) {
        return error
    }
}

