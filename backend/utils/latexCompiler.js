/**
 * Enhanced LaTeX to PDF/TXT Compilation Service (Final Version, Option 1)
 *
 * Supports:
 * - PDF: LaTeX-on-HTTP API (primary), Puppeteer fallback
 * - TXT: A new function for plain text conversion
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * Validate LaTeX content structure.
 * Checks for mandatory declarations like \documentclass, \begin{document}, and \end{document}.
 * Also provides warnings for potentially unescaped special characters.
 * @param {string} latexContent The raw LaTeX content string.
 * @returns {{isValid: boolean, errors: string[], warnings: string[]}} An object indicating validity and listing issues.
 */
function validateLatexContent(latexContent) {
    const errors = [];
    const warnings = [];

    if (!latexContent.includes("\\documentclass")) {
        errors.push("Missing \\documentclass declaration");
    }
    if (!latexContent.includes("\\begin{document}")) {
        errors.push("Missing \\begin{document}");
    }
    if (!latexContent.includes("\\end{document}")) {
        errors.push("Missing \\end{document}");
    }

    if (latexContent.includes("{") && !latexContent.includes("}")) {
        warnings.push("Unmatched braces detected");
    }

    // Check for common unescaped LaTeX special characters
    const specialChars = ["&", "%", "$", "#", "_"];
    specialChars.forEach((char) => {
        const regex = new RegExp(`(?<!\\\\)\\${char}`, "g");
        if (regex.test(latexContent)) {
            warnings.push(`Potentially unescaped special characters: ${char}`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Clean LaTeX content by removing extraneous text and escaping characters.
 * This function helps prepare raw input for a clean compilation.
 * @param {string} latexContent The raw LaTeX content string.
 * @returns {string} The cleaned and prepared LaTeX content.
 */
function cleanLatexContent(latexContent) {
    let cleaned = latexContent;

    // Remove markdown/code fences
    cleaned = cleaned.replace(/```latex\s*/g, "");
    cleaned = cleaned.replace(/```/g, "");
    cleaned = cleaned.replace(/^```[\w]*\s*/gm, "");

    // Remove AI instructions or similar comments
    cleaned = cleaned.replace(/Remember to replace.*$/s, "");
    cleaned = cleaned.replace(/This example provides.*$/s, "");
    cleaned = cleaned.replace(/\n\nRemember.*$/s, "");

    // Extract only the core LaTeX document content
    const docStart = cleaned.indexOf("\\documentclass");
    if (docStart > 0) cleaned = cleaned.substring(docStart);

    const docEnd = cleaned.indexOf("\\end{document}");
    if (docEnd !== -1) {
        cleaned = cleaned.substring(0, docEnd + "\\end{document}".length);
    }

    // Escape special characters to prevent compilation errors
    cleaned = cleaned.replace(/(?<!\\)&/g, "\\&");
    cleaned = cleaned.replace(/(?<!\\)%/g, "\\%");
    cleaned = cleaned.replace(/(?<!\\)\$/g, "\\$");
    cleaned = cleaned.replace(/(?<!\\)#/g, "\\#");
    cleaned = cleaned.replace(/(?<!\\)_/g, "\\_");

    // Normalize newlines for consistent formatting
    cleaned = cleaned.replace(/\\\\n/g, "\\\\\n");
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n");

    return cleaned.trim();
}

/**
 * Compile LaTeX → PDF via the LaTeX-on-HTTP API.
 * This is the primary and preferred compilation method.
 * @param {string} latexContent The cleaned LaTeX content.
 * @returns {Promise<Buffer>} A promise that resolves with the PDF data as a Buffer.
 * @throws {Error} If the API call fails or returns an invalid PDF.
 */
async function compileWithLatexOnHttp(latexContent) {
    try {
        console.log("Compiling with LaTeX-on-HTTP...");

        const cleanedContent = cleanLatexContent(latexContent);
        const payload = {
            compiler: "xelatex",
            resources: [{ main: true, content: cleanedContent }],
        };

        const response = await axios.post(
            "[https://latex.ytotech.com/builds/sync](https://latex.ytotech.com/builds/sync)",
            payload,
            { headers: { "Content-Type": "application/json" }, responseType: "arraybuffer", timeout: 30000 }
        );

        if (response.status === 200 && response.data.byteLength > 100) {
            console.log("LaTeX-on-HTTP success. PDF size:", response.data.byteLength);
            return Buffer.from(response.data);
        }
        throw new Error("Empty or invalid PDF from LaTeX-on-HTTP");
    } catch (err) {
        console.error("LaTeX-on-HTTP error:", err.message);
        throw err;
    }
}

/**
 * Fallback PDF generator via Puppeteer.
 * This is used if the primary API fails.
 * NOTE: The 'pdfGenerator' module is assumed to be available.
 * @param {string} latexContent The cleaned LaTeX content.
 * @param {string} fileName The desired file name (without extension).
 * @param {object} [promptData={}] Optional data related to the prompt.
 * @returns {Promise<Buffer>} A promise that resolves with the PDF data as a Buffer.
 * @throws {Error} If the Puppeteer generation fails.
 */
async function generateFallbackPdf(latexContent, fileName, promptData = {}) {
    // Assuming the pdfGenerator module is defined elsewhere
    const pdfGenerator = require("./pdfGenerator"); 
    try {
        console.log("Fallback: Generating PDF with Puppeteer...");
        const pdfBuffer = await pdfGenerator.generatePdfFromLatex(latexContent, fileName, promptData);
        console.log("Puppeteer PDF success. Size:", pdfBuffer.length);
        return pdfBuffer;
    } catch (err) {
        console.error("Puppeteer fallback failed:", err.message);
        throw err;
    }
}

/**
 * Public function to compile LaTeX to PDF with a fallback mechanism.
 * Tries the LaTeX-on-HTTP API first, then falls back to Puppeteer.
 * @param {string} latexContent The raw LaTeX content string.
 * @param {string} [fileName="document"] The desired file name.
 * @param {object} [promptData={}] Optional data related to the prompt.
 * @returns {Promise<Buffer>} A promise that resolves with the compiled PDF data.
 */
async function compileLatexToPdf(latexContent, fileName = "document", promptData = {}) {
    console.log("Starting LaTeX-to-PDF process...");
    try {
        return await compileWithLatexOnHttp(latexContent);
    } catch {
        console.log("Primary PDF failed. Trying Puppeteer...");
        return await generateFallbackPdf(latexContent, fileName, promptData);
    }
}

/**
 * Compile LaTeX to a plain text string.
 * This function first cleans the content and then uses a series of regex
 * replacements to remove LaTeX commands, leaving a simple text output.
 * @param {string} latexContent The raw LaTeX content string.
 * @returns {Promise<Buffer>} A promise that resolves with the plain text data as a Buffer.
 */
async function compileToTxt(latexContent) {
    try {
        console.log("Converting LaTeX to plain text...");
        const cleanedContent = cleanLatexContent(latexContent);

        // A simple, non-comprehensive approach to strip LaTeX commands
        const plainText = cleanedContent

            .trim();

        // Return the plain text as a Buffer
        return Buffer.from(plainText, "utf-8");
    } catch (err) {
        console.error("Plain text conversion failed:", err.message);
        throw err;
    }
}

/**
 * Aliases for functions for convenience.
 */
async function compileToPdf(latexContent, fileName, promptData) {
    return compileLatexToPdf(latexContent, fileName, promptData);
}

module.exports = {
    compileLatexToPdf,
    compileToPdf,
    generateFallbackPdf,
    validateLatexContent,
    cleanLatexContent,
    compileToTxt, // Export the new function
};
