// src/pages/university/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.universityName || "",
    email: user?.email || "",
    address: user?.address || "",
    website: user?.website || "",
    description: user?.description || "",
    contactPerson: user?.contactPerson || "",
    contactEmail: user?.contactEmail || "",
    phone: user?.phone || "",
    logo: user?.logo || "",
    establishedYear: user?.establishedYear || "",
    accreditations: user?.accreditations || [],
    departments: user?.departments || [],
    facilities: user?.facilities || [],
    achievements: user?.achievements || [],
    socialMedia: {
      linkedin: user?.socialMedia?.linkedin || "",
      twitter: user?.socialMedia?.twitter || "",
      facebook: user?.socialMedia?.facebook || ""
    }
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    const completion = calculateProfileCompletion(formData);
    setProfileCompletion(completion);
  }, [formData]);

  // In Profile.jsx, update the fetchProfileData function:
// Profile.jsx - Updated fetchProfileData function
const fetchProfileData = async () => {
  try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/university/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
          const profileData = response.data.data;
          setFormData({
              name: profileData.universityName || '',
              address: profileData.location || '',
              website: profileData.website || '',
              email: profileData.contactEmail || '',
              phone: profileData.contactPhone || '',
              description: profileData.description || '',
              establishedYear: profileData.establishedYear || '',
              departments: profileData.departments || [],
              accreditations: profileData.accreditations || []
          });
      }
  } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
  } finally {
      setLoading(false);
  }
};
  const calculateProfileCompletion = (data) => {
    const requiredFields = ['name', 'email', 'phone', 'address', 'website'];
    const optionalFields = ['description', 'contactPerson', 'logo', 'establishedYear', 'departments', 'facilities'];
    
    let completed = 0;
    let total = (requiredFields.length * 2) + optionalFields.length; // Required fields count double

    requiredFields.forEach(field => {
      if (data[field] && data[field].toString().trim() !== '') {
        completed += 2;
      }
    });

    optionalFields.forEach(field => {
      if (data[field]) {
        if (Array.isArray(data[field])) {
          if (data[field].length > 0) completed += 1;
        } else if (data[field].toString().trim() !== '') {
          completed += 1;
        }
      }
    });

    return Math.round((completed / total) * 100);
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({...prev, logo: 'File size should not exceed 5MB'}));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({...prev, logo: 'Please upload an image file'}));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setLogoFile(file);
      setErrors(prev => ({...prev, logo: null}));
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return formData.logo;

    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/university/upload-logo',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.logoUrl;
    } catch (error) {
      console.error('Logo upload error:', error);
      throw new Error('Failed to upload logo');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'University name is required';
    if (!formData.address && !formData.location) newErrors.location = 'Location is required';
    if (!formData.website) newErrors.website = 'Website is required';
    if (!formData.phone) newErrors.phone = 'Contact phone is required';
    if (!formData.email && !formData.contactEmail) newErrors.contactEmail = 'Contact email is required';

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
        newErrors.website = 'Website must start with http:// or https://';
    }

    if (formData.establishedYear) {
        const year = parseInt(formData.establishedYear);
        if (isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
            newErrors.establishedYear = 'Please enter a valid year';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  // In Profile.jsx, update the handleSubmit function:

  // Profile.jsx - Updated handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
      setLoading(true);

      // Ensure data matches the backend model structure exactly
      const profileData = {
          universityName: formData.name,
          location: formData.address,
          website: formData.website,
          contactEmail: formData.email,
          contactPhone: formData.phone,
          description: formData.description,
          establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : undefined,
          departments: formData.departments || [],
          accreditations: formData.accreditations || []
      };

      const response = await axios.put(
          'http://localhost:8000/api/university/profile',
          profileData,
          {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          }
      );

      if (response.data.success) {
          setIsEditing(false);
          // Update the form with the returned data to ensure synchronization
          const updatedData = response.data.data;
          setFormData({
              name: updatedData.universityName,
              address: updatedData.location,
              website: updatedData.website,
              email: updatedData.contactEmail,
              phone: updatedData.contactPhone,
              description: updatedData.description,
              establishedYear: updatedData.establishedYear,
              departments: updatedData.departments,
              accreditations: updatedData.accreditations
          });
          alert('Profile updated successfully');
      }
  } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      alert(errorMessage);
      console.error('Profile update error:', error.response?.data);
  } finally {
      setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">University Profile</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your university information and settings</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">Profile Completion</h3>
            <span className="text-sm font-medium text-gray-600">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo and Basic Info Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-8">
              {/* Logo Upload */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                    {(logoPreview || formData.logo) ? (
                      <img
                        src={logoPreview || formData.logo}
                        alt="University logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No Logo</span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className="mt-4">
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Change Logo
                        </span>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="sr-only"
                        />
                      </label>
                      {errors.logo && (
                        <p className="mt-2 text-sm text-red-600">{errors.logo}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="flex-grow space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">University Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Established Year</label>
                    <input
                      type="number"
                      name="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {errors.establishedYear && (
                      <p className="mt-2 text-sm text-red-600">{errors.establishedYear}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {errors.website && <p className="mt-2 text-sm text-red-600">{errors.website}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  name="socialMedia.linkedin"
                  value={formData.socialMedia.linkedin}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter</label>
                <input
                  type="url"
                  name="socialMedia.twitter"
                  value={formData.socialMedia.twitter}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                <input
                  type="url"
                  name="socialMedia.facebook"
                  value={formData.socialMedia.facebook}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;