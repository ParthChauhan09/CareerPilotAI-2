/**
 * Gemini AI Service
 *
 * This service provides AI-powered content generation for resumes, cover letters,
 * and LinkedIn profiles using Google's Gemini API.
 *
 * Features:
 * - Robust error handling and fallback mechanisms
 * - Optimized prompts for high-quality content generation
 * - Structured response parsing
 * - Content enhancement with industry-specific keywords
 */

// Import the Google Generative AI library
// Make sure to install this dependency: npm install @google/generative-ai
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Assuming you have a config file like this:
// config/config.js
// module.exports = {
//   gemini: {
//     apiKey: process.env.GEMINI_API_KEY || "your_gemini_api_key",
//     temperature: 0.7,
//     maxOutputTokens: 2048,
//     model: "gemini-pro", // Default model
//   },
// };
const config = require("../config/config");

// Log the version of the package
console.log(
  "Using @google/generative-ai version:",
  require("@google/generative-ai/package.json").version
);

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

// Validate available models
const AVAILABLE_MODELS = {
  // Current stable models
  "gemini-pro": true,
  "gemini-pro-vision": true,
  // Version-specific models
  "gemini-1.0-pro": true,
  "gemini-1.0-pro-vision": true,
  "gemini-1.5-pro": true,
  "gemini-1.5-pro-vision": true,
  "gemini-1.5-flash": true,
  // Legacy/experimental models that might be referenced (handle with caution)
  "gemini-1.5-flash-latest": true,
  "gemini-ultra": true, // Note: Access to gemini-ultra may require specific permissions
  "gemini-1.5-flash-preview": true,
};

// Set safe default model
const DEFAULT_MODEL = "gemini-1.5-flash-latest";

// Initialize Gemini client - initialized once
let genAI = null; // Corrected variable name to match common usage and avoid confusion
let isGeminiInitialized = false; // Flag to track initialization status

// Set to true to force local fallback instead of Gemini API (for testing/development)
// This should typically be false in production unless you have a specific reason
const useLocalFallback = false; // Changed default to false to attempt API usage

/**
 * Initializes the Gemini API client.
 * Returns true if initialization is successful, false otherwise.
 */
function initializeGeminiAPI() {
  // If we're using local fallback, don't try to initialize Gemini
  if (useLocalFallback) {
    console.log(
      "Using local fallback implementation instead of Gemini API (forced)"
    );
    isGeminiInitialized = false;
    return false;
  }

  // If already initialized, no need to do it again
  if (isGeminiInitialized && genAI) {
    console.log("Gemini API already initialized.");
    return true;
  }

  try {
    // Validate API key
    if (
      !config.gemini.apiKey ||
      config.gemini.apiKey === "your_gemini_api_key" ||
      config.gemini.apiKey.trim() === ""
    ) {
      console.error(
        "Gemini API key is not set in environment variables or is invalid. Falling back to local content generation."
      );
      isGeminiInitialized = false;
      return false;
    }

    // Check if API key looks valid (basic format check)
    // This is a heuristic, the API call is the real test
    if (!config.gemini.apiKey.startsWith("AIza")) {
      console.warn(
        "Gemini API key may be invalid - doesn't match expected format (AIza...)"
      );
    }

    // Initialize the client
    try {
      // Use GoogleGenerativeAI as per library documentation
      genAI = new GoogleGenerativeAI(config.gemini.apiKey);
      isGeminiInitialized = true; // Mark as initialized upon successful client creation
      console.log(
        "Gemini API client created successfully with key:",
        config.gemini.apiKey.substring(0, 8) +
          "..." +
          config.gemini.apiKey.substring(config.gemini.apiKey.length - 4)
      );
    } catch (initError) {
      console.error("Error creating GoogleGenerativeAI instance:", initError);
      isGeminiInitialized = false;
      return false; // Initialization failed
    }

    // Basic check if the client object seems valid
    if (!genAI) {
      console.error(
        "Failed to create GoogleGenerativeAI instance. Falling back."
      );
      isGeminiInitialized = false;
      return false;
    }

    // Note: Accessing genAI.models directly here might not be necessary or reliable
    // The actual model retrieval happens before content generation.
    // The test call below is a better indicator of API connectivity.

    return true; // Initialization attempt completed (may still fail on actual API call)
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
    console.log("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    isGeminiInitialized = false;
    return false; // Initialization failed due to an unexpected error
  }
}

// Attempt to initialize the API on service startup
const initSuccess = initializeGeminiAPI();

// Test the connection if initialization was successful
if (initSuccess) {
  setTimeout(async () => {
    try {
      // Double-check that genAI was properly initialized and models are accessible
      if (!genAI || typeof genAI.getGenerativeModel !== "function") {
        console.error(
          "Gemini API client not fully functional after initialization, skipping test"
        );
        isGeminiInitialized = false; // Mark as not fully initialized if test setup fails
        return;
      }

      // Use getGenerativeModel as per current library usage
      const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });

      if (!model) {
        console.error(`Could not get model: ${DEFAULT_MODEL}. Falling back.`);
        isGeminiInitialized = false; // Mark as not fully initialized if model retrieval fails
        return;
      }

      // Perform a small test generation
      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: "Hello, are you working?" }] },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 50,
        },
      });

      // Check for a valid response
      if (result && result.response && result.response.text()) {
        console.log(
          "Gemini API test successful:",
          result.response.text().substring(0, 50) + "..."
        );
        isGeminiInitialized = true; // Confirm successful initialization and connectivity
      } else {
        console.error(
          "Gemini API test returned empty or invalid result. Falling back."
        );
        isGeminiInitialized = false; // Mark as not fully initialized if test fails
      }
    } catch (testError) {
      console.error("Gemini API test failed:", testError.message);
      console.error("Test error details:", {
        name: testError.name,
        stack: testError.stack?.substring(0, 200),
      });
      isGeminiInitialized = false; // Mark as not fully initialized if test fails
    }
  }, 2000); // Run test after 2 seconds to ensure everything is loaded
} else {
  console.log(
    "Gemini API initialization failed. Using local fallback implementation for content generation."
  );
}

/**
 * Local fallback implementation for content generation
 * Provides basic content when the Gemini API is unavailable.
 * @param {string} prompt - The prompt to generate content for
 * @returns {string} - Generated content
 */
const generateLocalFallbackContent = (prompt) => {
  console.log("Using local fallback content generation");
  console.log(
    "Prompt:",
    prompt.substring(0, Math.min(100, prompt.length)) + "..."
  ); // Use Math.min for safety

  // Extract key information from the prompt (basic heuristic)
  const isResume = prompt.toLowerCase().includes("resume");
  const isCoverLetter = prompt.toLowerCase().includes("cover letter");
  const isLinkedIn = prompt.toLowerCase().includes("linkedin");

  // Generate appropriate fallback content
  let fallbackContent = "";

  if (isResume) {
    fallbackContent = `## Professional Resume

## Summary
A dedicated professional with relevant experience and skills.

## Experience
- Worked on various projects demonstrating technical and professional skills
- Collaborated with teams to achieve business objectives
- Implemented solutions to complex problems

## Education
- Bachelor's Degree in relevant field
- Additional certifications and training

## Skills
- Technical skills relevant to the position
- Communication and teamwork
- Problem-solving and analytical thinking

## Additional Information
Available upon request.`;
  } else if (isCoverLetter) {
    const currentDate = new Date().toLocaleDateString();
    fallbackContent = `${currentDate}

Dear Hiring Manager,

I am writing to express my interest in the position at your company. With my background in relevant skills, I believe I would be a valuable addition to your team.

I have experience in this field and have developed skills that would be beneficial for this role. My previous work has prepared me for the challenges and opportunities this position offers.

I am excited about the opportunity to contribute to your company and would welcome the chance to discuss how my skills and experiences align with your needs.

Thank you for considering my application. I look forward to the possibility of working with you.

Sincerely,

[Your Name]`;
  } else if (isLinkedIn) {
    fallbackContent = `Headline: Experienced Professional | Industry Expert

About: Dedicated professional with experience in the industry. Skilled in relevant technologies and methodologies with a track record of success in previous roles. Passionate about delivering high-quality results and contributing to team success.

Experience: Demonstrated expertise in the field with a focus on delivering value. Experienced in working with teams to achieve business objectives and implement effective solutions.`;
  } else {
    fallbackContent = `Generated content based on your request.

This is a fallback response as the AI service is currently unavailable. Please try again later for a more tailored response.

The system is using a local fallback mechanism to ensure you receive some content despite the AI service being unavailable.`;
  }

  // Add a note about using fallback content
  fallbackContent +=
    "\n\n[Note: This content was generated using a fallback system as the AI service is currently unavailable.]";

  return fallbackContent;
};

