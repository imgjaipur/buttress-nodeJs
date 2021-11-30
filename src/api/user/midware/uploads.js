const express = require('express');
const multer=require("multer")


const Storage=multer.diskStorage({
    destination:'../uploads',
    filename:(req,res,cb)=>{
        return cb(null,`${req.file.fieldname}${Date.now()}${path.extname(req.file.originalname)}`)
    }
});
const upload=multer({storage:Storage}).single("profile");

module.exports=upload;
