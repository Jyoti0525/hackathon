// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
    cgpa: Number,
    skills: [{
      name: String,
      level: String,
      verified: { type: Boolean, default: false }
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      verificationUrl: String,
      verified: { type: Boolean, default: false }
    }],
    projects: [{
      title: String,
      description: String,
      technologies: [String],
      url: String
    }],
    ranking: {
      overall: Number,
      academic: Number,
      skills: Number
    }
  });


  module.exports = mongoose.model('Student', studentSchema);