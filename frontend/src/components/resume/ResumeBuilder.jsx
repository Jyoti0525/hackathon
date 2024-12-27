import React, { useState, useEffect } from 'react';
import { FileText, Save, Wand2, PlusCircle, TrashIcon } from 'lucide-react';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchUserResume();
  }, []);

  const fetchUserResume = async () => {
    try {
      const response = await fetch('/api/resume');
      const data = await response.json();
      if (data.success) {
        setResumeData(data.resume);
      }
    } catch (err) {
      setError('Failed to fetch resume data');
    }
  };

  const handleInputChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (section, index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayField = (section) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], getEmptyObject(section)]
    }));
  };

  const removeArrayField = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const optimizeResume = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const response = await fetch('/api/resume/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      });
      const data = await response.json();
      if (data.success) {
        setResumeData(data.optimizedResume);
        setMessage('Resume optimized successfully');
      }
    } catch (err) {
      setError('Failed to optimize resume');
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const response = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Resume saved successfully');
      }
    } catch (err) {
      setError('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  const getEmptyObject = (section) => {
    switch (section) {
      case 'education':
        return { institution: '', degree: '', field: '', year: '' };
      case 'experience':
        return { company: '', position: '', duration: '', description: '' };
      case 'projects':
        return { name: '', description: '', technologies: '', link: '' };
      default:
        return {};
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Resume Builder
          </h2>
          <div className="flex gap-2">
            <button
              onClick={optimizeResume}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Optimize
            </button>
            <button
              onClick={saveResume}
              disabled={loading}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {message}
          </div>
        )}

        {/* Personal Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(resumeData.personalInfo).map(([field, value]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={value}
                  onChange={(e) => handleInputChange('personalInfo', field, e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Education</h3>
            <button
              onClick={() => addArrayField('education')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Education
            </button>
          </div>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => handleArrayFieldChange('education', index, 'field', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => handleArrayFieldChange('education', index, 'year', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <button
                onClick={() => removeArrayField('education', index)}
                className="mt-2 text-red-600 hover:text-red-700 flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Experience */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Experience</h3>
            <button
              onClick={() => addArrayField('experience')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Experience
            </button>
          </div>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => handleArrayFieldChange('experience', index, 'position', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => handleArrayFieldChange('experience', index, 'duration', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                  />
                </div>
              </div>
              <button
                onClick={() => removeArrayField('experience', index)}
                className="mt-2 text-red-600 hover:text-red-700 flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Projects</h3>
            <button
              onClick={() => addArrayField('projects')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Project
            </button>
          </div>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => handleArrayFieldChange('projects', index, 'name', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                  <input
                    type="text"
                    value={project.link}
                    onChange={(e) => handleArrayFieldChange('projects', index, 'link', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <button
                onClick={() => removeArrayField('projects', index)}
                className="mt-2 text-red-600 hover:text-red-700 flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Remove
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ResumeBuilder;