const jwt = require('jsonwebtoken')
const { successResponseWithData, ErrorResponse } = require("./apiresponse");


const User = require('../models/user')
const auth = async (req, res, next) => {
 try {
 const token = req.header('Authorization').replace('Bearer ', '')
 console.log("verify",token)
 const decoded = jwt.verify(token, "this is my");
 console.log(decoded.contactnumber)
 const user = await User.findOne({ _id: decoded._id, 'tokens.token':
token })
 if (!user) {
 throw new Error()
 }
 req.user = user
 next()
 } catch (e) {
//  res.status(401).send({ error: 'Please authenticate.' })
return successResponseWithData(res, "please authenticate");
 } }
module.exports = auth
 