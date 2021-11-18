const firebase = require('../../../connecton');
const admin = require('../../../connection1');
const fs = require('fs');
const moment = require('moment');
const nodemailer = require('nodemailer');
const { promisify } = require('util');
let randomString = require('randomstring');
const { count } = require('console');
const path = require('path');
const unlinkAsync = promisify(fs.unlink)
    // let bucket = admin.storage().bucket();
let db = firebase.firestore();
let adminController = {
    loginview: async(req, res) => {
        res.render('login');
    },
    login: async(req, res) => {
        try {
            let reqData = req.body;
            let data = await firebase.auth().signInWithEmailAndPassword(reqData.email, reqData.password);
            req.session.regenerate(function() {
                req.session.user = true;
                req.session.userId = data.user.uid;
                return res.redirect('/admin/dashbord');
            })
        } catch (error) {
            res.status(400).render('login', {
                msg: `invalid input details ${error}`
            })
        }
    },
    register_Admin_view: (req, res) => {
        res.render('insertAdmin');
    },
    registerAdmin: async(request, response) => {
        try {
            let reqData = request.body;
            let userRecord = await firebase.auth().createUserWithEmailAndPassword(reqData.email, reqData.password)
            const docRef = db.collection('admin').doc(userRecord.uid);
            let DocRef = await docRef.set({
                email: reqData.email,
                name: reqData.name,
                mobile: reqData.mobile,
                password: reqData.password,
                uid: userRecord.uid
            });
            return response.render('dashbord', {
                data: DocRef
            });
        } catch (error) {
            console.log('Error creating new user:', error);
            return response.render('insertAdmin', {
                msg: error
            });
        }
    },
    dashbordview: async(req, res) => {
        // 1agNz0NlpRGOqgxz0Iwb
        const userCollection = await db.collection('users').get();
        const allusers = userCollection.docs.map(docsnap => docsnap.data());

        const roomCollection = await db.collection('rooms').get();
        const allrooms = roomCollection.docs.map(docsnap => docsnap.data());

        let Docdata;
        const calendarCollection = await db.collection('calendar').get();
        calendarCollection.forEach(doc => {
                Docdata = doc.data();
                Docid = doc.id
            })
            // let transporter = nodemailer.createTransport({
            //     service: 'Gmail',
            //     auth: {
            //         user: 'devanshugautam0@gmail.com',
            //         pass: ''
            //     }
            // });
            // console.log('transporter------------------------------>', transporter);
            // let mailOptions = {
            //     from: 'devanshugautam0@gmail.com',
            //     to: 'devanshug.img@gmail.com',
            //     subject: 'Sending Email using Node.js',
            //     html: `<h1>OTP </h1><p>${allusers.length}${allrooms.length}${Docdata.Events.length}</p>`
            // }
            // console.log('mailOptions----------------------------------------->', mailOptions);
            // transporter.sendMail(mailOptions, (error, info) => {
            //         if (error) {
            //             console.log(error);
            //         } else {
            //             console.log(`Email Sent ${info.response}`);
            //         }
            //     })

        res.render('dashbord', {
            users: allusers.length,
            rooms: allrooms.length,
            calendar: Docdata.Events.length,
            // data: 'Send mail sucessfully !!'
        });

    },
    showusers: async(req, res) => {
        res.render('showusers');
    },
    user_datatable: async(req, res) => {
        // console.log(req.session.userId);
        let columns = [
            'uid',
            'bio',
            'email',
            'fullName',
            'phone',
            'profileImageURL',
            'block',
            'level',
            'isActive'
        ];
        let limit1 = req.query.length;
        let start = req.query.start;
        let sortObject = {},
            dir, join, conditions = {};
        if (req.query.order[0].dir == 'asc') {
            dir = 1;
        } else {
            dir = -1;
        }
        let order = columns[req.query.order[0].column];
        sortObject[order] = dir;
        let data = [];
        let count = 1
            // const userCollection = await db.collection('users').orderBy(`${columns[req.query.order[0].column]}`, `${req.query.order[0].dir}`).startAfter(Number(start)).get(); //startAfter.limit(Number(limit1))
        const userCollection = await db.collection('users').orderBy(`${columns[req.query.order[0].column]}`, `${req.query.order[0].dir}`).get(); //startAfter.limit(Number(limit1))
        const allusers = userCollection.docs.map(docsnap => docsnap.data());
        // console.log(rows1);
        allusers.forEach((show_user) => {
            // console.log(show_user);
            let user;
            let level, action, createCommunity;
            if (show_user.isActive == false) {
                action = `<span class = "text-danger h3"><i class="fas fa-user-slash"></i></span>`;
            } else {
                createCommunity = `<a class="btn m-auto btn-outline-info btn-sm text-white" title="Create Community Room" href="/admin/show_createCommunity/${show_user.uid}" style="text-decoration: none; color: rgb(247, 78, 11) !important"><i class="fal fa-video-plus"></i></a>
                <a class="btn btn-sm btn-outline-success m-auto text-white" title="Schedule Community Room" href="/admin/Scheduledcommunityroom/${show_user.uid}/${show_user.fullName}" style="text-decoration: none; color: rgb(247, 78, 11) !important"><i class="far fa-calendar-alt"></i></a>`
                action = `
                <a class="btn mr-1 text-warning btn-sm" title="Edit" href="/admin/edit/${show_user.uid}" style="text-decoration: none;"><b><i class="far fa-edit"></i></b></a>
                <a class="btn mr-1 text-danger btn-sm" href="/admin/delete/${show_user.uid}" title="Delete" style="text-decoration: none;"><b><i class="far fa-trash-alt"></i></b></a>
                <a class="btn mr-1 text-info btn-sm" title="show user" href="/admin/userdetails/${show_user.uid}" style="text-decoration: none;"><b><i class="far fa-eye"></i></b></a>`;
                if (show_user.block == false) {
                    user = `<button class="btn btn-warning btn-sm text-white" type="button" aria-expanded="false">
                    <a class="text-white" href="/admin/blockuser/true/${show_user.uid}" style="text-decoration: none;">Block</a>
                    </button>`;
                } else {
                    user = `<button class="btn btn-success btn-sm text-white" type="button" aria-expanded="false">
                    <a class="text-white" href="/admin/blockuser/false/${show_user.uid}" style="text-decoration: none;">Unblock</a>
                    </button>`
                }
                if (show_user.level == 1) {
                    level = `<button class="btn" style = "background-color: #fbb034 !important; background-image: linear-gradient(315deg,#fbb034 0%, #fdf4b1 0%, #fbb034 44%);">Primium <i class="fas fa-crown"></i></button>`
                } else {
                    level = 'free'
                }
            }
            data.push({
                "id": count,
                "action": action,
                "BlockUser": user,
                "level": level,
                "fullName": show_user.fullName,
                "email": show_user.email,
                "phone": show_user.phone,
                "profileImageURL": show_user.profileImageURL,
                "createCommunity": createCommunity

            });
            count++;
            if (count > allusers.length) {
                let json_data = JSON.stringify({
                    "data": data
                });
                res.send(json_data);
            }

        });
    },
    add_userByAdmin: (req, res) => {
        res.render('adduserByAdmin');
    },
    adduserByAdmin: async(req, res) => {
        try {
            let reqData = req.body;
            let referCode = '',
                characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < 6; i++) {
                referCode += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            let referuserData = {};
            if (reqData.refer != "" && reqData.refer != null && reqData.refer != undefined) {
                const userCollection = db.collection('users');

                let reso = await userCollection.where('referCode', '==', reqData.refer).get();
                reso.forEach(doc => {
                    referuserData = doc.data();
                    referuserData['id'] = doc.id;
                });
                if (!referuserData.id) {
                    return res.render('adduserByAdmin', {
                        msg: "Refer User Dosn't Exist"
                    });
                } else {
                    let userRecord = await firebase.auth().createUserWithEmailAndPassword(reqData.email, reqData.password);
                    const docRef = db.collection('users').doc(userRecord.uid);
                    // console.log(userRecord.uid);
                    await docRef.set({
                        bio: "",
                        email: reqData.email,
                        fcmToken: "",
                        firstName: reqData.fname || "",
                        lastName: reqData.lname || "",
                        fullName: `${reqData.fname} ${reqData.lname}` || "",
                        fullName_lower: (`${reqData.fname} ${reqData.lname}`).toLowerCase() || "",
                        isOnline: true,
                        isVerified: false,
                        level: 0,
                        phone: reqData.phone || "",
                        profileImageURL: reqData.image || "",
                        referCode: `TRUSO${(referCode).toUpperCase()}`,
                        referCodeUsedUsers: "",
                        timestamp: Date.now(),
                        uid: userRecord.user.uid,
                        mobileCarrier: reqData.carrier,
                        referUse: referuserData.id,
                        transaction: [],
                        totalEarn: 0,
                        wallet: 0,
                        premiumTimestamp: 0,
                        block: false,
                        isActive: true
                    });
                    const referedUser = db.collection('users').doc(referuserData.id);
                    await referedUser.update({
                        referCodeUsedUsers: `${referuserData.referCodeUsedUsers},${userRecord.user.uid}`
                    });
                    return res.redirect('/admin/dashbord');
                }
            } else {
                let userRecord = await firebase.auth().createUserWithEmailAndPassword(reqData.email, reqData.password);
                // console.log(userRecord.user.uid);
                const docRef = db.collection('users').doc(userRecord.uid);
                let DocRef = await docRef.set({
                    bio: "",
                    email: reqData.email,
                    fcmToken: "",
                    firstName: reqData.fname || "",
                    lastName: reqData.lname || "",
                    fullName: `${reqData.fname} ${reqData.lname}` || "",
                    fullName_lower: (`${reqData.fname} ${reqData.lname}`).toLowerCase() || "",
                    isOnline: true,
                    isVerified: false,
                    level: 0,
                    phone: reqData.phone || "",
                    profileImageURL: reqData.image || "",
                    referCode: `TRUSO${(referCode).toUpperCase()}`,
                    referCodeUsedUsers: "",
                    timestamp: Date.now(),
                    uid: userRecord.user.uid,
                    mobileCarrier: reqData.carrier,
                    referUse: "",
                    transaction: [],
                    totalEarn: 0,
                    wallet: 0,
                    premiumTimestamp: 0,
                    block: false,
                    isActive: true
                });
                return res.redirect('/admin/dashbord');
            }
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    profile_delete: async(req, res) => {
        try {
            let uid = req.params.uid;
            const userCollection = await db.collection('users').where('uid', '==', uid).get();
            let Docid = '';
            userCollection.forEach(doc => {
                Docid = doc.id
            })
            await db.collection('users').doc(Docid).update({
                isActive: false
            });
            return res.redirect('/admin/showusers');
        } catch (error) {
            console.log(error);
            return res.redirect('/admin/showusers');
        }

    },
    blockuser: async(req, res) => {
        try {
            let uid = req.params.uid;
            let status = (req.params.status === 'true');
            const userCollection = await db.collection('users').where('uid', '==', uid).get();
            let Docid = '';
            userCollection.forEach(doc => {
                Docid = doc.id
            })
            await db.collection("users").doc(Docid).update({
                block: status
            });
            return res.redirect('/admin/showusers');
        } catch (error) {
            console.log(error);
            return res.redirect('/admin/showusers');
        }

    },
    userdetails: async(req, res) => {
        try {
            let uid = req.params.uid;
            const user = await db.collection('users').where('uid', '==', uid).get();
            let Docid = {};
            user.forEach(doc => {
                Docid = doc.data()
            });
            console.log(Docid);
            res.render('showUserDetails', {
                data: Docid,
                following: (Docid.following == undefined) ? 0 : Docid.following.length,
                followers: (Docid.followers == undefined) ? 0 : Docid.followers.length,
            });
        } catch (error) {
            console.log(error);
            return res.redirect('/admin/showusers');
        }
    },
    transaction: async(req, res) => {
        res.render('Usertransaction', {
            uid: req.params.uid
        });
    },
    deleteprofileimage: async(req, res) => {
        try {
            let uid = req.params.uid;
            const usercollection = await db.collection('users').where('uid', '==', uid).get();
            let Docid = '';
            usercollection.forEach(doc => {
                Docid = doc.id
            })
            await db.collection("users").doc(Docid).update({
                profileImageURL: ""
            });
            return res.redirect(`/admin/userdetails/${uid}`);
        } catch (error) {
            console.log(error);
            return res.render('showUserDetails');
        }
    },
    transaction_datatable: async(req, res) => {
        try {
            let columns = [
                'id',
                'reciptUrl',
                'cardId',
                'txnId',
                'amount',
                'remark',
                'created'
            ];
            let limit1 = req.query.length;
            let start = req.query.start;
            let sortObject = {},
                dir, join, conditions = {};
            if (req.query.order[0].dir == 'asc') {
                dir = 1;
            } else {
                dir = -1;
            }
            let order = columns[req.query.order[0].column];
            sortObject[order] = dir;
            let count = 1
            let uid = req.params.uid
                // console.log(uid);
            const user = await db.collection('users').where('uid', '==', uid).get();
            let Docid = {};
            user.forEach(doc => {
                Docid = doc.data()
            });
            let data = [];
            let transaction = Docid.transaction;
            transaction.forEach((show_transaction) => {
                data.push({
                    "id": count,
                    'reciptUrl': show_transaction.reciptUrl,
                    'cardId': show_transaction.cardId,
                    'txnId': show_transaction.txnId,
                    'amount': show_transaction.amount,
                    'remark': show_transaction.remark,
                    'created': show_transaction.created
                })
                count++;
                if (count > transaction.length) {
                    let json_data = JSON.stringify({
                        "data": data
                    });
                    res.send(json_data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    },
    edit_user: async(req, res) => {
        try {
            let uid = req.params.uid;
            const userCollection = await db.collection('users').where('uid', '==', uid).get();
            let Docid = '';
            userCollection.forEach(doc => {
                Docid = doc.data()
            })
            return res.render('editUser', {
                data: Docid
            });
        } catch (error) {
            console.log(error);
            return res.redirect('/admin/showusers');
        }
    },
    edituser: async(req, res) => {
        try {
            // console.log('i am in edit user try');
            let uid = req.params.uid;
            const userCollection = await db.collection('users').where('uid', '==', uid).get();
            let Docid = '';
            userCollection.forEach(doc => {
                Docid = doc.id
            })
            let image = await admin.storage().bucket().upload(`F:/IMG/Truso(FireBase)/public/uploads/${req.file.originalname}`, {
                    destination: `profile_image/${req.file.originalname}`,
                    public: true,
                })
                // let image = await bucket.file(filename).createWriteStream().end(req.file.buffer);
                // console.log(image[0].metadata.mediaLink); // this will give the media link for the uploaded file
                // console.log(image);
            await db.collection("users").doc(Docid).update({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                fullName: `${req.body.firstName} ${req.body.lastName}` || "",
                fullName_lower: (`${req.body.firstName} ${req.body.lastName}`).toLowerCase() || "",
                email: req.body.email,
                phone: req.body.phone,
                profileImageURL: image[0].metadata.mediaLink || '',

            });
            console.log('i am above edituser%db.collection');
            await unlinkAsync(req.file.path);
            return res.redirect('/admin/showusers');

        } catch (error) {
            console.log(error);
            return res.redirect('/admin/showusers');
        }
    },
    resetview: (req, res) => {
        res.render('resetview');
    },
    reset: async(req, res) => {
        console.log('i am in reset');
        let ads = await admin.auth().generatePasswordResetLink(req.body.email)
        return res.redirect(ads);
    },
    communityRoom: async(req, res) => {
        const roomCollection = await db.collection('rooms').get();
        const allrooms = roomCollection.docs.map(docsnap => docsnap.data());
        let data = [];
        let j = 0;
        for await (let show_room of allrooms) {
            j++;
            data.push({
                title: show_room.title,
                uid: show_room.uid,
            });
            // console.log("------------->", j, allrooms.length, "<--------------")
            if (j == allrooms.length) {
                res.render('communityRoomtitle', {
                    data: data
                })
            }
        };
    },
    Show_communityRoom: async(req, res) => {
        try {
            let uid = req.query.roomUid

            // getting room 
            const roomCollection = await db.collection('rooms').where('uid', '==', uid).get();
            let Docdata = {};
            roomCollection.forEach(doc => {
                Docdata = doc.data()
            })

            // getting hosterID name from users collection
            const userCollection = await db.collection('users').where('uid', '==', Docdata.hosterID).get();
            let DochosterID = {};
            userCollection.forEach(doc => {
                DochosterID = doc.data()
            })

            // getting hosters name from users collection
            let Dochosters = [];
            let hosters = [];
            if (Docdata.hosters && Docdata.hosters.length > 0) {
                for await (let doc of Docdata.hosters) {
                    const userhostersCollection = await db.collection('users').where('uid', '==', doc).get();
                    userhostersCollection.forEach(doc1 => {
                        Dochosters.push(
                            doc1.data()
                        )
                    })
                };
                Dochosters.forEach(doc => {
                    hosters.push(doc.fullName)
                })
            } else {
                hosters.push('hosters not avaiable')
            }

            // getting audiences name from users collection
            let Docaudiences = [];
            let audiences = [];
            if (Docdata.audiences && Docdata.audiences.length > 0) {
                for await (let doc of Docdata.audiences) {
                    const useraudiencesCollection = await db.collection('users').where('uid', '==', doc).get();
                    useraudiencesCollection.forEach(doc => {
                        Docaudiences.push(
                            doc.data()
                        )
                    })
                };
                Docaudiences.forEach(doc => {
                    audiences.push(doc.fullName)
                })
            } else {
                audiences.push('audiences not avaiable')
            }

            // getting hands name from users collection
            let Dochands = [];
            let hands = [];
            if (Docdata.hands && Docdata.hands.length > 0) {
                for await (let doc of Docdata.hands) {
                    const userhandsCollection = await db.collection('users').where('uid', '==', doc).get();
                    userhandsCollection.forEach(doc => {
                        Dochands.push(
                            doc.data()
                        )
                    })
                };
                Dochands.forEach(doc => {
                    hands.push(doc.fullName)
                })
            } else {
                hands.push('hands not avaiable')
            }

            // getting allParticipantIds name from users collection
            let DocallParticipantIds = [];
            let allParticipantIds = [];
            if (Docdata.allParticipantIds && Docdata.allParticipantIds.length > 0) {
                for await (let doc of Docdata.allParticipantIds) {
                    const userallParticipantIdsCollection = await db.collection('users').where('uid', '==', doc).get();
                    userallParticipantIdsCollection.forEach(doc => {
                        DocallParticipantIds.push(
                            doc.data()
                        )
                    })
                };
                DocallParticipantIds.forEach(doc => {
                    allParticipantIds.push(doc.fullName)
                })
            } else {
                allParticipantIds.push('allParticipantIds not avaiable')
            }

            // getting inviters name from users collection
            let Docinviters = [];
            let inviters = [];
            if (Docdata.inviters && Docdata.inviters.length > 0) {
                for await (let doc of Docdata.inviters) {
                    const userinvitersCollection = await db.collection('users').where('uid', '==', doc).get();
                    userinvitersCollection.forEach(doc => {
                        Docinviters.push(
                            doc.data()
                        )
                    })
                };
                Docinviters.forEach(doc => {
                    inviters.push(doc.fullName)
                })
            } else {
                inviters.push('inviters not avaiable')
            }

            // getting allParticipants name from users collection
            let DocallParticipants = [];
            let allParticipants = [];
            if (Docdata.allParticipants && Docdata.allParticipants.length > 0) {
                for await (let doc of Docdata.allParticipants) {
                    const userallParticipantsCollection = await db.collection('users').where('uid', '==', doc).get();
                    userallParticipantsCollection.forEach(doc => {
                        DocallParticipants.push(
                            doc.data()
                        )
                    })
                };
                DocallParticipants.forEach(doc => {
                    allParticipants.push(doc.fullName)
                })
            } else {
                allParticipants.push('allParticipants not avaiable')
            }

            // getting idArr name from users collection
            let DocidArr = [];
            let idArr = [];
            if (Docdata.idArr && Docdata.idArr.length > 0) {
                for await (let doc of Docdata.idArr) {
                    const useridArrCollection = await db.collection('users').where('uid', '==', doc).get();
                    useridArrCollection.forEach(doc => {
                        DocidArr.push(
                            doc.data()
                        )
                    })
                };
                DocidArr.forEach(doc => {
                    idArr.push(doc.fullName)
                })
            } else {
                idArr.push('idArr not avaiable')
            }
            let data = {
                "hosterID": DochosterID.fullName || 'hosterID not avaiable',
                "title": Docdata.title || 'title not avaiable',
                "endTime": Docdata.endTime || 'endTime not defined',
                "thumbImageURL": Docdata.thumbImageURL || 'thumbImage not avaiable',
                "startTime": Docdata.startTime || 'startTime not defined',
                "description": Docdata.description || 'description not avaiable',
                "bgImageURL": Docdata.bgImageURL || 'bgImage not avaiable',
                "hosters": hosters,
                "audiences": audiences,
                "hands": hands,
                "allParticipantIds": allParticipantIds,
                "inviters": inviters,
                "allParticipants": allParticipants,
                "idArr": idArr,
                "uid": Docdata.uid
            }
            if (data) {
                res.send(data)
            } else {
                // console.log(Docdata);
                res.send(Docdata)
            }
        } catch (error) {
            console.log(error);
        }
    },
    deletecommunityroom: async(req, res) => {
        try {
            let uid = req.params.uid;
            const roomCollection = await db.collection('rooms').where('uid', '==', uid).get();
            let Docid = '';
            roomCollection.forEach(doc => {
                Docid = doc.id
            })
            await db.collection('rooms').doc(Docid).delete();
            return res.redirect('/admin/Show_communityRoom');
        } catch (error) {
            console.log(error);
            return res.redirect('/admin/Show_communityRoom');
        }
    },
    show_createCommunity: async(req, res) => {
        let hosterId = req.params.uid
        const userCollection = await db.collection('users').get();
        const allusers = userCollection.docs.map(docsnap => docsnap.data());
        let data = [];
        let j = 0;
        for await (let show_user of allusers) {
            j++;
            data.push({
                fullName: show_user.fullName,
                uid: show_user.uid,
                hosterId: hosterId


            });
            // console.log("------------->", j, allrooms.length, "<--------------")
            if (j == allusers.length) {
                res.render('show_creatcommunity', {
                    data: data
                })
            }
        };
    },
    createCommunity: async(req, res) => {
        let hosterID = req.params.hosterID
        try {
            let image = await admin.storage().bucket().upload(`F:/IMG/Truso(FireBase)/public/uploads/${req.files[0].originalname}`, {
                    destination: `room_image/${req.files[0].originalname}`,
                    public: true,
                })
                // console.log('req.files[0].originalname-------------------------------------->', req.files[0].originalname);
            let image1 = await admin.storage().bucket().upload(`F:/IMG/Truso(FireBase)/public/uploads/${req.files[1].originalname}`, {
                    destination: `room_image/${req.files[1].originalname}`,
                    public: true,
                })
                // console.log('image------------------------>', image[0].metadata.mediaLink);
                // console.log('iamge-------111111----------->', image1[0].metadata.mediaLink);
            let DocRef = {
                title: req.body.title,
                hosterID: hosterID,
                hosters: [
                    req.body.host1,
                    req.body.host2
                ],
                bgImageURL: image[0].metadata.mediaLink,
                thumbImageURL: image1[0].metadata.mediaLink,
                startTime: Date.now(),
                endTime: Date.now(),
                description: '',
                audiences: [],
                hands: [],
                allParticipantIds: [],
                inviters: [],
                allParticipants: [],
                idArr: [],
                uid: hosterID
            };
            await db.collection('rooms').doc().set(DocRef);
            // console.log(req.files.path);
            await unlinkAsync(req.files[0].path);
            await unlinkAsync(req.files[1].path);
            let Docid;
            let roomss = await db.collection('rooms').where('bgImageURL', '==', image[0].metadata.mediaLink).get();
            roomss.forEach(doc => {
                Docid = doc.id
            })
            await db.collection('rooms').doc(Docid).update({
                uid: Docid
            })
            return res.redirect('/admin/showusers');
        } catch (error) {
            console.log('Error creating new Community Room:', error);
            return res.render('show_creatcommunity', {
                msg: error
            });
        }

    },
    Scheduledcommunityroom: async(req, res) => {
        let hosterId = req.params.uid
        let fullName = req.params.fullName
        const userCollection = await db.collection('users').get();
        const allusers = userCollection.docs.map(docsnap => docsnap.data());
        let data = [];
        let j = 0;
        for await (let show_user of allusers) {
            j++;
            data.push({
                fullName: show_user.fullName,
                uid: show_user.uid,
                profileImageURL: show_user.profileImageURL,
                hosterId: hosterId,
                HfullName: fullName


            });
            // console.log("------------->", j, allrooms.length, "<--------------")
            if (j == allusers.length) {
                res.render('scheduleCommunityRoom', {
                    data: data
                })
            }
        };
    },
    Scheduled_community_room: async(req, res) => {
        try {
            let hosterID = req.params.hosterID
            let fullName = req.params.HfullName

            //-------------- to get date foramte
            function dateRange(startDate, endDate, steps = 1) {
                const dateArray = [];
                let currentDate = new Date(startDate);

                while (currentDate <= new Date(endDate)) {
                    dateArray.push(new Date(currentDate));
                    // Use UTC date to prevent problems with time zones and DST
                    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
                }

                return dateArray;
            }

            //------------ Ramdon hex color generator
            const random_hex_color_code = () => {
                let n = (Math.random() * 0xfffff * 1000000).toString(16);
                return '#' + n.slice(0, 6);
            };

            // -----------for id field in calendar
            let referCode = '',
                characters = 'ABCDEF65465654OPQRS54WXYZ46546sdf354klmnopqrst55468wxyz0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i <= 15; i++) {
                referCode += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            //----------- FOR BG IMAGE
            let image = await admin.storage().bucket().upload(`F:/IMG/Truso(FireBase)/public/uploads/${req.files[0].originalname}`, {
                    destination: `room_image/${req.files[0].originalname}`,
                    public: true,
                })
                // console.log(image);

            //----------- FOR THUMB IMAGE
            let image1 = await admin.storage().bucket().upload(`F:/IMG/Truso(FireBase)/public/uploads/${req.files[1].originalname}`, {
                    destination: `room_image/${req.files[1].originalname}`,
                    public: true,
                })
                // console.log('image------------------------>', image[0].metadata.mediaLink);
                // console.log('iamge-------111111----------->', image1[0].metadata.mediaLink);
                // console.log(req.body.enddatetime);

            //--------- object to store data in community room 
            let DocRef = {
                title: req.body.title,
                hosterID: hosterID,
                hosters: [
                    req.body.host1,
                    req.body.host2
                ],
                bgImageURL: image[0].metadata.mediaLink,
                thumbImageURL: image1[0].metadata.mediaLink,
                startTime: moment(req.body.startdatetime).format('X'),
                endTime: moment(req.body.enddatetime).format('X'),
                description: '',
                audiences: [],
                hands: [],
                allParticipantIds: [],
                inviters: [],
                allParticipants: [],
                idArr: [],
                uid: hosterID
            };

            let calenderDoc = {};
            // console.log(DocRef);
            if (moment(req.body.startdatetime).format() <= moment(req.body.enddatetime).format()) {
                if (Number(req.body.select) == 0) {
                    calenderDoc = {
                        communityName: req.body.title,
                        desc: '',
                        frequency: req.body.select,
                        formDate: '',
                        formTime: moment(req.body.startdatetime).format(),
                        hexColorCode: random_hex_color_code(),
                        host1: req.body.host1 || '',
                        host2: req.body.host2 || '',
                        host3: req.body.host3 || '',
                        hostName: fullName,
                        id: referCode,
                        toDate: '',
                        toTime: moment(req.body.enddatetime).format(),
                        uid: hosterID
                    }
                    let Docdata;
                    let Docid;
                    const calendarCollection = await db.collection('calendar').get();
                    calendarCollection.forEach(doc => {
                            Docdata = doc.data();
                            Docid = doc.id
                        })
                        // console.log('before------------------>', Docdata.Events);
                        (Docdata.Events).push(calenderDoc);
                    // console.log('after----------------------->', Docdata.Events);
                    await db.collection('calendar').doc(Docid).update({ Events: Docdata.Events });
                } else if (Number(req.body.select) == 1) {
                    const dates = dateRange(moment(req.body.startdatetime).format(), moment(req.body.enddatetime).format());
                    // console.log(dates);
                    let datenew = [],
                        i = 0;
                    for (let date of dates) {
                        datenew.push({
                            "communityName": req.body.title,
                            "desc": '',
                            "frequency": req.body.select,
                            "formDate": '',
                            "fromTime": moment(date).format(),
                            "hexColorCode": random_hex_color_code(),
                            "host1": req.body.host1 || '',
                            "host2": req.body.host2 || '',
                            "host3": req.body.host3 || '',
                            "hostName": fullName,
                            "id": referCode,
                            "toTime": moment(date).endOf('day').format(),
                            "uid": hosterID,
                        });
                    }
                    let Docdata;
                    let Docid;
                    const calendarCollection = await db.collection('calendar').get();
                    calendarCollection.forEach(doc => {
                            Docdata = doc.data();
                            Docid = doc.id
                        })
                        // console.log('before------------------>', Docdata.Events);
                    const mergearr = [...Docdata.Events, ...datenew];
                    // console.log('mergearr----------------------->', mergearr);
                    await db.collection('calendar').doc(Docid).update({ Events: mergearr });
                } else if (Number(req.body.select) == 3) {
                    let datenew = [];
                    while (moment(req.body.startdatetime).format() <= moment(req.body.enddatetime).format()) {
                        if (moment(req.body.startdatetime).day(1).format() >= moment(req.body.startdatetime).format()) {
                            datenew.push({
                                "communityName": req.body.title,
                                "desc": '',
                                "frequency": req.body.select,
                                "formDate": '',
                                "fromTime": moment(req.body.startdatetime).format(),
                                "hexColorCode": random_hex_color_code(),
                                "host1": req.body.host1 || '',
                                "host2": req.body.host2 || '',
                                "host3": req.body.host3 || '',
                                "hostName": fullName,
                                "id": referCode,
                                "toTime": moment(req.body.startdatetime).endOf('day').format(),
                                "uid": hosterID,
                            });
                            req.body.startdatetime = moment(req.body.startdatetime).day(1).add(7, 'days').format();
                            // console.log('-------------> Start', datenew);
                        } else {
                            req.body.startdatetime = moment(req.body.startdatetime).day(1).add(7, 'days').format();
                        }
                    }
                    let Docdata;
                    let Docid;
                    const calendarCollection = await db.collection('calendar').get();
                    calendarCollection.forEach(doc => {
                            Docdata = doc.data();
                            Docid = doc.id
                        })
                        // console.log('before------------------>', Docdata.Events);
                    const mergearr = [...Docdata.Events, ...datenew];
                    // console.log('mergearr----------------------->', mergearr);
                    await db.collection('calendar').doc(Docid).update({ Events: mergearr });
                } else if (Number(req.body.select) == 2) {
                    let datenew = [];
                    while (moment(req.body.startdatetime).format() <= moment(req.body.enddatetime).format()) {
                        if (moment(req.body.startdatetime).format() == moment(req.body.startdatetime).day(6).format() || moment(req.body.startdatetime).format() == moment(req.body.startdatetime).day(7).format()) {
                            if (moment(req.body.startdatetime).day(6).format() && moment(req.body.startdatetime).day(6).add(2, 'days').format() <= moment(req.body.enddatetime).format()) {
                                req.body.startdatetime = moment(req.body.startdatetime).add(2, 'days').format();
                            } else if (moment(req.body.startdatetime).day(7).format() && moment(req.body.startdatetime).day(7).add(1, 'days').format() <= moment(req.body.enddatetime).format()) {
                                req.body.startdatetime = moment(req.body.startdatetime).add(1, 'days').format();
                            } else {
                                break;
                            }
                        }
                        datenew.push({
                            "communityName": req.body.title,
                            "desc": '',
                            "frequency": req.body.select,
                            "formDate": '',
                            "fromTime": moment(req.body.startdatetime).format(),
                            "hexColorCode": random_hex_color_code(),
                            "host1": req.body.host1 || '',
                            "host2": req.body.host2 || '',
                            "host3": req.body.host3 || '',
                            "hostName": fullName,
                            "id": referCode,
                            "toTime": moment(req.body.startdatetime).endOf('day').format(),
                            "uid": hosterID,
                        });
                        req.body.startdatetime = moment(req.body.startdatetime).add(1, 'days').format();
                    }
                    let Docdata;
                    let Docid;
                    const calendarCollection = await db.collection('calendar').get();
                    calendarCollection.forEach(doc => {
                            Docdata = doc.data();
                            Docid = doc.id
                        })
                        // console.log('before------------------>', Docdata.Events);
                    const mergearr = [...Docdata.Events, ...datenew];
                    // console.log('mergearr----------------------->', mergearr);
                    await db.collection('calendar').doc(Docid).update({ Events: mergearr });
                }

                await db.collection('rooms').doc().set(DocRef);
                let Docid;
                let roomss = await db.collection('rooms').where('bgImageURL', '==', image[0].metadata.mediaLink).get();
                roomss.forEach(doc => {
                    Docid = doc.id
                })
                await db.collection('rooms').doc(Docid).update({
                    uid: Docid
                })
                await unlinkAsync(req.files[0].path);
                await unlinkAsync(req.files[1].path);
                return res.redirect('/admin/showusers');
            } else {
                return res.render('scheduleCommunityRoom', {
                    msg: 'plz select the start date less then your end date // go back and plz do it again'
                });
            }

        } catch (error) {
            console.log('Error creating new Community Room:', error);
            return res.render('show_creatcommunity', {
                msg: error
            });
        }
    },
    deleteprofileimageC: async(req, res) => {
        try {
            let uid = req.params.uid;
            const usercollection = await db.collection('rooms').where('uid', '==', uid).get();
            let Docid = '';
            usercollection.forEach(doc => {
                Docid = doc.id
            })
            await db.collection("rooms").doc(Docid).update({
                thumbImageURL: ""
            });
            return res.redirect(`/admin/communityRoom`);
        } catch (error) {
            console.log(error);
            return res.render('showUserDetails');
        }
    },
    deletebgimageC: async(req, res) => {
        try {
            let uid = req.params.uid;
            const usercollection = await db.collection('rooms').where('uid', '==', uid).get();
            let Docid = '';
            usercollection.forEach(doc => {
                Docid = doc.id
            })
            await db.collection("rooms").doc(Docid).update({
                bgImageURL: ""
            });
            return res.redirect(`/admin/communityRoom`);
        } catch (error) {
            console.log(error);
            return res.render('showUserDetails');
        }
    },
    showresources: async(req, res) => {
        const resourceCollection = await db.collection('resources').get();
        const allresources = resourceCollection.docs.map(docsnap => docsnap.data());
        let data = [];
        let j = 0;
        for await (let show_resource of allresources) {
            j++;
            data.push({
                fileName: show_resource.fileName,
                fileLink: show_resource.fileLink,
                producerName: show_resource.producerName,
                type: show_resource.type,
            });
            // console.log("------------->", j, allresources.length, "<--------------")
            data.sort((a, b) => a - b);
            if (j == allresources.length) {
                res.render('showresources', {
                    data: data
                })
            }
        };
    },
    add_folder: async(req, res) => {
        console.log(req.method);
        res.render('add_Folder', {
            uid: req.session.userId
        });
    },
    addFolder: async(req, res) => {
        let Docref = {
            folder: req.body.foldername,
            uid: req.body.loginUid,
            id: Date.now(),
            parentid: 0
        }
        let abc = await db.collection('folders').where('folder', '==', req.body.foldername).get();
        let countArray = [];
        abc.forEach(doc => {
            countArray.push(doc.data());
        });
        console.log('Docref.parentid---------------------->', Docref.parentid, 'whole data------------------------------->', Docref);
        if (countArray.length == 0) {
            await db.collection('folders').doc().set(Docref)
            res.redirect(`/admin/ShowFolders/${Docref.parentid}`);
        } else {
            res.render('add_Folder', {
                uid: req.session.userId,
                msg: "Folder Name Alrady Exist *****************************"
            });
        }
    },
    ShowFolders: async(req, res) => {
        res.render('ShowFolders', {
            parentid: req.params.parentid
        });
    },
    folder_datatable: async(req, res) => {
        console.log('req.params.parentid DATATABLE---------------------------->', req.params.parentid);
        let columns = [
            'uid',
            'folder'
        ];
        let data = [];
        let count = 1
        let parentid = req.params.parentid;
        const folderCollection = await db.collection('folders').where('parentid', '==', Number(parentid)).get();
        const allfolders = folderCollection.docs.map(docsnap => docsnap.data());
        console.log(allfolders);
        allfolders.forEach((show_folder) => {
            // console.log('show_folder------------------------>', show_folder);
            let action;
            action = `
            <a class="btn mr-1 btn-outline-info btn-sm btn-primary text-white" title="add subFolder" href="/admin/add_subFolder/${show_folder.id}" style="text-decoration: none;"><i class="fal fa-folder-tree"></i></a>
            <a class="btn mr-1 btn-outline-info btn-sm btn-dark text-white" title="add file" href="/admin/add_file/${show_folder.id}" style="text-decoration: none;"><i class="far fa-layer-plus"></i></a>
            <a class="btn mr-1 btn-outline-info btn-sm btn-primary text-white" title="show folder" href="/admin/view_folder/${show_folder.id}" style="text-decoration: none;">F</a>
            <a class="btn mr-1 btn-outline-info btn-sm btn-warning text-white" title="show files" href="/admin/view_files/${show_folder.id}" style="text-decoration: none;">S</a>`;
            data.push({
                "id": count,
                "action": action,
                "FolderName": show_folder.folder,

            });
            count++;
            if (count > allfolders.length) {
                let json_data = JSON.stringify({
                    "data": data
                });
                res.send(json_data);
            }

        });
    },
    add_subFolder: async(req, res) => {
        res.render('add_subFolder', {
            parentid: req.params.parentid,
            uid: req.session.userId
        })

    },
    addsubFolder: async(req, res) => {
        console.log('req.body.loginid------------------------------>', req.body.loginid);
        let Docref = {
            folder: req.body.foldername,
            parentid: Number(req.body.loginid),
            uid: req.body.loginUid,
            id: Date.now()
        }
        let abc = await db.collection('folders').where('folder', '==', req.body.foldername).get();
        let countArray = [];
        abc.forEach(doc => {
            countArray.push(doc.data());
        });
        console.log('Docref.parentid---------------------->', Docref.parentid, 'whole data------------------------------->', Docref);
        if (countArray.length == 0) {
            await db.collection('folders').doc().set(Docref)
            res.redirect(`/admin/ShowFolders/${Docref.parentid}`);
        } else {
            res.render('add_subFolder', {
                uid: req.session.userId,
                parentid: req.params.parentid,
                msg: "subFolder Name Alrady Exist *****************************"
            });
        }
    },
    add_file: async(req, res) => {
        res.render('add_file', {
            folderid: req.params.id
        });
    },
    addFile: async(req, res) => {
        console.log('i am in addFile function', req.file);
        let file;
        let original = req.file.originalname;
        // console.log('original==============================================================>', original);
        regex = new RegExp('[^.]+$');
        extension = original.match(regex);
        // console.log('extension[0]=============---------------------------->', extension[0]);
        if (extension[0] == 'pdf' || extension[0] == 'xls' || extension[0] == 'docx' || extension[0] == 'doc') {
            file = await admin.storage().bucket().upload(`F:/IMG/Truso(FireBase)/public/uploads/${req.file.originalname}`, {
                destination: `resources/${req.file.originalname}`,
                public: true,
            })
            const admins = await db.collection('admin').where('uid', '==', req.session.userId).get();
            let adminn;
            admins.forEach(doc => {
                adminn = doc.data();
            })
            let Docref = {
                filelink: file[0].metadata.mediaLink || '',
                filename: path.parse(req.file.originalname).name || '',
                name: adminn.name,
                id: Date.now(),
                type: extension[0] || '',
                folderid: Number(req.body.folderid),
            }
            await db.collection('files').doc().set(Docref);

            await unlinkAsync(req.file.path);
            console.log('fileuploaded ------------------------------>');
            res.redirect(`/admin/ShowFolders/${req.body.folderid}`);
        } else {
            res.redirect(`/admin/add_file/${req.body.folderid}`);
            console.log('file formate is not accepted');
        }
    },
    ViewFile: async(req, res) => {
        let file = await db.collection('folders').where('id', '==', Number(req.params.folderid)).get();
        const alldata = file.docs.map(docsnap => docsnap.data());
        console.log('alldata.folder--------------------------->', alldata[0].folder);
        res.render('showFiles', {
            folderid: req.params.folderid,
            folderName: alldata[0].folder
        });
    },
    file_datatable: async(req, res) => {
        try {
            let columns = [
                'id',
                'filename',
                'name',
                'type',
                'folderid',
            ];
            let count = 1
            let folderid = req.params.folderid
            console.log(folderid);
            const filess = await db.collection('files').where('folderid', '==', Number(folderid)).get();
            let Docid = [];
            filess.forEach(doc => {
                Docid.push(doc.data())
            });
            let data = [];
            // let transaction = Docid.transaction;

            Docid.forEach((show_files) => {
                data.push({
                    "id": count,
                    'filename': show_files.filename,
                    'name': show_files.name,
                    'type': show_files.type,
                    'action': `<a class="btn mr-1 btn-outline-info btn-sm btn-primary text-white" title="add subFolder" href="${show_files.filelink}" style="text-decoration: none;"><i class="fas fa-file-download"></i></a>`
                })
                count++;
                if (count > Docid.length) {
                    let json_data = JSON.stringify({
                        "data": data
                    });
                    res.send(json_data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    },

}
module.exports = adminController;
// admin.auth().generatePasswordResetLink()
// firebase.auth().confirmPasswordReset().
// firebase.auth().currentUser({})
// // //get the chats from the room .--..--..--..--..--..--..--.
// const userCollection = await db.collection('rooms').get();
// let Docid = [];
// let Docdata = [];
// userCollection.forEach(doc => {
//     Docid.push(doc.id);
// });
// // console.log(Docid);
// let i = 0;
// let j = 0;
// for await (let doc of Docid) {
//     // Docid.forEach(async(doc) => {
//     const chatCollection = await db.collection('rooms').doc(doc).collection('thread').get();
//     // console.log(chatCollection);
//     // for (let doc1 of chatCollection) {
//     await chatCollection.forEach(async(doc1) => {
//         // console.log(doc1.data());
//         Docdata.push(doc1.data());
//     });
// };
// console.log(Docdata);
// fs.writeFile('chatdata1.json', JSON.stringify(Docdata), err => {
//     if (err) throw err;
//     console.log('done writing');
// })

// {
//   'city': {
//     $cond:{
//       if:{"$eq":[{$size:$split:["$location.location",","]},3]},
//       then: { $arrayElemAt: [ $split:["$location.location",","], 2 ] },
//       else :{ $arrayElemAt: [ $split:["$location.location",","], 2 ] }
//     }
//   }
// }