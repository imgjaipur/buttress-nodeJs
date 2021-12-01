const mongoose=require("mongoose");

let workerStatusSchema= new mongoose.Schema({
    worker_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
    },
    constructionSite_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'siteinfo'
    },
    start_time:{
        type:String
    },
    end_time:{
        type:String
    },
    status:{
        type:String
    },
    total_working_hours:{
        type:String
    },
    note:{
        type:String
    }
},{versionKey:false,timestamps:true});

module.exports=mongoose.model('workerStatus',workerStatusSchema);