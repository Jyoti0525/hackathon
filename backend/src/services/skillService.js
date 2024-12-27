const OpenAI = require('openai');
const Skill = require('../models/Skill');
const User = require('../models/User');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class SkillService {
    async getAllSkills(userId) {
        try {
            const skills = await Skill.find({ userId })
                .populate('endorsements.userId', 'name email')
                .sort({ createdAt: -1 });
            return skills;
        } catch (error) {
            throw new Error(`Failed to retrieve skills: ${error.message}`);
        }
    }

    async createSkill(userId, skillData) {
        try {
            const skill = new Skill({
                userId,
                name: skillData.name,
                category: skillData.category,
                level: skillData.level || 'beginner',
                progress: {
                    level: this._convertLevelToNumeric(skillData.level || 'beginner'),
                    lastAssessed: new Date(),
                    history: [{
                        level: this._convertLevelToNumeric(skillData.level || 'beginner'),
                        date: new Date()
                    }]
                }
            });
            await skill.save();
            return skill;
        } catch (error) {
            throw new Error(`Failed to create skill: ${error.message}`);
        }
    }

    async updateSkill(skillId, userId, updateData) {
        try {
            const skill = await Skill.findOne({ _id: skillId, userId });
            if (!skill) {
                throw new Error('Skill not found or unauthorized');
            }

            Object.assign(skill, updateData);
            if (updateData.level) {
                skill.progress.history.push({
                    level: this._convertLevelToNumeric(updateData.level),
                    date: new Date()
                });
                skill.progress.level = this._convertLevelToNumeric(updateData.level);
                skill.progress.lastAssessed = new Date();
            }

            await skill.save();
            return skill;
        } catch (error) {
            throw new Error(`Failed to update skill: ${error.message}`);
        }
    }

    async deleteSkill(skillId, userId) {
        try {
            const skill = await Skill.findOneAndDelete({ _id: skillId, userId });
            if (!skill) {
                throw new Error('Skill not found or unauthorized');
            }
            return skill;
        } catch (error) {
            throw new Error(`Failed to delete skill: ${error.message}`);
        }
    }

    async assessSkill(userId, skillId, evidence) {
        try {
            const skill = await Skill.findOne({ _id: skillId, userId });
            if (!skill) {
                throw new Error('Skill not found or unauthorized');
            }

            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: "Analyze the provided evidence and assess the skill level. Consider factors like complexity, practical application, and expertise demonstrated."
                }, {
                    role: "user",
                    content: `Skill: ${skill.name}\nEvidence: ${evidence}\nCurrent Level: ${skill.level}`
                }],
                temperature: 0.3,
            });

            const assessment = JSON.parse(response.choices[0].message.content);
            
            skill.level = assessment.level;
            skill.progress.level = this._convertLevelToNumeric(assessment.level);
            skill.progress.lastAssessed = new Date();
            skill.progress.history.push({
                level: skill.progress.level,
                date: new Date()
            });

            if (assessment.verifications) {
                skill.verifications.push(...assessment.verifications.map(v => ({
                    type: 'assessment',
                    source: 'AI Assessment',
                    date: new Date(),
                    score: v.score,
                    verified: true
                })));
            }

            await skill.save();
            return skill;
        } catch (error) {
            throw new Error(`Skill assessment failed: ${error.message}`);
        }
    }

    async verifySkill(userId, skillId, proofs) {
        try {
            const skill = await Skill.findOne({ _id: skillId, userId });
            if (!skill) {
                throw new Error('Skill not found or unauthorized');
            }

            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: "Verify the authenticity and validity of the provided skill proofs. Analyze certificates, projects, and assessments for credibility."
                }, {
                    role: "user",
                    content: JSON.stringify({ proofs, skillName: skill.name })
                }],
                temperature: 0.2,
            });

            const verificationResults = JSON.parse(response.choices[0].message.content);
            
            skill.verifications.push(...verificationResults.map(v => ({
                type: v.type,
                source: v.source,
                url: v.url,
                date: new Date(v.date),
                score: v.score,
                verified: v.verified
            })));

            await skill.save();
            return skill;
        } catch (error) {
            throw new Error(`Skill verification failed: ${error.message}`);
        }
    }

    async getRecommendations(userId) {
        try {
            const userSkills = await Skill.find({ userId });
            const userProfile = await User.findById(userId);

            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: "Based on the user's current skills and career interests, recommend relevant skills to develop."
                }, {
                    role: "user",
                    content: JSON.stringify({
                        currentSkills: userSkills.map(s => ({
                            name: s.name,
                            level: s.level,
                            category: s.category
                        })),
                        careerInterests: userProfile.careerInterests
                    })
                }],
                temperature: 0.4,
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            throw new Error(`Failed to get recommendations: ${error.message}`);
        }
    }

    async getSkillAnalytics(userId) {
        try {
            const skills = await Skill.find({ userId });
            
            return {
                totalSkills: skills.length,
                skillsByLevel: this._aggregateSkillsByLevel(skills),
                verificationStats: this._aggregateVerificationStats(skills),
                progressOverTime: this._aggregateProgressHistory(skills),
                endorsementStats: this._aggregateEndorsements(skills)
            };
        } catch (error) {
            throw new Error(`Failed to get analytics: ${error.message}`);
        }
    }

    async getSkillGaps(userId, targetRole) {
        try {
            const userSkills = await Skill.find({ userId });
            
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: "Analyze the gap between current skills and target role requirements. Provide specific recommendations for skill development."
                }, {
                    role: "user",
                    content: JSON.stringify({
                        currentSkills: userSkills.map(s => ({
                            name: s.name,
                            level: s.level,
                            category: s.category
                        })),
                        targetRole
                    })
                }],
                temperature: 0.3,
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            throw new Error(`Failed to analyze skill gaps: ${error.message}`);
        }
    }

    // Helper methods
    _convertLevelToNumeric(level) {
        const levels = {
            'beginner': 25,
            'intermediate': 50,
            'advanced': 75,
            'expert': 100
        };
        return levels[level.toLowerCase()] || 25;
    }

    _aggregateSkillsByLevel(skills) {
        return skills.reduce((acc, skill) => {
            acc[skill.level] = (acc[skill.level] || 0) + 1;
            return acc;
        }, {});
    }

    _aggregateVerificationStats(skills) {
        return skills.reduce((acc, skill) => {
            skill.verifications.forEach(verification => {
                acc[verification.type] = (acc[verification.type] || 0) + 1;
            });
            return acc;
        }, {});
    }

    _aggregateProgressHistory(skills) {
        return skills.map(skill => ({
            skillName: skill.name,
            history: skill.progress.history
        }));
    }

    _aggregateEndorsements(skills) {
        return skills.map(skill => ({
            skillName: skill.name,
            endorsementCount: skill.endorsements.length,
            averageRating: this._calculateAverageRating(skill.endorsements)
        }));
    }

    _calculateAverageRating(endorsements) {
        if (endorsements.length === 0) return 0;
        const sum = endorsements.reduce((acc, end) => acc + (end.rating || 0), 0);
        return sum / endorsements.length;
    }
}

module.exports = new SkillService();