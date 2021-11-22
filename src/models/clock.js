const mongoose = require('mongoose');

const clockSchema= new mongoose.Schema({
    whereyouare:{
        type:String,

    },
    enteraddress:{
        type:String,
    

    },
})
module.exports=mongoose.model("clock",clockSchema)
