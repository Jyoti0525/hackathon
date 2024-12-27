// frontend/src/services/universityService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/university';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // 5 seconds timeout
});

// Add request interceptor to handle auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    throw error.response?.data || {
      success: false,
      message: 'Network error occurred'
    };
  }
);

const UniversityService = {
  getDashboardStats: async () => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await axios.get(`${BASE_URL}/dashboard-stats`);
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },


  updateDashboardStats: async (stats) => {
    return await axiosInstance.put('/dashboard-stats', stats);
  },

  getDriveDetails: async (driveId) => {
    return await axiosInstance.get(`/placement-drive/${driveId}`);
  },

  updateDriveStatus: async (driveId, status) => {
    return await axiosInstance.patch(`/placement-drive/${driveId}/status`, { status });
  },

  // Test connection method
  testConnection: async () => {
    try {
      const response = await axiosInstance.get('/test');
      console.log('Connection test response:', response);
      return response;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }
};

// Add error handler to catch any unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
});

export default UniversityService;