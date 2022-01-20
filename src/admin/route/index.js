//Required Packages
const express = require('express');

const router = express.Router();

const adminController = require('../../admin/controller/admincontroller');

const multer = require('multer');

const path = require('path');

const auth = require('../middleware/auth');

// console.log(path.join(__dirname,'uploads/adminuploads');

// file uploading  with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/users');
    },
    filename: (req, file, cb) => {
        let fileEx = (file.originalname).split('.').pop();
        let file_name = Date.now();
        let fileName = `${file_name}.${fileEx}`;
        cb(null, fileName)
    }
});
var upload = multer({
        storage: storage,
    })
    // --------- registration route-------

router.get('/', auth, async(req, res) => {
    res.send("buttress project setup")
})
router.get('/login', adminController.login_View);
router.post('/login', adminController.log_in);
router.get('/logout', auth, adminController.log_out);
// ---------------------------------------------------------------------------------
router.get('/register', adminController.register_Admin_view);
router.post('/register', upload.single('profile'), adminController.registerAdmin);
// ---------------------------------------------------------------------------------
router.get('/api', auth, adminController.admindata);
router.get('/dashbord', auth, adminController.dashbord);
router.get('/users-datatable', auth, adminController.users_datatable_view);
router.get('/usersdatatable', auth, adminController.users_datatable);
router.get('/delete', auth, adminController.delete_user);
router.get('/edit', auth, adminController.edit_user_view);
router.post('/edit-user', auth, upload.single('image'), adminController.edit_user)
router.get('/view', auth, adminController.view_user);
router.get('/blockuser/:status/:id', adminController.update_block_status);
router.get('/site-insert', auth, adminController.site_insert_view_page);
router.post('/site-insert', auth, adminController.insert_site_info);
router.get('/siteinfo', auth, adminController.site_info_datatable_view);
router.get('/siteinfo-data', auth, adminController.site_info_datatable);
router.get('/siteinfo-delete', auth, adminController.delete_site_info);
router.get('/siteinfo-view', auth, adminController.site_info_view);
router.get('/siteinfo-edit-view', auth, adminController.site_info_update_view);
router.post('/siteinfo-update', auth, adminController.site_info_update);



module.exports = router;