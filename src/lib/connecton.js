<<<<<<< HEAD
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/buttress").then(()=>
     console.log("connected mongo db")
).catch((err) => console.log('could not connnect',err))
=======
const mongoose = require("mongoose");
 mongoose.set('debug', true);

mongoose.connect("mongodb://127.0.0.1:27017/buttress",{
    
    useNewUrlParser:true,

    useUnifiedTopology: true 

}).then(()=>{
    console.log("connection successful")
}).catch(()=>{
    console.log("no connection")
})
>>>>>>> master
