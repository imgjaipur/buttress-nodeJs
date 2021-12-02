const jwt = require('jsonwebtoken')
// const { successResponseWithData, ErrorResponse } = require("./apiresponse");


// const User = require('../models/user.js')
// const auth = async (req, res, next) => {
//  try {
//  const token = req.header('Authorization').replace('Bearer ', '')
//  console.log("verify",token)
//  const decoded = jwt.verify(token, "this is my");
//  const user = await User.findOne({ _id: decoded._id, 'tokens.token':
// token })
//  if (!user) {
//  throw new Error()
//  }
//  req.user = user
//  next()
//  } catch (e) {
// //  res.status(401).send({ error: 'Please authenticate.' })
// return successResponseWithData(res, "please authenticate");
//  } }
// module.exports = auth


exports.authUser=(req,res,next)=>{
    if(req.headers.token){
        const token=req.headers.token
        const user=jwt.verify(token,"this is my");
        req.user=user;

        
    }else{
        return res.status(400).json({message:'Authorization required'});
    }
   
    next();
}
 