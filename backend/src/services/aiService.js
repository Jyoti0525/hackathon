import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const optimizeResume = async (resumeData) => {
  try {
    // Optimize summary
    const summaryPrompt = `Improve this professional summary while maintaining authenticity: ${resumeData.personal.summary}`;
    const summaryResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: summaryPrompt,
      max_tokens: 200
    });
    resumeData.personal.summary = summaryResponse.data.choices[0].text.trim();

    // Enhance experience descriptions
    const enhancedExperience = await Promise.all(
      resumeData.experience.map(async (exp) => {
        const expPrompt = `Improve this job description using action words and quantifiable achievements: ${exp.description}`;
        const expResponse = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: expPrompt,
          max_tokens: 150
        });
        return {
          ...exp,
          description: expResponse.data.choices[0].text.trim()
        };
      })
    );
    resumeData.experience = enhancedExperience;

    // Suggest additional skills
    const skillsPrompt = `Based on these skills: ${resumeData.skills.join(', ')}, suggest 5 relevant additional skills that would complement the profile.`;
    const skillsResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: skillsPrompt,
      max_tokens: 100
    });
    const suggestedSkills = skillsResponse.data.choices[0].text
      .split(',')
      .map(skill => skill.trim());

    return {
      ...resumeData,
      suggestedSkills
    };
  } catch (error) {
    console.error('AI optimization error:', error);
    throw error;
  }
};

export const getSkillSuggestions = async (currentSkills) => {
  try {
    const prompt = `Based on these skills: ${currentSkills.join(', ')}, suggest 5 relevant skills that are in high demand in the job market.`;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100
    });
    return response.data.choices[0].text
      .split(',')
      .map(skill => skill.trim());
  } catch (error) {
    console.error('Skill suggestion error:', error);
    throw error;
  }
};