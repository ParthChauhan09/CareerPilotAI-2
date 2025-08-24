/**
 * Enhanced LaTeX to PDF Compilation Service
 * 
 * This service now uses:
 * 1. LaTeX-on-HTTP API (primary) - https://latex.ytotech.com/
 * 2. Puppeteer HTML fallback (secondary)
 */

const axios = require('axios');
const puppeteer = require('puppeteer');

/**
 * Validate LaTeX content structure
 */
function validateLatexContent(latexContent) {
  const errors = [];
  const warnings = [];

  if (!latexContent.includes('\\documentclass')) {
    errors.push('Missing \\documentclass declaration');
  }
  if (!latexContent.includes('\\begin{document}')) {
    errors.push('Missing \\begin{document}');
  }
  if (!latexContent.includes('\\end{document}')) {
    errors.push('Missing \\end{document}');
  }

  if (latexContent.includes('{') && !latexContent.includes('}')) {
    warnings.push('Unmatched braces detected');
  }

  const specialChars = ['&', '%', '$', '#', '_'];
  specialChars.forEach(char => {
    const regex = new RegExp(`[^\\\\]\\${char}`, 'g');
    if (regex.test(latexContent)) {
      warnings.push(`Potentially unescaped special characters: ${char}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Clean and fix common LaTeX issues
 */
function cleanLatexContent(latexContent) {
  let cleaned = latexContent;

  // Remove markdown/code fences
  cleaned = cleaned.replace(/```latex\s*/g, '');
  cleaned = cleaned.replace(/```\s*/g, '');
  cleaned = cleaned.replace(/^```[\w]*\s*/gm, '');
  cleaned = cleaned.replace(/```$/gm, '');

  // Remove extra AI comments/explanations
  cleaned = cleaned.replace(/Remember to replace.*$/s, '');
  cleaned = cleaned.replace(/This example provides.*$/s, '');
  cleaned = cleaned.replace(/Also consider tailoring.*$/s, '');
  cleaned = cleaned.replace(/\n\nRemember.*$/s, '');

  // Extract only LaTeX doc
  const docStart = cleaned.indexOf('\\documentclass');
  if (docStart > 0) cleaned = cleaned.substring(docStart);

  const docEnd = cleaned.indexOf('\\end{document}');
  if (docEnd !== -1) {
    cleaned = cleaned.substring(0, docEnd + '\\end{document}'.length);
  }

  // Escape issues
  cleaned = cleaned.replace(/([^\\])&/g, '$1\\&');
  cleaned = cleaned.replace(/([^\\])%/g, '$1\\%');
  cleaned = cleaned.replace(/([^\\])\$/g, '$1\\$');
  cleaned = cleaned.replace(/([^\\])#/g, '$1\\#');
  cleaned = cleaned.replace(/([^\\])_/g, '$1\\_');

  cleaned = cleaned.replace(/\\\\n/g, '\\\\\n');
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  return cleaned.trim();
}

/**
 * Compile LaTeX to PDF using LaTeX-on-HTTP API (Primary)
 */
async function compileWithLatexOnHttp(latexContent, fileName = 'document') {
  try {
    console.log('Compiling LaTeX with LaTeX-on-HTTP API...');

    const cleanedContent = cleanLatexContent(latexContent);
    const validation = validateLatexContent(cleanedContent);

    if (!validation.isValid) {
      console.warn('LaTeX validation warnings:', validation.errors);
    }

    const payload = {
      compiler: "xelatex", // better Unicode/font support
      resources: [{ main: true, content: cleanedContent }]
    };

    const response = await axios.post(
      'https://latex.ytotech.com/builds/sync',
      payload,
      { headers: { 'Content-Type': 'application/json' }, responseType: 'arraybuffer', timeout: 30000 }
    );

    if ((response.status === 200 || response.status === 201) && response.data.byteLength > 100) {
      console.log('LaTeX-on-HTTP compilation successful, PDF size:', response.data.byteLength);
      return Buffer.from(response.data);
    } else {
      throw new Error(`LaTeX-on-HTTP compilation failed: status ${response.status}`);
    }

  } catch (error) {
    console.error('LaTeX-on-HTTP error:', error.message);
    throw new Error(`LaTeX-on-HTTP compilation failed: ${error.message}`);
  }
}

/**
 * Generate PDF using Puppeteer as fallback
 */
async function generateFallbackPdf(latexContent, fileName, promptData = {}) {
  const pdfGenerator = require('./pdfGenerator');
  try {
    console.log('Generating fallback PDF using Puppeteer...');
    const pdfBuffer = await pdfGenerator.generatePdfFromLatex(latexContent, fileName, promptData);
    console.log('Puppeteer fallback successful, size:', pdfBuffer.length);
    return pdfBuffer;
  } catch (error) {
    console.error('Puppeteer fallback error:', error.message);
    throw new Error(`Fallback PDF failed: ${error.message}`);
  }
}

/**
 * Main function to compile LaTeX to PDF
 * - Primary: LaTeX-on-HTTP
 * - Fallback: Puppeteer
 */
async function compileLatexToPdf(latexContent, fileName = 'document', promptData = {}) {
  console.log('Starting LaTeX-to-PDF compilation...');

  // Method 1: LaTeX-on-HTTP
  try {
    const pdfBuffer = await compileWithLatexOnHttp(latexContent, fileName);
    if (pdfBuffer.length > 1000) return pdfBuffer;
    else throw new Error('LaTeX-on-HTTP generated small PDF');
  } catch (err) {
    console.warn('LaTeX-on-HTTP failed:', err.message);
  }

  // Method 2: Puppeteer fallback
  try {
    const pdfBuffer = await generateFallbackPdf(latexContent, fileName, promptData);
    if (pdfBuffer.length > 1000) return pdfBuffer;
    else throw new Error('Puppeteer generated small PDF');
  } catch (err) {
    console.error('Puppeteer fallback failed:', err.message);
    throw new Error(`All PDF methods failed. Last error: ${err.message}`);
  }
}

/**
 * Legacy alias
 */
async function compileToPdf(latexContent, fileName, promptData) {
  return compileLatexToPdf(latexContent, fileName, promptData);
}

module.exports = {
  compileLatexToPdf,
  compileToPdf,
  generateFallbackPdf,
  validateLatexContent,
  cleanLatexContent
};
