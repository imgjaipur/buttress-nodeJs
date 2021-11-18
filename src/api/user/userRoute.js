const {Router} = require('express');
const userController = require('./userController');
const userRoutes = Router();

userRoutes.get('/insertHospital', userController.register);


exports.userRoutes = userRoutes;