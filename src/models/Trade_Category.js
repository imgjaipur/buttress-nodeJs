const mongoose=require("mongoose");

let Trade_Schema=new mongoose.Schema({
    tradeName:{type:String},
    status:{
        type:Boolean,
        default:true
    }
},{versionKey:false,timestamps:true});


module.exports=mongoose.model('Trade_Category',Trade_Schema);