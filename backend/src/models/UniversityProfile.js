// models/UniversityProfile.js
const mongoose = require('mongoose');

const universityProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('UniversityProfile', universityProfileSchema);