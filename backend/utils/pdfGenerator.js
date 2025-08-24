const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Parse LaTeX content to extract structured information
 * @param {string} latexContent - The LaTeX content
 * @returns {object} Parsed content structure
 */
function parseLatexContent(latexContent) {
  // Clean the LaTeX content first
  let cleaned = latexContent;
  
  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/```latex\s*/g, '');
  cleaned = cleaned.replace(/```\s*/g, '');
  cleaned = cleaned.replace(/^```[\w]*\s*/gm, '');
  cleaned = cleaned.replace(/Remember to replace.*$/s, '');
  cleaned = cleaned.replace(/This example provides.*$/s, '');
  
  // Extract document class and determine document type
  const docClassMatch = cleaned.match(/\\documentclass(?:\[[^\]]*\])?\{([^}]+)\}/);
  const documentType = docClassMatch ? docClassMatch[1] : 'article';
  
  // Extract name
  const nameMatch = cleaned.match(/\\name\{([^}]+)\}\{([^}]+)\}/);
  const name = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : '';
  
  // Extract title
  const titleMatch = cleaned.match(/\\title\{([^}]+)\}/);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Extract signature (for letters)
  const signatureMatch = cleaned.match(/\\signature\{([^}]+)\}/);
  const signature = signatureMatch ? signatureMatch[1] : '';
  
  // Extract address
  const addressMatch = cleaned.match(/\\address\{([^}]+)\}\{([^}]+)\}/);
  const address = addressMatch ? `${addressMatch[1]}, ${addressMatch[2]}` : '';
  
  // Extract sections
  const sections = [];
  const sectionRegex = /\\section\{([^}]+)\}([\s\S]*?)(?=\\section\{|\\end\{document\}|$)/g;
  let sectionMatch;
  
  while ((sectionMatch = sectionRegex.exec(cleaned)) !== null) {
    const sectionTitle = sectionMatch[1];
    const sectionContent = sectionMatch[2].trim();
    
    // Parse different types of content within sections
    const parsedContent = parseSectionContent(sectionContent, sectionTitle);
    
    sections.push({
      title: sectionTitle,
      content: parsedContent
    });
  }
  
  // For letters, extract opening, body, and closing
  let letterContent = null;
  if (documentType === 'letter') {
    const openingMatch = cleaned.match(/\\opening\{([^}]+)\}/);
    const closingMatch = cleaned.match(/\\closing\{([^}]+)\}/);
    
    // Extract letter body (everything between opening and closing)
    const bodyStart = cleaned.indexOf('\\opening{');
    const bodyEnd = cleaned.indexOf('\\closing{');
    
    if (bodyStart !== -1 && bodyEnd !== -1) {
      const bodySection = cleaned.substring(bodyStart, bodyEnd);
      // Remove the opening command and extract the actual body
      const bodyContent = bodySection.replace(/\\opening\{[^}]+\}\s*/, '').trim();
      
      letterContent = {
        opening: openingMatch ? openingMatch[1] : 'Dear Hiring Manager,',
        body: bodyContent,
        closing: closingMatch ? closingMatch[1] : 'Sincerely,'
      };
    }
  }
  
  return {
    documentType,
    name,
    title,
    signature,
    address,
    sections,
    letterContent
  };
}

/**
 * Parse section content based on LaTeX commands
 * @param {string} content - Section content
 * @param {string} sectionTitle - Section title for context
 * @returns {object} Parsed section content
 */
function parseSectionContent(content, sectionTitle) {
  const result = {
    type: 'text',
    items: []
  };
  
  // Check for cventry (moderncv entries)
  const cventryRegex = /\\cventry\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}/g;
  let cventryMatch;
  
  while ((cventryMatch = cventryRegex.exec(content)) !== null) {
    result.type = 'entries';
    result.items.push({
      date: cventryMatch[1],
      title: cventryMatch[2],
      organization: cventryMatch[3],
      location: cventryMatch[4],
      grade: cventryMatch[5],
      description: cventryMatch[6]
    });
  }
  
  // Check for cvitem (moderncv items)
  const cvitemRegex = /\\cvitem\{([^}]*)\}\{([^}]*)\}/g;
  let cvitemMatch;
  
  while ((cvitemMatch = cvitemRegex.exec(content)) !== null) {
    if (result.type === 'text') result.type = 'items';
    result.items.push({
      label: cvitemMatch[1],
      content: cvitemMatch[2]
    });
  }
  
  // If no specific LaTeX commands found, treat as plain text
  if (result.items.length === 0) {
    result.type = 'text';
    result.content = content.replace(/\\[a-zA-Z]+\{[^}]*\}/g, '').trim();
  }
  
  return result;
}

/**
 * Convert parsed LaTeX content to HTML for PDF generation
 * @param {object} parsedContent - Parsed LaTeX content
 * @param {object} promptData - The original prompt data
 * @returns {string} HTML content
 */
function parsedContentToHtml(parsedContent, promptData) {
  const { documentType, name, title, signature, address, sections, letterContent } = parsedContent;
  
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentType === 'letter' ? 'Cover Letter' : 'Resume'}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            color: #333;
            background: white;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            ${documentType === 'moderncv' ? 'border-bottom: 2px solid #2c5aa0; padding-bottom: 20px;' : ''}
        }
        .name {
            font-size: ${documentType === 'letter' ? '20px' : '28px'};
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 5px;
        }
        .title {
            font-size: 16px;
            color: #666;
            font-style: italic;
            margin-bottom: 10px;
        }
        .address {
            font-size: 12px;
            color: #666;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #2c5aa0;
            ${documentType === 'moderncv' ? 'border-bottom: 1px solid #2c5aa0;' : ''}
            padding-bottom: 5px;
            margin-bottom: 15px;
            text-transform: uppercase;
        }
        .entry {
            margin-bottom: 15px;
        }
        .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
        }
        .entry-title {
            font-weight: bold;
            color: #333;
        }
        .entry-organization {
            font-weight: bold;
            color: #2c5aa0;
        }
        .entry-location {
            color: #666;
            font-style: italic;
        }
        .entry-date {
            color: #666;
            font-style: italic;
            white-space: nowrap;
        }
        .entry-description {
            margin-top: 5px;
            color: #555;
            text-align: justify;
        }
        .skills-list {
            line-height: 1.8;
        }
        .letter-opening {
            margin-bottom: 20px;
            font-weight: bold;
        }
        .letter-body {
            text-align: justify;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .letter-body p {
            margin-bottom: 15px;
        }
        .letter-closing {
            margin-top: 30px;
        }
        .signature {
            margin-top: 40px;
            font-weight: bold;
        }
        @media print {
            body {
                padding: 20px;
            }
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>`;

  // Add header
  if (name || title) {
    htmlContent += `<div class="header">`;
    if (name) {
      htmlContent += `<div class="name">${name}</div>`;
    }
    if (title) {
      htmlContent += `<div class="title">${title}</div>`;
    }
    if (address) {
      htmlContent += `<div class="address">${address}</div>`;
    }
    htmlContent += `</div>`;
  }

  // Handle letter format
  if (documentType === 'letter' && letterContent) {
    htmlContent += `
      <div class="letter-opening">${letterContent.opening}</div>
      <div class="letter-body">
        ${letterContent.body.split('\n\n').map(paragraph => 
          paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
        ).join('')}
      </div>
      <div class="letter-closing">${letterContent.closing}</div>
      ${signature ? `<div class="signature">${signature}</div>` : ''}
    `;
  } else {
    // Handle resume/article format with sections
    sections.forEach(section => {
      htmlContent += `<div class="section">`;
      htmlContent += `<div class="section-title">${section.title}</div>`;
      
      if (section.content.type === 'entries') {
        // Handle cventry items
        section.content.items.forEach(item => {
          htmlContent += `
            <div class="entry">
              <div class="entry-header">
                <div>
                  <div class="entry-title">${item.title}</div>
                  <div class="entry-organization">${item.organization}</div>
                  ${item.location ? `<div class="entry-location">${item.location}</div>` : ''}
                </div>
                ${item.date ? `<div class="entry-date">${item.date}</div>` : ''}
              </div>
              ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
            </div>
          `;
        });
      } else if (section.content.type === 'items') {
        // Handle cvitem items
        section.content.items.forEach(item => {
          if (item.label) {
            htmlContent += `<div class="entry"><strong>${item.label}:</strong> ${item.content}</div>`;
          } else {
            htmlContent += `<div class="entry">${item.content}</div>`;
          }
        });
      } else {
        // Handle plain text content
        htmlContent += `<div class="entry">${section.content.content || section.content}</div>`;
      }
      
      htmlContent += `</div>`;
    });
  }

  htmlContent += `</body></html>`;
  return htmlContent;
}

