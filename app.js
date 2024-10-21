require('dotenv').config();

const express = require('express');
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');

const {dbConnect} = require('./src/config/dbConnection');
const pageRoute = require('./src/routes/pageRoute');
const adminRoute = require('./src/routes/adminRoute');


const app = express();

port =  process.env.APP_PORT || 5000;


// configure ejs template
app.set('view engine', 'ejs');

// set static file directory
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());
app.use(cookieParser());

app.use(pageRoute);
app.use('/admin', adminRoute);

// db connection
dbConnect();

app.listen(port, ()=>{
    console.log('server running on port', port)
})