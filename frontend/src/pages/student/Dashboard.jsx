// src/pages/student/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentService from '../../services/studentService';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        profile: {
            name: '',
            department: '',
            year: '',
            cgpa: 0
        },
        applications: [],
        skills: [],
        interviews: [],
        assessments: {
            completed: [],
            upcoming: []
        },
        recentActivities: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await StudentService.getDashboardStats();
            
            if (response.success) {
                setDashboardData(response.data);
                setError(null);
            } else {
                throw new Error(response.message || 'Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Unable to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {dashboardData.profile.name || user?.name}</h1>
                        <p className="text-gray-600 mt-1">
                            {dashboardData.profile.department} • Year {dashboardData.profile.year}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Current CGPA</div>
                        <div className="text-2xl font-bold text-blue-600">{dashboardData.profile.cgpa.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <button 
                    onClick={() => navigate('/student/assessment/generate')}
                    className="bg-blue-50 hover:bg-blue-100 p-4 rounded-xl transition-all flex flex-col items-center justify-center"
                >
                    <span className="text-blue-600 font-semibold">Take Assessment</span>
                    <span className="text-sm text-gray-600 mt-1">Practice your skills</span>
                </button>
                <button 
                    onClick={() => navigate('/student/jobs')}
                    className="bg-green-50 hover:bg-green-100 p-4 rounded-xl transition-all flex flex-col items-center justify-center"
                >
                    <span className="text-green-600 font-semibold">Browse Jobs</span>
                    <span className="text-sm text-gray-600 mt-1">Find opportunities</span>
                </button>
                <button 
                    onClick={() => navigate('/student/skills')}
                    className="bg-purple-50 hover:bg-purple-100 p-4 rounded-xl transition-all flex flex-col items-center justify-center"
                >
                    <span className="text-purple-600 font-semibold">Skill Development</span>
                    <span className="text-sm text-gray-600 mt-1">Enhance your profile</span>
                </button>
                <button 
                    onClick={() => navigate('/student/interview-prep')}
                    className="bg-orange-50 hover:bg-orange-100 p-4 rounded-xl transition-all flex flex-col items-center justify-center"
                >
                    <span className="text-orange-600 font-semibold">Interview Prep</span>
                    <span className="text-sm text-gray-600 mt-1">Practice interviews</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Recent Applications</h2>
                        <button 
                            onClick={() => navigate('/student/applications')}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {dashboardData.applications.slice(0, 3).map((application, index) => (
                            <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-medium">{application.companyName}</h3>
                                    <p className="text-sm text-gray-600">{application.position}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    application.status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
                                    application.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                                    application.status === 'selected' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {application.status.replace('_', ' ').charAt(0).toUpperCase() + 
                                     application.status.slice(1).replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                        {dashboardData.applications.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No recent applications</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Upcoming Interviews</h2>
                        <button 
                            onClick={() => navigate('/student/interviews')}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {dashboardData.interviews.slice(0, 3).map((interview, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{interview.companyName}</h3>
                                        <p className="text-sm text-gray-600">{interview.position}</p>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(interview.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => navigate('/student/interview-prep')}
                                    className="mt-2 text-sm text-blue-600 hover:underline"
                                >
                                    Prepare Now
                                </button>
                            </div>
                        ))}
                        {dashboardData.interviews.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No upcoming interviews</p>
                        )}
                    </div>
                </div>

                {/* Skills Progress */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Skills Progress</h2>
                        <button 
                            onClick={() => navigate('/student/skills')}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {dashboardData.skills.slice(0, 5).map((skill, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">{skill.name}</span>
                                    <span className="text-sm text-gray-600">{skill.level}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{ 
                                            width: `${
                                                skill.level === 'Beginner' ? '33' :
                                                skill.level === 'Intermediate' ? '66' :
                                                '100'}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {dashboardData.skills.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No skills added yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;