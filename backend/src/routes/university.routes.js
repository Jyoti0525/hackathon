// src/routes/university.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Student = require('../models/Student');
const Placement = require('../models/Placement');
const Company = require('../models/Company');
const PlacementDrive = require('../models/PlacementDrive');
const auth = require('../middlewares/auth');
const UniversityProfile = require('../models/UniversityProfile');
const University = require('../models/University');


// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5 // 5MB limit
    }
  });
// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'University routes working!' });
});

// Upload routes
router.post('/upload/students', upload.single('file'), async (req, res) => {
  try {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const students = await Student.insertMany(results);
        fs.unlinkSync(req.file.path);
        res.json({
          success: true,
          message: `${students.length} students uploaded successfully`
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/upload/companies', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
  
      const xlsx = require('xlsx');
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
  
      // Format company data
      const formattedData = data.map(row => ({
        name: row.name,
        status: 'active',  // default status
        industry: row.industry
      }));
  
      const companies = await Company.insertMany(formattedData);
  
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
  
      res.json({
        success: true,
        message: `${companies.length} companies uploaded successfully`,
        data: companies
      });
  
    } catch (error) {
      console.error('Upload error:', error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        success: false,
        message: `Upload failed: ${error.message}`
      });
    }
  });
  router.post('/upload/placements', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
  
      const xlsx = require('xlsx');
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
  
      // Convert date format and validate data
      const formattedData = data.map(row => {
        // Convert date from DD-MM-YYYY to YYYY-MM-DD
        let formattedDate;
        if (row.date) {
          const [day, month, year] = row.date.split('-');
          formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
          formattedDate = new Date().toISOString().split('T')[0];
        }
  
        return {
          student: row.studentId,
          company: row.companyId,
          role: row.role,
          package: parseFloat(row.package),
          date: formattedDate
        };
      });
  
      const placements = await Placement.insertMany(formattedData);
  
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
  
      res.json({
        success: true,
        message: `${placements.length} placements uploaded successfully`
      });
  
    } catch (error) {
      console.error('Upload error:', error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        success: false,
        message: `Upload failed: ${error.message}`
      });
    }
  });

 // In your university.routes.js
// In your university.routes.js
router.get('/get-available-data', async (req, res) => {
    try {
      // Get students with full info
      const students = await Student.find();
  
      // Get companies with full info
      const companies = await Company.find();
  
      // Get placements with populated data
      const placements = await Placement.find()
        .populate({
          path: 'student',
          select: 'name email' // Add any other student fields you want
        })
        .populate({
          path: 'company',
          select: 'name' // Add any other company fields you want
        });
  
      // Format the response
      const formattedPlacements = placements.map(p => ({
        id: p._id,
        studentName: p.student?.name || 'Not Available',
        company: p.company?.name || 'Not Available',
        role: p.role,
        package: p.package,
        date: p.date
      }));
  
      res.json({
        success: true,
        data: {
          students: students.map(student => ({
            id: student._id,
            name: student.name || 'Not specified',
            email: student.email
          })),
          companies: companies.map(company => ({
            id: company._id,
            name: company.name
          })),
          placements: placements.map(placement => ({
            id: placement._id,
            studentName: placement.student?.name || 'Unknown Student',
            company: placement.company?.name || 'Unknown Company',
            role: placement.role,
            package: placement.package,
            date: placement.date
          }))
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });

// Main dashboard stats route
router.get('/dashboard-stats', async (req, res) => {
    try {
      // Get all students count
      const totalStudents = await Student.countDocuments();
  
      // Get placements with companies and students info
      const placements = await Placement.find()
        .populate('student', 'name')
        .populate('company', 'name')
        .sort({ date: -1 });
  
      // Calculate placement stats
      const placedStudents = placements.length;
      const placementRate = totalStudents > 0 
        ? ((placedStudents / totalStudents) * 100).toFixed(1) 
        : 0;
  
      // Calculate average package
      const totalPackages = placements.reduce((sum, p) => sum + p.package, 0);
      const averagePackage = placedStudents > 0 
        ? (totalPackages / placedStudents).toFixed(1) 
        : 0;
  
      // Get active companies count
      const activeCompanies = await Company.countDocuments({ status: 'active' });
  
      // Get recent placements (last 5)
      const recentPlacements = placements.slice(0, 5).map(p => ({
        id: p._id,
        studentName: p.student.name,
        company: p.company.name,
        role: p.role,
        package: `${p.package} LPA`,
        date: p.date
      }));
  
      // Get upcoming placement drives
      const today = new Date();
      const upcomingDrives = await PlacementDrive.find({
        date: { $gte: today }
      })
      .populate('company', 'name')
      .sort({ date: 1 })
      .limit(5);
  
      const formattedDrives = upcomingDrives.map(drive => ({
        id: drive._id,
        company: drive.company.name,
        date: drive.date,
        roles: drive.jobRoles?.map(role => role.title) || [],
        eligibility: `${drive.eligibilityCriteria?.minimumCGPA || 0} CGPA`,
        registrations: drive.registeredStudents?.length || 0
      }));
  
      const dashboardData = {
        success: true,
        data: {
          totalStudents,
          placedStudents,
          placementRate,
          averagePackage,
          activeCompanies,
          recentPlacements,
          upcomingDrives: formattedDrives
        }
      };
  
      res.json(dashboardData);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard statistics'
      });
    }
  });

// Get drive details route
router.get('/placement-drive/:id', async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id)
      .populate('company')
      .populate('registeredStudents.student');

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found'
      });
    }

    const driveData = {
      success: true,
      data: {
        id: drive._id,
        company: drive.company.name,
        date: drive.date,
        status: drive.status,
        registrationDeadline: drive.registrationDeadline,
        jobRoles: drive.jobRoles.map(role => ({
          title: role.title,
          package: role.package,
          positions: role.positions,
          description: role.description,
          requiredSkills: role.requiredSkills
        })),
        eligibility: {
          minimumCGPA: drive.eligibilityCriteria.minimumCGPA,
          allowedBacklogs: drive.eligibilityCriteria.allowedBacklogs,
          eligibleBranches: drive.eligibilityCriteria.eligibleBranches
        },
        registeredStudents: drive.registeredStudents.map(reg => ({
          name: reg.student.name,
          registrationDate: reg.registrationDate,
          status: reg.status
        })),
        rounds: drive.rounds.map(round => ({
          roundNumber: round.roundNumber,
          type: round.type,
          date: round.date,
          status: round.status
        }))
      }
    };

    res.json(driveData);
  } catch (error) {
    console.error('Drive details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drive details'
    });
  }
});

