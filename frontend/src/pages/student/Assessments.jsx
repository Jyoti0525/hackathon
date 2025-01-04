// src/pages/student/Assessments.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentService from '../../services/studentService';

const Assessments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for skill selection
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillLevels, setSkillLevels] = useState([]);

    // Available skills for selection
    const availableSkills = [
        'Python',
        'Java',
        'JavaScript',
        'React',
        'Node.js',
        'SQL',
        'Data Structures',
        'Algorithms'
    ];

    const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

    const handleAddSkill = () => {
        setSelectedSkills([...selectedSkills, '']);
        setSkillLevels([...skillLevels, 'Beginner']); // Default level
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = selectedSkills.filter((_, i) => i !== index);
        const updatedLevels = skillLevels.filter((_, i) => i !== index);
        setSelectedSkills(updatedSkills);
        setSkillLevels(updatedLevels);
    };

    const handleSkillChange = (index, skill) => {
        const updatedSkills = [...selectedSkills];
        updatedSkills[index] = skill;
        setSelectedSkills(updatedSkills);
    };

    const handleLevelChange = (index, level) => {
        const updatedLevels = [...skillLevels];
        updatedLevels[index] = level;
        setSkillLevels(updatedLevels);
    };

    const handleGenerateAssessment = async () => {
        try {
            const assessmentData = {
                skills: selectedSkills,
                levels: skillLevels
            };

            // Navigate to assessment page with selected skills and levels
            navigate('/student/assessment/take', { 
                state: { assessmentData }
            });
        } catch (error) {
            setError('Failed to generate assessment. Please try again.');
        }
    };

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            const response = await StudentService.getAssessments();

            if (response.success) {
                setAssessments(response.data);
                setError(null);
            } else {
                throw new Error(response.message || 'Failed to fetch assessments');
            }
        } catch (error) {
            console.error('Error fetching assessments:', error);
            setError('Unable to load assessments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Assessments</h1>
                <p className="text-gray-600 mt-1">Generate new assessments and view your completed ones</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg flex justify-between items-center">
                    <span>{error}</span>
                    <button 
                        onClick={fetchAssessments}
                        className="text-sm underline hover:text-red-800"
                    >
                        Try Again
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Generate New Assessment</h2>

                {/* Skills Selection Section */}
                <div className="space-y-4">
                    {selectedSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <select
                                value={skill}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                className="flex-1 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a skill</option>
                                {availableSkills.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            <select
                                value={skillLevels[index]}
                                onChange={(e) => handleLevelChange(index, e.target.value)}
                                className="w-48 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                            >
                                {difficultyLevels.map((level) => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>

                            <button
                                onClick={() => handleRemoveSkill(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={handleAddSkill}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        + Add Skill
                    </button>
                </div>

                <button
                    onClick={handleGenerateAssessment}
                    disabled={selectedSkills.length === 0 || selectedSkills.some(skill => !skill)}
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Generate Assessment
                </button>
            </div>

            {/* Completed Assessments Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Completed Assessments</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {assessments.length} Completed
                    </span>
                </div>

                <div className="bg-white rounded-lg shadow">
                    {assessments.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            No completed assessments yet
                        </p>
                    ) : (
                        <div className="divide-y">
                            {assessments.map((assessment) => (
                                <div key={assessment._id} className="p-4"> {/* Updated card */}
                                    <h3 className="text-lg font-semibold">{assessment.title}</h3>
                                    <p>{assessment.topic}</p>
                                    <p>Score: {assessment.score}/{assessment.totalMarks}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Assessments;
