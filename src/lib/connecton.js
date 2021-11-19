const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/buttress").then(()=>
     console.log("connected mongo db")
).catch((err) => console.log('could not connnect',err))
