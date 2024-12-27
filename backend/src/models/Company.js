// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    industry: String,
    size: String,
    location: String,
    jobListings: [{
      title: String,
      description: String,
      requirements: [String],
      skills: [String],
      status: { type: String, default: 'active' },
      applications: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        status: String,
        appliedAt: Date
      }]
    }]
  });

  module.exports = mongoose.model('Company', companySchema);