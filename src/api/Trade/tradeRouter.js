const express=require("express");
const tradeRoute=express.Router();
const auth = require('./../../lib/authmiddleware');
const tradeController=require("./tradeController");

// tradeRoute

tradeRoute.get("/getTradeData",auth,tradeController.getTradeDataPage);
tradeRoute.post("/addSiteTrade",auth,tradeController.addSiteToTrade);
tradeRoute.post("/addworkstatus-trade",auth,tradeController.addworkstatus_trade);







module.exports=tradeRoute;