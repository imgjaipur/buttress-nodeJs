const mongoose=require("mongoose");

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
        // required:true
        default:""
    },
    password:{
        type:String,
        // required:true
        default:""
    },
    image:{
        type:String,
        required:true,
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
    tokens:[{
        token:{
            type:String,
            required:true

        }
    }]



},{versionKey:false,timestamps:true})



let registerUsers= new mongoose.model("register", registerSchema);
module.exports = registerUsers;