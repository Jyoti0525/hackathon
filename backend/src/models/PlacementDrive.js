// models/PlacementDrive.js
const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema({
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  driveDate: { type: Date, required: true },
  positions: [{
    role: String,
    package: Number,
    openings: Number,
    description: String
  }],
  eligibilityCriteria: {
    minimumCGPA: Number,
    allowedDepartments: [String],
    allowedBatches: [String],
    additionalRequirements: String
  },
  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  status: {
    type: String,
    enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  rounds: [{
    name: String,
    date: Date,
    status: String,
    selectedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);