//Required Packages
const express = require('express');
const multer = require('multer');
const moment = require('moment');
const router = express.Router();
const admin = require('../../../connection1');
let ddb = admin.firestore();

// Multer file upload
const storage1 = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage: storage1
})

// Middleware
const auth = require('../middleware/auth');

//controllers
const admins = require('../controller/admincontroller');
//ROUTES

// --Login
router.get('/', admins.loginview);
router.post('/login', admins.login);

// --dashbord
router.get('/dashbord', auth, admins.dashbordview);

// --registerAdmin
router.get('/register_Admin_view', auth, admins.register_Admin_view);
router.post('/registerAdmin', admins.registerAdmin);

// --showusers
router.get('/showusers', auth, admins.showusers);
router.get('/user_datatable', admins.user_datatable);

// --adduserByAdmin
router.get('/add_userByAdmin', auth, admins.add_userByAdmin);
router.post('/adduserByAdmin', admins.adduserByAdmin);
router.get('/delete/:uid', admins.profile_delete);
router.get('/blockuser/:status/:uid', admins.blockuser);
router.get('/userdetails/:uid', auth, admins.userdetails);

// --transaction
router.get('/transaction/:uid', auth, admins.transaction);
router.get('/transaction_datatable/:uid', admins.transaction_datatable);

// --edituser
router.get('/edit/:uid', auth, admins.edit_user);
router.post('/edituser/:uid', auth, upload.single('image'), admins.edituser);

// --resetview
router.get('/resetview', auth, admins.resetview);
router.post('/reset', auth, admins.reset);

// --deleteprofileimage
// router.get('/deleteprofileimage/:uid', admins.deleteprofileimage);

// --communityRoom
router.get('/communityRoom', auth, admins.communityRoom);
router.get('/Show_communityRoom', auth, admins.Show_communityRoom);

// --createCommunity
router.get('/show_createCommunity/:uid', auth, admins.show_createCommunity);
router.post('/createCommunity/:hosterID', auth, upload.array('bgImgURL', 2), admins.createCommunity);
// router.get('/deleteprofileimageC/:uid', admins.deleteprofileimageC);
// router.get('/deletebgimageC/:uid', admins.deletebgimageC);
// router.get('/deletecommunityroom/:uid', admins.deletecommunityroom);

// --Scheduled_community_room
router.get('/Scheduledcommunityroom/:uid/:fullName', auth, admins.Scheduledcommunityroom);
router.post('/Scheduled_community_room/:hosterID/:HfullName', auth, upload.array('bgImgURL', 2), admins.Scheduled_community_room);
// upload.fields([{ name: 'bgImgURL', maxCount: 1 }, { name: 'thumbImgURL', maxCount: 1 }])

// -- show Resources
router.get('/showresources', auth, admins.showresources);

// --add Folder
router.get('/add_Folder', auth, admins.add_folder);
router.post('/addFolder', auth, admins.addFolder);

// --add sub folder
router.get('/add_subFolder/:parentid', auth, admins.add_subFolder);
router.post('/addsubFolder', auth, admins.addsubFolder);

// --add files in folder
router.get('/add_file/:id', auth, admins.add_file);
router.post('/addFile', auth, upload.single('image'), admins.addFile);

// --showFolder
router.get('/ShowFolders/:parentid', auth, admins.ShowFolders);
router.get('/folder_datatable/:parentid', auth, admins.folder_datatable);

//  --View files
router.get('/view_files/:folderid', auth, admins.ViewFile);
router.get('/file_datatable/:folderid', auth, admins.file_datatable);

//  --Cron job
const premiumCronadmin = async(req, res) => {
    try {
        let Docdata;
        let Docid;
        admin.auth().getUserByEmail('admin1@gmail.com')
            .then(async(userCredential) => {
                const calendarCollection = await ddb.collection('calendar').get();
                calendarCollection.forEach(doc => {
                    Docdata = doc.data();
                    Docid = doc.id
                })
                console.log(Docdata.Events);
                const Docdata12 = await (Docdata.Events).filter(data => {
                    return (data.toTime).toString() >= (moment(Date.now()).format()).toString()
                });
                console.log('Filtered data------------------------->', Docdata12);
                await ddb.collection('calendar').doc(Docid).update({ Events: Docdata12 });
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (e) {
        return e;
    }
};

module.exports = { router, premiumCronadmin };



// module.exports = router;