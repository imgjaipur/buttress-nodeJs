// ---------new code start from here--------

const registerAdmin = require('../../models/adminModel');

const bcrypt = require('bcryptjs');

const multer = require('multer');

const upload = multer({ dest: 'src/admin/adminUploads/' });

const registerUsers = require('../../models/user');

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
            if (req.body.email == "" && req.body.password == "") {
                res.render("login", { dataF: "Credentials can not be empty" });
            } else if (admin_data.length == 0) {
                res.render("login", { data: "Invalid credentials" });
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
                    res.render("login");
                }
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    dashbord: async (req, res) => {
        res.render('dashbord');
    },
    users_data: async (req , res) => {
        let users = await registerUsers.find();
       res.send(users);
    },
    users_datatable_view: async (req , res) => {
        res.render("usersdatatable")
    },
    users
}




module.exports = adminController;