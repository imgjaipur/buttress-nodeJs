const User = require("../../models/user.js");
// const User = require("../../models/usermodel.js");
const { validationResult } = require("express-validator");
const workingStatusSchema=require("../../models/workerStatus");

const bcrypt = require("bcrypt");
const moment = require('moment');
const jwt = require("jsonwebtoken");
const fs=require("fs");
require('dotenv').config();
const {
  successResponseWithData,
  ErrorResponse,
} = require("./../../lib/apiresponse");
const { model } = require("mongoose");
const { update } = require("../../models/workerStatus");

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
        companyName
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
      xsafetyrating ? (dataToSet.xsafetyrating = xsafetyrating) : true;
      companyName ? (dataToSet.companyName = companyName) : true;

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
      const dat = await User.find({_id: user._id },{otp:0,token:0,password:0,tempmobile:0 ,blocked:0,status:0,_id:0});
        
    
      return successResponseWithData(res, "Success", dat);
    } catch (e) {
      console.log(e);
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  resendOtp: async (req, res) => {
    try {
      
      const data = await User.findOne({ mobile: req.body.mobile });
      // let otpcode =Math.floor((Math.random()*10000)+1)
      let otpcode = 1234;
        if (!data) {
          const value = await User.findOne({tempmobile : req.body.mobile});
          if(!value){
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

  },
  add_workerStatus:async(req,res)=>{
    try{
      let  myworking=new workingStatusSchema({
        worker_id:req.user._id,
        constructionSite_id:req.body.constructionSite_id,
        start_time:moment().format("YYYY-MM-DDThh:mm:ss"),
        status:'Working',
        note:req.body.note
      });
      myworkSave=myworking.save();
      let workStatus_id = {workStatus_id:myworking._id};
      return successResponseWithData(res, "Success",workStatus_id);

    }catch(error){
      console.log(error);
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  end_workerStatus:async(req,res)=>{
    try{
      let dataToSet= {};
      const workerStatusData = await workingStatusSchema.findOne({_id:req.body.workStatus_id});
      console.log(workerStatusData.start_time.split("T")[1]);
      let end_time = moment().format("YYYY-MM-DDThh:mm:ss");
      let hrs = moment.utc(moment(end_time.split("T")[1], "hh-mm-ss").diff(moment(workerStatusData.start_time.split("T")[1],"hh-mm-ss"))).format("HH");
      let min = moment.utc(moment(end_time.split("T")[1], "hh-mm-ss").diff(moment(workerStatusData.start_time.split("T")[1],"hh-mm-ss"))).format("mm");
      let sec = moment.utc(moment(end_time.split("T")[1], "hh-mm-ss").diff(moment(workerStatusData.start_time.split("T")[1],"hh-mm-ss"))).format("ss");
      let total_working_hours = [hrs, min, sec].join(':');
      dataToSet.total_working_hours = total_working_hours;
      dataToSet.end_time = end_time;
      dataToSet.status = 'Completed';
      if(req.body.note){
        dataToSet['note'] = req.body.note;
      }
      let documents = await workingStatusSchema.findOneAndUpdate(
        {_id: req.body.workStatus_id },
        { $set: dataToSet },
        { returnOriginal: false }
      );
      console.log(documents);
          return successResponseWithData(res, "Success",documents);
    }catch(error){
      console.log(error);
      return ErrorResponse(res, "Something is wrong!");
    }
  },
  uploadsImg:async(req,res)=>{
    console.log(req.user)
    console.log("file---",req.file.path)
    // console.log(Process.env.LOCAL_URL.LOCAL_API_PORT);
    const imgupload=await User.update({_id:req.user._id},{
      $set:{
        image:`http://localhost:3030/userupload/${req.file.filename}`
      },
    },{new:true})
    
    return successResponseWithData(res, "Successfully updated the image");
    
  } 
}



module.exports = userController;
