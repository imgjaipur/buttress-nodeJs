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
          type: Number,
     }],
     site_start_date: {
          type: Date
     },
     site_end_date: {
          type: Date

     },
     users_id: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user'
     }]
}, { timestamps: true, versionKey: false });

siteSchema.index({ 'location': '2dsphere' });
let site_Data = new mongoose.model("siteinfo", siteSchema);


module.exports = site_Data;