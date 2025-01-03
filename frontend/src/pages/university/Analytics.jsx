// src/pages/university/Analytics.jsx
import React, { useState, useEffect } from 'react';
import UniversityService from '../../services/universityService';
import DepartmentAnalytics from './analytics/DepartmentAnalytics';
import SkillsAnalysis from './analytics/SkillsAnalysis';
import RecruitmentTimeline from './analytics/RecruitmentTimeline';
import ComparisonChart from './analytics/ComparisonChart';
import PlacementStats from './analytics/PlacementStats';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState({
        placementStats: {
            totalStudents: 0,
            placedStudents: 0,
            averagePackage: 0,
            companiesVisited: 0,
            highestPackage: 0,
            packageGrowth: 0,
            newCompanies: 0,
            highestPackageCompany: '',
            previousYearTotal: 0
        },
        departmentStats: [],
        skillsStats: [],
        recruitmentTimeline: [],
        yearComparison: {
            currentYear: { totalPlacements: 0, averagePackage: 0 },
            previousYear: { totalPlacements: 0, averagePackage: 0 }
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('yearly');
    const [comparisonMetric, setComparisonMetric] = useState('placements');
    const [filterDateRange, setFilterDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: new Date()
    });

    const processPlacementStats = (placements, students, companies) => {
      const currentYear = new Date().getFullYear();
      const currentYearPlacements = placements.filter(p => 
          new Date(p.date).getFullYear() === currentYear
      );
      const previousYearPlacements = placements.filter(p => 
          new Date(p.date).getFullYear() === currentYear - 1
      );
  
      const avgPackageCurrent = currentYearPlacements.reduce((sum, p) => sum + (p.package || 0), 0) / 
          (currentYearPlacements.length || 1);
      const avgPackagePrevious = previousYearPlacements.reduce((sum, p) => sum + (p.package || 0), 0) / 
          (previousYearPlacements.length || 1);
  
      const highestPlacement = placements.reduce((max, p) => 
          (p.package > (max?.package || 0)) ? p : max, null);
  
      return {
          totalStudents: students.length,
          placedStudents: currentYearPlacements.length,
          averagePackage: avgPackageCurrent.toFixed(2),
          companiesVisited: companies.length,
          highestPackage: highestPlacement?.package || 0,
          packageGrowth: ((avgPackageCurrent / avgPackagePrevious - 1) * 100).toFixed(1),
          newCompanies: companies.filter(c => new Date(c.createdAt).getFullYear() === currentYear).length,
          highestPackageCompany: highestPlacement?.company?.name || 'N/A',
          previousYearTotal: previousYearPlacements.length
      };
  };
  
  const processDepartmentStats = (placements) => {
      const departmentMap = new Map();
      
      placements.forEach(placement => {
          const dept = placement.student?.department || 'Other';
          if (!departmentMap.has(dept)) {
              departmentMap.set(dept, {
                  placedStudents: 0,
                  totalPackage: 0
              });
          }
          
          const stats = departmentMap.get(dept);
          stats.placedStudents += 1;
          stats.totalPackage += placement.package || 0;
      });
  
      return Array.from(departmentMap.entries()).map(([name, stats]) => ({
          name,
          placedStudents: stats.placedStudents,
          averagePackage: (stats.totalPackage / stats.placedStudents).toFixed(2)
      }));
  };
  
  const processSkillsStats = (placements) => {
      const skillsCount = new Map();
      
      placements.forEach(placement => {
          const skills = placement.requiredSkills || [];
          skills.forEach(skill => {
              skillsCount.set(skill, (skillsCount.get(skill) || 0) + 1);
          });
      });
  
      return Array.from(skillsCount.entries())
          .map(([skill, count]) => ({ skill, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);
  };
  
  const processRecruitmentTimeline = (placements) => {
      const currentYear = new Date().getFullYear();
      const monthlyData = new Map();
      
      for (let i = 0; i < 12; i++) {
          monthlyData.set(i, { placements: 0, offers: 0 });
      }
  
      placements.forEach(placement => {
          const date = new Date(placement.date);
          if (date.getFullYear() === currentYear) {
              const month = date.getMonth();
              const data = monthlyData.get(month);
              data.placements += 1;
              data.offers += 1;
          }
      });
  
      return Array.from(monthlyData.entries())
          .map(([month, data]) => ({
              month: new Date(currentYear, month).toLocaleString('default', { month: 'short' }),
              ...data
          }));
  };
  
  const processYearComparison = (placements) => {
      const currentYear = new Date().getFullYear();
      
      const currentYearData = placements.filter(p => 
          new Date(p.date).getFullYear() === currentYear
      );
      const previousYearData = placements.filter(p => 
          new Date(p.date).getFullYear() === currentYear - 1
      );
  
      return {
          currentYear: {
              totalPlacements: currentYearData.length,
              averagePackage: (currentYearData.reduce((sum, p) => sum + (p.package || 0), 0) / 
                  (currentYearData.length || 1)).toFixed(2)
          },
          previousYear: {
              totalPlacements: previousYearData.length,
              averagePackage: (previousYearData.reduce((sum, p) => sum + (p.package || 0), 0) / 
                  (previousYearData.length || 1)).toFixed(2)
          }
      };
  };
  
    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const response = await UniversityService.getAvailableData();
            
            if (response.success) {
                const { placements, students, companies } = response.data;
                const filteredPlacements = filterPlacementsByDate(placements);

                const processedData = {
                    placementStats: processPlacementStats(filteredPlacements, students, companies),
                    departmentStats: processDepartmentStats(filteredPlacements),
                    skillsStats: processSkillsStats(filteredPlacements),
                    recruitmentTimeline: processRecruitmentTimeline(filteredPlacements),
                    yearComparison: processYearComparison(filteredPlacements)
                };

                setAnalyticsData(processedData);
                setError(null);
            } else {
                throw new Error('Failed to fetch analytics data');
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError('Failed to load analytics data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange, comparisonMetric]);

    const filterPlacementsByDate = (placements) => {
        return placements.filter(placement => {
            const placementDate = new Date(placement.date);
            return placementDate >= filterDateRange.startDate && 
                   placementDate <= filterDateRange.endDate;
        });
    };

    const exportAnalyticsReport = () => {
        try {
            const report = {
                reportTitle: "University Analytics Report",
                generatedAt: new Date().toLocaleString(),
                timeRange,
                metrics: {
                    overview: analyticsData.placementStats,
                    departmentPerformance: analyticsData.departmentStats,
                    skillsDemand: analyticsData.skillsStats,
                    placementTrends: analyticsData.recruitmentTimeline
                }
            };

            const csvContent = generateCSVReport(report);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const fileName = `Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`;

            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success message
            alert('Report exported successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export report. Please try again.');
        }
    };

    const generateCSVReport = (report) => {
        const headers = [
            'Metric',
            'Current Value',
            'Previous Value',
            'Change (%)',
            'Notes'
        ].join(',');

        const rows = [
            // Overview
            ['Total Students', report.metrics.overview.totalStudents, report.metrics.overview.previousYearTotal, 
                calculateGrowth(report.metrics.overview.totalStudents, report.metrics.overview.previousYearTotal)],
            ['Average Package', report.metrics.overview.averagePackage, '', report.metrics.overview.packageGrowth],
            ['Companies Visited', report.metrics.overview.companiesVisited, '', 
                `+${report.metrics.overview.newCompanies} new`],
            ['Highest Package', report.metrics.overview.highestPackage, '', 
                report.metrics.overview.highestPackageCompany],

            // Department Performance
            ['', '', '', ''], // Empty row for separation
            ['Department Performance', '', '', ''],
            ...report.metrics.departmentPerformance.map(dept => [
                dept.name,
                dept.placedStudents,
                dept.averagePackage,
                `${calculateGrowth(dept.placedStudents, 0)}%`
            ]),

            // Skills Demand
            ['', '', '', ''],
            ['Skills in Demand', '', '', ''],
            ...report.metrics.skillsDemand.map(skill => [
                skill.skill,
                skill.count,
                '',
                'Demand Score'
            ])
        ].map(row => row.join(','));

        return [headers, ...rows].join('\n');
    };

    const shareAnalytics = async () => {
        try {
            const shareableData = {
                reportType: 'University Analytics',
                generatedAt: new Date().toISOString(),
                timeRange,
                summary: {
                    totalStudents: analyticsData.placementStats.totalStudents,
                    averagePackage: analyticsData.placementStats.averagePackage,
                    placementRate: `${((analyticsData.placementStats.placedStudents / 
                        analyticsData.placementStats.totalStudents) * 100).toFixed(1)}%`,
                    topDepartment: analyticsData.departmentStats[0]?.name || 'N/A',
                    topSkill: analyticsData.skillsStats[0]?.skill || 'N/A'
                }
            };

            await navigator.clipboard.writeText(JSON.stringify(shareableData, null, 2));
            alert('Analytics report data copied to clipboard!');
        } catch (error) {
            console.error('Share failed:', error);
            alert('Failed to share report. Please try again.');
        }
    };

    const calculateGrowth = (current, previous) => {
        if (!previous) return '0';
        return ((current - previous) / previous * 100).toFixed(1);
    };

    const AnalyticsControls = () => (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Range
                    </label>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                    >
                        <option value="yearly">Yearly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comparison Metric
                    </label>
                    <select
                        value={comparisonMetric}
                        onChange={(e) => setComparisonMetric(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                    >
                        <option value="placements">Placements</option>
                        <option value="package">Package</option>
                        <option value="companies">Companies</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={fetchAnalyticsData}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 m-6 bg-red-100 text-red-600 rounded-lg">
                {error}
                <button 
                    onClick={fetchAnalyticsData}
                    className="ml-4 text-sm underline hover:text-red-800"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">University Analytics</h1>
                        <p className="text-gray-600">Comprehensive placement and recruitment insights</p>
                    </div>
                    <div className="flex space-x-4">
                        <button 
                            onClick={fetchAnalyticsData}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>

                <AnalyticsControls />

                <PlacementStats data={analyticsData.placementStats} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <DepartmentAnalytics data={analyticsData.departmentStats} />
                    <SkillsAnalysis data={analyticsData.skillsStats} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <RecruitmentTimeline data={analyticsData.recruitmentTimeline} />
                    <ComparisonChart data={analyticsData.yearComparison} />
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button 
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
                        onClick={exportAnalyticsReport}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Report
                    </button>
                    <button 
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                        onClick={shareAnalytics}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share Analytics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Analytics;