import React, { useState } from 'react';
import Education from '../../components/resume/sections/Education';
import Experience from '../../components/resume/sections/Experience';
import PersonalInfo from '../../components/resume/sections/PersonalInfo';
import Preview from '../../components/resume/sections/Preview';
import Projects from '../../components/resume/sections/Projects';
import Skills from '../../components/resume/sections/Skills';
import AIResumeEnhancer from '../../components/resume/AIResumeEnhancer';
import ResumeAnalysis from '../../components/resume/ResumeAnalysis';
import ResumeBuilder from '../../components/resume/ResumeBuilder';

const Resume = () => {
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    education: [],
    experience: [],
    projects: [],
    skills: []
  });

  const handleUpdateData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'personalInfo':
        return <PersonalInfo data={resumeData.personalInfo} onUpdate={data => handleUpdateData('personalInfo', data)} />;
      case 'education':
        return <Education data={resumeData.education} onUpdate={data => handleUpdateData('education', data)} />;
      case 'experience':
        return <Experience data={resumeData.experience} onUpdate={data => handleUpdateData('experience', data)} />;
      case 'projects':
        return <Projects data={resumeData.projects} onUpdate={data => handleUpdateData('projects', data)} />;
      case 'skills':
        return <Skills data={resumeData.skills} onUpdate={data => handleUpdateData('skills', data)} />;
      case 'preview':
        return <Preview resumeData={resumeData} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* Left Side - Navigation */}
        <div className="w-64">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('personalInfo')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeSection === 'personalInfo' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveSection('education')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeSection === 'education' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveSection('experience')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeSection === 'experience' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => setActiveSection('projects')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeSection === 'projects' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveSection('skills')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeSection === 'skills' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveSection('preview')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeSection === 'preview' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                Preview
              </button>
            </nav>

            <div className="mt-6 pt-6 border-t">
              <ResumeAnalysis resumeData={resumeData} />
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {renderSection()}
        </div>
      </div>

      {/* AI Enhancement */}
      <div className="mt-6">
        <AIResumeEnhancer resumeData={resumeData} onUpdate={setResumeData} />
      </div>
    </div>
  );
};

export default Resume;