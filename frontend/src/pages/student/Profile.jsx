import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: ''
    },
    education: {
      university: '',
      degree: '',
      major: '',
      graduationYear: '',
      cgpa: ''
    },
    skills: [],
    certifications: [],
    projects: [],
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
        const response = await fetch('/api/student/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            // Transform the data to match your form structure
            setFormData({
                name: data.name || '',
                email: data.email || '',
                college: data.college || '',
                degree: data.degree || '',
                graduationYear: data.graduationYear || '',
                skills: data.skills || [],
                bio: data.bio || '',
                linkedin: data.linkedin || '',
                github: data.github || '',
                portfolio: data.portfolio || ''
            });
        } else {
            setError(data.message);
        }
    } catch (err) {
        setError('Failed to fetch profile data');
    } finally {
        setLoading(false);
    }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setIsEditing(false);
      fetchProfileData();
    } catch (err) {
      setError(err.message);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg ${
            isEditing 
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.personalInfo.firstName}
                onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.personalInfo.lastName}
                onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.personalInfo.email}
                disabled={true}
                className="w-full rounded-md border border-gray-300 p-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.personalInfo.dateOfBirth}
                onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={formData.personalInfo.address}
                onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input
                type="text"
                value={formData.education.university}
                onChange={(e) => handleChange('education', 'university', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input
                type="text"
                value={formData.education.degree}
                onChange={(e) => handleChange('education', 'degree', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
              <input
                type="text"
                value={formData.education.major}
                onChange={(e) => handleChange('education', 'major', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <input
                type="number"
                value={formData.education.graduationYear}
                onChange={(e) => handleChange('education', 'graduationYear', e.target.value)}
                disabled={!isEditing}
                min={2000}
                max={2030}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.education.cgpa}
                onChange={(e) => handleChange('education', 'cgpa', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="space-y-4">
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...formData.skills];
                    newSkills[index].name = e.target.value;
                    handleChange('skills', '', newSkills);
                  }}
                  disabled={!isEditing}
                  className="flex-1 rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Skill name"
                />
                <select
                  value={skill.level}
                  onChange={(e) => {
                    const newSkills = [...formData.skills];
                    newSkills[index].level = e.target.value;
                    handleChange('skills', '', newSkills);
                  }}
                  disabled={!isEditing}
                  className="rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = formData.skills.filter((_, i) => i !== index);
                      handleChange('skills', '', newSkills);
                    }}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  const newSkills = [...formData.skills, { name: '', level: 'Beginner' }];
                  handleChange('skills', '', newSkills);
                }}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md"
              >
                + Add Skill
              </button>
            )}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleChange('socialLinks', 'linkedin', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
              <input
                type="url"
                value={formData.socialLinks.github}
                onChange={(e) => handleChange('socialLinks', 'github', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
              <input
                type="url"
                value={formData.socialLinks.portfolio}
                onChange={(e) => handleChange('socialLinks', 'portfolio', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      )}
    </form>
  </div>
);
};

export default Profile;