const OpenAI = require('openai');
const config = require('../config/config');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey
});

/**
 * Custom error class for OpenAI errors
 */
class OpenAIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'OpenAIError';
    this.statusCode = statusCode;
  }
}

/**
 * Generate resume content using OpenAI
 * @param {Object} promptData - Data for resume generation
 * @returns {Promise<string>} - Generated resume content
 */
exports.generateResume = async (promptData) => {
  try {
    const { jobTitle, skills, experience, education, additionalInfo } = promptData;
    
    const skillsText = skills && skills.length > 0 
      ? `Skills: ${skills.join(', ')}\n` 
      : '';
    
    const additionalText = additionalInfo 
      ? `Additional Information: ${additionalInfo}\n` 
      : '';

    const prompt = `
      Create a professional resume for a ${jobTitle} position with the following details:
      
      Experience:
      ${experience}
      
      Education:
      ${education}
      
      ${skillsText}
      ${additionalText}
      
      Format the resume professionally with clear sections for Summary, Experience, Education, and Skills.
      Use bullet points for achievements and responsibilities.
      Keep the content concise and focused on relevant qualifications.
    `;

    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: 'You are a professional resume writer with expertise in creating compelling, ATS-friendly resumes.' },
        { role: 'user', content: prompt }
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens
    });

    if (!response.choices || response.choices.length === 0) {
      throw new OpenAIError('Failed to generate resume content', 500);
    }

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI Resume Generation Error:', error);
    
    if (error.name === 'OpenAIError') {
      throw error;
    }
    
    throw new OpenAIError(
      error.message || 'Error generating resume content',
      error.status || 500
    );
  }
};

/**
 * Generate cover letter content using OpenAI
 * @param {Object} promptData - Data for cover letter generation
 * @returns {Promise<string>} - Generated cover letter content
 */
exports.generateCoverLetter = async (promptData) => {
  try {
    const { jobTitle, companyName, skills, experience, jobDescription, additionalInfo } = promptData;
    
    const skillsText = skills && skills.length > 0 
      ? `Skills: ${skills.join(', ')}\n` 
      : '';
    
    const experienceText = experience 
      ? `Experience: ${experience}\n` 
      : '';
    
    const jobDescText = jobDescription 
      ? `Job Description: ${jobDescription}\n` 
      : '';
    
    const additionalText = additionalInfo 
      ? `Additional Information: ${additionalInfo}\n` 
      : '';

    const prompt = `
      Write a professional cover letter for a ${jobTitle} position at ${companyName} with the following details:
      
      ${experienceText}
      ${skillsText}
      ${jobDescText}
      ${additionalText}
      
      Format the cover letter professionally with a proper greeting, introduction, body paragraphs highlighting relevant skills and experience, and a strong closing.
      Keep the tone professional but engaging.
      Limit to one page in length.
    `;

    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: 'You are a professional cover letter writer with expertise in creating compelling, personalized cover letters.' },
        { role: 'user', content: prompt }
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens
    });

    if (!response.choices || response.choices.length === 0) {
      throw new OpenAIError('Failed to generate cover letter content', 500);
    }

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI Cover Letter Generation Error:', error);
    
    if (error.name === 'OpenAIError') {
      throw error;
    }
    
    throw new OpenAIError(
      error.message || 'Error generating cover letter content',
      error.status || 500
    );
  }
};

/**
 * Generate LinkedIn bio content using OpenAI
 * @param {Object} promptData - Data for LinkedIn bio generation
 * @returns {Promise<string>} - Generated LinkedIn bio content
 */
exports.generateLinkedInBio = async (promptData) => {
  try {
    const { currentRole, industry, skills, experience, achievements, tone, additionalInfo } = promptData;
    
    const skillsText = skills && skills.length > 0 
      ? `Skills: ${skills.join(', ')}\n` 
      : '';
    
    const experienceText = experience 
      ? `Experience: ${experience}\n` 
      : '';
    
    const achievementsText = achievements 
      ? `Key Achievements: ${achievements}\n` 
      : '';
    
    const additionalText = additionalInfo 
      ? `Additional Information: ${additionalInfo}\n` 
      : '';

    const toneDescription = tone === 'professional' ? 'professional and formal'
      : tone === 'friendly' ? 'friendly and approachable'
      : 'creative and distinctive';

    const prompt = `
      Write a compelling LinkedIn bio for a ${currentRole} in the ${industry} industry with the following details:
      
      ${experienceText}
      ${skillsText}
      ${achievementsText}
      ${additionalText}
      
      The tone should be ${toneDescription}.
      Include a strong headline and summary section.
      Optimize for LinkedIn search with relevant keywords.
      Keep it concise (under 2000 characters).
    `;

    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: 'You are a professional LinkedIn profile writer with expertise in creating compelling, keyword-optimized LinkedIn bios.' },
        { role: 'user', content: prompt }
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens
    });

    if (!response.choices || response.choices.length === 0) {
      throw new OpenAIError('Failed to generate LinkedIn bio content', 500);
    }

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI LinkedIn Bio Generation Error:', error);
    
    if (error.name === 'OpenAIError') {
      throw error;
    }
    
    throw new OpenAIError(
      error.message || 'Error generating LinkedIn bio content',
      error.status || 500
    );
  }
};
