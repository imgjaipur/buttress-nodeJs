// require("dotenv").load();

const express = require("express");
const cors = require("cors");
require('./src/lib/connecton');
const path=require("path");
// Create Express webapp
const app = express();

app.use(express.static(path.join(__dirname,'/uploads')));

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Routes 
app.use('/', require('./src/api/index').v1routes);


const port = process.env.PORT || 3030;
app.listen(port, () => {
    // LoggerOutput.info('Log', `🌏 Express server started at ${port}`);
            console.log('Log', `🌏 Express server started at ${port}`);
});    
