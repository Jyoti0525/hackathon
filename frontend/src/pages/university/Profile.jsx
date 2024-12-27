import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.universityName || "",
    email: user?.email || "",
    address: user?.address || "",
    website: user?.website || "",
    description: user?.description || "",
    contactPerson: user?.contactPerson || "",
    contactEmail: user?.contactEmail || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

 // Profile.jsx
const fetchProfileData = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get('http://localhost:5000/api/university/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.success) {
      setFormData(prev => ({
        ...prev,
        ...response.data.data
      }));
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  } finally {
    setLoading(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.put(
      'http://localhost:5000/api/university/profile',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      setIsEditing(false);
      alert('Profile updated successfully');
      fetchProfileData();
    }
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error);
    alert(error.response?.data?.message || 'Failed to update profile');
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white shadow-lg p-6 rounded-lg mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              University Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your university information below.
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Loading..." : isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 flex items-center">
          {/* Profile Logo */}
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
            <span className="text-gray-500 text-sm">University Logo</span>
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {formData.name || "University Name"}
            </h2>
            <p className="text-sm text-gray-500">
              {formData.description || "Add a short description"}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Profile Completion
          </h3>
          <div className="relative w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-blue-600"
              style={{ width: "70%" }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">70% completed</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  University Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    isEditing ? "" : "bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                />
              </div>
            </div>

            {/* Contact Details */}
            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
              Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    isEditing ? "" : "bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    isEditing ? "" : "bg-gray-100"
                  }`}
                />
              </div>
            </div>

            {/* Additional Information */}
            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  rows={3}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    isEditing ? "" : "bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  rows={4}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    isEditing ? "" : "bg-gray-100"
                  }`}
                />
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;