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
        cb(null, 'C:/NodeJs/buttress-nodeJs/uploads/adminuploads/')
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

router.post('/login',adminController.log_in);
router.get('/login',adminController.login_View);
router.get('/register',adminController.register_Admin_view);
router.post('/register',upload.single('profile'), adminController.registerAdmin);
router.get('/api',auth,adminController.admindata);
router.get('/dashbord',auth,adminController.dashbord);
router.get('/users-datatable',auth,adminController.users_datatable_view);
router.get('/usersdatatable',auth,adminController.users_datatable);
router.get('/delete',auth,adminController.delete_user);
router.get('/edit',auth,adminController.edit_user_view);
router.post('/edit-user',auth,adminController.edit_user)
router.get('/view',adminController.view_user);
router.get('/blockuser/:status/:id',adminController.update_block_status);
router.get('/site-insert',adminController.site_insert_view_page);
router.post('/site-insert',adminController.insert_site_info);
router.get('/siteinfo',adminController.site_info_datatable_view);
router.get('/siteinfo-data',adminController.site_info_datatable);
router.get('/siteinfo-delete',adminController.delete_site_info);
router.get('/siteinfo-view',adminController.site_info_view);
router.get('/siteinfo-edit-view',adminController.site_info_update_view);
router.post('/siteinfo-update',adminController.site_info_update);



module.exports = router;











