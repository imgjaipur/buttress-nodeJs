const Site = require("../../models/siteModel.js");
const { findOne } = require("../../models/workerStatus.js");

let sitecontroller={
    getsite:async(req,res)=>{
        try{
        let whereObj = {
            working_status:true
        }
        if(req.params.id){
            whereObj['_id'] =req.params.id;
        }
        // console.log(whereObj);
                const site = await Site.find(whereObj)
                res.send(site)
        }catch(e){
            console.log(e);
            res.status(500).json(e)
        }
    }
}


module.exports = sitecontroller;
