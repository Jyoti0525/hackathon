// frontend/src/services/studentService.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/student';

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
        if (!token) {
            throw new Error('Authentication required');
        }
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const StudentService = {
    // Profile Management
    updateProfile: async (profileData) => {
        try {
            const response = await axiosInstance.put('/profile/update', profileData);
            return response.data;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    },

    // Skills Management
    addSkill: async (skillData) => {
        try {
            const response = await axiosInstance.post('/skills/add', skillData);
            return response.data;
        } catch (error) {
            console.error('Skill addition error:', error);
            throw error;
        }
    },

    updateSkill: async (skillId, skillData) => {
        try {
            const response = await axiosInstance.put(`/skills/${skillId}`, skillData);
            return response.data;
        } catch (error) {
            console.error('Skill update error:', error);
            throw error;
        }
    },

    // Application Management
    submitApplication: async (applicationData) => {
        try {
            const response = await axiosInstance.post('/applications/submit', applicationData);
            return response.data;
        } catch (error) {
            console.error('Application submission error:', error);
            throw error;
        }
    },

    getApplications: async () => {
        try {
            const response = await axiosInstance.get('/applications');
            return response.data;
        } catch (error) {
            console.error('Applications fetch error:', error);
            throw error;
        }
    },

    // Interview Management
    scheduleInterview: async (interviewData) => {
        try {
            const response = await axiosInstance.post('/interviews/schedule', interviewData);
            return response.data;
        } catch (error) {
            console.error('Interview scheduling error:', error);
            throw error;
        }
    },

    // Dashboard Data
    getDashboardStats: async () => {
        try {
            const response = await axiosInstance.get('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            throw error;
        }
    },
    getAssessments: async () => {
        try {
            const response = await axiosInstance.get('/assessments');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch assessments:', error);
            throw error;
        }
    },

    startAssessment: async (assessmentId) => {
        try {
            const response = await axiosInstance.post(`/assessments/${assessmentId}/start`);
            return response.data;
        } catch (error) {
            console.error('Failed to start assessment:', error);
            throw error;
        }
    },

    submitAssessment: async (assessmentId, answers) => {
        try {
            const response = await axiosInstance.post(`/assessments/${assessmentId}/submit`, answers);
            return response.data;
        } catch (error) {
            console.error('Failed to submit assessment:', error);
            throw error;
        }
    }
};

export default StudentService;