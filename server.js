const express = require('express');

const app = express();

const hbs = require('hbs');

const mongoose = require('mongoose');

// mongoose.set('debug' , true);

const path = require('path');

const mongodb = require('./src/lib/connecton');

const route = require('./src/admin/route/index');

const multer = require('multer');

const session = require('express-session');

const cookieParser = require('cookie-parser');

const auth = require('../buttress-nodeJs/src/admin/middleware/auth');

const dotenv = require('dotenv').config();

const fs = require('fs');




app.use(express.static(path.join(__dirname,'/uploads')));



app.use(express.json());

app.use(express.static(path.join(__dirname, '/src/admin')));

hbs.registerPartials(path.join(__dirname, 'src/admin/partials'))
// console.log("path---------",__dirname)
app.set('views', path.join(__dirname, 'src/admin/views'))
app.set('view engine',"hbs");




app.use(express.json());

app.use(express.urlencoded({ extended: true }));

let privateKey = fs.readFileSync('./private.key',"utf8");

app.use(session({
     secret: privateKey,
     resave: false,
     saveUninitialized: false,
     cookie: { maxAge: 7200000, httpOnly: true } 
 }));
app.use(cookieParser())
app.use(route);

const port = 8080;
app.listen(port , (err) => {if (err)
    {
    console.log(err); process.exit(0)}
    else{
        console.log(`Connected Successfully to this  ${port}.`)
    }});   