const express = require('express');
const siteRoutes = express.Router();
const sitecontroller = require('./sitecontroller.js');
siteRoutes.get('/getsite/:id?',sitecontroller.getsite);

// exports.siteRoutes = siteRoutes;
module.exports = siteRoutes;




