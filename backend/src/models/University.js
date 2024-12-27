// models/University.js
const mongoose = require('mongoose');
const universitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: String,
    website: String,
    verificationKey: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    stats: {
      totalStudents: Number,
      placementRate: Number
    }
  });

  module.exports = mongoose.model('University', universitySchema);