/**
 * Generate content using Gemini with error handling and fallback.
 * Enhanced with Canvas support for better formatting.
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Object} options - Additional options (temperature, maxOutputTokens, modelName, useCanvas)
 * @returns {Promise<string>} - The generated content
 */
const generateContent = async (prompt, options = {}) => {
  const {
    temperature = config.gemini.temperature,
    maxOutputTokens = config.gemini.maxOutputTokens,
    modelName = config.gemini.model,
    useCanvas = false, // New option to enable Canvas formatting
    canvasWidth = 800, // Default canvas width
    canvasHeight = 1200, // Default canvas height
    fontFamily = "Arial, sans-serif", // Default font family
    fontSize = 14, // Default font size
    lineHeight = 1.5, // Default line height
    textColor = "#333333", // Default text color
    backgroundColor = "#FFFFFF", // Default background color
    padding = 20, // Default padding
  } = options;

  // If forced local fallback or API is not initialized/functional, use fallback
  if (useLocalFallback || !isGeminiInitialized || !genAI) {
    console.log(
      "Using local fallback instead of Gemini API (API not initialized or forced)"
    );
    return generateLocalFallbackContent(prompt);
  }

  // Validate API key again before making a call (redundant but safe)
  if (
    !config.gemini.apiKey ||
    config.gemini.apiKey === "your_gemini_api_key" ||
    config.gemini.apiKey.trim() === ""
  ) {
    console.error(
      "Invalid Gemini API key detected during content generation. Falling back."
    );
    isGeminiInitialized = false; // Mark as not initialized
    return generateLocalFallbackContent(prompt);
  }

  // Determine which model to use, with validation
  let selectedModelName = modelName;
  if (!AVAILABLE_MODELS[selectedModelName]) {
    console.warn(
      `Model "${selectedModelName}" not in validated list or potentially unavailable. Using default "${DEFAULT_MODEL}".`
    );
    selectedModelName = DEFAULT_MODEL;
  }

  console.log("Using Gemini model:", selectedModelName);
  console.log("Prompt length:", prompt.length, "characters");
  console.log("Using Canvas formatting:", useCanvas);

  try {
    // Get the model instance
    const model = genAI.getGenerativeModel({ model: selectedModelName });

    if (!model) {
      console.error(
        `Could not access Gemini model: ${selectedModelName}. Falling back.`
      );
      isGeminiInitialized = false; // Mark as not initialized if model retrieval fails
      return generateLocalFallbackContent(prompt);
    }

    // Generate content with timeout (library handles internal timeouts)
    console.log(
      `Generating content with ${selectedModelName}, max tokens: ${maxOutputTokens}, temperature: ${temperature}`
    );

    let result;

    if (useCanvas) {
      // Enhanced prompt for Canvas-based formatting
      const canvasPrompt = `
Format the following content for a professional document with clear section headers,
proper spacing, and consistent formatting. Use appropriate styling for headings,
bullet points, and paragraphs:

${prompt}

Please ensure:
- Clear visual hierarchy with distinct headings
- Proper spacing between sections
- Consistent bullet point formatting
- Professional appearance suitable for ${
        prompt.includes("resume")
          ? "a resume"
          : prompt.includes("cover letter")
          ? "a cover letter"
          : prompt.includes("linkedin")
          ? "a LinkedIn profile"
          : "a professional document"
      }
`;

      // Use structured format for better control
      result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: canvasPrompt }],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens,
          // Add structured output parameters if needed
          // structuredOutputSchema: {...}
        },
      });
    } else {
      // Standard text generation
      result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens,
        },
      });
    }

    // Check for a valid response
    if (!result || !result.response || !result.response.text()) {
      console.error(
        "Empty or invalid response from Gemini API during generation. Falling back."
      );
      return generateLocalFallbackContent(prompt);
    }

    const responseText = result.response.text();
    console.log(
      "Content generation successful, response length:",
      responseText ? responseText.length : 0,
      "characters"
    );

    // Apply additional formatting to the response text
    let formattedText = responseText;

    if (useCanvas) {
      // Apply enhanced formatting to the response
      formattedText = enhanceTextFormatting(responseText, {
        isResume: prompt.includes("resume"),
        isCoverLetter: prompt.includes("cover letter"),
        isLinkedIn: prompt.includes("linkedin"),
      });
    }

    return formattedText;
  } catch (generationError) {
    console.error("Error generating content with Gemini API:", generationError);
    // Log detailed error information
    console.log("Generation error details:", {
      message: generationError.message,
      name: generationError.name,
      stack: generationError.stack?.substring(0, 200), // Log partial stack trace
      status: generationError.status, // Include status if available
    });
    console.log("Falling back to local content generation.");
    return generateLocalFallbackContent(prompt);
  }
};

/**
 * Enhance text formatting for better visual presentation
 * @param {string} text - The text to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted text
 */
