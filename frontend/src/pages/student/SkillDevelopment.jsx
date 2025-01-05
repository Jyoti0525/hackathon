import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SkillDevelopment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('mySkills');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Define skill levels progression
    const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    // Get next level for a skill
    const getNextLevel = (currentLevel) => {
        const currentIndex = skillLevels.indexOf(currentLevel);
        return currentIndex < skillLevels.length - 1 ? skillLevels[currentIndex + 1] : null;
    };

    const handleUpgradeSkill = async (skill) => {
        const nextLevel = getNextLevel(skill.level);
        
        // If already at maximum level, don't proceed
        if (!nextLevel) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Make API request to generate assessment for skill upgrade
            const response = await fetch('http://localhost:8500/generate-assessment', {
                method: 'POST',
                mode: 'cors', // Enable CORS
                credentials: 'include', // Include credentials if needed
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                },
                body: JSON.stringify({
                     skills: [skill.name],//selectedSkills,
                    levels: [nextLevel]//skillLevels
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to generate assessment');
            }

            if (data.success) {
                // Navigate to assessment page with questions
                // navigate('/student/assessment/take', { 
                //     state: { 
                //         questions: data.questions,
                //         skillUpgrade: {
                //             skill: skill.name,
                //             currentLevel: skill.level,
                //             targetLevel: nextLevel
                //         }
                //     }
                // });
                navigate('/dashboard/student/skills', { 
                  state: { questions: data.questions }
              });
            }
        } catch (error) {
            setError('Failed to generate upgrade assessment. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

  // Sample data - replace with API calls
  const skills = [
    {
      id: 1,
      name: 'React',
      level: 'Intermediate',
      progress: 75,
      certifications: ['Meta React Developer'],
      lastAssessed: '2024-01-10'
    },
    {
      id: 2,
      name: 'Node.js',
      level: 'Beginner',
      progress: 45,
      certifications: [],
      lastAssessed: '2024-01-05'
    }
  ];

  const recommendedSkills = [
    {
      id: 1,
      name: 'TypeScript',
      relevance: 95,
      reason: 'Highly demanded with React',
      demandGrowth: '+45% YoY'
    },
    {
      id: 2,
      name: 'AWS',
      relevance: 88,
      reason: 'Essential for full-stack development',
      demandGrowth: '+30% YoY'
    }
  ];

  const learningPaths = [
    {
      id: 1,
      title: 'Full Stack Development',
      skills: ['React', 'Node.js', 'MongoDB'],
      duration: '3 months',
      progress: 60
    },
    {
      id: 2,
      title: 'Cloud Computing',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      duration: '2 months',
      progress: 25
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Skill Development</h1>
        <p className="text-gray-600">Track and enhance your professional skills</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Total Skills</h3>
          <p className="text-2xl font-bold">{skills.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Average Proficiency</h3>
          <p className="text-2xl font-bold text-green-600">72%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Certifications</h3>
          <p className="text-2xl font-bold text-blue-600">3</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b">
          <nav className="flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('mySkills')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'mySkills'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Skills
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'recommended'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recommended Skills
            </button>
            <button
              onClick={() => setActiveTab('learningPaths')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'learningPaths'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Learning Paths
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'mySkills' && (
            <div className="space-y-6">
              {skills.map(skill => (
                <div key={skill.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      <p className="text-sm text-gray-600">Level: {skill.level}</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" onClick={() => {handleUpgradeSkill(skill)}}>
                      Upgrade Skill
                    </button>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  {skill.certifications.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Certifications: {skill.certifications.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recommended' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedSkills.map(skill => (
                <div key={skill.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {skill.relevance}% Match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{skill.reason}</p>
                  <p className="text-sm text-green-600">Growth: {skill.demandGrowth}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'learningPaths' && (
            <div className="space-y-6">
              {learningPaths.map(path => (
                <div key={path.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{path.title}</h3>
                      <p className="text-sm text-gray-600">Duration: {path.duration}</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Start Path
                    </button>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillDevelopment;

// import React, { useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const SkillDevelopment = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('mySkills');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Define skill levels progression
//     const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

//     // Sample data - replace with API calls
//     const skills = [
//         {
//             id: 1,
//             name: 'React',
//             level: 'Intermediate',
//             progress: 75,
//             certifications: ['Meta React Developer'],
//             lastAssessed: '2024-01-10'
//         },
//         {
//             id: 2,
//             name: 'Node.js',
//             level: 'Beginner',
//             progress: 45,
//             certifications: [],
//             lastAssessed: '2024-01-05'
//         }
//     ];

//     const recommendedSkills = [
//         {
//             id: 1,
//             name: 'TypeScript',
//             relevance: 95,
//             reason: 'Highly demanded with React',
//             demandGrowth: '+45% YoY'
//         },
//         {
//             id: 2,
//             name: 'AWS',
//             relevance: 88,
//             reason: 'Essential for full-stack development',
//             demandGrowth: '+30% YoY'
//         }
//     ];

//     const learningPaths = [
//         {
//             id: 1,
//             title: 'Full Stack Development',
//             skills: ['React', 'Node.js', 'MongoDB'],
//             duration: '3 months',
//             progress: 60
//         },
//         {
//             id: 2,
//             title: 'Cloud Computing',
//             skills: ['AWS', 'Docker', 'Kubernetes'],
//             duration: '2 months',
//             progress: 25
//         }
//     ];

//     // Get next level for a skill
//     const getNextLevel = (currentLevel) => {
//         const currentIndex = skillLevels.indexOf(currentLevel);
//         return currentIndex < skillLevels.length - 1 ? skillLevels[currentIndex + 1] : null;
//     };

//     const handleUpgradeSkill = async (skill) => {
//         const nextLevel = getNextLevel(skill.level);
        
//         if (!nextLevel) return;

//         try {
//             setLoading(true);
//             setError(null);

//             const response = await fetch('http://localhost:8500/generate-assessment', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     skills: [skill.name],
//                     levels: [nextLevel]
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.detail || 'Failed to generate assessment');
//             }

//             if (data.success) {
//               navigate('/dashboard/student/take-assessment', { 
//                 state: { questions: data.questions }
//               });
//             }
//         } catch (error) {
//             setError('Failed to generate upgrade assessment. Please try again.');
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="p-6">
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold">Skill Development</h1>
//                 <p className="text-gray-600">Track and enhance your professional skills</p>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h3 className="text-sm text-gray-600">Total Skills</h3>
//                     <p className="text-2xl font-bold">{skills.length}</p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h3 className="text-sm text-gray-600">Average Proficiency</h3>
//                     <p className="text-2xl font-bold text-green-600">72%</p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h3 className="text-sm text-gray-600">Certifications</h3>
//                     <p className="text-2xl font-bold text-blue-600">3</p>
//                 </div>
//             </div>

//             {/* Tabs */}
//             <div className="bg-white rounded-lg shadow mb-6">
//                 <div className="border-b">
//                     <nav className="flex" aria-label="Tabs">
//                         <button
//                             onClick={() => setActiveTab('mySkills')}
//                             className={`px-4 py-2 text-sm font-medium border-b-2 ${
//                                 activeTab === 'mySkills'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                             }`}
//                         >
//                             My Skills
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('recommended')}
//                             className={`px-4 py-2 text-sm font-medium border-b-2 ${
//                                 activeTab === 'recommended'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                             }`}
//                         >
//                             Recommended Skills
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('learningPaths')}
//                             className={`px-4 py-2 text-sm font-medium border-b-2 ${
//                                 activeTab === 'learningPaths'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                             }`}
//                         >
//                             Learning Paths
//                         </button>
//                     </nav>
//                 </div>

//                 <div className="p-6">
//                     {activeTab === 'mySkills' && (
//                         <div className="space-y-6">
//                             {error && (
//                                 <div className="p-4 bg-red-100 text-red-600 rounded-lg mb-4">
//                                     {error}
//                                 </div>
//                             )}
                            
//                             {skills.map(skill => (
//                                 <div key={skill.id} className="border rounded-lg p-4">
//                                     <div className="flex justify-between items-start mb-4">
//                                         <div>
//                                             <h3 className="font-semibold">{skill.name}</h3>
//                                             <p className="text-sm text-gray-600">Level: {skill.level}</p>
//                                         </div>
//                                         <button 
//                                             onClick={() => handleUpgradeSkill(skill)}
//                                             disabled={!getNextLevel(skill.level) || loading}
//                                             className={`px-3 py-1 rounded-lg text-sm ${
//                                                 getNextLevel(skill.level)
//                                                     ? 'bg-blue-600 text-white hover:bg-blue-700'
//                                                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                             }`}
//                                         >
//                                             {loading ? 'Loading...' : getNextLevel(skill.level) 
//                                                 ? `Upgrade to ${getNextLevel(skill.level)}` 
//                                                 : 'Maximum Level'}
//                                         </button>
//                                     </div>
//                                     <div className="mb-4">
//                                         <div className="flex justify-between text-sm mb-1">
//                                             <span>Progress</span>
//                                             <span>{skill.progress}%</span>
//                                         </div>
//                                         <div className="w-full bg-gray-200 rounded-full h-2">
//                                             <div
//                                                 className="bg-blue-600 h-2 rounded-full"
//                                                 style={{ width: `${skill.progress}%` }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                     {skill.certifications.length > 0 && (
//                                         <div className="text-sm text-gray-600">
//                                             Certifications: {skill.certifications.join(', ')}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {activeTab === 'recommended' && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {recommendedSkills.map(skill => (
//                                 <div key={skill.id} className="border rounded-lg p-4">
//                                     <div className="flex justify-between items-start mb-2">
//                                         <h3 className="font-semibold">{skill.name}</h3>
//                                         <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                                             {skill.relevance}% Match
//                                         </span>
//                                     </div>
//                                     <p className="text-sm text-gray-600 mb-2">{skill.reason}</p>
//                                     <p className="text-sm text-green-600">Growth: {skill.demandGrowth}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {activeTab === 'learningPaths' && (
//                         <div className="space-y-6">
//                             {learningPaths.map(path => (
//                                 <div key={path.id} className="border rounded-lg p-4">
//                                     <div className="flex justify-between items-start mb-4">
//                                         <div>
//                                             <h3 className="font-semibold">{path.title}</h3>
//                                             <p className="text-sm text-gray-600">Duration: {path.duration}</p>
//                                         </div>
//                                         <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
//                                             Start Path
//                                         </button>
//                                     </div>
//                                     <div className="mb-4">
//                                         <div className="flex justify-between text-sm mb-1">
//                                             <span>Progress</span>
//                                             <span>{path.progress}%</span>
//                                         </div>
//                                         <div className="w-full bg-gray-200 rounded-full h-2">
//                                             <div
//                                                 className="bg-blue-600 h-2 rounded-full"
//                                                 style={{ width: `${path.progress}%` }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-wrap gap-2">
//                                         {path.skills.map((skill, index) => (
//                                             <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
//                                                 {skill}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SkillDevelopment;

// src/pages/student/SkillDevelopment.jsx

// import React, { useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const SkillDevelopment = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('mySkills');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Define skill levels progression
//     const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

//     // Sample data - replace with API calls
//     const skills = [
//         {
//             id: 1,
//             name: 'React',
//             level: 'Intermediate',
//             progress: 75,
//             certifications: ['Meta React Developer'],
//             lastAssessed: '2024-01-10'
//         },
//         {
//             id: 2,
//             name: 'Node.js',
//             level: 'Beginner',
//             progress: 45,
//             certifications: [],
//             lastAssessed: '2024-01-05'
//         }
//     ];

//     const recommendedSkills = [
//         {
//             id: 1,
//             name: 'TypeScript',
//             relevance: 95,
//             reason: 'Highly demanded with React',
//             demandGrowth: '+45% YoY'
//         },
//         {
//             id: 2,
//             name: 'AWS',
//             relevance: 88,
//             reason: 'Essential for full-stack development',
//             demandGrowth: '+30% YoY'
//         }
//     ];

//     const learningPaths = [
//         {
//             id: 1,
//             title: 'Full Stack Development',
//             skills: ['React', 'Node.js', 'MongoDB'],
//             duration: '3 months',
//             progress: 60
//         },
//         {
//             id: 2,
//             title: 'Cloud Computing',
//             skills: ['AWS', 'Docker', 'Kubernetes'],
//             duration: '2 months',
//             progress: 25
//         }
//     ];

//     // Get next level for a skill
//     const getNextLevel = (currentLevel) => {
//         const currentIndex = skillLevels.indexOf(currentLevel);
//         return currentIndex < skillLevels.length - 1 ? skillLevels[currentIndex + 1] : null;
//     };

//     const handleUpgradeSkill = async (skill) => {
//       const nextLevel = getNextLevel(skill.level);
      
//       if (!nextLevel) return;
  
//       try {
//           setLoading(true);
//           setError(null);
  
//           const response = await fetch('http://localhost:8500/generate-assessment', {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/json',
//                   'Accept': 'application/json',
//               },
//               body: JSON.stringify({
//                   skills: [skill.name],
//                   levels: [nextLevel]
//               })
//           });
  
//           const data = await response.json();
  
//           if (!response.ok) {
//               throw new Error(data.detail || 'Failed to generate assessment');
//           }
  
//           // Navigate to the assessment page
//           navigate('/dashboard/student/assessment/take', { 
//               state: { 
//                   mode: 'SKILL_UPGRADE',
//                   assessmentData: {
//                       questions: data.questions,
//                       skillInfo: {
//                           name: skill.name,
//                           currentLevel: skill.level,
//                           targetLevel: nextLevel
//                       }
//                   }
//               }
//           });
//       } catch (error) {
//           setError('Failed to generate upgrade assessment. Please try again.');
//           console.error('Error:', error);
//       } finally {
//           setLoading(false);
//       }
//   };

//     return (
//         <div className="p-6">
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold">Skill Development</h1>
//                 <p className="text-gray-600">Track and enhance your professional skills</p>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h3 className="text-sm text-gray-600">Total Skills</h3>
//                     <p className="text-2xl font-bold">{skills.length}</p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h3 className="text-sm text-gray-600">Average Proficiency</h3>
//                     <p className="text-2xl font-bold text-green-600">72%</p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h3 className="text-sm text-gray-600">Certifications</h3>
//                     <p className="text-2xl font-bold text-blue-600">3</p>
//                 </div>
//             </div>

//             {/* Tabs */}
//             <div className="bg-white rounded-lg shadow mb-6">
//                 <div className="border-b">
//                     <nav className="flex" aria-label="Tabs">
//                         <button
//                             onClick={() => setActiveTab('mySkills')}
//                             className={`px-4 py-2 text-sm font-medium border-b-2 ${
//                                 activeTab === 'mySkills'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                             }`}
//                         >
//                             My Skills
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('recommended')}
//                             className={`px-4 py-2 text-sm font-medium border-b-2 ${
//                                 activeTab === 'recommended'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                             }`}
//                         >
//                             Recommended Skills
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('learningPaths')}
//                             className={`px-4 py-2 text-sm font-medium border-b-2 ${
//                                 activeTab === 'learningPaths'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                             }`}
//                         >
//                             Learning Paths
//                         </button>
//                     </nav>
//                 </div>

//                 <div className="p-6">
//                     {activeTab === 'mySkills' && (
//                         <div className="space-y-6">
//                             {error && (
//                                 <div className="p-4 bg-red-100 text-red-600 rounded-lg mb-4">
//                                     {error}
//                                 </div>
//                             )}
                            
//                             {skills.map(skill => (
//                                 <div key={skill.id} className="border rounded-lg p-4">
//                                     <div className="flex justify-between items-start mb-4">
//                                         <div>
//                                             <h3 className="font-semibold">{skill.name}</h3>
//                                             <p className="text-sm text-gray-600">Level: {skill.level}</p>
//                                         </div>
//                                         <button 
//                                             onClick={() => handleUpgradeSkill(skill)}
//                                             disabled={!getNextLevel(skill.level) || loading}
//                                             className={`px-3 py-1 rounded-lg text-sm ${
//                                                 getNextLevel(skill.level)
//                                                     ? 'bg-blue-600 text-white hover:bg-blue-700'
//                                                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                             }`}
//                                         >
//                                             {loading ? 'Loading...' : getNextLevel(skill.level) 
//                                                 ? `Upgrade to ${getNextLevel(skill.level)}` 
//                                                 : 'Maximum Level'}
//                                         </button>
//                                     </div>
//                                     <div className="mb-4">
//                                         <div className="flex justify-between text-sm mb-1">
//                                             <span>Progress</span>
//                                             <span>{skill.progress}%</span>
//                                         </div>
//                                         <div className="w-full bg-gray-200 rounded-full h-2">
//                                             <div
//                                                 className="bg-blue-600 h-2 rounded-full"
//                                                 style={{ width: `${skill.progress}%` }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                     {skill.certifications.length > 0 && (
//                                         <div className="text-sm text-gray-600">
//                                             Certifications: {skill.certifications.join(', ')}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {activeTab === 'recommended' && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {recommendedSkills.map(skill => (
//                                 <div key={skill.id} className="border rounded-lg p-4">
//                                     <div className="flex justify-between items-start mb-2">
//                                         <h3 className="font-semibold">{skill.name}</h3>
//                                         <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                                             {skill.relevance}% Match
//                                         </span>
//                                     </div>
//                                     <p className="text-sm text-gray-600 mb-2">{skill.reason}</p>
//                                     <p className="text-sm text-green-600">Growth: {skill.demandGrowth}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {activeTab === 'learningPaths' && (
//                         <div className="space-y-6">
//                             {learningPaths.map(path => (
//                                 <div key={path.id} className="border rounded-lg p-4">
//                                     <div className="flex justify-between items-start mb-4">
//                                         <div>
//                                             <h3 className="font-semibold">{path.title}</h3>
//                                             <p className="text-sm text-gray-600">Duration: {path.duration}</p>
//                                         </div>
//                                         <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
//                                             Start Path
//                                         </button>
//                                     </div>
//                                     <div className="mb-4">
//                                         <div className="flex justify-between text-sm mb-1">
//                                             <span>Progress</span>
//                                             <span>{path.progress}%</span>
//                                         </div>
//                                         <div className="w-full bg-gray-200 rounded-full h-2">
//                                             <div
//                                                 className="bg-blue-600 h-2 rounded-full"
//                                                 style={{ width: `${path.progress}%` }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-wrap gap-2">
//                                         {path.skills.map((skill, index) => (
//                                             <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
//                                                 {skill}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SkillDevelopment;