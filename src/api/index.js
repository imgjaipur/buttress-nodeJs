const express = require('express');
const {userRoutes} = require('./user/userRoute');
// Uses of the express Pakages
const app = express();
let routes = [].concat(userRoutes);
exports.v1routes = 	app.use('/api' ,routes);

