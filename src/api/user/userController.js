const User = require("../../models/user.js");
const workingStatusSchema = require("../../models/workerStatus");
const SiteModel = require("../../models/siteModel.js");
const bcrypt = require("bcrypt");
const moment = require('moment');
const jwt = require("jsonwebtoken");
const fs = require("fs");
require('dotenv').config();
const {
    successResponseWithData,
    ErrorResponse,
} = require("./../../lib/apiresponse");

let userController = {
    register: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);
            req.body.password = hash;
            const { email } = req.body;

            const mail = await User.findOne({ email: email });
            if (mail) return ErrorResponse(res, "email allready exits !");

            const newuser = new User({
                email: email,
                password: req.body.password,
            });
            await newuser.save();

            return successResponseWithData(res, "Success");
        } catch (e) {
            console.log(e);
            return ErrorResponse(res, "Something went wrong! Please try again!");
        }
    },
    verify: async(req, res) => {
        try {
            const user = await User.findOne({ mobile: req.body.mobile });
            if (!user) {
                const use = await User.findOne({ tempmobile: req.body.mobile });
                if (use) {
                    if (use.otp == req.body.otp) {
                        const OTP = await User.findOneAndUpdate({ tempmobile: req.body.mobile }, { $set: { otp: "", tempmobile: "", mobile: use.tempmobile } }, { new: true });
                        const token = jwt.sign({ _id: OTP._id.toString() }, "this is my");
                        return successResponseWithData(res, "Success", token)
                    } else {
                        return ErrorResponse(res, "OTP Dosn't Matched!");
                    }

                } else {
                    return ErrorResponse(res, "Mobile No. Not Found!");
                }
            } else {
                if (user.otp === req.body.otp) {
                    const OTP = await User.findOneAndUpdate({ mobile: req.body.mobile }, { $set: { otp: "" } }, { new: true });
                    const token = jwt.sign({ _id: OTP._id.toString() }, "this is my");

                    return successResponseWithData(res, "Success", token)
                } else {
                    return ErrorResponse(res, "OTP Dosn't Matched!");
                }
            }
        } catch (e) {
            console.log(e);
            return ErrorResponse(res, "Something is wrong!");
        }
    },
    updateprofile: async(req, res) => {
        try {
            let deleteOld = await User.findOne({ _id: req.user._id }, { _id: 0, image: 1, firstname: 1, lastname: 1, mobile: 1, xabn: 1, xqualifications: 1, xwhitecard: 1, xsafetyrating: 1, companyName: 1 });
            let user = req.user;
            let dataToSet = req.body;
            dataToSet.profilestatus = true;
            let mObj = await Object.assign(deleteOld, dataToSet);
            let arr = Object.values(mObj);
            let arr1 = Object.values(arr[2]);
            for (let member of arr1) {
                if (member == "") {
                    mObj.profilestatus = false;
                }
            }
            await User.findOneAndUpdate({ _id: user._id }, { $set: mObj }, { new: true });
            return successResponseWithData(res, "Success");
        } catch (e) {
            console.log(e);
            return ErrorResponse(res, "Something is wrong!");
        }
    },
    emaillogin: async(req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            !user && ErrorResponse(res, "email not exist");
            const validate = await bcrypt.compare(req.body.password, user.password);
            !validate && ErrorResponse(res, "invalid credintials");
            const token = jwt.sign({ _id: user._id.toString() }, "this is my");
            return successResponseWithData(res, "Success", token);
        } catch (e) {
            console.log(e);
            return ErrorResponse(res, "Something is wrong!");
        }
    },
    getProfile: async(req, res) => {
        try {
            const dat = await User.findOne({ _id: req.user._id }, { otp: 0, token: 0, password: 0, tempmobile: 0, blocked: 0, status: 0, _id: 0 });
            dat.image = dat.image && dat.image != "" ? dat.image : "https://i.postimg.cc/XqJrTnxq/default-pic.jpg";
            return successResponseWithData(res, "Success", dat);
        } catch (e) {
            console.log(e);
            return ErrorResponse(res, "Something is wrong!");
        }
    },
    resendOtp: async(req, res) => {
        try {
            const data = await User.findOne({ mobile: req.body.mobile });
            // let otpcode =Math.floor((Math.random()*10000)+1)
            let otpcode = 1234;
            if (!data) {
                const value = await User.findOne({ tempmobile: req.body.mobile });
                if (!value) {
                    return ErrorResponse(res, "Mobile Number not found!");
                }
                await User.findOneAndUpdate({ tempmobile: value.mobile }, { otp: otpcode });
                return successResponseWithData(res, "Success");
            }
            await User.findOneAndUpdate({ mobile: data.mobile }, { otp: otpcode });
            return successResponseWithData(res, "Success");
        } catch (e) {
            return ErrorResponse(res, "Something is wrong!");
        }
    },
    login: async(req, res) => {
        try {
            const mob = await User.findOne({ mobile: req.body.mobile });
            let otpcode = 1234;
            // let otpcode =Math.floor((Math.random()*10000)+1)
            if (mob) {
                await User.findOneAndUpdate({ mobile: mob.mobile }, { otp: otpcode });
                return successResponseWithData(res, "Success");
            } else {
                const mobo = await User.findOne({ tempmobile: req.body.mobile });
                if (mobo) {
                    await User.findOneAndUpdate({ tempmobile: mobo.tempmobile }, { otp: otpcode });
                    return successResponseWithData(res, "Success");
                } else {
                    const mobi = await User({
                        tempmobile: req.body.mobile,
                        otp: otpcode
                    });
                    await mobi.save();
                    return successResponseWithData(res, "Success");
                }
            }
        } catch (e) {
            console.log(e);
            return ErrorResponse(res, "Something is wrong!");
        }
    },
    sociallogin: async(req, res) => {
        try {
            const mail = await User.findOne({ email: req.body.email });
            if (mail) {
                const token = jwt.sign({ _id: mail._id.toString() }, "this is my");
                return successResponseWithData(res, "Success", token);
            }
            if (!mail) {
                const data = await User({
                    email: req.body.email
                });
                await data.save();
                const toke = jwt.sign({ _id: data._id.toString() }, "this is my");
                return successResponseWithData(res, "Success", toke);

            }
        } catch (e) {
            console.log(e);
            return ErrorResponse(res, "Something is wrong!");
        }

    },
    add_workerStatus: async(req, res) => {
        try {
            let whereObj = {};
            if (req.body.address) {
                whereObj['site_address'] = req.body.address;
            } else if (req.body.code) {
                whereObj['site_code'] = req.body.code;
            } else {
                return ErrorResponse(res, "Required at lest one of them address or code");
            }
            let siteDetails = await SiteModel.findOne(whereObj);
            if (!siteDetails) {
                return ErrorResponse(res, "Please Enter Correct Address Or Code For The Construction Site That You Want To Select");
            }
            let myworking = new workingStatusSchema({
                worker_id: req.user._id,
                constructionSite_id: siteDetails._id,
                start_time: moment().format("YYYY-MM-DDTHH:mm:ss"),
                status: 'Working'
            });
            let myworkSave = await myworking.save();
            // console.log(`siteDetails`, siteDetails);
            let workStatus_id = { workStatus_id: myworkSave._id, start_time: myworkSave.start_time, constructionSite_id: myworkSave.constructionSite_id, site_Name: siteDetails.site_name };
            // console.log(myworkSave);
            return successResponseWithData(res, "Success", workStatus_id);

        } catch (error) {
            console.log(error);
            return ErrorResponse(res, "Something is wrong!");
        }
    },
    end_workerStatus: async(req, res) => {
        try {
            let dataToSet = {};
            // const workerStatusData = await workingStatusSchema.findOne({ worker_id: req.user._id, });
            // console.log(workerStatusData.start_time.split("T")[1]);
            // let end_time = moment().format("YYYY-MM-DDThh:mm:ss");
            // let hrs = moment.utc(moment(end_time.split("T")[1], "hh-mm-ss").diff(moment(workerStatusData.start_time.split("T")[1], "hh-mm-ss"))).format("HH");
            // let min = moment.utc(moment(end_time.split("T")[1], "hh-mm-ss").diff(moment(workerStatusData.start_time.split("T")[1], "hh-mm-ss"))).format("mm");
            // let sec = moment.utc(moment(end_time.split("T")[1], "hh-mm-ss").diff(moment(workerStatusData.start_time.split("T")[1], "hh-mm-ss"))).format("ss");
            // let total_working_hours = [hrs, min, sec].join(':');
            dataToSet.total_working_hours = req.body.total_working_hours; //hh:mm:ss
            dataToSet.end_time = moment(req.body.end_time).format("YYYY-MM-DDTHH:mm:ss");
            dataToSet.status = 'Completed';
            dataToSet.note = req.body.note;
            let documents = await workingStatusSchema.findOneAndUpdate({ worker_id: req.user._id, status: 'Working' }, { $set: dataToSet }, { returnOriginal: false });
            console.log(documents);
            return successResponseWithData(res, "Success", documents);
        } catch (error) {
            console.log(error);
            return ErrorResponse(res, "Something is wrong!");
        }
    },
    uploadsImg: async(req, res) => {
        try {
            const deleteOld = await User.findOne({ _id: req.user._id });
            const imgexc = (deleteOld.image).split("/").pop();
            let filepath = "uploads/userupload/" + imgexc;
            if (deleteOld.image) {
                if (fs.existsSync(filepath)) {
                    fs.unlink(filepath, (err) => {
                        console.log(err)
                    });
                }
            }
            // ---------------------------------------
            let localurl = process.env.LOCAL_URL;
            let port = process.env.LOCAL_API_PORT;
            let envUrl = `${localurl}${port}`;

            const imgupload = await User.update({ _id: req.user._id }, {
                $set: {
                    image: `${envUrl}/userupload/${req.file.filename}`
                },
            }, { new: true });
            return successResponseWithData(res, "Successfully Updated The Image");

        } catch (error) {
            console.log(error);
            return ErrorResponse(res, "Something is wrong!");
        }

    },

    updateUserNote_page: async(req, res) => {
        try {
            const noteUpdate = await workingStatusSchema.updateOne({ _id: req.body.workStatus_id, status: "Completed" }, { $set: { note: req.body.note } });
            return successResponseWithData(res, "Successfully Updated The Note");
        } catch (error) {
            console.log(error);
            return ErrorResponse(res, "Something is wrong!");
        }
    },
    timesheet: async(req, res) => {
        try {
            let start_time = moment(req.query.start_time).format('llll');
            let end_time = moment(req.query.end_time).add(1, "days").subtract(1, "minutes").format('llll');
            const data = await workingStatusSchema.find({ createdAt: { $gte: new Date(start_time), $lte: new Date(end_time) }, status: { $ne: "Working" }, worker_id: req.user._id });
            Array.prototype.sum = function(prop) {
                let sec = 0,
                    min = 0,
                    hour = 0,
                    total;
                for (let i = 0, _len = this.length; i < _len; i++) {
                    console.log(`this[i][prop].split(':')[2] ---------->`, this[i][prop].split(':')[2]);
                    console.log(`this[i][prop].split(':')[1] ---------->`, this[i][prop].split(':')[1]);
                    console.log(`this[i][prop].split(':')[0] ---------->`, this[i][prop].split(':')[0]);
                    sec += Number(this[i][prop].split(':')[2]);
                    min += Number(this[i][prop].split(':')[1]);
                    hour += Number(this[i][prop].split(':')[0]);

                }
                total = moment.utc(((hour * 3600) + (min * 60) + sec) * 1000).format('HH:mm:ss');
                console.log(`this[i][prop]`, total);
                return total;
            }
            let groupBy = (data, prop) => {
                return data.reduce((acc, obj) => {
                    const key = moment(obj[prop]).format('YYYY-MM-DD');
                    console.log('--------------------->', obj);
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    // obj.Total_Working_HOURS = 
                    acc[key].push(obj);
                    return acc;
                }, {});
            }
            let newarr = Object.values(groupBy(data, 'start_time'));
            let final = newarr.map(doc => {
                let obj = {};
                obj.start_date = doc[0].start_time.split('T')[0];
                obj.total_working_hours = doc.sum('total_working_hours');
                // obj.worker_id = newarr[0].worker_id;
                return obj;

            });
            let difference = (moment(end_time).format("YYYY-MM-DD").diff(moment(start_time).format("YYYY-MM-DD"),"days"));
            let startDate = moment(start_time).format("YYYY-MM-DD");
            let blankDate = [];
            for(let i =1 ; i<= difference; i++){
                startDate = moment(start_time).add(i,'days').format("YYYY-MM-DD");
                if(!final.some((val)=>{startDate == val.start_date})){
                    blankDate.push({
                        start_date : startDate,
                        total_working_hours : "00:00:00" 
                    });
                }
            }
            return successResponseWithData(res, "Success", [...final,...blankDate]);

        } catch (e) {
            console.log(e);
            return ErrorResponse(res, "Something is wrong!");
        }
    },
    timesheet_user_details: async(req, res) => {
        try {
            let time_data = await workingStatusSchema.find({ status: "Completed", worker_id: req.user._id });
            let finalarr = [];
            for (let member of time_data) {
                let siteName = await SiteModel.findOne({ _id: member.constructionSite_id }, { _id: 0, name: 1 });
                console.log('sitename-------------->', member.constructionSite_id);
                console.log('sitename-------------->', siteName);
                let name;
                if (siteName.site_name && siteName) {
                    name = siteName.site_name;
                } else {
                    name = "";
                }
                let compareDate = (member.start_time).split("T")[0];
                member.siteName = name;
                if (moment(compareDate).format("YYYY-MM-DD") == moment(req.query.start_date).format("YYYY-MM-DD")) {
                    finalarr.push(member);
                }
            }
            Array.prototype.sum = function(prop) {
                let sec = 0,
                    min = 0,
                    hour = 0,
                    total;
                for (let i = 0, _len = this.length; i < _len; i++) {
                    console.log(`this[i][prop].split(':')[2] ---------->`, this[i][prop].split(':')[2]);
                    console.log(`this[i][prop].split(':')[1] ---------->`, this[i][prop].split(':')[1]);
                    console.log(`this[i][prop].split(':')[0] ---------->`, this[i][prop].split(':')[0]);
                    sec += Number(this[i][prop].split(':')[2]);
                    min += Number(this[i][prop].split(':')[1]);
                    hour += Number(this[i][prop].split(':')[0]);

                }
                total = moment.utc(((hour * 3600) + (min * 60) + sec) * 1000).format('HH:mm:ss');
                console.log(`this[i][prop]`, total);
                return total;
            }
            let total_working_hourss = finalarr.sum('total_working_hours');

            return successResponseWithData(res, "Success", { allResult: finalarr, total_hours: total_working_hourss });
        } catch (err) {
            console.log(err);
            return ErrorResponse(res, "Something went wrong")
        }
    }
}

module.exports = userController;