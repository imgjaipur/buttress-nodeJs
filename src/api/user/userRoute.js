const {Router} = require('express');
const userController = require('./userController');
const multer = require("multer")
const userRoutes = Router();
var Storage=multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'uploads/')
    },
    filename:function(req,files,cb){
        cb(null,Date.now()+files.originalname)
    }
})
var upload=multer({storage:Storage}).single("image");

userRoutes.post('/insert',upload,userController.register);
userRoutes.post('/login', userController.login);
userRoutes.post('/user', userController.verify);


exports.userRoutes = userRoutes;