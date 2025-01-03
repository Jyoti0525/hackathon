// services/universityDashboardService.js
const University = require('../models/University');
const UniversityProfile = require('../models/UniversityProfile');
const Placement = require('../models/Placement');
const PlacementDrive = require('../models/PlacementDrive');
const Student = require('../models/Student');
const EventEmitter = require('events');

class UniversityDashboardService extends EventEmitter {
  static async getDashboardData(universityId) {
    try {
      const [metrics, placements, drives, studentStats] = await Promise.all([
        this.calculateDashboardMetrics(universityId),
        this.getRecentPlacements(universityId),
        this.getUpcomingDrives(universityId),
        this.getStudentStats(universityId)
      ]);

      const dashboardData = {
        metrics: {
          ...metrics,
          ...studentStats
        },
        recentPlacements: placements,
        upcomingDrives: drives
      };

      this.emit('dashboard_updated', { universityId, data: dashboardData });
      return dashboardData;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  static async calculateDashboardMetrics(universityId) {
    try {
      const placementStats = await Placement.aggregate([
        { $match: { university: universityId } },
        {
          $group: {
            _id: null,
            totalPlacements: { $sum: 1 },
            averagePackage: { $avg: "$package" },
            highestPackage: { $max: "$package" },
            totalPackageValue: { $sum: "$package" }
          }
        }
      ]);

      const activeCompanies = await PlacementDrive.distinct('company', {
        university: universityId,
        status: { $in: ['Scheduled', 'In Progress'] }
      }).count();

      const metrics = {
        totalPlacements: placementStats[0]?.totalPlacements || 0,
        averagePackage: placementStats[0]?.averagePackage.toFixed(2) || 0,
        highestPackage: placementStats[0]?.highestPackage || 0,
        activeCompanies
      };

      this.emit('metrics_updated', { universityId, data: metrics });
      return metrics;
    } catch (error) {
      console.error('Error calculating metrics:', error);
      throw new Error('Failed to calculate dashboard metrics');
    }
  }

  static async getStudentStats(universityId) {
    try {
      const stats = await Student.aggregate([
        { $match: { university: universityId } },
        {
          $group: {
            _id: null,
            totalStudents: { $sum: 1 },
            eligibleStudents: {
              $sum: { $cond: [{ $gte: ["$cgpa", 6.0] }, 1, 0] }
            }
          }
        }
      ]);

      const studentStats = {
        totalStudents: stats[0]?.totalStudents || 0,
        eligibleStudents: stats[0]?.eligibleStudents || 0,
        placementRate: stats[0]?.totalStudents 
          ? ((placementStats[0]?.totalPlacements || 0) / stats[0].totalStudents * 100).toFixed(2)
          : 0
      };

      this.emit('student_stats_updated', { universityId, data: studentStats });
      return studentStats;
    } catch (error) {
      console.error('Error fetching student stats:', error);
      throw new Error('Failed to fetch student statistics');
    }
  }

  static async getRecentPlacements(universityId, limit = 5) {
    try {
      const placements = await Placement.find({ university: universityId })
        .populate('student', 'name department')
        .populate('company', 'name industry')
        .sort({ placementDate: -1 })
        .limit(limit)
        .lean();

      const formattedPlacements = placements.map(placement => ({
        id: placement._id,
        studentName: placement.student?.name || 'Unknown Student',
        studentDepartment: placement.student?.department,
        company: placement.company?.name || 'Unknown Company',
        industry: placement.company?.industry,
        role: placement.role,
        package: `${placement.package} LPA`,
        placementDate: placement.placementDate
      }));

      this.emit('placements_updated', { universityId, data: formattedPlacements });
      return formattedPlacements;
    } catch (error) {
      console.error('Error fetching placements:', error);
      throw new Error('Failed to fetch recent placements');
    }
  }

  static async getUpcomingDrives(universityId, limit = 5) {
    try {
      const drives = await PlacementDrive.find({
        university: universityId,
        status: 'Scheduled',
        driveDate: { $gte: new Date() }
      })
      .populate('company', 'name industry requirements')
      .sort({ driveDate: 1 })
      .limit(limit)
      .lean();

      const formattedDrives = drives.map(drive => ({
        id: drive._id,
        company: drive.company?.name,
        industry: drive.company?.industry,
        driveDate: drive.driveDate,
        roles: drive.jobRoles?.map(role => ({
          title: role.title,
          package: role.package,
          openings: role.openings
        })) || [],
        eligibilityCriteria: drive.eligibilityCriteria,
        registrationCount: drive.registeredStudents?.length || 0
      }));

      this.emit('drives_updated', { universityId, data: formattedDrives });
      return formattedDrives;
    } catch (error) {
      console.error('Error fetching drives:', error);
      throw new Error('Failed to fetch upcoming drives');
    }
  }

  static subscribeToUpdates(callback) {
    this.on('dashboard_updated', callback);
    this.on('metrics_updated', callback);
    this.on('placements_updated', callback);
    this.on('drives_updated', callback);
    this.on('student_stats_updated', callback);
  }

  static unsubscribeFromUpdates(callback) {
    this.removeListener('dashboard_updated', callback);
    this.removeListener('metrics_updated', callback);
    this.removeListener('placements_updated', callback);
    this.removeListener('drives_updated', callback);
    this.removeListener('student_stats_updated', callback);
  }
}

module.exports = UniversityDashboardService;