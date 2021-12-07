const express=require("express");
const tradeRoute=express.Router();
const auth = require('./../../lib/authmiddleware');
const tradeController=require("./tradeController");

// tradeRoute

tradeRoute.post("/getTradeData",auth,tradeController.getTradeDataPage);
tradeRoute.post("/addSiteTrade",tradeController.addSiteToTrade);
tradeRoute.post("/addtaskdisc",tradeController.addTaskDisc);





module.exports=tradeRoute;