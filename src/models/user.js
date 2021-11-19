const mongoose=require("mongoose");

const jwt = require("jsonwebtoken");
const userSchema= new mongoose.Schema({
    firstname:{
        type:String,

    },
    lastname:{
        type:String,
    

    },
    mobile:{
        type:String,
        // required:true,
        // unique:true
    },
    email:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        // required:true
    },
    image:{
        type:String
    },
    xcompanyname:{
        type:String
    },
    xabn:{
        type:String
    },
    xqualifications:{
        type:String
    },
    xwhitecard:{
        type:String
    },
    xsafetyrating:{
        type:String
    },
    profilestatus:{
        type:String,
        enum:['ACTIVE','INACTIVE' ],
        default:'ACTIVE'
     },
    status:{
        type:String,
        enum:['ACTIVE','INACTIVE' ],
        default:'ACTIVE'

    },
    otp:{
        type:String
    }



},{versionKey:false,timestamps:true})
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id:user._id.toString()},"this is my")
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


module.exports=mongoose.model("user",userSchema)