/**
 * Convert LaTeX content to HTML for PDF generation
 * @param {string} latexContent - The LaTeX content
 * @param {object} promptData - The original prompt data
 * @returns {string} HTML content
 */
function latexToHtml(latexContent, promptData) {
  console.log("Converting LaTeX to HTML, content length:", latexContent.length);
  
  // Parse the LaTeX content
  const parsedContent = parseLatexContent(latexContent);
  console.log("Parsed LaTeX structure:", JSON.stringify(parsedContent, null, 2));
  
  // Convert to HTML
  const htmlContent = parsedContentToHtml(parsedContent, promptData);
  
  return htmlContent;
}

/**
 * Generate PDF from LaTeX content using Puppeteer
 * @param {string} latexContent - The LaTeX content
 * @param {string} fileName - Base file name for temp files
 * @param {object} promptData - The original prompt data
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generatePdfFromLatex(latexContent, fileName, promptData = {}) {
  let browser;
  
  try {
    console.log("Generating PDF from LaTeX using Puppeteer fallback");
    
    // Convert LaTeX to HTML with proper parsing
    const htmlContent = latexToHtml(latexContent, promptData);
    
    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content and generate PDF
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    console.log("Puppeteer PDF generation successful, size:", pdfBuffer.length, "bytes");
    return pdfBuffer;
    
  } catch (error) {
    console.error("Puppeteer PDF generation error:", error);
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Generate DOCX from LaTeX content (simplified version)
 * @param {string} latexContent - The LaTeX content
 * @param {string} fileName - Base file name for temp files
 * @param {object} promptData - The original prompt data
 * @returns {Promise<Buffer>} DOCX buffer
 */
