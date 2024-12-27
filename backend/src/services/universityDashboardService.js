// services/universityDashboardService.js
const University = require('../models/University');
const UniversityProfile = require('../models/UniversityProfile');
const Placement = require('../models/Placement');
const PlacementDrive = require('../models/PlacementDrive');

class UniversityDashboardService {
  static async calculateDashboardMetrics(universityId) {
    try {
      const placementStats = await Placement.aggregate([
        { $match: { university: universityId } },
        {
          $group: {
            _id: null,
            totalPlacements: { $sum: 1 },
            averagePackage: { $avg: "$package" },
            highestPackage: { $max: "$package" }
          }
        }
      ]);

      const activeCompanies = await PlacementDrive.distinct('company', {
        university: universityId,
        status: { $in: ['Scheduled', 'In Progress'] }
      }).count();

      return {
        placementStats: placementStats[0] || {},
        activeCompanies
      };
    } catch (error) {
      console.error('Error calculating dashboard metrics:', error);
      throw error;
    }
  }

  static async getRecentPlacements(universityId, limit = 5) {
    try {
      return await Placement.find({ university: universityId })
        .populate('student', 'name')
        .populate('company', 'name')
        .sort({ placementDate: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error fetching recent placements:', error);
      throw error;
    }
  }

  static async getUpcomingDrives(universityId, limit = 5) {
    try {
      return await PlacementDrive.find({
        university: universityId,
        status: 'Scheduled',
        driveDate: { $gte: new Date() }
      })
      .populate('company', 'name')
      .sort({ driveDate: 1 })
      .limit(limit);
    } catch (error) {
      console.error('Error fetching upcoming drives:', error);
      throw error;
    }
  }

  static async updateUniversityStats(universityId, stats) {
    try {
      return await UniversityProfile.findOneAndUpdate(
        { university: universityId },
        { $set: { stats } },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating university stats:', error);
      throw error;
    }
  }
}

module.exports = UniversityDashboardService;