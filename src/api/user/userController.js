const User = require('../../models/user');
const bcrypt=require("bcrypt");


let userController ={
    register:async(req,res)=>{
        try{
            const salt = await bcrypt.genSalt(10);
            // console.log('i am here',salt);
            const hash = await bcrypt.hash(req.body.password,salt)
            console.log(req.body.pass);

            // console.log(hash);
            req.body.password = hash;
            // now we set user password to hashed password
            const newuser = new User(req.body)
            console.log(newuser)
            const user= await newuser.save();
            res.send(user)


            
    
        }catch(e){
            console.log(e);
            res.status(500).json(e)
    
        }
    },
    login:async(req,res)=>{
        try{
            
            
            const data = await User.findOne({mobile:req.body.mobile})
            // const responsetype={}
            
                let otpcode =Math.floor((Math.random()*10000)+1)
            
                let result = await User.findOneAndUpdate({ mobile:data.mobile},{ otp: otpcode} );

            
            res.send(result) 
            // res.send(data)
            
            

    
        }catch(e){
            console.log(e);
            res.send(e)
        }
    
    },
    verify:async(req,res)=>{
        try{
            const result = await User.findOne({mobile:req.body.mobile});
            if(!result){
                res.send("")
            }
            res.status("200").json(result);

        }catch(e){
            res.send(e)
        }
    },updateprofile:async(req,res)=>{
        try{

        }catch(e){
            
        }
    }
}





        


            

            




  


module.exports = userController;




