require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(__dirname + "/uploads"));


app.use('/api', require('./api/index'));
app.use('/users', require('./routes/users'));

if(process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"))
    app.get('/*', (req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server started at Port ${PORT}`);
});
