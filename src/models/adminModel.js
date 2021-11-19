const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
     name: {
          type: String
     },
     email: {
          type: String,
          unique: true,
          required: true,
     },
     mobile: {
          type: Number,
          required: true,
     },
     password: {
          type: String,
          required: true,
     },
     profile: {
          type: String,
     },
},
     { timestamps: true, versionKey: false });

let registerAdmin = new mongoose.model("admin", adminSchema);
module.exports = registerAdmin;
