const User = require('../../models/user');
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponseWithData, ErrorResponse } = require("./../../lib/apiresponse");


let userDao ={
    // register:async(req)=>{
    //     try{
    //         // const salt = await bcrypt.genSalt(10);
    //         // // console.log('i am here',salt);
    //         // const hash = await bcrypt.hash(req.body.password,salt)
    //         // // console.log(req.body.pass);

    //         // // console.log(hash);
    //         // req.body.password = hash;
    //         // // now we set user password to hashed password
    //         const newuser = new User(req.body)
    //         // console.log(newuser)
    //          const user = await newuser.save();
    //         return user;


            
    
    //     }catch(e){
    //         console.log(e);
    //         res.status(500).json(e)
    
    //     }
    // },
    login:async(req)=>{
        try{
            
            
            const data = await User.findOne({mobile:req.body.mobile})
            // console.log(data);
            if(!data){
                return ErrorResponse(res, "go to registration page")
                
            }
            // return data;
            // // const responsetype={}
            
                let otpcode =Math.floor((Math.random()*10000)+1)
            
                 await User.findOneAndUpdate({ mobile:data.mobile},{ otp: otpcode} );

            
                return successResponseWithData(res, "Success");
            // // res.send(data)
            
            

    
        }catch(e){
            console.log(e);
            return ErrorResponse(res, "Something is wrong!")
        }
    
    },
    verify:async(req)=>{
        try{
            
            const user = await User.findOne({mobile:req.body.mobile});
            if (!user) return ErrorResponse(res, " user not found for this mobile !");
            const token = jwt.sign({ _id:user._id.toString()},"this is my")
            if(user.otp==3546) return successResponseWithData(res, "Success",token);


        }catch(e){
            res.send(e)
        }
    },
    updateprofile:async(req,res)=>{
        try{
            // console.log(req.params.id);
            // let _id= req.params.id;
            let { firstname,lastname,mobile,email,xcompanyname,xabn,xqualifications,xwhitecard,xsafetyrating,password } = req.body;
            let filename = req.file && req.file.filename ? req.file.filename : "";
            let dataToSet = {};
            firstname ? dataToSet.firstname = firstname : true;
            lastname ? dataToSet.lastname = lastname : true;
            filename ? dataToSet.image= filename : true;
             mobile? dataToSet.mobile = mobile : true;
             password? dataToSet.password = password : true;

            email ? dataToSet.email = email : true;
            xcompanyname ? dataToSet.xcompanyname = xcompanyname : true;
            xabn ? dataToSet.xabn = xabn : true;
            xqualifications ? dataToSet.xqualifications =xqualifications : true;
            xwhitecard ? dataToSet.xwhitecard = xwhitecard : true;
            xsafetyrating ? dataToSet.xsafetyratin=xsafetyrating : true;
            


            let update = await User.findOneAndUpdate({_id:req.params.id}, { $set: dataToSet }, { new: true })
            // console.log(update);
            res.send(update)


        }catch(e){
            res.send(e)
            
        }
    }
}





        


            

            




  


module.exports = userDao;




  