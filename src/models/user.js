const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const userSchema= new mongoose.Schema({
    firstname:{
        type:String,

    },
    lastname:{
        type:String,
    

    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
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

    }



},{versionKey:false,timestamps:true})


module.exports=mongoose.model("user",userSchema)