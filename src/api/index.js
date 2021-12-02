const express = require('express');
const {userRoutes} = require('./user/userRoute');
const siteroutes = require('./contruction/siteRoutes');
// Uses of the express Pakages
const app = express();
let routes = [].concat(userRoutes,siteroutes);
exports.v1routes = 	app.use('/api' ,routes);

