// controllers/universityDashboardController.js
const University = require('../models/University');
const UniversityProfile = require('../models/UniversityProfile');
const Placement = require('../models/Placement');
const PlacementDrive = require('../models/PlacementDrive');

exports.getDashboardStats = async (req, res) => {
  try {
    const universityId = req.user.universityId; // Assuming we get this from auth middleware

    // Get university profile with stats
    const universityProfile = await UniversityProfile.findOne({ 
      userId: req.user._id 
    });

    // Get recent placements
    const recentPlacements = await Placement.find({ 
      university: universityId 
    })
    .populate('student', 'name')
    .populate('company', 'name')
    .sort({ placementDate: -1 })
    .limit(5);

    // Get upcoming placement drives
    const upcomingDrives = await PlacementDrive.find({
      university: universityId,
      status: 'Scheduled',
      driveDate: { $gte: new Date() }
    })
    .populate('company', 'name')
    .sort({ driveDate: 1 })
    .limit(5);

    // Calculate average package
    const averagePackage = await Placement.aggregate([
      { $match: { university: universityId } },
      { $group: { _id: null, avg: { $avg: "$package" } } }
    ]);

    const dashboardData = {
      totalStudents: universityProfile.stats.totalStudents || 0,
      placedStudents: universityProfile.stats.placedStudents || 0,
      placementRate: universityProfile.stats.placementRate || 0,
      averagePackage: averagePackage[0]?.avg || 0,
      activeCompanies: universityProfile.stats.activeCompanies || 0,
      recentPlacements,
      upcomingDrives
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard statistics' 
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