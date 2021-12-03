const jwt = require('jsonwebtoken')
// const { successResponseWithData, ErrorResponse } = require("./apiresponse");


const auth = async (req, res, next) => {
 try {
 const token = req.header('Authorization').replace('Bearer ', '');
 console.log("verify",token);
 const decoded = jwt.verify(token, "this is my");
 if (!decoded) {
 throw new Error()
 }
 req.user = decoded;
 next();

 } catch (e) {
return successResponseWithData(res, "please authenticate");
 } 
}
module.exports = auth;


// exports.authUser=(req,res,next)=>{
//     if(req.headers.token){
//         const token=req.headers.token
//         const user=jwt.verify(token,"this is my");
//         req.user=user;

        
//     }else{
//         return res.status(400).json({message:'Authorization required'});
//     }
   
//     next();
// }
 