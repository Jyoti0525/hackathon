// src/pages/shared/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Settings = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [accountSettings, setAccountSettings] = useState({
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        systemNotifications: true,
        marketingEmails: false
    });
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'public',
        dataSharing: true,
        activityTracking: true
    });
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    // src/pages/shared/Settings.jsx
const fetchSettings = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
            setError('Authentication required. Please log in again.');
            return;
        }

        const response = await axios.get('http://localhost:5000/api/user/settings', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            const settings = response.data.data;
            setNotificationSettings(settings.notifications || notificationSettings);
            setPrivacySettings(settings.privacy || privacySettings);
        }
    } catch (error) {
        if (error.response?.status === 401) {
            setError('Session expired. Please log in again.');
            // Optionally redirect to login
            // navigate('/login');
        } else {
            setError('Failed to load settings. Please try again.');
        }
        console.error('Error fetching settings:', error);
    } finally {
        setLoading(false);
    }
};
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (accountSettings.newPassword !== accountSettings.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:5000/api/settings/password',
                {
                    currentPassword: accountSettings.currentPassword,
                    newPassword: accountSettings.newPassword
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setSuccess('Password updated successfully');
                setAccountSettings(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationSettingsChange = async (e) => {
        const { name, checked } = e.target;
        try {
            setLoading(true);
            const updatedSettings = {
                ...notificationSettings,
                [name]: checked
            };

            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:5000/api/settings/notifications',
                updatedSettings,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setNotificationSettings(updatedSettings);
                setSuccess('Notification settings updated');
            }
        } catch (error) {
            setError('Failed to update notification settings');
        } finally {
            setLoading(false);
        }
    };

    const handlePrivacySettingsChange = async (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        try {
            setLoading(true);
            const updatedSettings = {
                ...privacySettings,
                [name]: newValue
            };

            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:5000/api/settings/privacy',
                updatedSettings,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setPrivacySettings(updatedSettings);
                setSuccess('Privacy settings updated');
            }
        } catch (error) {
            setError('Failed to update privacy settings');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.delete(
                    'http://localhost:5000/api/settings/account',
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                if (response.data.success) {
                    await logout();
                    window.location.href = '/login';
                }
            } catch (error) {
                setError('Failed to delete account');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage your account settings and preferences</p>
                </div>

                {/* Settings Navigation and Content */}
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {['account', 'notifications', 'privacy'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-6 text-sm font-medium ${
                                        activeTab === tab
                                            ? 'border-b-2 border-blue-500 text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-md">
                                {success}
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={accountSettings.currentPassword}
                                            onChange={(e) => setAccountSettings(prev => ({
                                                ...prev,
                                                currentPassword: e.target.value
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={accountSettings.newPassword}
                                            onChange={(e) => setAccountSettings(prev => ({
                                                ...prev,
                                                newPassword: e.target.value
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={accountSettings.confirmPassword}
                                            onChange={(e) => setAccountSettings(prev => ({
                                                ...prev,
                                                confirmPassword: e.target.value
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>

                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                                <div className="space-y-4">
                                    {Object.entries(notificationSettings).map(([key, value]) => (
                                        <div key={key} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="checkbox"
                                                    name={key}
                                                    checked={value}
                                                    onChange={handleNotificationSettingsChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label className="font-medium text-gray-700">
                                                    {key.split(/(?=[A-Z])/).join(' ')}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Profile Visibility
                                        </label>
                                        <select
                                            name="profileVisibility"
                                            value={privacySettings.profileVisibility}
                                            onChange={handlePrivacySettingsChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                            <option value="connections">Connections Only</option>
                                        </select>
                                    </div>
                                    {Object.entries(privacySettings)
                                        .filter(([key]) => key !== 'profileVisibility')
                                        .map(([key, value]) => (
                                            <div key={key} className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        type="checkbox"
                                                        name={key}
                                                        checked={value}
                                                        onChange={handlePrivacySettingsChange}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label className="font-medium text-gray-700">
                                                        {key.split(/(?=[A-Z])/).join(' ')}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;