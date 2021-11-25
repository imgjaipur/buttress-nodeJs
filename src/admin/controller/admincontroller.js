// ---------new code start from here--------

const registerAdmin = require('../../models/adminModel');

const bcrypt = require('bcryptjs');

const multer = require('multer');

const upload = multer({ dest: 'src/admin/adminUploads/' });

const registerUsers = require('../../models/usermodel');

const moment = require('moment');

const btoau = require('b2a');

const site_Data = require('./../../models/siteModel');

// const express = require('');

let adminController = {
    register_Admin_view: (req, res) => {
        res.render('adminRegister');
    },
    registerAdmin: async (req, res) => {
        // console.log('i am in here');
        try {
            if (req.method == "POST") {
                // console.log(req.file)
                let hashPassword = await bcrypt.hash(req.body.password, 10);
                let admin = new registerAdmin({
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    password: hashPassword,
                    profile: req.file.originalname
                });
                let admin_Doc = await admin.save();
                // console.log("admin_doc", admin_Doc);
                res.render('login');
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    admindata: async (req, res) => {
        let data = await registerAdmin.find();
        let json_data = JSON.stringify(data);
        res.send(json_data);
    },
    login_View: async (req, res) => {
        res.render('login');
    },
    log_in: async (req, res) => {
        try {
            let admin_data = await registerAdmin.find({ email: req.body.email });
            // console.log(admin_data);
            // console.log("data ------", admin_data.length);
            if (req.body.email == "" && req.body.password == "") {
                res.render("login", { data: "Credentials can not be empty" });
            } else if (admin_data.length !== 1) {
                res.render("login", { data_val: "check your Email again" });
            } else if (admin_data.length > 0) {
                let matchPassword = await bcrypt.compare(
                    req.body.password,
                    admin_data[0].password
                );
                if (matchPassword) {
                    req.session.regenerate(function () {
                        req.session.user = admin_data;
                        req.session.user = true;
                        return res.redirect('/dashbord');
                    })
                } else {
                    res.render("login", { pass: "Incorrect Password" });
                }
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    dashbord: async (req, res) => {
        res.render('dashbord');
    },
    users_data: async (req, res) => {
        let users = await registerUsers.find();
        // console.log(users);
        res.send(users);
    },
    users_datatable_view: async (req, res) => {
        res.render("usersdatatable")
    },
    users_datatable: async (req, res) => {
        let columns = [
            "name",
            "mobile",
            "email",
            "status",
            "blocked",
            "profilestatus",
            "xcompanyname",
            "actions"
        ];
        let limit1 = req.query.length;
        let start = req.query.start;
        // console.log(req.query.length);
        let sortObject = {}, dir, join, conditions = {};
        if (req.query.order[0].dir == 'asc') {
            dir = 1;
        } else {
            dir = -1;
        }
        let order = columns[req.query.order[0].column];
        sortObject[order] = dir;
        let name;
        if (req.query.name && req.query.name !== "") {
            name = req.query.name;
        }
        registerUsers.countDocuments(conditions).exec((err, rows) => {
            // console.log('rows', rows);
            let totalFiltered = rows;
            let data = [];
            let count = 1;
            registerUsers.find(conditions).skip(Number(start)).limit(Number(limit1)).sort(sortObject).exec((err, rows1) => {
                // console.log("data----", rows1);
                if (err) console.log(err);
                rows1.forEach((index) => {
                // console.log("company--------------",index.xcompanyname);
                // console.log("coemail--------------",index.email);
                // console.log("mob--------------",index.mobile);
                    let user;
                    if (index.blocked == false) {
                        user = `<button  class="btn btn-outline-danger" btn-sm text-white" type="button" aria-expanded="true">
                        <a class="text-white" href="/blockuser/true/${index.id}" style="text-decoration: none;">Block</a>
                        </button>`;
                    } else {
                        user = `<button class="btn btn-outline-success btn-sm text-success" type="button" aria-expanded="false">
                        <a class="text-white" href="/blockuser/false/${index.id}" style="text-decoration: none;">Unblock</a>
                        </button>`
                    }
                    data.push({
                        "name": `${index.firstname} ${index.lastname}`,
                        "mobile": index.mobile,
                        "email": index.email,
                        "status": index.status,
                        "blocked": index.blocked,
                        "profilestatus": index.profilestatus,
                        "xcompanyname": index.xcompanyname,
                        "actions": `<a href="/edit/?id=${index.id}"><button class = "btn btn-outline-light btn-sm text-success"><i class="fas fa-edit"></i></button></a>` + "   " + `<a href="/delete/?id=${index.id}"><button class = "btn btn-outline-light btn-sm text-danger"><i class="fas fa-trash-alt"></i></button></a>` + "  " + `<a href="/view/?id=${index.id}"><button class = "btn btn-outline-light btn-sm text-primary"><i class="fas fa-eye"></i></button></a>`
                    });
                    count++;
                    if (count > rows1.length) {
                        let json_data = JSON.stringify({
                            "recordsTotal": rows,
                            "recordsFiltered": totalFiltered,
                            "data": data
                        });
                        res.send(json_data);
                    }
                });
            });
        });
    },
    users_datatable_custom_search: async (req, res) => {

    },
    delete_user: async (req, res) => {
        let user_delete_data = await registerUsers.deleteOne({ _id: req.query.id })
        res.redirect("/users-datatable")
    },
    edit_user_view: async (req, res) => {
        let user_data = await registerUsers.findOne({ _id: req.query.id });
        // console.log("clicked user data----", user_data);
        res.render("editUser", { user: user_data })
    },
    edit_user: async (req, res) => {
        try {
            let data = await registerUsers.update({ _id: req.body.id }, {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    mobile: req.body.mobile,
                    email: req.body.email,
                    xcompanyname: req.body.xcompanyname,
                    xabn: req.body.xabn,
                    xqualifications: req.body.xqualifications,
                    xwhitecard: req.body.xwhitecard,
                    profilestatus: req.body.profilestatus,
                    status: req.body.status,
                }
            });
            res.redirect('/users-datatable');
        } catch (err) {
            console.log(err);
        }
    },
    view_user: async (req, res) => {
        let user_data = await registerUsers.findOne({ _id: req.query.id });
        console.log(user_data);
        res.render("usercard", { info: user_data })
    },
    update_block_status: async (req, res) => {
        try {
            // console.log("query data----", req.params.status,'sdjvhdkfjgdfjk---->',req.params.id)
            let status_data = await registerUsers.updateOne({ _id: req.params.id }, {
                $set: { blocked: req.params.status }
            });
            res.redirect('/users-datatable');


        } catch (err) {
            console.log(err);
        }

    },
    site_insert_view_page: async (req, res) => {
        const data = await site_Data.findOne({});
        // console.log('site_start_date',data.site_start_date);
        // console.log('site_start_date with moment',moment(data.site_start_date).format("YYYY-MM-DD"));
        res.render('siteView');
    },
    insert_site_info: async (req, res) => {
        if (req.method == 'POST')
            try {
                console.log("longitude-----", [parseFloat(req.body.longitude)], "latitude", [parseFloat(req.body.latitude)])
                // console.log("sit amne-----" , req.body.site , "latitude" , req.body.siteAddress)
                let site_info = new site_Data({
                    site_name: req.body.site,
                    site_address: req.body.siteAddress,
                    construction_manager: req.body.cmanager,
                    site_code: req.body.sitecode,
                    location: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
                    site_start_date: req.body.startdate,
                    site_end_date: req.body.enddate,
                    users: req.body.users
                })
                let site_Document = await site_info.save();
                res.redirect('/login')
            } catch (err) {
                console.log(err);
            }
    },
    site_info_datatable_view: async (req, res) => {
        res.render("siteinfodatatable")
    },
    site_info_datatable: async (req, res) => {
        let columns = [
            "sitename",
            "constructionmanager",
            "siteaddress",
            "sitecode",
            "location",
            "date",
            "actions"
        ];
        let limit1 = req.query.length;
        let start = req.query.start;
        // console.log(req.query.length);
        let sortObject = {}, dir, join, conditions = {};
        if (req.query.order[0].dir == 'asc') {
            dir = 1;
        } else {
            dir = -1;
        }
        let order = columns[req.query.order[0].column];
        sortObject[order] = dir;
        let name;
        if (req.query.name && req.query.name !== "") {
            name = req.query.name;
        }
        site_Data.countDocuments(conditions).exec((err, rows) => {
            // console.log('rows', rows);
            let totalFiltered = rows;
            let data = [];
            let count = 1;
            site_Data.find(conditions).skip(Number(start)).limit(Number(limit1)).sort(sortObject).exec((err, rows1) => {
                // console.log("data----", rows1);
                if (err) console.log(err);
                rows1.forEach((index) => {
                    data.push({
                        "sitename": index.site_name,
                        "constructionmanager": index.construction_manager,
                        "siteaddress": index.site_address,
                        "sitecode": index.site_code,
                        "location": `${index.location}`,
                        "date": `${moment(index.site_start_date).format("DD-MM-YYYY") + "  -  " + moment(index.site_end_date).format("DD-MM-YYYY")}`,
                        "actions": `<a href="/siteinfo-edit-view/?id=${index.id}"><button class = "btn btn-outline-light btn-sm text-success"><i class="fas fa-edit"></i></button></a>` + "   " + `<a href="/siteinfo-delete/?id=${index.id}"><button class = "btn btn-outline-light btn-sm text-danger"><i class="fas fa-trash-alt"></i></button></a>` + "  " + `<a href="/siteinfo-view/?id=${index.id}"><button class = "btn btn-outline-light btn-sm text-primary"><i class="fas fa-eye"></i></button></a>`
                    });
                    count++;
                    if (count > rows1.length) {
                        let json_data = JSON.stringify({
                            "recordsTotal": rows,
                            "recordsFiltered": totalFiltered,
                            "data": data
                        });
                        // console.log(data);
                        res.send(json_data);
                    }
                });
            });
        });
    },
    delete_site_info: async (req, res) => {
        let site_delete_data = await site_Data.deleteOne({ _id: req.query.id });
        res.redirect("/siteinfo");
    },
    site_info_view: async (req, res) => {
        let site_info = await site_Data.findOne({ _id: req.query.id });
        res.render("siteinfocard", { info: site_info })
    },
    site_info_update_view: async (req, res) => {
        let site_info = await site_Data.findOne({ _id: req.query.id })
        // console.log("abc---------", site_info);
        res.render("editsiteinfo", { info_data: site_info })
    },
    site_info_update: async (req, res) => {
        try {
            let site_data = await site_Data.update({ _id: req.body.id }, {
                $set: {
                    site_name: req.body.site,
                    site_address: req.body.siteAddress,
                    construction_manager: req.body.cmanager,
                    site_code: req.body.sitecode,
                    location: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
                    site_start_date: req.body.startdate,
                    site_end_date: req.body.enddate,
                    users: req.body.users
                }
            });
            // console.log("modified data -----------" , site_data);
            res.redirect('/siteinfo');
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = adminController;