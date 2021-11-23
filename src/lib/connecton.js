const mongoose = require("mongoose");
//  mongoose.set('debug', true);

mongoose.connect("mongodb://127.0.0.1:27017/buttress",{
    
    useNewUrlParser:true,

    useUnifiedTopology: true 

}).then(()=>{
    console.log("connection successful")
}).catch(()=>{
    console.log("no connection")
})
