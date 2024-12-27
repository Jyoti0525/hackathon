// src/models/StudentProfile.js
const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University'
  },
  personalInfo: {
    dateOfBirth: Date,
    phoneNumber: String,
    address: String
  },
  education: {
    degree: String,
    major: String,
    year: Number,
    cgpa: Number
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    }
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    credentialUrl: String
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studentProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);