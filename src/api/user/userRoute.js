const {Router} = require('express');
const userController = require('./userController');
const userRoutes = Router();

userRoutes.post('/insert', userController.register);
userRoutes.post('/login', userController.login);


exports.userRoutes = userRoutes;