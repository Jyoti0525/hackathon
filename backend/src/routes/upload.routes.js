// src/routes/upload.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// File upload route
router.post('/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message
    });
  }
});

// CSV upload route for universities
router.post('/csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Check if it's a CSV file
    if (path.extname(req.file.originalname) !== '.csv') {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    res.status(200).json({
      message: 'CSV file uploaded successfully',
      file: req.file
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error uploading CSV file',
      error: error.message
    });
  }
});

module.exports = router;