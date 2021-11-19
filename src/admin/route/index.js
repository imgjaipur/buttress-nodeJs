//Required Packages
const express = require('express');

const router = express.Router();

const adminController = require('../../admin/controller/admincontroller');

const multer = require('multer');

const path = require('path');

const auth = require('../middleware/auth');



// file uploading  with multer

var storage1 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'src/admin/adminUploads/')
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, file.originalname)
    }
})
var upload = multer({
    storage: storage1,
})


// --------- registration route-------

router.get('/' , auth ,   async(req , res )=>{
    res.send("buttress project setup")
})
router.get('/register', adminController.register_Admin_view);
router.post('/register', upload.single('profile'), adminController.registerAdmin);
router.get('/api', auth , adminController.admindata);
router.get('/login' , adminController.login_View);
router.post('/login' , adminController.log_in);
router.get('/dashbord' ,auth, adminController.dashbord);


module.exports = router;