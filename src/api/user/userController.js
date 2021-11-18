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
            const {mobile}=req.body
            const login = await User.findOne({mobile});
            // console.log(login);
            if(!login){
                res.status(201).send("go to registration page")
            }
            res.send(login)
    
    
        }catch(e){
            console.log(e);
            res.status(500).json(e)
        }
    
    }
}




        


            

            




  


module.exports = userController;




