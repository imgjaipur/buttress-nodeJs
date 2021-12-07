const mongoose=require("mongoose");

const tradeModule=require("../../models/Trade_Category");
const siteInfo=require("../../models/siteModel");
const User=require("../../models/user");

const allTradeCategory={
    
    getTradeDataPage:async (req,res)=>{
            try{
                const tradeData=await siteInfo.findOne({site_code:req.body.site_code});
                const newSchema=new tradeModule({
                    Site_id:tradeData._id,
                    tradeName:req.body.tradeName
                });
                const dat = await newSchema.save();
                res.send(dat);
                
            }catch(error){
                // console.log(error);
                throw error;
            }
    },
    addSiteToTrade:async(req,res)=>{

        try{
            const addsitetrade=await siteInfo.findOne({site_code:req.body.site_code});      
            const tradeCategarySiteId=await tradeModule.find({Site_id:addsitetrade._id});
            console.log("tradeCategarySiteId-->",tradeCategarySiteId)
            if(tradeCategarySiteId > 0){ 
                res.send("allready excess");
            }else{
                const newupdate=await tradeModule.updateOne({_id:req.query.site_id},{$push:{Site_id:addsitetrade._id}})
               res.send(newupdate);
            }
        }catch(error){
            throw error;
        }

    },
    addTaskDisc:async(req,res)=>{
        try{
                // const tardeCategoryName=await tradeModule.findOne({tradeName:req.body.})
                console.log('i am in');

        }catch(error){
            console.log(error)
        }
    },


}
module.exports=allTradeCategory;