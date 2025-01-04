// src/pages/student/ProfileManager.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StudentService from '../../services/studentService';

const ProfileManager = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        personalInfo: {
            name: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            address: '',
            gender: ''
        },
        academicInfo: {
            department: '',
            year: '',
            semester: '',
            rollNumber: '',
            cgpa: ''
        },
        educationalBackground: {
            highSchool: {
                name: '',
                board: '',
                percentage: '',
                yearOfCompletion: ''
            },
            intermediary: {
                name: '',
                board: '',
                percentage: '',
                yearOfCompletion: ''
            }
        },
        socialLinks: {
            linkedin: '',
            github: '',
            portfolio: ''
        }
    });

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await StudentService.getProfile();
            
            if (response.success) {
                setFormData(response.data);
                setError(null);
            } else {
                throw new Error(response.message || 'Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Unable to load profile data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await StudentService.updateProfile(formData);
            
            if (response.success) {
                setSuccessMessage('Profile updated successfully');
                setIsEditing(false);
                fetchProfileData(); // Refresh data
            } else {
                throw new Error(response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        // Add your validation logic here
        return true;
    };

    if (loading && !formData.personalInfo.name) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your personal and academic information</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 rounded-lg ${
                        isEditing 
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.personalInfo.name}
                                onChange={(e) => handleChange('personalInfo', 'name', e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.personalInfo.email}
                                onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                                disabled={true}
                                className="w-full rounded-lg border border-gray-300 p-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={formData.personalInfo.phone}
                                onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                value={formData.personalInfo.dateOfBirth}
                                onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                value={formData.personalInfo.address}
                                onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                                disabled={!isEditing}
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Information Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input
                                type="text"
                                value={formData.academicInfo.department}
                                onChange={(e) => handleChange('academicInfo', 'department', e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                                type="number"
                                value={formData.academicInfo.year}
                                onChange={(e) => handleChange('academicInfo', 'year', e.target.value)}
                                disabled={!isEditing}
                                min="1"
                                max="4"
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                            <input
                                type="number"
                                value={formData.academicInfo.cgpa}
                                onChange={(e) => handleChange('academicInfo', 'cgpa', e.target.value)}
                                disabled={!isEditing}
                                step="0.01"
                                min="0"
                                max="10"
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                            <input
                                type="text"
                                value={formData.academicInfo.rollNumber}
                                onChange={(e) => handleChange('academicInfo', 'rollNumber', e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Social Links</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                            <input
                                type="url"
                                value={formData.socialLinks.linkedin}
                                onChange={(e) => handleChange('socialLinks', 'linkedin', e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
                            <input
                                type="url"
                                value={formData.socialLinks.github}
                                onChange={(e) => handleChange('socialLinks', 'github', e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                placeholder="https://github.com/yourusername"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Website</label>
                            <input
                                type="url"
                                value={formData.socialLinks.portfolio}
                                onChange={(e) => handleChange('socialLinks', 'portfolio', e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                placeholder="https://yourportfolio.com"
                            />
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !validateForm()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProfileManager;