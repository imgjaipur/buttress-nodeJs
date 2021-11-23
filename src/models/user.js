const mongoose=require("mongoose");
// const bcrypt=require("bcrypt");
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
    }
},{versionKey:false,timestamps:true})


let registerUsers= new mongoose.model("user", userSchema);
module.exports = registerUsers;




// module.exports=mongoose.model("user",userSchema)