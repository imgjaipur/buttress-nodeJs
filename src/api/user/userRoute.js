const {Router} = require('express');

const multer = require("multer");
const userRoutes = Router();
const path=require("path");
const fileExtension=require("file-extension")
const crypto=require("crypto")

const userController = require('./userController');
const auth =require('./../../lib/authmiddleware');
const { isRequestValidated,validateSingupRequest}=require("./../../lib/validationuser")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/userupload');
    },
    filename: (req, file, cb) => {
        const fileexce=(file.originalname).split('.').pop();
        const filenemo=Date.now();
        const fileName=`${filenemo}.${fileexce}`;
        // const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
        }
    }
});

// let  Storage=multer.diskStorage({
//     destination:function(req,res,cb){
//         cb(null,'uploads/userupload');
//     },
//     filename:function(req,file,cb){
//         cb(null,Date.now()+file.originalname);
//     }
// })
//  let  upload = multer({storage:Storage}).single("image");

userRoutes.post('/insertUser',validateSingupRequest,isRequestValidated,userController.register);
// userRoutes.post('/insertUser',userController.register);
userRoutes.post('/mobileLogin', userController.login);
userRoutes.post('/emailLogin', userController.emaillogin);
userRoutes.post('/verifyMobile', userController.verify);
userRoutes.post('/resendOTP', userController.resendOtp);

userRoutes.get('/getProfile', auth,userController.getProfile);
userRoutes.put('/updateProfile',auth,upload.single("image"),userController.updateprofile);
// userRoutes.post('/mobileRegistration', userController.mobileregistration);
userRoutes.post('/socialLogin', userController.sociallogin);
// userRoutes.get('/qrcode' , userController.Qr_Code);
userRoutes.post('/workerStatus',auth,userController.add_workerStatus);
userRoutes.put('/endworkingStatus',auth,userController.end_workerStatus);
userRoutes.post('/uploadsImage',auth,upload.single("image"),userController.uploadsImg);
userRoutes.post("/deleteOnlyImage",auth,userController.deleteImage)


exports.userRoutes = userRoutes;