// controllers/universityDashboardController.js
const University = require('../models/University');
const UniversityProfile = require('../models/UniversityProfile');
const Placement = require('../models/Placement');
const PlacementDrive = require('../models/PlacementDrive');

exports.getDashboardStats = async (req, res) => {
  try {
    const universityId = req.user.universityId;
    
    // Implement parallel data fetching for better performance
    const [universityProfile, recentPlacements, upcomingDrives, placementStats] = await Promise.all([
      UniversityProfile.findOne({ userId: req.user._id }),
      Placement.find({ university: universityId })
        .populate('student', 'name email department')
        .populate('company', 'name industry')
        .sort({ placementDate: -1 })
        .limit(5),
      PlacementDrive.find({
        university: universityId,
        driveDate: { $gte: new Date() }
      })
        .populate('company', 'name industry requirements')
        .sort({ driveDate: 1 })
        .limit(5),
      Placement.aggregate([
        { $match: { university: universityId } },
        { 
          $group: { 
            _id: null,
            avgPackage: { $avg: "$package" },
            maxPackage: { $max: "$package" },
            totalPlacements: { $sum: 1 }
          }
        }
      ])
    ]);

    // Enhanced response data
    const dashboardData = {
      stats: {
        totalStudents: universityProfile.stats.totalStudents || 0,
        placedStudents: placementStats[0]?.totalPlacements || 0,
        averagePackage: (placementStats[0]?.avgPackage || 0).toFixed(2),
        highestPackage: placementStats[0]?.maxPackage || 0,
        activeCompanies: await Company.countDocuments({ 
          'activeDrives.university': universityId 
        })
      },
      recentPlacements: recentPlacements.map(p => ({
        id: p._id,
        studentName: p.student.name,
        company: p.company.name,
        role: p.role,
        package: p.package,
        department: p.student.department,
        date: p.placementDate
      })),
      upcomingDrives: upcomingDrives.map(d => ({
        id: d._id,
        company: d.company.name,
        date: d.driveDate,
        roles: d.positions,
        eligibility: d.eligibilityCriteria,
        registrations: d.registeredStudents?.length || 0,
        industry: d.company.industry
      }))
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard statistics',
      error: error.message 
    });
  }
};

exports.updateDashboardStats = async (req, res) => {
  try {
    const { totalStudents, placedStudents, activeCompanies } = req.body;
    const universityId = req.user.universityId;

    const updatedProfile = await UniversityProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          'stats.totalStudents': totalStudents,
          'stats.placedStudents': placedStudents,
          'stats.activeCompanies': activeCompanies,
          'stats.placementRate': (placedStudents / totalStudents) * 100
        }
      },
      { new: true }
    );

    res.json({ success: true, data: updatedProfile.stats });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating dashboard statistics' 
    });
  }
};