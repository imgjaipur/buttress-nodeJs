const mongoose=require("mongoose");

const tradeModule=require("../../models/Trade_Category");
const siteInfo=require("../../models/siteModel");
const User=require("../../models/user");
const workingStatusSchema=require("../../models/workerStatus");
const moment = require('moment');
const {
    successResponseWithData,
    ErrorResponse,
} = require("./../../lib/apiresponse");
const { updateOne } = require("../../models/Trade_Category");

const allTradeCategory={
    
    getTradeDataPage:async (req,res)=>{
            try{
                const tradeData=await tradeModule.find({status:true});
                return successResponseWithData(res,"Success",tradeData);
            }catch(error){
                return ErrorResponse(res, "Something is wrong!");
            }
    },
    addSiteToTrade:async(req,res)=>{

        try{
            const newSchema=new tradeModule({
                tradeName:req.body.tradeName
            });
            const dat = await newSchema.save();
            return successResponseWithData(res,"Success",dat);
        }catch(error){
            return ErrorResponse(res, "Something is wrong!");
        }

    },
    addworkstatus_trade:async(req,res)=>{
        try{
            if(!req.user._id){
                return ErrorResponse(res, "Please Authenticate!");
            }
            const siteDetails=await siteInfo.findOne({site_code:req.body.site_code})
            // console.log('---------------->',(siteDetails._id).toString());
            let end_time = moment(req.body.end_time).format("YYYY-MM-DDTHH:mm:ss");
            let hrs = moment.utc(moment(end_time.split("T")[1], "HH-mm-ss").diff(moment(moment(req.body.start_time).format("YYYY-MM-DDTHH:mm:ss").split("T")[1], "HH-mm-ss"))).format("HH");
            let min = moment.utc(moment(end_time.split("T")[1], "HH-mm-ss").diff(moment(moment(req.body.start_time).format("YYYY-MM-DDTHH:mm:ss").split("T")[1], "HH-mm-ss"))).format("mm");
            let sec = moment.utc(moment(end_time.split("T")[1], "HH-mm-ss").diff(moment(moment(req.body.start_time).format("YYYY-MM-DDTHH:mm:ss").split("T")[1], "HH-mm-ss"))).format("ss");
            let total_working_hours = [hrs, min, sec].join(':');
            let myworking = new workingStatusSchema({
                worker_id: req.user._id,
                constructionSite_id: (siteDetails._id).toString(),
                start_time: moment(req.body.start_time).format("YYYY-MM-DDTHH:mm:ss"),
                end_time: end_time,
                total_working_hours:total_working_hours,
                status: 'Completed',
                note:req.body.note
            });
            let myworkSave = await myworking.save();
            return successResponseWithData(res,"Success",myworkSave);
        }catch(error){
            console.log(error);
            return ErrorResponse(res, "Something is wrong!");
        }
    },


}
module.exports=allTradeCategory;