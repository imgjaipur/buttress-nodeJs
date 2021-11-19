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
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id:user._id.toString()},"this is my")
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


let registerUsers= new mongoose.model("user", userSchema);
module.exports = registerUsers;




// module.exports=mongoose.model("user",userSchema)