// Add test data route
router.post('/add-test-data', async (req, res) => {
  try {
    // Create test companies
    const companies = await Company.create([
      { name: 'Tech Corp', status: 'active' },
      { name: 'Innovate Inc', status: 'active' },
      { name: 'Global Systems', status: 'active' },
      { name: 'Future Tech', status: 'active' }
    ]);

    // Create test students
    const students = await Student.create([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Alex Johnson', email: 'alex@example.com' }
    ]);

    // Create test placements
    const placements = await Placement.create([
      {
        student: students[0]._id,
        company: companies[0]._id,
        role: 'Software Engineer',
        package: 12,
        date: new Date('2024-01-15')
      },
      {
        student: students[1]._id,
        company: companies[1]._id,
        role: 'Product Manager',
        package: 15,
        date: new Date('2024-01-14')
      }
    ]);

    // Create test placement drives
    const placementDrives = await PlacementDrive.create([
      {
        company: companies[2]._id,
        date: new Date('2024-01-20'),
        status: 'Scheduled',
        registrationDeadline: new Date('2024-01-18'),
        jobRoles: [
          {
            title: 'Software Developer',
            package: 12,
            positions: 10,
            description: 'Looking for full stack developers',
            requiredSkills: ['JavaScript', 'React', 'Node.js']
          }
        ],
        eligibilityCriteria: {
          minimumCGPA: 7.5,
          allowedBacklogs: 0,
          eligibleBranches: ['Computer Science', 'Information Technology']
        }
      }
    ]);

    res.json({
      success: true,
      message: 'Test data added successfully',
      data: {
        companies,
        students,
        placements,
        placementDrives
      }
    });
  } catch (error) {
    console.error('Error adding test data:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding test data'
    });
  }
});
// In your university.routes.js
router.get('/analytics', async (req, res) => {
  try {
    // Get department-wise stats
    const departmentStats = await Placement.aggregate([
      {
        $group: {
          _id: '$department',
          placedStudents: { $sum: 1 },
          averagePackage: { $avg: '$package' }
        }
      }
    ]);

    // Get skills stats from placements
    const skillsStats = await Placement.aggregate([
      { $unwind: '$requiredSkills' },
      {
        $group: {
          _id: '$requiredSkills',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        departmentStats,
        skillsStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
});
// backend/src/routes/university.routes.js

// GET profile route with detailed error logging
router.get('/profile', auth, async (req, res) => {
  try {
    const profile = await UniversityProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      // Create a default profile if none exists
      const newProfile = new UniversityProfile({
        userId: req.user._id,
        name: req.user.name || '',
        email: req.user.email || ''
      });
      await newProfile.save();
      return res.json({ success: true, data: newProfile });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    let profile = await UniversityProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      profile = new UniversityProfile({
        userId: req.user._id,
        ...req.body
      });
    } else {
      Object.assign(profile, req.body);
    }

    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});



module.exports = router;