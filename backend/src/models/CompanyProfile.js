// src/models/CompanyProfile.js
const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyInfo: {
    name: {
      type: String,
      required: true
    },
    industry: {
      type: String,
      required: true
    },
    website: String,
    size: {
      type: String,
      enum: ['1-50', '51-200', '201-500', '501-1000', '1000+'],
      required: true
    },
    founded: Number,
    description: String,
    logo: String
  },
  contactInfo: {
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    phoneNumber: String,
    email: String,
    hrContact: {
      name: String,
      email: String,
      phone: String
    }
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  recruitmentStats: {
    totalHires: {
      type: Number,
      default: 0
    },
    openPositions: {
      type: Number,
      default: 0
    },
    averagePackage: {
      type: Number,
      default: 0
    },
    hiringHistory: [{
      year: Number,
      hires: Number,
      averagePackage: Number
    }]
  },
  jobPreferences: {
    preferredInstitutions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University'
    }],
    minimumCGPA: {
      type: Number,
      default: 0
    },
    preferredSkills: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

companyProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);