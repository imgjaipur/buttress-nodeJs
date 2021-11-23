const mongoose=require("mongoose");
const validator = require("validator")

// const jwt = require("jsonwebtoken");
const registerSchema= new mongoose.Schema({
    firstname:{
        type:String,
        default:""

    },
    lastname:{
        type:String,
        default:""
    

    },
    mobile:{
        type:String,
        // required:true,
        unique:true,
        default:""

    },
    email:{
        type:String,
        
        required:true,
      

    },
    password:{
        type:String,
        required:true,
        minlength:7,
       },


    

    image:{
        type:String,
        // required:true,
        default:""
    },
    xabn:{
        type:String,
        default:""
    },
    xqualifications:{
        type:String,
        default:""
    },
    xwhitecard:{
        type:String
    },
    xsafetyrating:{
        type:String,
        default:""
    },
    profilestatus:{
        type:Boolean,
        default:false
    },
    status:{
        type:Boolean,
        default:true
    },
    blocked :{
        type : Boolean,
        default:false
    },
    otp:{
        type:String
    },
    token:{
        type:String,
        // required:true

    },
    tempmobile:{
        type:String
    }
},{versionKey:false,timestamps:true})



let registerUsers= new mongoose.model("register", registerSchema);
module.exports = registerUsers;