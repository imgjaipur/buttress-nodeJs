const {Router} = require('express');
const userController = require('./userController');
const multer = require("multer")
const userRoutes = Router();
const path=require("path");
const crypto=require("crypto")
const fileExtension=require("file-extension")
const auth =require('./../../lib/authmiddleware')
// var storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//     callback(null, path.join(__dirname, "../uploads/userupload"));
//     },
//     filename: function (req, file, cb) {
//     crypto.pseudoRandomBytes(16, function (err, raw) {
//     cb(
//     null,
//     raw.toString("hex") + Date.now() + "." + fileExtension(file.mimetype)
//     );
//     });
//     }
//     });
// var upload = multer({ storage: storage, })
let  Storage=multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'uploads/userupload')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})
 let  upload = multer({storage:Storage}).single("image");

userRoutes.post('/insert',upload,userController.register);
userRoutes.post('/login', userController.login);
userRoutes.post('/emailLogin', userController.emaillogin);
userRoutes.post('/verify', userController.verify);
userRoutes.post('/resendotp', userController.resendOtp);
userRoutes.get('/getProfile/:id', userController.getProfile);

userRoutes.put('/updateProfile/:id',upload,auth,userController.updateprofile);

exports.userRoutes = userRoutes;