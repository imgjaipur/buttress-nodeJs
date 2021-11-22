const User = require("../../models/usermodel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  successResponseWithData,
  ErrorResponse,
} = require("./../../lib/apiresponse");
const { model } = require("mongoose");

let userController = {
  register: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      // console.log('i am here',salt);
      const hash = await bcrypt.hash(req.body.password, salt);
      // console.log(req.body.pass);

      // console.log(hash);
      req.body.password = hash;

      const { email } = req.body;
      // const data = await User.findOne({ mobile: mobile })
      // if (data) return ErrorResponse(res, "mobile allready exits !")
      const mail = await User.findOne({ email: email });
      if (mail) return ErrorResponse(res, "email allready exits !");

      const newuser = new User({
        email: email,
        password: req.body.password,
      });

      const user = await newuser.save();

      return successResponseWithData(res, "Success");
    } catch (e) {
      console.log(e);
      return ErrorResponse(res, "Something went wrong! Please try again!");
    }
  },
  login: async (req, res) => {
    try {
      const data = await User.findOne({ mobile: req.body.mobile });
    //   console.log(data);
      if (!data) {
        return ErrorResponse(res, "go to registration page");
      }
      // const responsetype={}

      let otpcode =Math.floor((Math.random()*10000)+1)
    //   let otpcode = 1234;

      await User.findOneAndUpdate({ mobile: data.mobile }, { otp: otpcode });
      // await userDao.login(req);

      return successResponseWithData(res, "Success");
      // res.send(data)
    } catch (e) {
      console.log(e);
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  verify: async (req, res) => {
    try {
      const user = await User.findOne({ mobile: req.body.mobile });
      if (!user) return ErrorResponse(res, " user not found for this mobile !");
      const token = jwt.sign({ _id: user._id.toString() }, "this is my");
      // user.tokens = user.tokens.concat({ token })
      // const dat = user.tokens
      // await user.save()
      if (user.otp == 1234) {
        await User.findOneAndUpdate(
          { mobile: req.body.mobile },
          { $set: { otp: "",tokens : token}},
          { new: true }
        );
        user.tokens = user.tokens.concat({ token });
        await user.save();
        // console.log(data);
        // return successResponseWithData(res, "Success",token);
      }
      return successResponseWithData(res, "Success", token);
    } catch (e) {
      res.send(e);
    }
  },
  updateprofile: async (req, res) => {
    try {
      // console.log(req.params.id);
      // let _id= req.params.id;
      let {
        firstname,
        lastname,
        mobile,
        xcompanyname,
        xabn,
        xqualifications,
        xwhitecard,
        xsafetyrating,
      } = req.body;
      let filename = req.file && req.file.filename ? req.file.filename : "";
      let dataToSet = {};
      firstname ? (dataToSet.firstname = firstname) : true;
      lastname ? (dataToSet.lastname = lastname) : true;
      filename ? (dataToSet.image = filename) : true;
      mobile ? (dataToSet.mobile = mobile) : true;
      //  password? dataToSet.password = password : true;

      // email ? dataToSet.email = email : true;
      xcompanyname ? (dataToSet.xcompanyname = xcompanyname) : true;
      xabn ? (dataToSet.xabn = xabn) : true;
      xqualifications ? (dataToSet.xqualifications = xqualifications) : true;
      xwhitecard ? (dataToSet.xwhitecard = xwhitecard) : true;
      xsafetyrating ? (dataToSet.xsafetyratin = xsafetyrating) : true;

      await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: dataToSet },
        { new: true }
      );
      // console.log(update);
      return successResponseWithData(res, "Success");
    } catch (e) {
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  emaillogin: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && ErrorResponse(res, "email not exist");
      const validate = await bcrypt.compare(req.body.password, user.password);
      !validate && ErrorResponse(res, "invalid credintials");
      const token = jwt.sign({ _id: user._id.toString() }, "this is my");
      user.tokens = user.tokens.concat({ token });
      await user.save();
      // console.log({user,token})

      return successResponseWithData(res, "Success", token);
    } catch (e) {
      console.log(e);
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  getProfile: async (req, res) => {
    try {
      const _id = req.params.id;
      const user = await User.findById(
        { _id },
        { firstname: 1 ,  lastname: 1 }
      );
      return successResponseWithData(res, "Success", user);
    } catch (e) {
      console.log(e);
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  resendOtp: async (req, res) => {
    try {
      const data = await User.findOne({ mobile: req.body.mobile });
      console.log(data);
      if (!data) {
        return ErrorResponse(res, "go to registration page");
      }
      // const responsetype={}

      // let otpcode =Math.floor((Math.random()*10000)+1)
      let otpcode = 1234;

      await User.findOneAndUpdate({ mobile: data.mobile }, { otp: otpcode });
      // await userDao.login(req);

      return successResponseWithData(res, "Success", otpcode);
    } catch (e) {
      return ErrorResponse(res, "Something is wrong!");
    }
  },
};

module.exports = userController;
