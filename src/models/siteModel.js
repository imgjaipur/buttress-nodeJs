const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
     site_name: {
          type: String
     },
     site_address: {
          type: String
     },
     construction_manager: {
          type: String
     },
     site_code: {
          type: String
     },
     location: [{
          type: Number
     }],
    working_status:{
          type: Boolean
     },
     qr_code:{
          type: String
     }
}, { timestamps: true, versionKey: false });

// siteSchema.index({ 'location': '2dsphere' });
let site_Data = new mongoose.model("siteinfo", siteSchema);


module.exports = site_Data;