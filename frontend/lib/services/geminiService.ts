/**
 * Gemini API Service
 * Handles all interactions with Google's Generative AI (Gemini) API
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import serverConfig from "@/lib/server-config";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(serverConfig.gemini.apiKey);

/**
 * Generate resume content using Gemini
 */
export async function generateResume(promptData: any, user?: any): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({
            model: serverConfig.gemini.model,
        });

        const prompt = buildResumePrompt(promptData);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Validate and ensure LaTeX format
        if (!text.includes("\\documentclass")) {
            text = wrapInLatex(text, "resume");
        }

        return text;
    } catch (error) {
        console.error("Error generating resume:", error);
        throw new Error(
            `Failed to generate resume: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Generate cover letter content using Gemini
 */
export async function generateCoverLetter(
    promptData: any,
    user?: any
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({
            model: serverConfig.gemini.model,
        });

        const prompt = buildCoverLetterPrompt(promptData);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Validate and ensure LaTeX format
        if (!text.includes("\\documentclass")) {
            text = wrapInLatex(text, "letter");
        }

        return text;
    } catch (error) {
        console.error("Error generating cover letter:", error);
        throw new Error(
            `Failed to generate cover letter: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Generate LinkedIn bio content using Gemini
 */
export async function generateLinkedInBio(
    promptData: any,
    user?: any
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({
            model: serverConfig.gemini.model,
        });

        const prompt = buildLinkedInBioPrompt(promptData);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Error generating LinkedIn bio:", error);
        throw new Error(
            `Failed to generate LinkedIn bio: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Build resume generation prompt
 */
function buildResumePrompt(promptData: any): string {
    const {
        jobTitle = "Professional",
        skills = [],
        experience = "",
        education = "",
        additionalInfo = "",
    } = promptData;

    return `Generate a professional resume in LaTeX format for the following profile:

Job Title: ${jobTitle}
Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}
Experience: ${experience}
Education: ${education}
Additional Information: ${additionalInfo}

Requirements:
- Use proper LaTeX syntax with \\documentclass{article}
- Include all provided information in a well-formatted resume
- Use \\ for line breaks
- Include proper spacing and sections (Summary, Skills, Experience, Education)
- Make it professional and ATS-friendly
- Wrap all content in a proper LaTeX document structure`;
}

/**
 * Build cover letter generation prompt
 */
function buildCoverLetterPrompt(promptData: any): string {
    const {
        jobTitle = "Position",
        companyName = "Company",
        skills = [],
        experience = "",
        jobDescription = "",
        additionalInfo = "",
    } = promptData;

    return `Generate a professional cover letter in LaTeX format for the following:

Job Title: ${jobTitle}
Company: ${companyName}
Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}
Experience: ${experience}
Job Description: ${jobDescription}
Additional Information: ${additionalInfo}

Requirements:
- Use proper LaTeX syntax with \\documentclass{article}
- Write a compelling cover letter addressing the job requirements
- Include professional formatting with proper spacing
- Use \\ for line breaks
- Structure with opening, body paragraphs, and closing
- Personalize it based on the provided information
- Wrap all content in a proper LaTeX document structure`;
}

/**
 * Build LinkedIn bio generation prompt
 */
function buildLinkedInBioPrompt(promptData: any): string {
    const profile = promptData.profile || {};
    const experience = promptData.experience || {};
    const preferences = promptData.preferences || {};

    const {
        firstName = "Professional",
        lastName = "",
        headline = "",
        location = "",
        industry = "",
        currentPosition = "",
    } = profile;

    const {
        skills = "",
        professionalExperience = "",
        education = "",
        certifications = "",
    } = experience;

    const { tone = "professional", targetRole = "", focusPoints = "", keywords = "" } =
        preferences;

    return `Generate a compelling LinkedIn bio for:

Name: ${firstName} ${lastName}
Current Position: ${currentPosition}
Headline: ${headline}
Location: ${location}
Industry: ${industry}
Skills: ${skills}
Professional Experience: ${professionalExperience}
Education: ${education}
Certifications: ${certifications}
Target Role: ${targetRole}
Tone: ${tone}
Focus Points: ${focusPoints}
Keywords: ${keywords}

Requirements:
- Create an engaging, professional LinkedIn summary (100-200 words)
- Highlight key achievements and skills
- Use a ${tone} tone
- Include relevant keywords for searchability
- Focus on: ${focusPoints || "achievements, expertise, and career goals"}
- Make it compelling and ATS-friendly
- Structure with clear sections and bullet points where appropriate`;
}

/**
 * Wrap plain text content in LaTeX document structure
 */
function wrapInLatex(content: string, type: "resume" | "letter" = "resume"): string {
    const preamble = `\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\rfoot{\\thepage}

\\begin{document}
`;

    const closing = `\\end{document}`;

    // Clean up the content
    let cleanedContent = content
        .replace(/^#+\s+/gm, "\\section{") // Convert markdown headers to sections
        .replace(/\n/g, "\n");

    // If content doesn't have any LaTeX commands, wrap in basic structure
    if (!cleanedContent.includes("\\")) {
        cleanedContent = cleanedContent
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => {
                // Convert bold markdown
                line = line.replace(/\*\*(.*?)\*\*/g, "\\textbf{$1}");
                // Convert italic markdown
                line = line.replace(/\*(.*?)\*/g, "\\textit{$1}");
                return line;
            })
            .join("\n\n");
    }

    return `${preamble}${cleanedContent}\n${closing}`;
}

/**
 * Fallback content generators (in case Gemini fails)
 */
export function getResumeFallback(promptData: any): string {
    const {
        jobTitle = "Professional",
        skills = [],
        experience = "",
        education = "",
    } = promptData;

    return `\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\begin{document}

\\textbf{\\Large ${jobTitle}}

\\section*{Summary}
Skilled professional with expertise in ${Array.isArray(skills) ? skills.slice(0, 3).join(", ") : "technology"}.

\\section*{Skills}
${Array.isArray(skills) ? skills.map((skill: string) => `\\item ${skill}`).join("\n") : "N/A"}

\\section*{Experience}
${experience || "Professional experience available upon request"}

\\section*{Education}
${education || "Education details available upon request"}

\\end{document}`;
}

export function getCoverLetterFallback(promptData: any): string {
    const { jobTitle = "Position", companyName = "Company" } = promptData;

    return `\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\begin{document}

Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position at ${companyName}. With my strong background and proven track record, I am confident that I can contribute significantly to your team.

Throughout my career, I have developed expertise that aligns well with your requirements. I am excited about the opportunity to bring my skills and experience to your organization.

I look forward to discussing how I can contribute to ${companyName}'s continued success.

Sincerely,
[Your Name]

\\end{document}`;
}

export function getLinkedInBioFallback(profile: any): string {
    const { firstName = "Professional", currentPosition = "", headline = "" } = profile;

    return `${firstName} | ${currentPosition || "Professional"} ${headline ? `| ${headline}` : ""}

Dedicated professional with a passion for excellence and continuous growth.`;
}
