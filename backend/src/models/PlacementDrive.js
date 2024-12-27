// models/PlacementDrive.js
const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema({
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  driveDate: {
    type: Date,
    required: true
  },
  registrationDeadline: Date,
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  eligibilityCriteria: {
    minimumCGPA: Number,
    allowedBacklogs: Number,
    eligibleBranches: [String],
    eligibleBatches: [Number]
  },
  jobRoles: [{
    title: String,
    package: Number,
    numberOfPositions: Number,
    description: String,
    requiredSkills: [String]
  }],
  registeredStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Registered', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'],
      default: 'Registered'
    }
  }],
  rounds: [{
    roundNumber: Number,
    roundType: {
      type: String,
      enum: ['Aptitude', 'Technical', 'HR', 'Group Discussion', 'Other']
    },
    date: Date,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    }
  }]
});

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);