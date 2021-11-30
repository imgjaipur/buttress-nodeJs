const User = require("../../models/user.js");
// const User = require("../../models/usermodel.js");
const { validationResult } = require("express-validator");
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
      const mail = await User.findOne({ email:email });
      if (mail) return ErrorResponse(res, "email allready exits !");

      const newuser = new User({
        email:email,
        password: req.body.password,
      });

       await newuser.save();

      return successResponseWithData(res, "Success");
    } catch (e) {
      console.log(e);
      return ErrorResponse(res, "Something went wrong! Please try again!");
    }
  },
  // login: async (req, res) => {
  //   try {
  //     const data = await User.findOne({ mobile: req.body.mobile });
  //   //   console.log(data);
  //     if (!data) {
  //       return ErrorResponse(res, "go to registration page");
  //     }
  //     // const responsetype={}

  //     // let otpcode =Math.floor((Math.random()*10000)+1)
  //     let otpcode = 1234;

  //     await User.findOneAndUpdate({ mobile: data.mobile }, { otp: otpcode });
  //     // await userDao.login(req);

  //     return successResponseWithData(res, "Success");
  //     // res.send(data)
  //   } catch (e) {
  //     console.log(e);
  //     return ErrorResponse(res, "Something is wrong!");
  //   }
  // },
  verify: async (req, res) => {
    try {
      const user = await User.findOne({ mobile: req.body.mobile });
      if(!user){
        const use = await User.findOne({ tempmobile: req.body.mobile });
        if(use){
          if (use.otp == req.body.otp) {
            const OTP = await User.findOneAndUpdate(
              { tempmobile: req.body.mobile },
              { $set: { otp: "",tempmobile: "",mobile :use.tempmobile }},
              { new: true }
              );
              const token = jwt.sign({ _id: OTP._id.toString() }, "this is my");
              return successResponseWithData(res, "Success",token)
          }
          else{
            return ErrorResponse(res, "OTP Dosn't Matched!");
          }
          
        }
        else{
          return ErrorResponse(res, "Mobile No. Not Found!");
        }
      }else{
        if (user.otp === req.body.otp) {
            const OTP = await User.findOneAndUpdate(
              { mobile: req.body.mobile },
              { $set: { otp: ""}},
              { new: true }
            );
            const token = jwt.sign({ _id: OTP._id.toString() }, "this is my");

            return successResponseWithData(res, "Success",token)
        }
        else{
          return ErrorResponse(res, "OTP Dosn't Matched!");
        }
      }
    }catch (e) {
      console.log(e);
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  updateprofile: async (req, res) => {
    try {
      // console.log(req.params.id);
      // let _id= req.params.id;
      let user = req.user;
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
      let filename = req.file && req.file.filename ? req.file.filename : "https://i.postimg.cc/XqJrTnxq/default-pic.jpg";
      let dataToSet = {};
      firstname ? (dataToSet.firstname = firstname) : true;
      lastname ? (dataToSet.lastname = lastname) : true;
      filename ? (dataToSet.image = filename) : true;
      mobile ? (dataToSet.mobile = mobile) : true;
      //  tempmobile? (dataToSet.tempmobile = tempmobile) : true;

      // email ? dataToSet.email = email : true;
      xcompanyname ? (dataToSet.xcompanyname = xcompanyname) : true;
      xabn ? (dataToSet.xabn = xabn) : true;
      xqualifications ? (dataToSet.xqualifications = xqualifications) : true;
      xwhitecard ? (dataToSet.xwhitecard = xwhitecard) : true;
      xsafetyrating ? (dataToSet.xsafetyratin = xsafetyrating) : true;

      await User.findOneAndUpdate(
        {_id: user._id  },
        { $set: dataToSet },
        { new: true }
      );
      // console.log(update);
      return successResponseWithData(res, "Success",filename);
    } catch (e) {
      console.log(e);
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
      // user.tokens = user.tokens.concat({ token });
      // await user.save();
      // console.log({user,token})

      return successResponseWithData(res, "Success", token);
    } catch (e) {
      console.log(e);
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  getProfile: async (req, res) => {
    try {
      const user = req.user
      const dat = await User.find({_id: user._id },{firstname:1,lastname:2,mobile:3,email:4,image:5,xcompanyname:6,xabn:7,xqualifications:8,xwhitecard:9,xsafetyrating:10});
        
    
      return successResponseWithData(res, "Success", dat);
    } catch (e) {
      console.log(e);
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  resendOtp: async (req, res) => {
    try {
      const data = await User.findOne({ mobile: req.body.mobile });
      //   console.log(data);
        if (!data) {
          return ErrorResponse(res, "go to registration page");
        }
        // const responsetype={}
  
        // let otpcode =Math.floor((Math.random()*10000)+1)
        let otpcode = 1234;
  
        await User.findOneAndUpdate({ mobile: data.mobile }, { otp: otpcode });
        // await userDao.login(req);
  
        return successResponseWithData(res, "Success");
    } catch (e) {
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  login:async(req,res)=>{
    try{
 
     const mob = await User.findOne({mobile:req.body.mobile})
     if(mob){
      let otpcode = 1234;
  
        const th = await User.findOneAndUpdate({ mobile:mob.mobile }, { otp: otpcode });
        return successResponseWithData(res, "Success");

     }
    else{
      const mobo = await User.findOne({tempmobile:req.body.mobile})
     if(mobo){
      let otpcode = 1234;
  
        const th = await User.findOneAndUpdate({ tempmobile:mobo.tempmobile }, { otp: otpcode });
        return successResponseWithData(res, "Success");
     }
     else{
      const mobi = await User({
        tempmobile:req.body.mobile
      })
      await mobi.save()
      let otpcode = 1234;
  
        const th = await User.findOneAndUpdate({ tempmobile:mobi.tempmobile }, { otp: otpcode });
        // await mobi.save()
      return successResponseWithData(res, "Success");
     }
    }
    // return successResponseWithData(res, "Success",mob);
   
  



    }catch(e){
      console.log(e);
      return ErrorResponse(res, "Something is wrong!");

    }
  },
  sociallogin:async(req,res)=>{
    try {
      const mail = await User.findOne({email:req.body.email})
      if(mail){
        const token = jwt.sign({ _id: mail._id.toString() }, "this is my");
        return successResponseWithData(res, "Success",token);

      }
      if(!mail){
        const data = await User({
          email:req.body.email
          
        })
        await data.save()
        const toke = jwt.sign({ _id: data._id.toString() }, "this is my");
        return successResponseWithData(res, "Success",toke);

      }
      // return successResponseWithData(res, "Success",token,toke);

      
    } catch (e) {
      console.log(e);
      return ErrorResponse(res, "Something is wrong!");
      
      
    }

  }
  
}



module.exports = userController;
