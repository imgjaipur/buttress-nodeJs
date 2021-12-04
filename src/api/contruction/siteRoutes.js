const express = require('express');
const siteRoutes = express.Router();
const auth = require('./../../lib/authmiddleware');
const sitecontroller = require('./sitecontroller.js');
siteRoutes.get('/getAllsite', auth, sitecontroller.getsite);

// exports.siteRoutes = siteRoutes;
module.exports = siteRoutes;