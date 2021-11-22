const {Router} = require('express');

const multer = require("multer");
const userRoutes = Router();

const userController = require('./userController');
const auth =require('./../../lib/authmiddleware');

let  Storage=multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'uploads/userupload');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
})
 let  upload = multer({storage:Storage}).single("image");

userRoutes.post('/insertUser',userController.register);
userRoutes.post('/mobileLogin', userController.login);
userRoutes.post('/emailLogin', userController.emaillogin);
userRoutes.post('/verifyMobile', userController.verify);
userRoutes.post('/resendOTP', userController.resendOtp);

userRoutes.get('/getProfile/:id', userController.getProfile);
userRoutes.put('/updateProfile/:id',auth,upload,userController.updateprofile);

exports.userRoutes = userRoutes;