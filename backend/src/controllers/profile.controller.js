// src/controllers/profile.controller.js
const StudentProfile = require('../models/StudentProfile');
const UniversityProfile = require('../models/UniversityProfile');
const CompanyProfile = require('../models/CompanyProfile');

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const { role } = req.user;
    let profile;

    switch (role) {
      case 'student':
        profile = await StudentProfile.findOne({ userId: req.user.id });
        break;
      case 'university':
        profile = await UniversityProfile.findOne({ userId: req.user.id });
        break;
      case 'company':
        profile = await CompanyProfile.findOne({ userId: req.user.id });
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error retrieving profile' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { role } = req.user;
    let profile;
    const updateData = req.body;

    switch (role) {
      case 'student':
        profile = await StudentProfile.findOneAndUpdate(
          { userId: req.user.id },
          updateData,
          { new: true, upsert: true }
        );
        break;
      case 'university':
        profile = await UniversityProfile.findOneAndUpdate(
          { userId: req.user.id },
          updateData,
          { new: true, upsert: true }
        );
        break;
      case 'company':
        profile = await CompanyProfile.findOneAndUpdate(
          { userId: req.user.id },
          updateData,
          { new: true, upsert: true }
        );
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Add profile routes
exports.addSkill = async (req, res) => {
  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { skills: req.body } },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error adding skill' });
  }
};

exports.addCertification = async (req, res) => {
  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { certifications: req.body } },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error adding certification' });
  }
};

exports.addProject = async (req, res) => {
  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { projects: req.body } },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error adding project' });
  }
};