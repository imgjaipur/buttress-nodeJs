const express = require('express');
const {userRoutes} = require('./user/userRoute');
const siteroutes = require('./contruction/siteRoutes');
const tardeCategory=require("./Trade/tradeRouter");
// Uses of the express Pakages
const app = express();
let routes = [].concat(userRoutes,siteroutes,tardeCategory);
exports.v1routes = 	app.use('/api' ,routes);

