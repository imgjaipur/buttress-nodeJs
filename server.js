require("dotenv").load();

const http = require("http");
const path = require("path");
const express = require("express");
const session = require('express-session');
const cors = require("cors");
const hbs = require('hbs');
const adminroutes = require('./src/adminPanel/route/index').router;

// Create Express webapp
let key = 'imgglobalinfotech';
const app = express();

app.use(express.static(path.join(__dirname, "/public")));

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(session({
    secret: key,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 }
}));

app.set('views', path.join(__dirname, './src/adminPanel/views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + './src/adminPanel/views')
    // Routes 
app.use('/admin', adminroutes);
app.use('/', (req, res, next) => {
    res.redirect('/admin/');
});

// Create an http server and run it
const server = http.createServer(app);
const port = process.env.PORT || 4000;
server.listen(port, function() {
    console.log("Express server running on *:" + port);
});