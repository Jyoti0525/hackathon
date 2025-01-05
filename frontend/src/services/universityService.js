// frontend/src/services/universityService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/university';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    };
    
    console.error('API Error:', errorDetails);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(new Error('Authentication required'));
    }
    
    return Promise.reject(error.response?.data || {
      success: false,
      message: 'An unexpected error occurred'
    });
  }
);

const UniversityService = {
  // Existing dashboard methods
  async getDashboardStats() {
    try {
      const response = await axiosInstance.get('/dashboard-stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  async getAvailableData() {
    try {
      const response = await axiosInstance.get('/get-available-data');
      return response;
    } catch (error) {
      console.error('Failed to fetch available data:', error);
      throw error;
    }
  },

  async updateDashboardStats(stats) {
    try {
      const response = await axiosInstance.put('/dashboard-stats', stats);
      return response;
    } catch (error) {
      console.error('Failed to update dashboard stats:', error);
      throw error;
    }
  },

  // Student management methods
  async getStudents() {
    try {
      const response = await axiosInstance.get('/get-available-data');  // Using your existing endpoint
      return response;
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  },

  async updateStudent(studentId, updatedData) {
    try {
        // Log the complete URL for debugging
        console.log('Update URL:', `${BASE_URL}/update-student/${studentId}`);
        console.log('Update Data:', updatedData);

        const response = await axios({
            method: 'put',
            url: `${BASE_URL}/update-student/${studentId}`,
            data: updatedData,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Update Response:', response);
        return response.data;
    } catch (error) {
        console.error('Update Request Details:', {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data
        });
        throw error;
    }
},
  
  getStudentDetails: async (studentId) => {
    try {
      // Using get-available-data endpoint since that's what's currently working
      const response = await axiosInstance.get('/get-available-data');
      if (response.success) {
        // Find the specific student from the returned data
        const student = response.data.students.find(s => s.id === studentId);
        if (student) {
          return {
            success: true,
            data: student
          };
        } else {
          throw new Error('Student not found');
        }
      }
      throw new Error('Failed to fetch student data');
    } catch (error) {
      console.error(`Failed to fetch details for student ${studentId}:`, error);
      throw error;
    }
  },

  async deleteStudent(studentId) {
    try {
      const response = await axiosInstance.delete(`/students/${studentId}`);
      return response;
    } catch (error) {
      console.error(`Failed to delete student ${studentId}:`, error);
      throw error;
    }
  },

  async uploadStudentsBatch(formData) {
    try {
      const response = await axiosInstance.post('/upload/students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Failed to upload students batch:', error);
      throw error;
    }
  },

  // Placement drive methods
  async getDriveDetails(driveId) {
    try {
      const response = await axiosInstance.get(`/placement-drive/${driveId}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch drive details for ID ${driveId}:`, error);
      throw error;
    }
  },

  async updateDriveStatus(driveId, status) {
    try {
      const response = await axiosInstance.patch(`/placement-drive/${driveId}/status`, { status });
      return response;
    } catch (error) {
      console.error(`Failed to update drive status for ID ${driveId}:`, error);
      throw error;
    }
  },
// src/services/universityService.js
// Add these analytics methods to your existing service

async getAnalyticsData() {
  try {
      // Fetch all necessary data for analytics
      const [placements, students, companies] = await Promise.all([
          this.getAvailableData(), // Your existing endpoint
          axios.get(`${BASE_URL}/students`),
          axios.get(`${BASE_URL}/companies`)
      ]);

      // Calculate analytics from real data
      return this.processAnalyticsData(placements.data, students.data, companies.data);
  } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      throw error;
  }
},

processAnalyticsData(placements, students, companies) {
  const placementData = placements.placements || [];
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  // Calculate department-wise stats
  const departmentStats = this.calculateDepartmentStats(placementData);

  // Calculate skills analysis
  const skillsStats = this.analyzeSkills(placementData);

  // Calculate placement stats
  const placementStats = {
      totalStudents: students.length,
      averagePackage: this.calculateAveragePackage(placementData),
      companiesVisited: companies.length,
      highestPackage: this.calculateHighestPackage(placementData)
  };

  // Calculate recruitment timeline
  const recruitmentTimeline = this.calculateRecruitmentTimeline(placementData);

  // Year over year comparison
  const yearComparison = {
      currentYear: this.getYearStats(placementData, currentYear),
      previousYear: this.getYearStats(placementData, lastYear)
  };

  return {
      departmentStats,
      skillsStats,
      placementStats,
      recruitmentTimeline,
      yearComparison
  };
},

calculateDepartmentStats(placements) {
  const departmentMap = new Map();
  
  placements.forEach(placement => {
      const dept = placement.student?.department || 'Unknown';
      if (!departmentMap.has(dept)) {
          departmentMap.set(dept, {
              placed: 0,
              totalPackage: 0
          });
      }
      
      const stats = departmentMap.get(dept);
      stats.placed += 1;
      stats.totalPackage += placement.package || 0;
  });

  return Array.from(departmentMap.entries()).map(([dept, stats]) => ({
      name: dept,
      placedStudents: stats.placed,
      averagePackage: stats.placed > 0 ? (stats.totalPackage / stats.placed).toFixed(2) : 0
  }));
},

analyzeSkills(placements) {
  // Extract and analyze skills from placement data
  const skillsMap = new Map();
  
  placements.forEach(placement => {
      const skills = placement.role?.requiredSkills || [];
      skills.forEach(skill => {
          skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
      });
  });

  return Array.from(skillsMap.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);
},

calculateRecruitmentTimeline(placements) {
  // Group placements by month
  const monthlyData = new Map();
  const currentYear = new Date().getFullYear();
  
  placements.forEach(placement => {
      const date = new Date(placement.date);
      if (date.getFullYear() === currentYear) {
          const month = date.getMonth();
          if (!monthlyData.has(month)) {
              monthlyData.set(month, {
                  placements: 0,
                  offers: 0
              });
          }
          
          const data = monthlyData.get(month);
          data.placements += 1;
          data.offers += 1; // Assuming each placement represents an offer
      }
  });

  return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
          month: new Date(currentYear, month).toLocaleString('default', { month: 'short' }),
          placements: data.placements,
          offers: data.offers
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
},

  async getStudentStats() {
    try {
      const response = await axiosInstance.get('/students/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch student statistics:', error);
      throw error;
    }
  },

  async testConnection() {
    try {
      const response = await axiosInstance.get('/test');
      console.log('Connection test successful:', response);
      return response;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

export default UniversityService;