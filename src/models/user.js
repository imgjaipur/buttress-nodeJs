const mongoose=require("mongoose");
// const validator = require("validator")

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
        default:""
    },
    email:{
        type:String,
        unique:false,
        default:""
    },
    password:{
        type:String,
    },
    image:{
        type:String,
        default:"",
        // required:true        
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
        type:String,
        default:""
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
        type:String
    },
    tempmobile:{
        type:String
    }
},{versionKey:false,timestamps:true})



let registerUsers= new mongoose.model("user", registerSchema);
module.exports = registerUsers;