/**
 * Enhanced Gemini AI Service for LaTeX Generation
 *
 * This service provides AI-powered LaTeX content generation for resumes, cover letters,
 * and LinkedIn profiles using Google's Gemini API with strict LaTeX validation.
 * It uses predefined templates and customizes them with user data.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config/config");
const { getTemplate, customizeTemplate } = require("./templates");

/**
 * Custom error class for Gemini errors
 */
class GeminiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
  }
}

// Initialize Gemini client
let genAI = null;
let isGeminiInitialized = false;
// DEV CACHE: Simple in-memory cache to prevent rate limiting during local development.
const requestCache = new Map();


/**
 * Initialize the Gemini API client
 * REFACTORED: Prioritizes environment variables for API keys to be more robust in deployed environments.
 */
function initializeGeminiAPI() {
  try {
    // Prioritize the environment variable, falling back to the config file.
    const apiKey = process.env.GEMINI_API_KEY || config.gemini?.apiKey;

    if (!apiKey) {
      console.error("Gemini API key not configured in environment variables (GEMINI_API_KEY) or config file.");
      isGeminiInitialized = false;
      return false;
    }

    genAI = new GoogleGenerativeAI(apiKey);
    isGeminiInitialized = true;
    console.log("=== GEMINI API INITIALIZATION ===");
    console.log("API Key Source:", process.env.GEMINI_API_KEY ? "Environment Variable" : "Config File");
    console.log("Status: Successfully initialized");
    console.log("=====================================");
    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
    isGeminiInitialized = false;
    return false;
  }
}

// Initialize on startup
initializeGeminiAPI();

/**
 * Validate and clean LaTeX content received from the API
 * @param {string} content - Raw LaTeX content
 * @returns {string} - Cleaned and validated LaTeX content
 */
function validateAndCleanLatex(content) {
  let cleaned = content;

  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/```latex\n?/g, "").replace(/```\n?/g, "");
  cleaned = cleaned.replace(/^```[\w]*\n?/gm, "").replace(/```$/gm, "");

  // Remove any explanatory text before the LaTeX document starts
  const docStart = cleaned.indexOf("\\documentclass");
  if (docStart > 0) {
    cleaned = cleaned.substring(docStart);
  }

  // Remove any text after \end{document}
  const docEnd = cleaned.indexOf("\\end{document}");
  if (docEnd !== -1) {
    cleaned = cleaned.substring(0, docEnd + "\\end{document}".length);
  }

  // Basic escaping for common special characters to prevent compilation errors
  cleaned = cleaned.replace(/([^\\])&/g, "$1\\&");
  cleaned = cleaned.replace(/([^\\])%/g, "$1\\%");
  cleaned = cleaned.replace(/([^\\])\$/g, "$1\\$");
  cleaned = cleaned.replace(/([^\\])#/g, "$1\\#");
  cleaned = cleaned.replace(/([^\\])_/g, "$1\\_");

  // Fix for escaped newlines that might be returned by the model
  cleaned = cleaned.replace(/\\\\n/g, "\\\\\n");

  return cleaned.trim();
}

/**
 * Check if error is a rate limit error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if it's a rate limit error
 */
function isRateLimitError(error) {
  const errorMessage = error.message?.toLowerCase() || '';
  const errorString = error.toString?.()?.toLowerCase() || '';

  return (
    error.status === 429 ||
    errorMessage.includes('429') ||
    errorMessage.includes('too many requests') ||
    errorMessage.includes('quota') ||
    errorMessage.includes('rate limit') ||
    errorString.includes('quotafailure') ||
    errorString.includes('rate limit')
  );
}

/**
 * Check if error should be retried
 * @param {Error} error - The error to check
 * @returns {boolean} - True if error should be retried
 */
function shouldRetryError(error) {
  const errorMessage = error.message?.toLowerCase() || '';

  // Retry server errors (5xx) and network issues, but NOT rate limit errors.
  return (
    !isRateLimitError(error) && (
      (error.status >= 500 && error.status < 600) ||
      errorMessage.includes('network') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('connection')
    )
  );
}

/**
 * Extract retry delay from error with enhanced parsing
 * @param {Error} error - The error to extract delay from
 * @param {number} attempt - The current retry attempt number
 * @returns {number} - Delay in milliseconds
 */
function extractRetryDelay(error, attempt) {
  const errorString = error.toString?.() || '';

  // Try to extract API-provided retry delay
  const retryMatch = errorString.match(/"retryDelay":"(\d+)s"/);
  if (retryMatch) {
    return parseInt(retryMatch[1], 10) * 1000; // Convert to milliseconds
  }

  // Check for retry info in error details
  if (error.errorDetails) {
    for (const detail of error.errorDetails) {
      if (detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo' && detail.retryDelay) {
        const seconds = parseInt(detail.retryDelay.replace('s', ''), 10);
        return seconds * 1000;
      }
    }
  }

  // Default exponential backoff for other retryable errors
  return Math.min(1000 * Math.pow(2, attempt), 10000); // Cap at 10 seconds
}


/**
 * Generate content using Gemini with LaTeX-specific handling and enhanced retry logic
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Object} options - Generation options
 * @returns {Promise<string>} - Generated LaTeX content
 */
async function generateLatexContent(prompt, options = {}) {
  const {
    temperature = 0.7,
    maxOutputTokens = 3000,
    modelName = config.gemini?.model || "gemini-1.5-flash",
    maxRetries = 3,
  } = options;

  // NEW: Development-only caching to prevent rate limit errors
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const CACHE_DURATION_MS = 5 * 60 * 1000; // Cache results for 5 minutes in dev

  // Use a simple string from the prompt as a key. This is sufficient for development.
  const cacheKey = prompt.slice(0, 200) + prompt.length;

  if (isDevelopment && requestCache.has(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      console.log("Returning cached LaTeX content to avoid hitting API rate limit.");
      return cached.content;
    }
  }

  if (!isGeminiInitialized || !genAI) {
    throw new GeminiError("Gemini API not initialized", 503);
  }

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens,
        },
      });

      const response = result?.response;
      const rawContent = response?.text();

      if (!rawContent) {
        throw new Error("Empty response from Gemini API");
      }

      const validatedContent = validateAndCleanLatex(rawContent);

      // NEW: Store successful result in cache if in development
      if (isDevelopment) {
        requestCache.set(cacheKey, {
          content: validatedContent,
          timestamp: Date.now()
        });
      }

      return validatedContent;
    } catch (error) {
      console.error(`Gemini LaTeX generation error (attempt ${attempt + 1}):`, error);
      lastError = error;

      // Don't retry on the last attempt or if the error is not retryable
      if (attempt === maxRetries || !shouldRetryError(error)) {
        break;
      }

      const delay = extractRetryDelay(error, attempt);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Throw a specific error for rate limiting
  if (isRateLimitError(lastError)) {
    throw new GeminiError(`Rate limit exceeded: ${lastError.message}`, 429);
  }

  // Throw a generic error for other failures
  throw new GeminiError(`LaTeX generation failed after ${maxRetries + 1} attempts: ${lastError.message}`, 500);
}


/**
 * Generate resume LaTeX content by filling a template with Gemini
 * @param {Object} promptData - Data for resume generation
 * @param {Object} user - User object from database (optional)
 * @returns {Promise<string>} - Generated LaTeX content
 */
async function generateResume(promptData, user = null) {
  const userName = promptData.applicantName || user?.name || "John Doe";

  try {
    const {
      jobTitle,
      skills,
      experience,
      education,
      additionalInfo,
    } = promptData;

    const baseTemplate = getTemplate("resumeTemplate");
    if (!baseTemplate) {
      throw new GeminiError("Resume template not found", 404);
    }

    const prompt = `
      You are an expert LaTeX resume generator.  
      Your task is to take the provided LaTeX template and the applicant's details, then generate a **complete, valid, and compilable LaTeX resume**.  

      ⚡ CRITICAL INSTRUCTIONS:  
      1. **Output ONLY the final LaTeX code**. Do not include markdown, explanations, or comments.  
      2. **Ensure 100% compilability**: The final document must compile without errors in Overleaf or any LaTeX compiler.  
      3. **Escape all LaTeX special characters properly** (%, &, _, #, $).  
      4. **Replace all placeholders (...) with real content** using the provided applicant details. If any information is missing, invent **realistic but professional details** relevant to the target job role.  
      5. **Personal Information Section**: Include name, phone, email, LinkedIn, GitHub, portfolio links (only if provided). Otherwise, skip the link.  
      6. **Education Section**: Show degree, institution, timeline, and key coursework. Add GPA only if specified or invent a realistic one.  
      7. **Experience Section**: Each entry should include company, job title, location, timeline, and at least 3 achievements written as **impact-focused bullet points**. Use action verbs and quantify results where possible.  
      8. **Projects Section**: Each project must include:  
         - Project title  
         - GitHub/repo link (if available, otherwise invent)  
         - 3 bullet points describing the project features or achievements  
         - Tech stack used (e.g., React, Node.js, MongoDB)  
      9. **Skills Section**: Must be categorized with **bullet-point formatting**:  
         - Frontend: ...  
         - Backend: ...  
         - Databases: ...  
         - Deployment/Tools: ...  
         - Others (if applicable)  
      10. **Publications/Certifications (Optional)**: Add only if applicant details provide them, otherwise skip.  
      11. **Do not leave any section empty**. If information is missing, intelligently generate **plausible, professional, and relevant content** for a software developer applying for ${jobTitle}.  
      12. **Language & Style**: Keep tone professional, concise, and ATS-friendly.  
      13. **Output must be ONE final LaTeX document** (from \\documentclass to \\end{document}).  


      **APPLICANT DETAILS:**
      - **Name:** ${userName}
      - **Target Job Title:** ${jobTitle || "Not specified"}
      - **Experience:** ${experience || "Not specified"}
      - **Education:** ${education || "Not specified"}
      - **Skills:** ${Array.isArray(skills) ? skills.join(", ") : "Not specified"}
      - **Projects & Additional Info:** ${additionalInfo || "Not specified"}

      **LATEX TEMPLATE TO COMPLETE:**
      \`\`\`latex
      ${baseTemplate}
      \`\`\`

      Now, generate the final completed LaTeX resume following all critical requirements.
    `;

    // Use smaller token budget and no retries to reduce quota pressure
    return await generateLatexContent(prompt, {
      modelName: config.gemini?.model || "gemini-1.5-flash",
      maxOutputTokens: Math.min(2000, config.gemini?.maxOutputTokens || 3000),
      maxRetries: 0,
      temperature: 0.6,
    });
  } catch (error) {
    console.error("Resume generation error:", error);

    // REFACTORED: Consolidated fallback logic.
    // If API fails (especially rate limit), use an enhanced fallback template.
    if (isRateLimitError(error)) {
      console.log("Rate limit hit, using enhanced fallback template for resume.");
    } else {
      console.log("API call failed, using fallback template for resume.");
    }

    const fallbackTemplate = getTemplate("resumeTemplate");
    if (fallbackTemplate) {
      return customizeTemplate(fallbackTemplate, {
        "Your Name": userName,
        "your.email@example.com": promptData.email || "your.email@example.com",
        "+1 (555) 123-4567": promptData.phone || "+1 (555) 123-4567",
        "City, State": promptData.location || "City, State",
        "linkedin.com/in/yourprofile": promptData.linkedin || "linkedin.com/in/yourprofile",
        "github.com/yourusername": promptData.github || "github.com/yourusername",
        "Write a compelling professional summary...": `Experienced ${promptData.jobTitle || "Software Developer"} with strong skills in ${Array.isArray(promptData.skills) ? promptData.skills.slice(0, 5).join(", ") : "various technologies"}.`,
        "Job Title": promptData.currentPosition || promptData.jobTitle || "Software Developer",
        "Company Name": promptData.company || "Tech Company",
        "MM/YYYY - Present": "01/2023 - Present",
        "Describe your key responsibilities...": promptData.experience || "• Developed and maintained web applications using modern technologies.",
        "Degree Type": "Bachelor of Science",
        "Major/Field of Study": "Computer Science",
        "University Name": "University Name",
        "Graduation MM/YYYY": "05/2021",
        "Relevant coursework...": "Relevant Coursework: Data Structures, Algorithms, Software Engineering.",
        "Project Name 1": promptData.additionalInfo ? "CareerPilotAI" : "Portfolio Website",
        "Brief description of the project...": promptData.additionalInfo || "Personal portfolio website built with React and Node.js.",
        "List your technical skills...": Array.isArray(promptData.skills) ? promptData.skills.join(", ") : promptData.skills || "JavaScript, React, Node.js",
        "Include relevant certifications...": "AWS Cloud Practitioner"
      });
    }

    // If even the fallback template is missing, throw the original error.
    throw new GeminiError(error.message || "Error generating resume content", error.status || 500);
  }
}

/**
 * Generate cover letter LaTeX content by filling a template with Gemini
 * @param {Object} promptData - Data for cover letter generation
 * @param {Object} user - User object from database (optional)
 * @returns {Promise<string>} - Generated LaTeX content
 */
async function generateCoverLetter(promptData, user = null) {
  const userName = promptData.applicantName || user?.name || "Jane Doe";

  try {
    const {
      jobTitle,
      companyName,
      skills,
      experience,
      jobDescription,
      hiringManager,
    } = promptData;

    const baseTemplate = getTemplate("coverLetterTemplate");
    if (!baseTemplate) {
      throw new GeminiError("Cover letter template not found", 404);
    }

    const partiallyFilledTemplate = customizeTemplate(baseTemplate, {
      "Company Address": `${companyName || "Company Name"}\\nCompany Address`,
      "Hiring Manager's Name": hiringManager || "Hiring Manager",
      "Your Name": userName,
      "Your Contact Information": "Your Address\\nYour Phone\\nYour Email",
    });

    const safeJobDesc = (jobDescription || "Not specified").slice(0, 1200);
    const safeExperience = (experience || "Not specified").slice(0, 1200);
    const safeSkills = Array.isArray(skills) ? skills.slice(0, 20) : skills;

    const prompt = `
      Please complete the following LaTeX cover letter by writing the content for the bracketed paragraph descriptions.

      **CRITICAL INSTRUCTIONS:**
      1.  **Output ONLY LaTeX Code:** Your response must be the final, complete LaTeX document. Do not include explanations or markdown.
      2.  **Professional Tone:** Write in a professional and persuasive tone.
      3.  **Tailor Content:** Use the details below to tailor the letter to the specific job and company.

      **DETAILS FOR CONTENT GENERATION:**
      - **Applicant:** ${userName}
      - **Applying for:** ${jobTitle || "the position"}
      - **At:** ${companyName || "your company"}
      - **Relevant Experience:** ${safeExperience}
      - **Key Skills:** ${Array.isArray(safeSkills) ? safeSkills.join(", ") : (safeSkills || "Not specified")}
      - **Job Description Snippet:** ${safeJobDesc}

      **PARTIALLY FILLED LATEX TEMPLATE:**
      \`\`\`latex
      ${partiallyFilledTemplate}
      \`\`\`

      Replace the bracketed instructions (e.g., "[First paragraph: ...]") with well-written paragraphs.
    `;

    return await generateLatexContent(prompt, {
      modelName: config.gemini?.model || "gemini-1.5-flash",
      maxOutputTokens: 2048,
      maxRetries: 0,
      temperature: 0.6,
    });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    
    // REFACTORED: Consolidated fallback logic.
    if (isRateLimitError(error)) {
      console.log("Rate limit hit, using enhanced fallback template for cover letter.");
    } else {
      console.log("API call failed, using fallback template for cover letter.");
    }

    const fallbackTemplate = getTemplate("coverLetterTemplate");
    if (fallbackTemplate) {
      const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      return customizeTemplate(fallbackTemplate, {
        "\\today": currentDate,
        "Company Address": `${promptData.companyName || "Company Name"}\\\\\\nCompany Address`,
        "Hiring Manager's Name": promptData.hiringManager || "Hiring Manager",
        "Your Name": userName,
        "Your Contact Information": `${userName}\\\\\\n${promptData.email || "your.email@example.com"}\\\\\\n${promptData.phone || "+1 (555) 123-4567"}`,
        "[First paragraph: Introduction...]": `I am writing to express my strong interest in the ${promptData.jobTitle || "Software Engineer"} position at ${promptData.companyName || "your company"}. With my background in ${Array.isArray(promptData.skills) ? promptData.skills.slice(0, 3).join(", ") : "software development"}, I am confident I can contribute to your team.`,
        "[Second paragraph: Your relevant skills...]": `Throughout my career, I have developed expertise in ${Array.isArray(promptData.skills) ? promptData.skills.join(", ") : "modern software practices"}. I have successfully delivered projects from conception to deployment.`,
        "[Third paragraph: Why you're interested...]": `I am particularly drawn to ${promptData.companyName || "your company"} because of its commitment to innovation. Your work in the industry aligns with my professional goals.`,
        "[Fourth paragraph: Call to action...]": `Thank you for considering my application. I look forward to discussing how my skills can benefit your team.`
      });
    }

    throw new GeminiError(error.message || "Error generating cover letter content", error.status || 500);
  }
}

/**
 * Generate LinkedIn bio LaTeX content by filling a template with Gemini
 * @param {Object} data - Data for LinkedIn bio generation
 * @param {Object} user - User object from database (optional)
 * @returns {Promise<string>} - Generated LaTeX content
 */
async function generateLinkedInBio(data, user = null) {
  const profileName = `${data.profile?.firstName || ""} ${data.profile?.lastName || ""}`.trim();
  const userName = profileName || user?.name || "Professional";

  try {
    const { profile, experience, preferences } = data;
    if (!profile || !experience || !preferences) {
      throw new GeminiError("Missing required data: profile, experience, and preferences are required", 400);
    }

    const baseTemplate = getTemplate("linkedinBioTemplate");
    if (!baseTemplate) {
      throw new GeminiError("LinkedIn bio template not found", 404);
    }

    const safeProfExp = (experience.professionalExperience || "Not specified").slice(0, 1200);
    const safeSkillsLI = Array.isArray(experience.skills) ? experience.skills.slice(0, 25) : experience.skills;

    const prompt = `
      You are an expert LinkedIn profile writer. Generate a complete LaTeX document representing a professional LinkedIn profile by filling in the bracketed placeholders in the template.

      **CRITICAL INSTRUCTIONS:**
      1.  **Output ONLY LaTeX Code:** Your response must be the final, complete LaTeX document.
      2.  **Professional & Engaging Content:** Write compelling content that showcases expertise.
      3.  **Escape LaTeX Special Characters:** Properly escape all special characters (%, &, _, #, $).
      4.  **Replace ALL Placeholders:** Replace every bracketed placeholder with content based on the profile details.

      **PROFILE DETAILS:**
      - **Name:** ${userName}
      - **Current Position:** ${profile.currentPosition || "Not specified"}
      - **Industry:** ${profile.industry || "Not specified"}
      - **Target Role:** ${preferences.targetRole || "new opportunities"}
      - **Professional Experience:** ${safeProfExp}
      - **Skills:** ${typeof safeSkillsLI === 'string' ? safeSkillsLI : Array.isArray(safeSkillsLI) ? safeSkillsLI.join(", ") : "Not specified"}
      - **Tone Preference:** ${preferences.tone || "professional"}

      **LATEX TEMPLATE TO COMPLETE:**
      \`\`\`latex
      ${baseTemplate}
      \`\`\`

      Generate engaging, professional content for each bracketed placeholder.
    `;
    return await generateLatexContent(prompt, {
      modelName: config.gemini?.model || "gemini-1.5-flash",
      maxOutputTokens: 2048,
      maxRetries: 0,
      temperature: 0.6,
    });
  } catch (error) {
    console.error("LinkedIn bio generation error:", error);

    // REFACTORED: Consolidated fallback logic.
    if (isRateLimitError(error)) {
      console.log("Rate limit hit, using enhanced fallback template for LinkedIn bio.");
    } else {
      console.log("API call failed, using fallback template for LinkedIn bio.");
    }
    
    const fallbackTemplate = getTemplate("linkedinBioTemplate");
    if (fallbackTemplate) {
      const skills = Array.isArray(data.experience?.skills) ? data.experience.skills.join(", ") : "JavaScript, Python, React, Node.js";
      return customizeTemplate(fallbackTemplate, {
        "[Professional Name]": userName,
        "[Write a compelling professional headline...]": `${data.profile?.currentPosition || "Software Developer"} | ${data.profile?.industry || "Technology"} | Seeking ${data.preferences?.targetRole || "New Opportunities"}`,
        "[Write a professional summary...]": `Experienced ${data.profile?.currentPosition || "Software Developer"} with a strong foundation in ${skills}. Passionate about creating scalable solutions and driving technological innovation.`,
        "[Key achievement or project...]": `• Led development of full-stack applications resulting in improved user experience.`,
        "[Leadership experience...]": `• Successfully collaborated with cross-functional teams to deliver high-quality software.`,
        "[Technical skill or innovation...]": `• Implemented solutions using modern technologies that enhanced system efficiency.`,
        "[Industry recognition...]": `• Achieved recognition for technical excellence in software development.`,
        "[List core technical and professional skills...]": `**Technical Skills:** ${skills}\\n**Methodologies:** Agile, Test-driven development`,
        "[Include relevant education...]": `**Education:** ${data.experience?.education || "Bachelor's degree in Computer Science"}`,
        "[Mention industry trends...]": `**Areas of Interest:** ${data.preferences?.keywords || "AI/ML, cloud-native development"}`
      });
    }

    throw new GeminiError(error.message || "Error generating LinkedIn bio content", error.status || 500);
  }
}

// Export all functions
module.exports = {
  generateResume,
  generateCoverLetter,
  generateLinkedInBio,
  generateLatexContent,
  validateAndCleanLatex,
  GeminiError,
};