const enhanceTextFormatting = (text, options = {}) => {
  const {
    isResume = false,
    isCoverLetter = false,
    isLinkedIn = false,
  } = options;

  let formattedText = text;

  // Common formatting improvements
  formattedText = formattedText
    // Ensure consistent heading formatting
    .replace(/^(#+)\s*([A-Za-z\s]+):?$/gm, "## $2")
    // Format section headers without markdown
    .replace(/^([A-Z][A-Za-z\s]+):$/gm, "## $1")
    // Ensure bullet points are consistent with proper indentation
    .replace(/(?:^|\n)[-*]\s+/g, "\n• ")
    // Ensure proper spacing between sections
    .replace(/(\n#+\s+[^\n]+)\n(?!\n)/g, "$1\n\n")
    // Remove excessive blank lines
    .replace(/\n{3,}/g, "\n\n");

  // Document-specific formatting
  if (isResume) {
    formattedText = formattedText
      // Format the name at the top (centered)
      .replace(/^([A-Za-z\s]+)$/m, (match) => {
        if (/^[A-Za-z\s]+$/.test(match) && formattedText.indexOf(match) < 50) {
          return `# ${match.trim()}`;
        }
        return match;
      })
      // Add horizontal line after the name for better visual separation
      .replace(/(^# [^\n]+\n)(?!\n----)/, "$1\n\n----\n")
      // Format dates to be consistent (MM/YYYY format)
      .replace(
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/gi,
        (match) => {
          const parts = match.split(/\s+/);
          const month = parts[0].substring(0, 3);
          const monthNum =
            [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].indexOf(month) + 1;
          return monthNum
            ? `${monthNum.toString().padStart(2, "0")}/${parts[1]}`
            : match;
        }
      )
      // Format company and position information
      .replace(/\*\*([^*]+)\*\*\s*(?:at|,)\s*\*\*([^*]+)\*\*/g, "$1 - $2")
      // Format dates to be right-aligned (for markdown rendering)
      .replace(/(\| \d{2}\/\d{4}( - (Present|\d{2}\/\d{4}))?)$/gm, "**$1**")
      // Ensure consistent spacing between main sections (double line breaks)
      .replace(/(^## [^\n]+\n(?:(?!^##)[^\n]*\n)*)(?=^## )/gm, "$1\n")
      // Consolidate skills sections into a single section
      .replace(
        /^## Skills\n\n([\s\S]*?)(?=^## |$)/m,
        (match, skillsContent) => {
          // Extract all skill categories and their content
          const skillCategories =
            skillsContent.match(
              /^([A-Za-z\/]+):\s*(.*?)(?=\n[A-Za-z\/]+:|$)/gms
            ) || [];

          if (skillCategories.length > 0) {
            // Combine all skills into a single paragraph with commas
            const allSkills = skillCategories
              .map((category) => {
                // eslint-disable-next-line no-unused-vars
                const [_, _categoryName, skills] =
                  category.match(/^([A-Za-z\/]+):\s*(.*?)$/s) || [];
                return skills ? skills.trim() : "";
              })
              .filter(Boolean)
              .join(", ");

            return `## Skills\n\n${allSkills}\n\n`;
          }

          return match;
        }
      );
  } else if (isCoverLetter) {
    // Get today's date for cover letter if needed
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    formattedText = formattedText
      // Ensure proper date format if not already formatted
      .replace(/^([A-Za-z]+ \d{1,2},? \d{4})(?!\n\n)/, "$1\n\n")
      // Add today's date if no date is present at the beginning
      .replace(/^(?![A-Za-z]+ \d{1,2},? \d{4})/, `${formattedDate}\n\n`)
      // Ensure proper spacing after greeting
      .replace(/(Dear .*?),(?!\n\n)/, "$1,\n\n")
      // Ensure proper spacing between paragraphs
      .replace(/(\.)(\n)([A-Z])/g, "$1\n\n$3")
      // Ensure proper spacing before closing
      .replace(
        /(\.)(\n)(Sincerely|Regards|Respectfully|Thank you|Best regards|Yours truly)/i,
        "$1\n\n$3"
      )
      // Ensure proper spacing after closing
      .replace(
        /(Sincerely|Regards|Respectfully|Thank you|Best regards|Yours truly),(?!\n\n)/i,
        "$1,\n\n"
      );
  } else if (isLinkedIn) {
    // Get today's date for LinkedIn bio if needed
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    formattedText = formattedText
      // Add today's date at the top if not already present
      .replace(/^/, `Last Updated: ${formattedDate}\n\n`)
      // Format LinkedIn headline
      .replace(/^(Headline:)(.*)$/m, "## $1$2")
      // Format About section
      .replace(/^(About:)(.*)$/m, "## $1$2")
      // Format Experience section
      .replace(/^(Experience:)(.*)$/m, "## $1$2")
      // Format Skills section
      .replace(/^(Skills:)(.*)$/m, "## $1$2");
  }

  return formattedText;
};

/**
 * Enhanced LinkedIn response parser
 * Extracts headline, about, and experience sections from AI response
 * Improved formatting for better readability and structure
 */
const parseLinkedInResponse = (responseText, profile) => {
  // More robust regex patterns with multiple possible section headers
  const headlinePattern =
    /(?:Headline|Professional Headline|Title):[\s\n]*(.*?)(?=(?:About|Summary|Profile|Experience):|$)/is;
  const aboutPattern =
    /(?:About|Summary|Profile):[\s\n]*(.*?)(?=(?:Experience|Work Experience|Professional Experience):|$)/is;
  const experiencePattern =
    /(?:Experience|Work Experience|Professional Experience|Current Role):[\s\n]*(.*?)(?=(?:Education|Skills|Certifications):|$)/is;

  // Extract sections with improved patterns
  const headlineMatch = responseText.match(headlinePattern);
  const aboutMatch = responseText.match(aboutPattern);
  const experienceMatch = responseText.match(experiencePattern);

  // Format headline with proper emphasis
  let headline = headlineMatch
    ? headlineMatch[1].trim()
    : profile.headline ||
      `${profile.currentPosition || "Experienced Professional"} at ${
        profile.industry || "an Industry"
      }`;

  // Format about section with proper paragraph structure
  let about = aboutMatch
    ? aboutMatch[1].trim()
    : responseText.substring(0, Math.min(1000, responseText.length)).trim();

  // Ensure paragraphs are properly separated
  about = about.replace(/\n{3,}/g, "\n\n"); // Replace excessive newlines with double newlines

  // Format experience section with proper structure
  let experience = experienceMatch
    ? experienceMatch[1].trim()
    : `${profile.currentPosition || "Professional"} with expertise in ${
        profile.industry || "their field"
      }.`;

  // Ensure bullet points are properly formatted
  experience = experience.replace(/(?:^|\n)[-•*]\s*/g, "\n• ");

  // Create structured response with improved formatting
  return {
    headline: headline,
    about: about,
    experience: experience,
  };
};

/**
 * Parse resume content into structured sections
 * @param {string} content - Raw resume content from AI
 * @returns {Object} - Structured resume sections
 */
exports.parseResumeContent = (content) => {
  // Extract sections using regex patterns
  const summaryMatch = content.match(
    /(?:Summary|Professional Summary|Profile):?\s*([\s\S]*?)(?=##|#|\*\*|$)/i
  );
  const experienceMatch = content.match(
    /(?:Experience|Work Experience|Professional Experience):?\s*([\s\S]*?)(?=##|#|\*\*Education|$)/i
  );
  const educationMatch = content.match(
    /(?:Education|Academic Background):?\s*([\s\S]*?)(?=##|#|\*\*Skills|$)/i
  );
  const skillsMatch = content.match(
    /(?:Skills|Core Competencies|Technical Skills):?\s*([\s\S]*?)(?=##|#|\*\*Additional|$)/i
  );
  const additionalMatch = content.match(
    /(?:Additional Information|Other Information|Certifications):?\s*([\s\S]*?)(?=$)/i
  );

  // Format summary with proper structure
  let summary = summaryMatch
    ? summaryMatch[1].trim()
    : "Professional with relevant experience and skills.";

  // Format experience section with proper bullet points
  let experience = experienceMatch ? experienceMatch[1].trim() : content.trim();
  // Ensure bullet points are properly formatted
  experience = experience.replace(/(?:^|\n)[-•*]\s*/g, "\n• ");

  // Format education section
  let education = educationMatch ? educationMatch[1].trim() : "";
  education = education.replace(/(?:^|\n)[-•*]\s*/g, "\n• ");

  // Format skills section with proper bullet points
  let skills = skillsMatch ? skillsMatch[1].trim() : "";
  // Convert comma-separated skills to bullet points if not already formatted
  if (skills && !skills.includes("•") && !skills.includes("-")) {
    skills = skills
      .split(/,\s*/)
      .map((skill) => `• ${skill.trim()}`)
      .join("\n");
  } else {
    skills = skills.replace(/(?:^|\n)[-•*]\s*/g, "\n• ");
  }

  // Format additional information
  let additional = additionalMatch ? additionalMatch[1].trim() : "";
  additional = additional.replace(/(?:^|\n)[-•*]\s*/g, "\n• ");

  // Return structured content with improved formatting
  return {
    summary: summary,
    experience: experience,
    education: education,
    skills: skills,
    additional: additional,
    rawContent: content, // Keep the raw content as well
  };
};

/**
 * Generate resume content using Gemini
 * @param {Object} promptData - Data for resume generation
 * @returns {Promise<Object>} - Generated resume content (structured and raw)
 */
exports.generateResume = async (promptData) => {
  try {
    console.log(
      "Generating resume with data:",
      JSON.stringify(promptData, null, 2)
    );
    const {
      jobTitle,
      skills,
      experience,
      education,
      additionalInfo,
      achievements,
      certifications,
      applicantName, // Add applicant name to the destructured variables
    } = promptData;

    // Format skills with bullet points if available
    const skillsList =
      skills && Array.isArray(skills) && skills.length > 0 // Added Array.isArray check
        ? skills.map((skill) => `• ${skill}`).join("\n")
        : "";

    // Format achievements if available
    const achievementsList = achievements
      ? `\nKey Achievements:\n${achievements}`
      : "";

    // Format certifications if available
    const certificationsList = certifications
      ? `\nCertifications:\n${certifications}`
      : "";

    // Get today's date in a formal format
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Enhanced prompt with more detailed instructions and improved formatting guidance
    const prompt = `
Create a professional, ATS-optimized resume for ${
      applicantName ? applicantName : "a candidate"
    } applying for a ${
      jobTitle || "desired"
    } position with the following details:

DATE:
${formattedDate}

APPLICANT NAME:
${applicantName || "Use a professional name placeholder"}

EXPERIENCE:
${experience || "Relevant work experience."}
${achievementsList}

EDUCATION:
${education || "Relevant education background."}

SKILLS:
${skillsList || "Key skills."}
${certificationsList}

${additionalInfo ? `ADDITIONAL INFORMATION:\n${additionalInfo}` : ""}

INSTRUCTIONS:
1. Create a clean, professional resume with consistent formatting that will look good in both Word and PDF formats.
2. Start with the applicant's name as a centered heading at the top.
3. Create a compelling professional summary (3-4 lines maximum) that highlights key qualifications.
4. Format the experience section with clear job titles, company names, locations, and dates (in MM/YYYY format).
5. Use bullet points that begin with strong action verbs to describe achievements and responsibilities.
6. Format the education section with degree, institution, location, and graduation date.
7. List ALL skills in a SINGLE section without categorization, separated by commas.
8. Use consistent formatting for all section headers (make them stand out with bold or underlining).
9. Ensure PROPER SPACING between sections - add a blank line between each main section.
10. Format all bullet points consistently using the "•" character with proper indentation.
11. Include dates for experience and education in a consistent right-aligned format.
12. Use a professional, clean font style throughout the document.
13. Avoid using excessive formatting, colors, or graphics that might not render well in different formats.
14. Ensure all content is properly aligned and has consistent spacing.
15. Format the document to be easily scannable by both ATS systems and human readers.
16. DO NOT split skills into multiple categories - keep them all in one section.
17. Do not add fictional information.


The resume should be ready to use in job applications with minimal editing and look professional when exported to PDF.
`;
    // Use the centralized content generation function with Canvas formatting
    let resumeContent;
    try {
      resumeContent = await generateContent(prompt, {
        temperature: 0.7, // Slightly higher temperature for creativity
        maxOutputTokens: 5000, // Increased token limit for more detailed content
        useCanvas: true, // Enable Canvas formatting for better visual presentation
      });
      console.log(
        "Successfully generated resume with Gemini Canvas formatting"
      );

      // Apply additional formatting to ensure consistency and professional appearance
      resumeContent = resumeContent
        // Format the name at the top (centered)
        .replace(/^([A-Za-z\s]+)$/m, (match) => {
          // Only apply to the first line if it looks like a name (no special characters)
          if (
            /^[A-Za-z\s]+$/.test(match) &&
            resumeContent.indexOf(match) < 50
          ) {
            return `# ${match.trim()}`;
          }
          return match;
        })
        // If applicant name is provided but not at the top, add it
        .replace(/^/, (match) => {
          if (
            applicantName &&
            !resumeContent.trim().startsWith("#") &&
            !resumeContent.trim().startsWith(applicantName)
          ) {
            return `# ${applicantName.trim()}\n\n`;
          }
          return match;
        })
        // Ensure section headers are properly formatted and consistent
        .replace(/^(#+)\s*([A-Za-z\s]+):?$/gm, "## $2")
        // Format section headers without markdown
        .replace(/^([A-Z][A-Za-z\s]+):$/gm, "## $1")
        // Ensure bullet points are consistent with proper indentation
        .replace(/(?:^|\n)[-*]\s+/g, "\n• ")
        // Ensure proper spacing between sections
        .replace(/(\n#+\s+[^\n]+)\n(?!\n)/g, "$1\n\n")
        // Format dates to be consistent (MM/YYYY format)
        .replace(
          /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/gi,
          (match) => {
            const parts = match.split(/\s+/);
            const month = parts[0].substring(0, 3);
            const monthNum =
              [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].indexOf(month) + 1;
            return monthNum
              ? `${monthNum.toString().padStart(2, "0")}/${parts[1]}`
              : match;
          }
        )
        // Format company and position information
        .replace(/\*\*([^*]+)\*\*\s*(?:at|,)\s*\*\*([^*]+)\*\*/g, "$1 - $2")
        // Remove excessive blank lines
        .replace(/\n{3,}/g, "\n\n")
        // Add proper spacing after bullet points for readability
        .replace(/•\s*([^\n]+)(?=\n[^•])/g, "• $1\n")
        // Ensure consistent spacing in contact information
        .replace(
          /(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)(?!\s+\|)/,
          "$1 | "
        )
        // Format phone numbers consistently
        .replace(/(\b\d{3}[-.)]\s*\d{3}[-.)]\s*\d{4}\b)(?!\s+\|)/, "$1 | ")
        // Add horizontal line after the name for better visual separation
        .replace(/(^# [^\n]+\n)(?!\n----)/, "$1\n\n----\n")
        // Format section headers with proper spacing
        .replace(/(^## [^\n]+)(?!\n\n)/gm, "$1\n\n")
        // Ensure job titles are properly formatted and stand out
        .replace(/\*\*([^*\n]+)\*\*/g, "$1")
        // Format dates to be right-aligned (for markdown rendering)
        .replace(/(\| \d{2}\/\d{4}( - (Present|\d{2}\/\d{4}))?)$/gm, "**$1**")
        // Add contact information section if not present, using real user data when available
        .replace(/(^# [^\n]+\n\n----\n\n)(?!([^#]*?@[^#]*?))/, (match, p1) => {
          // Use actual user data from promptData if available
          const email = promptData.email || promptData.contactInfo || "";
          const phone = promptData.phone || "";
          const location = promptData.location || "";

          // Only add contact section if we have at least one piece of contact info
          if (email || phone || location) {
            let contactInfo = [];
            if (email) contactInfo.push(`Email: ${email}`);
            if (phone) contactInfo.push(`Phone: ${phone}`);
            if (location) contactInfo.push(`Location: ${location}`);

            return `${p1}${contactInfo.join(" | ")}\n\n`;
          }
          return match;
        });

      // For database storage, we need to return the raw content as a string
      return resumeContent;
    } catch (error) {
      console.error("Error generating resume with Gemini:", error);
      // Log detailed error information
      console.log("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        status: error.status,
      });
      // Create a basic fallback resume if AI generation fails
      // Prepare contact information using real user data
      const email = promptData.email || promptData.contactInfo || "";
      const phone = promptData.phone || "";
      const location = promptData.location || "";

      let contactSection = "";
      if (email || phone || location) {
        let contactInfo = [];
        if (email) contactInfo.push(`Email: ${email}`);
        if (phone) contactInfo.push(`Phone: ${phone}`);
        if (location) contactInfo.push(`Location: ${location}`);
        contactSection = contactInfo.join(" | ");
      }

      const fallbackContent = `# ${applicantName || "Professional"} Resume

----

${contactSection}

## Summary

A dedicated professional with experience in ${
        jobTitle || "relevant"
      } roles, bringing valuable skills and a strong educational background. Seeking a challenging position to utilize expertise and contribute to organizational success.

## Experience

${
  experience
    ? experience
    : promptData.currentPosition
    ? `${promptData.currentPosition} - ${
        promptData.company || "Current Company"
      } | **Present**
• Demonstrated success in project delivery and team collaboration
• Implemented effective solutions to complex problems
• Contributed to organizational growth and success`
    : `Professional - Company Name | **Present**
• Demonstrated success in project delivery and team collaboration
• Implemented effective solutions to complex problems
• Contributed to organizational growth and success`
}

## Education

${education ? education : "Bachelor of Science - University Name | **05/2020**"}

## Skills

${
  skills && Array.isArray(skills)
    ? skills.join(", ")
    : "Technical expertise, Communication and teamwork, Problem-solving abilities, Project management, Analytical thinking"
}

${
  additionalInfo
    ? `## Additional Information\n\n${additionalInfo}`
    : "## Certifications\n\n• Relevant certification\n• Professional development"
}`;
      console.log("Using fallback content for resume");
      // For database storage, we need to return the raw content as a string
      return fallbackContent;
    }
  } catch (error) {
    console.error("Gemini Resume Generation Error:", error);
    if (error.name === "GeminiError") {
      throw error;
    }
    // Wrap other errors in GeminiError
    throw new GeminiError(
      error.message || "Error generating resume content",
      error.status || 500
    );
  }
};

/**
 * Parse cover letter content into structured sections
 * @param {string} content - Raw cover letter content from AI
 * @returns {Object} - Structured cover letter sections
 */
exports.parseCoverLetterContent = (content) => {
  // Extract sections using regex patterns
  const headerMatch = content.match(
    /^(.*?)(?=Dear|To Whom|Hiring Manager|Recruiter)/is
  );
  const greetingMatch = content.match(
    /(Dear.*?|To Whom.*?)(?=\n\n|\r\n\r\n)/is
  );
  const introMatch = content.match(
    /(?:Dear.*?\n\n|\r\n\r\n)(.*?)(?=\n\n|\r\n\r\n)/s
  );
  // Find the closing section (typically starts with "Sincerely" or similar)
  const closingMatch = content.match(
    /(?:Sincerely|Regards|Respectfully|Thank you|Best regards|Yours truly).*$/is
  );

  // The body is everything between intro and closing
  let bodyContent = content;
  if (introMatch && introMatch.index !== undefined) {
    const introEndPos = introMatch.index + introMatch[0].length;
    const closingStartPos =
      closingMatch && closingMatch.index !== undefined
        ? closingMatch.index
        : content.length; // If no closing, body goes to the end
    bodyContent = content.substring(introEndPos, closingStartPos).trim();
  } else if (closingMatch && closingMatch.index !== undefined) {
    // If no intro match but there's a closing, body is everything before closing
    bodyContent = content.substring(0, closingMatch.index).trim();
  }

  // Format header with proper date structure
  let header = headerMatch ? headerMatch[1].trim() : "";
  // If header doesn't contain a date, try to add one
  if (!header.match(/\d{1,2}\/\d{1,2}\/\d{2,4}|\w+ \d{1,2},? \d{4}/)) {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    header = currentDate + "\n\n" + header;
  }

  // Format greeting with proper spacing
  let greeting = greetingMatch
    ? greetingMatch[0].trim()
    : "Dear Hiring Manager,";

  // Format introduction with proper paragraph structure
  let introduction = introMatch ? introMatch[1].trim() : "";

  // Format body with proper paragraph spacing
  // Ensure paragraphs are properly separated
  bodyContent = bodyContent.replace(/\n{3,}/g, "\n\n");

  // Format closing with proper spacing and structure
  let closing = closingMatch
    ? closingMatch[0].trim()
    : "Sincerely,\n\n[Your Name]";
  // Ensure there's proper spacing between "Sincerely," and the name
  closing = closing.replace(
    /(?:Sincerely|Regards|Respectfully|Thank you|Best regards|Yours truly),?\s*(\w)/i,
    (match, p1) => match.replace(p1, "\n\n" + p1)
  );

  // Return structured content with improved formatting
  return {
    header: header,
    greeting: greeting,
    introduction: introduction,
    body: bodyContent,
    closing: closing,
    rawContent: content, // Keep the raw content as well
  };
};

/**
 * Generate cover letter content using Gemini
 * @param {Object} promptData - Data for cover letter generation
 * @returns {Promise<Object>} - Generated cover letter content (structured and raw)
 */
exports.generateCoverLetter = async (promptData) => {
  try {
    console.log(
      "Generating cover letter with data:",
      JSON.stringify(promptData, null, 2)
    );
    const {
      jobTitle,
      companyName,
      skills,
      experience,
      jobDescription,
      additionalInfo,
      hiringManager,
      applicantName,
      contactInfo,
    } = promptData;

    // Format skills with bullet points if available
    const skillsText =
      skills && Array.isArray(skills) && skills.length > 0
        ? `Skills: ${skills.join(", ")}`
        : ""; // Added Array.isArray check

    // Format job description if available
    const jobDescText = jobDescription
      ? `Job Description: ${jobDescription}`
      : "";

    // Determine greeting based on hiring manager info
    const greetingText = hiringManager
      ? `Dear ${hiringManager},`
      : "Dear Hiring Manager,";

    // Format contact info if available
    const contactText = contactInfo
      ? `Contact Information: ${contactInfo}`
      : "";

    // Get today's date in a formal format
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Enhanced prompt with more detailed instructions and improved formatting guidance
    const prompt = `
Write a compelling, personalized cover letter for a ${
      jobTitle || "relevant"
    } position at ${companyName || "a company"} with the following details:

DATE:
${formattedDate}

APPLICANT INFORMATION:
${applicantName ? `Name: ${applicantName}` : ""}
${contactText}
${promptData.email ? `Email: ${promptData.email}` : ""}
${promptData.phone ? `Phone: ${promptData.phone}` : ""}
${promptData.location ? `Location: ${promptData.location}` : ""}
${
  promptData.currentPosition
    ? `Current Position: ${promptData.currentPosition}`
    : ""
}
${promptData.company ? `Current Company: ${promptData.company}` : ""}

EXPERIENCE:
${experience || "Relevant experience details."}

SKILLS:
${skillsText || "Key skills."}

JOB DETAILS:
${jobDescText}
${additionalInfo ? `Additional Context: ${additionalInfo}` : ""}

INSTRUCTIONS:
1. Start with today's date in the format "Month Day, Year" (e.g., "January 15, 2023").
2. Add a professional greeting (${greetingText}) with proper spacing after the date.
3. Write a compelling introduction that mentions the specific position and expresses enthusiasm.
4. Create 2-3 body paragraphs that highlight relevant skills and experiences that match the job requirements.
5. Connect your experience directly to the company's needs and values.
6. Include specific achievements with measurable results where possible.
7. Write a confident closing paragraph that requests an interview.
8. End with a professional sign-off (Sincerely, Respectfully, etc.) followed by two line breaks and then the name.
9. Ensure proper spacing between paragraphs (double line breaks).
10. Keep paragraphs concise and focused (3-5 sentences each).
11. Use a professional, enthusiastic tone throughout.
13. dont do any formatting like bold and italics.
14. Do not add fictional information.
${
  applicantName
    ? `12. Include the name "${applicantName}" in the signature.`
    : ""
}

The cover letter should be professional, enthusiastic, and tailored specifically to ${
      companyName || "the company"
    }.
Avoid generic language and focus on why the applicant is a perfect fit for this specific role.
`;
    // Use the centralized content generation function with Canvas formatting
    let coverLetterContent;
    try {
      coverLetterContent = await generateContent(prompt, {
        temperature: 0.6, // Slightly lower temperature for more professional tone
        maxOutputTokens: 5000, // Increased token limit for more detailed content
        useCanvas: true, // Enable Canvas formatting for better visual presentation
      });
      console.log(
        "Successfully generated cover letter with Gemini Canvas formatting"
      );

      // Apply additional formatting to ensure consistency
      coverLetterContent = coverLetterContent
        // Ensure proper date format if not already formatted
        .replace(/^([A-Za-z]+ \d{1,2},? \d{4})(?!\n\n)/, "$1\n\n")
        // Ensure proper spacing after greeting
        .replace(/(Dear .*?),(?!\n\n)/, "$1,\n\n")
        // Ensure proper spacing between paragraphs
        .replace(/(\.)(\n)([A-Z])/g, "$1\n\n$3")
        // Ensure proper spacing before closing
        .replace(
          /(\.)(\n)(Sincerely|Regards|Respectfully|Thank you|Best regards|Yours truly)/i,
          "$1\n\n$3"
        )
        // Ensure proper spacing after closing
        .replace(
          /(Sincerely|Regards|Respectfully|Thank you|Best regards|Yours truly),(?!\n\n)/i,
          "$1,\n\n"
        )
        // Remove excessive blank lines
        .replace(/\n{3,}/g, "\n\n");

      // For database storage, we need to return the raw content as a string
      return coverLetterContent;
    } catch (error) {
      console.error("Error generating cover letter with Gemini:", error);
      // Log detailed error information
      console.log("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        status: error.status,
      });
      // Create a basic fallback cover letter if AI generation fails
      // Use the same date format as in the prompt for consistency
      const currentDate =
        formattedDate ||
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

      // Use real contact information if available
      const contactDetails = [];
      if (promptData.email) contactDetails.push(promptData.email);
      if (promptData.phone) contactDetails.push(promptData.phone);
      if (promptData.location) contactDetails.push(promptData.location);

      const contactHeader =
        contactDetails.length > 0
          ? `${applicantName || ""}\n${contactDetails.join(" | ")}\n\n`
          : "";

      // Format skills properly
      const skillsFormatted =
        skills && Array.isArray(skills) && skills.length > 0
          ? skills.join(", ")
          : typeof skills === "string"
          ? skills
          : "relevant skills";

      const fallbackContent = `${contactHeader}${currentDate}

${greetingText}

I am writing to express my interest in the ${
        jobTitle || "relevant"
      } position at ${
        companyName || "your company"
      }. With my background in ${skillsFormatted}, I believe I would be a valuable addition to your team.

${experience || ""}

${additionalInfo ? additionalInfo : ""}

I am excited about the opportunity to contribute to ${
        companyName || "this company"
      } and would welcome the chance to discuss how my skills and experiences align with your needs.

Thank you for considering my application. I look forward to the possibility of working with you.

Sincerely,

${applicantName || "[Your Name]"}`;
      console.log("Using fallback content for cover letter");
      // For database storage, we need to return the raw content as a string
      return fallbackContent;
    }
  } catch (error) {
    console.error("Gemini Cover Letter Generation Error:", error);
    if (error.name === "GeminiError") {
      throw error;
    }
    // Wrap other errors in GeminiError
    throw new GeminiError(
      error.message || "Error generating cover letter content",
      error.status || 500
    );
  }
};

/**
 * Optimize content with industry-specific keywords and best practices
 * @param {Object} data - Optimization data (content, contentType, industry, keywords)
 * @returns {Promise<string>} - Optimized content
 */
exports.optimizeContent = async (data) => {
  try {
    const { content, contentType, industry, keywords } = data;
    if (!content) {
      throw new GeminiError("No content provided for optimization", 400);
    }

    // Determine content type for specific optimization strategies
    const type = contentType || "general";

    // Build optimization prompt based on content type
    let optimizationPrompt;
    switch (type.toLowerCase()) {
      case "resume":
        optimizationPrompt = `
Optimize the following resume content for ATS systems and human readers:
${content}

OPTIMIZATION INSTRUCTIONS:
1. Incorporate these industry keywords naturally: ${
          keywords || `relevant ${industry || "industry"} keywords`
        }
2. Ensure all bullet points start with strong action verbs.
3. Add quantifiable achievements where appropriate.
4. Maintain professional formatting and structure.
5. Keep the content concise and impactful.
6. Do not add fictional information.
Return the optimized resume content only.
`;
        break;
      case "cover-letter":
        optimizationPrompt = `
Optimize the following cover letter for impact and relevance:
${content}

OPTIMIZATION INSTRUCTIONS:
1. Incorporate these industry keywords naturally: ${
          keywords || `relevant ${industry || "industry"} keywords`
        }
2. Strengthen the opening hook and closing call-to-action.
3. Ensure the letter demonstrates a clear value proposition.
4. Maintain a professional tone and eliminate generic language.
5. Keep paragraphs concise (3-4 sentences maximum).
6. Do not add fictional information.
Return the optimized cover letter content only.
`;
        break;
      case "linkedin":
        optimizationPrompt = `
Optimize the following LinkedIn profile content for maximum visibility and impact:
${content}

OPTIMIZATION INSTRUCTIONS:
1. Incorporate these industry keywords naturally: ${
          keywords || `relevant ${industry || "industry"} keywords`
        }
2. Ensure the headline is compelling and keyword-rich (under 220 characters).
3. Add a clear call-to-action in the About section.
4. Use LinkedIn-friendly formatting (avoid special characters/symbols).
5. Maintain a first-person perspective and professional tone.
6. Do not add fictional information.
Return the optimized LinkedIn content only.
`;
        break;
      default:
        optimizationPrompt = `
Optimize the following content for clarity, impact, and professional quality:
${content}

OPTIMIZATION INSTRUCTIONS:
1. Incorporate these keywords naturally: ${keywords || "relevant keywords"}
2. Improve sentence structure and flow.
3. Eliminate redundancies and filler words.
4. Ensure professional tone and language.
5. Maintain the original meaning and information.
6. Do not add fictional information.
Return the optimized content only.
`;
    }

    // Generate optimized content
    // Note: Optimization doesn't have a specific fallback in the original code,
    // but generateContent handles its own fallback if the API fails.
    const optimizedContent = await generateContent(optimizationPrompt, {
      temperature: 0.3, // Lower temperature for more conservative optimization
      maxOutputTokens: 5000,
    });

    // If generateContent returned fallback content, the optimizedContent will contain the fallback note.
    // You might want to add a check here if you need to explicitly know if optimization used fallback.

    return optimizedContent;
  } catch (error) {
    console.error("Content Optimization Error:", error);
    if (error.name === "GeminiError") {
      throw error;
    }
    // Wrap other errors in GeminiError
    throw new GeminiError(
      error.message || "Error optimizing content",
      error.status || 500
    );
  }
};

/**
 * Analyze job description to extract key requirements and keywords
 * @param {Object} data - Job description data (jobDescription, jobTitle, company, industry)
 * @returns {Promise<Object>} - Analyzed job requirements
 */
exports.analyzeJobDescription = async (data) => {
  try {
    const { jobDescription, jobTitle, company, industry } = data;
    if (!jobDescription) {
      throw new GeminiError("No job description provided for analysis", 400);
    }

    // Build analysis prompt
    const analysisPrompt = `
Analyze the following job description for a ${jobTitle || "position"} at ${
      company || "a company"
    } in the ${industry || ""} industry:
${jobDescription}

ANALYSIS INSTRUCTIONS:
1. Extract the top 10-15 required skills mentioned explicitly or implicitly.
2. Identify 5-8 key responsibilities of the role.
3. Determine 3-5 preferred qualifications or "nice-to-haves".
4. Extract 10-15 important keywords that would help with ATS optimization.
5. Identify the likely years of experience required (e.g., "3-5 years", "Entry-level", "Senior").
6. Determine required education level if mentioned (e.g., "Bachelor's Degree", "Master's Preferred").
7. Identify any specific certifications or technical requirements.
8. Suggest 3-5 achievements that would impress for this role, based on the job description.
Format your response as a structured JSON object with these keys:
- requiredSkills (array of strings)
- keyResponsibilities (array of strings)
- preferredQualifications (array of strings)
- keywords (array of strings)
- experienceLevel (string)
- educationRequirements (string)
- certifications (array of strings)
- suggestedAchievements (array of strings)
Ensure all arrays contain only strings, not objects or arrays.
Provide ONLY the JSON object in your response, no extra text.
`;
    try {
      // Generate analysis
      // Note: Analysis doesn't have a specific fallback in the original code,
      // but generateContent handles its own fallback if the API fails.
      const analysisContent = await generateContent(analysisPrompt, {
        temperature: 0.2, // Lower temperature for more factual analysis
        maxOutputTokens: 5000,
      });

      // Attempt to parse the JSON response
      try {
        const parsedAnalysis = JSON.parse(analysisContent);
        return {
          ...parsedAnalysis,
          jobTitle: jobTitle || "Position",
          company: company || "Company",
          success: true, // Indicate successful structured parsing
          isFallback: false, // Explicitly mark as not fallback
        };
      } catch (parseError) {
        console.error("Error parsing job analysis JSON:", parseError);
        // Attempt to extract information with regex if JSON parsing fails
        // This is a fallback for parsing, not for API failure
        const skillsMatch = analysisContent.match(
          /requiredSkills.*?:.*?\[([\s\S]*?)\]/is // Use [\s\S]*? to match across lines
        );
        const keywordsMatch = analysisContent.match(
          /keywords.*?:.*?\[([\s\S]*?)\]/is // Use [\s\S]*? to match across lines
        );
        const responsibilitiesMatch = analysisContent.match(
          /keyResponsibilities.*?:.*?\[([\s\S]*?)\]/is
        );
        const preferredMatch = analysisContent.match(
          /preferredQualifications.*?:.*?\[([\s\S]*?)\]/is
        );
        const experienceMatch = analysisContent.match(
          /experienceLevel.*?:.*?"(.*?)"/is
        );
        const educationMatch = analysisContent.match(
          /educationRequirements.*?:.*?"(.*?)"/is
        );
        const certificationsMatch = analysisContent.match(
          /certifications.*?:.*?\[([\s\S]*?)\]/is
        );
        const achievementsMatch = analysisContent.match(
          /suggestedAchievements.*?:.*?\[([\s\S]*?)\]/is
        );

        return {
          requiredSkills: skillsMatch ? extractArrayItems(skillsMatch[1]) : [],
          keyResponsibilities: responsibilitiesMatch
            ? extractArrayItems(responsibilitiesMatch[1])
            : [],
          preferredQualifications: preferredMatch
            ? extractArrayItems(preferredMatch[1])
            : [],
          keywords: keywordsMatch ? extractArrayItems(keywordsMatch[1]) : [],
          experienceLevel: experienceMatch ? experienceMatch[1].trim() : "",
          educationRequirements: educationMatch ? educationMatch[1].trim() : "",
          certifications: certificationsMatch
            ? extractArrayItems(certificationsMatch[1])
            : [],
          suggestedAchievements: achievementsMatch
            ? extractArrayItems(achievementsMatch[1])
            : [],
          rawAnalysis: analysisContent, // Include the raw AI response
          jobTitle: jobTitle || "Position",
          company: company || "Company",
          success: false, // Indicate parsing failed
          error:
            "Could not parse structured JSON data from AI response. Extracted available fields.",
          isFallback: false, // This is a parsing fallback, not an API fallback
        };
      }
    } catch (error) {
      console.error("Error analyzing job description with Gemini:", error);
      // Return basic analysis if AI generation fails (this is the API fallback for analyze)
      console.log("Falling back to basic keyword extraction for analysis.");
      return {
        requiredSkills: extractBasicKeywords(jobDescription, 10),
        keywords: extractBasicKeywords(jobDescription, 15),
        keyResponsibilities: [],
        preferredQualifications: [],
        experienceLevel: "",
        educationRequirements: "",
        certifications: [],
        suggestedAchievements: [],
        rawDescription: jobDescription, // Include the original description
        jobTitle: jobTitle || "Position",
        company: company || "Company",
        success: false, // Indicate analysis failed
        error: error.message || "Error analyzing job description with AI.",
        isFallback: true, // Indicate this is a full fallback response
      };
    }
  } catch (error) {
    console.error("Job Description Analysis Error:", error);
    if (error.name === "GeminiError") {
      throw error;
    }
    // Wrap other errors in GeminiError
    throw new GeminiError(
      error.message || "Error analyzing job description",
      error.status || 500
    );
  }
};

/**
 * Helper function to extract array items from a string representation of an array.
 * Handles strings like '["item1", "item 2"]' or '[item1, item 2]'.
 * @param {string} str - String containing array items
 * @returns {Array<string>} - Extracted array items
 */
function extractArrayItems(str) {
  if (!str) return [];
  // Remove surrounding brackets and quotes, then split by comma.
  // Handles cases with spaces and different quote types.
  return str
    .replace(/^\[|\]$/g, "") // Remove leading/trailing brackets
    .split(",")
    .map((item) => item.replace(/^['"\s]+|['"\s]+$/g, "").trim()) // Remove quotes and trim whitespace
    .filter((item) => item.length > 0); // Filter out empty strings
}

/**
 * Extract basic keywords from text based on frequency and relevance
 * (Simple implementation, not a sophisticated keyword extractor)
 * @param {string} text - Text to extract keywords from
 * @param {number} count - Number of keywords to extract
 * @returns {Array<string>} - Extracted keywords
 */
function extractBasicKeywords(text, count = 10) {
  if (!text) return [];

  // Remove common stop words (can be expanded)
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "is",
    "are",
    "in",
    "to",
    "for",
    "with",
    "on",
    "at",
    "from",
    "by",
    "of",
    "be",
    "this",
    "that",
    "have",
    "has",
    "it",
    "its",
    "and/or",
    "etc",
    "vs",
    "via",
    "per",
    "as",
    "if",
    "then",
    "else",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "can",
    "will",
    "just",
    "don't",
    "should",
    "now",
    "d",
    "ll",
    "m",
    "o",
    "re",
    "ve",
    "y",
    "ain",
    "aren",
    "couldn",
    "didn",
    "doesn",
    "hadn",
    "hasn",
    "haven",
    "isn",
    "ma",
    "mightn",
    "mustn",
    "needn",
    "shan",
    "shouldn",
    "wasn",
    "weren",
    "won",
    "wouldn",
  ]);

  // Split text into words, convert to lowercase, and remove punctuation/numbers
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\d+/g, "") // Remove numbers
    .split(/\s+/) // Split by whitespace
    .filter((word) => word.length > 2 && !stopWords.has(word)); // Filter short words and stop words

  // Count word frequency
  const wordFrequency = {};
  words.forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Sort by frequency and return top 'count' words
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1]) // Sort descending by frequency
    .slice(0, count) // Take the top 'count' entries
    .map((entry) => entry[0]); // Return just the words
}

/**
 * Generate LinkedIn bio content using Gemini
 * @param {Object} data - Data for LinkedIn bio generation (profile, experience, preferences)
 * @returns {Promise<Object>} - Generated LinkedIn bio content
 */
exports.generateLinkedInBio = async (data) => {
  try {
    console.log(
      "Generating LinkedIn bio with data:",
      JSON.stringify(data, null, 2)
    );
    const { profile, experience, preferences } = data;

    // Format experience details if available
    const experienceText = experience.professionalExperience
      ? `Professional Experience: ${experience.professionalExperience}`
      : "";
    const educationText = experience.education
      ? `Education: ${experience.education}`
      : "";
    const certificationsText = experience.certifications
      ? `Certifications: ${experience.certifications}`
      : "";
    const skillsText = experience.skills
      ? `Skills: ${
          Array.isArray(experience.skills)
            ? experience.skills.join(", ")
            : experience.skills
        }` // Handle array or string
      : "";
    const achievementsText = experience.achievements
      ? `Key Achievements: ${experience.achievements}`
      : "";

    // Format preferences if available
    const focusPointsText = preferences.focusPoints
      ? `Key Points to Focus On: ${preferences.focusPoints}`
      : "";
    const keywordsText = preferences.keywords
      ? `Industry Keywords: ${
          Array.isArray(preferences.keywords)
            ? preferences.keywords.join(", ")
            : preferences.keywords
        }` // Handle array or string
      : "";

    // Determine tone based on preferences
    const toneDescription =
      preferences.tone === "professional"
        ? "professional and formal"
        : preferences.tone === "friendly"
        ? "friendly and approachable"
        : "creative and distinctive";

    // Get today's date in a formal format
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Enhanced prompt with more detailed instructions and improved formatting guidance
    const prompt = `
Create a compelling, keyword-optimized LinkedIn profile for ${
      profile.firstName || "[Your Name]"
    } ${profile.lastName || ""}, a ${
      profile.currentPosition || "professional"
    } in the ${
      profile.industry || "relevant"
    } industry with the following details:

DATE:
${formattedDate}

PERSONAL INFORMATION:
Full Name: ${profile.firstName || "[Your Name]"} ${profile.lastName || ""}
Current Position: ${profile.currentPosition || "Professional"}
Industry: ${profile.industry || "Relevant Industry"}
Location: ${profile.location || "Your Location"}
${profile.email ? `Email: ${profile.email}` : ""}
${profile.phone ? `Phone: ${profile.phone}` : ""}
${profile.company ? `Current Company: ${profile.company}` : ""}
${profile.website ? `Website: ${profile.website}` : ""}
Target Role: ${
      preferences.targetRole ||
      profile.currentPosition ||
      "relevant opportunities"
    }

BACKGROUND:
${experienceText}
${achievementsText}
${educationText}
${certificationsText}
${skillsText}

OPTIMIZATION GUIDANCE:
${focusPointsText}
${keywordsText}
Tone: ${toneDescription}

INSTRUCTIONS:
1. Create a powerful headline (max 220 characters) that includes job title, industry, and value proposition.
2. Write a compelling "About" section (max 2000 characters) that tells a career story and highlights expertise.
3. Craft an experience description for the current role that emphasizes achievements and skills.
4. Incorporate relevant keywords throughout for LinkedIn search optimization.
5. Use a first-person perspective and maintain a ${toneDescription} tone.
6. Format each section with clear labels: "Headline:", "About:", and "Experience:".
7. Include a call-to-action in the About section (e.g., "Connect with me to discuss...", "Learn more about...").
8. Use proper paragraph spacing with double line breaks between paragraphs.
9. Format any lists as bullet points with the "•" character.
10. Ensure the headline is bold and attention-grabbing.
11. Break the About section into 2-3 well-structured paragraphs with clear focus.
12. Format the Experience section with bullet points for key responsibilities and achievements.
13. dont do any formatting like bold and italics.
14. Do not add fictional information.

The profile should position ${
      profile.firstName || "the applicant"
    } as an authority in ${profile.industry || "their field"} and attract ${
      preferences.targetRole || "relevant"
    } opportunities.
`;
    // Use the centralized content generation function with Canvas formatting
    let linkedInContent;
    try {
      linkedInContent = await generateContent(prompt, {
        temperature: 0.7, // Balanced temperature for creativity and professionalism
        maxOutputTokens: 5000, // Increased token limit for more detailed content
        useCanvas: true, // Enable Canvas formatting for better visual presentation
      });
      console.log(
        "Successfully generated LinkedIn bio with Gemini Canvas formatting"
      );

      // Parse the content into structured sections for LinkedIn
      const parsedLinkedIn = parseLinkedInResponse(linkedInContent, profile);

      // Return the structured content for LinkedIn (this is different from resume/cover letter)
      return {
        about: parsedLinkedIn.about || "",
        headline: parsedLinkedIn.headline || "",
        experience: parsedLinkedIn.experience || "",
      };
    } catch (error) {
      console.error("Error generating LinkedIn bio with Gemini:", error);
      // Log detailed error information
      console.log("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        status: error.status,
      });
      // Create a basic fallback LinkedIn profile if AI generation fails
      // Use real user data for a more personalized fallback
      const fullName = `${profile.firstName || ""} ${
        profile.lastName || ""
      }`.trim();
      const position = profile.currentPosition || "";
      const industry = profile.industry || "";
      const location = profile.location || "";

      // Extract real skills if available
      const skillsList = experience.skills
        ? Array.isArray(experience.skills)
          ? experience.skills.join(", ")
          : experience.skills
        : "";

      // Extract real achievements if available
      const achievementsList = experience.achievements || "";

      const fallbackContent = `
Headline: ${fullName || "[Your Name]"} | ${position || "Professional"} | ${
        industry || "Industry"
      } Professional

About:
Experienced ${position || "professional"} in the ${
        industry || "relevant"
      } industry${location ? ` based in ${location}` : ""}. ${
        experienceText
          ? experienceText.replace("Professional Experience: ", "")
          : ""
      }

${skillsList ? `Skilled in ${skillsList}` : ""}

I'm passionate about delivering results and connecting with other professionals in my field. Feel free to reach out to discuss collaboration opportunities.

Experience:
As a ${position || "professional"}, I ${
        experience.professionalExperience
          ? experience.professionalExperience
          : `have developed expertise in ${
              industry || "my field"
            } and contributed to organizational success.`
      }

${
  achievementsList
    ? `• ${achievementsList.replace(/\n/g, "\n• ")}`
    : `• Demonstrated success in project delivery and team leadership
• Expertise in problem-solving and strategic planning
• Committed to continuous learning and professional development`
}
`;
      console.log("Using fallback content for LinkedIn bio");
      // Parse the fallback content
      const parsedFallback = parseLinkedInResponse(fallbackContent, profile);

      // Return the structured content for LinkedIn (this is different from resume/cover letter)
      return {
        about: parsedFallback.about || "",
        headline: parsedFallback.headline || "",
        experience: parsedFallback.experience || "",
      };
    }
  } catch (error) {
    console.error("Gemini LinkedIn Bio Generation Error:", error);
    if (error.name === "GeminiError") {
      throw error;
    }
    // Wrap other errors in GeminiError
    throw new GeminiError(
      error.message || "Error generating LinkedIn bio content",
      error.status || 500
    );
  }
};

// Helper exports (if needed elsewhere)
// exports.extractArrayItems = extractArrayItems;
// exports.extractBasicKeywords = extractBasicKeywords;

// You might want to export the generateContent function if it's used directly
// exports.generateContent = generateContent;

// Also export the error class if needed
// exports.GeminiError = GeminiError;