async function generateDocxFromLatex(latexContent, fileName, promptData = {}) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
  
  try {
    // Parse the LaTeX content
    const parsedContent = parseLatexContent(latexContent);
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: parsedContent.name || 'Professional Resume',
                bold: true,
                size: 32,
                color: "2c5aa0"
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: "center"
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: parsedContent.title || promptData.jobTitle || 'Software Developer',
                italics: true,
                size: 24
              })
            ],
            alignment: "center"
          }),
          new Paragraph({ text: "" }), // Empty line
          
          // Add sections
          ...parsedContent.sections.flatMap(section => [
            new Paragraph({
              children: [
                new TextRun({
                  text: section.title.toUpperCase(),
                  bold: true,
                  size: 24,
                  color: "2c5aa0"
                })
              ],
              heading: HeadingLevel.HEADING_1
            }),
            ...generateDocxSectionContent(section),
            new Paragraph({ text: "" })
          ])
        ]
      }]
    });
    
    const buffer = await Packer.toBuffer(doc);
    return buffer;
    
  } catch (error) {
    throw new Error(`DOCX generation failed: ${error.message}`);
  }
}

/**
 * Generate DOCX content for a section
 * @param {object} section - Parsed section
 * @returns {Array} Array of DOCX paragraphs
 */
function generateDocxSectionContent(section) {
  const paragraphs = [];
  
  if (section.content.type === 'entries') {
    section.content.items.forEach(item => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${item.title} - ${item.organization}`,
              bold: true
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: item.description || ''
            })
          ]
        })
      );
    });
  } else if (section.content.type === 'items') {
    section.content.items.forEach(item => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.label ? `${item.label}: ${item.content}` : item.content
            })
          ]
        })
      );
    });
  } else {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.content.content || section.content
          })
        ]
      })
    );
  }
  
  return paragraphs;
}

/**
 * Generate TXT from LaTeX content
 * @param {string} latexContent - The LaTeX content
 * @param {string} fileName - Base file name for temp files
 * @param {object} promptData - The original prompt data
 * @returns {Promise<string>} TXT content
 */
async function generateTxtFromLatex(latexContent, fileName, promptData = {}) {
  try {
    // Parse the LaTeX content
    const parsedContent = parseLatexContent(latexContent);
    
    let txtContent = '';
    
    // Add header
    if (parsedContent.name) {
      txtContent += `${parsedContent.name}\n`;
    }
    if (parsedContent.title) {
      txtContent += `${parsedContent.title}\n`;
    }
    txtContent += `${'='.repeat(50)}\n\n`;
    
    // Add sections
    parsedContent.sections.forEach(section => {
      txtContent += `${section.title.toUpperCase()}\n`;
      txtContent += `${'-'.repeat(section.title.length)}\n`;
      
      if (section.content.type === 'entries') {
        section.content.items.forEach(item => {
          txtContent += `${item.title} - ${item.organization}\n`;
          if (item.description) {
            txtContent += `${item.description}\n`;
          }
          txtContent += '\n';
        });
      } else if (section.content.type === 'items') {
        section.content.items.forEach(item => {
          txtContent += item.label ? `${item.label}: ${item.content}\n` : `${item.content}\n`;
        });
      } else {
        txtContent += `${section.content.content || section.content}\n`;
      }
      
      txtContent += '\n';
    });
    
    return txtContent;
    
  } catch (error) {
    throw new Error(`TXT generation failed: ${error.message}`);
  }
}

module.exports = {
  generatePdfFromLatex,
  generateDocxFromLatex,
  generateTxtFromLatex
};