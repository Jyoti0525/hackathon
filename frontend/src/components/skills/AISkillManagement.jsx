import React, { useState, useEffect } from 'react';
import { PlusCircle, Award, TrendingUp } from 'lucide-react';

const AISkillManagement = () => {
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserSkills();
    fetchSkillRecommendations();
  }, []);

  const fetchUserSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/skills');
      const data = await response.json();
      setSkills(data);
    } catch (err) {
      setError('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillRecommendations = async () => {
    try {
      const response = await fetch('/api/skills/recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  const initiateSkillAssessment = async (skillId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/skills/assess/${skillId}`, {
        method: 'POST'
      });
      const data = await response.json();
      setSelectedSkill(data);
      await fetchUserSkills();
    } catch (err) {
      setError('Failed to initiate assessment');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      beginner: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-green-100 text-green-800',
      advanced: 'bg-purple-100 text-purple-800',
      expert: 'bg-orange-100 text-orange-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Award className="mr-2 h-6 w-6" />
            My Skills
          </h2>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Skill
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Skills List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            skills.map((skill) => (
              <div key={skill._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{skill.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>
                  <button
                    onClick={() => initiateSkillAssessment(skill._id)}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                  >
                    <Award className="mr-2 h-4 w-4 inline" />
                    Assess Skill
                  </button>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {skill.progress?.level || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                    <div 
                      className="bg-blue-600 transition-all duration-300"
                      style={{ width: `${skill.progress?.level || 0}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Last assessed: {new Date(skill.progress?.lastAssessed).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* AI Recommendations */}
        <div className="mt-8">
          <h3 className="text-xl font-bold flex items-center mb-4">
            <TrendingUp className="mr-2 h-5 w-5" />
            Recommended Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold">{rec.skillName}</h4>
                <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {rec.industryDemand}% Industry Demand
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISkillManagement;