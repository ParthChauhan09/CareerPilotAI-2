const docx = require("docx");
const sanitizeHtml = require("sanitize-html");

const {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  Footer,
  LineRuleType,
} = docx;

/**
 * Direct HTML to DOCX conversion
 * @param {string} htmlContent - HTML content to convert
 * @param {string} title - Document title
 * @returns {Array} - Array of document elements (paragraphs, tables, etc.)
 */
function convertHtmlToDocxElements(htmlContent, title) {
  // Clean the HTML content with sanitize-html
  const cleanHtml = sanitizeHtml(htmlContent, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "ul",
      "ol",
      "li",
      "a",
      "b",
      "strong",
      "i",
      "em",
      "br",
      "div",
      "span",
      "table",
      "tr",
      "td",
      "th",
      "thead",
      "tbody",
    ],
    allowedAttributes: {
      a: ["href"],
      span: ["style"],
      div: ["style"],
      p: ["style"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
  });

  const elements = [];

  // Add title as the first element
  elements.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 240,
        after: 240,
      },
    })
  );

  // Process the HTML content by extracting different types of elements
  // This is a more direct approach than splitting by tags

  // Extract paragraphs
  const paragraphMatches = cleanHtml.match(/<p[^>]*>(.*?)<\/p>/gs) || [];
  for (const paragraphMatch of paragraphMatches) {
    const paragraphContent = paragraphMatch
      .replace(/<p[^>]*>(.*?)<\/p>/s, "$1")
      .trim();
    if (!paragraphContent) continue;

    const textRuns = processTextFormatting(paragraphContent);
    elements.push(
      new Paragraph({
        children: textRuns,
        spacing: {
          after: 240, // 12pt spacing after paragraphs
          line: 360, // 1.5 line spacing
          lineRule: LineRuleType.AUTO,
        },
      })
    );
  }

  // Extract headings
  const headingMatches = cleanHtml.match(/<h([1-6])[^>]*>(.*?)<\/h\1>/gs) || [];
  for (const headingMatch of headingMatches) {
    const headingLevel = parseInt(headingMatch.match(/<h([1-6])[^>]*>/)[1]);
    const headingContent = headingMatch
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/s, "$1")
      .trim();
    if (!headingContent) continue;

    elements.push(
      new Paragraph({
        text: headingContent,
        heading:
          headingLevel === 1
            ? HeadingLevel.HEADING_1
            : headingLevel === 2
            ? HeadingLevel.HEADING_2
            : HeadingLevel.HEADING_3,
        spacing: {
          before: 240, // 12pt spacing before
          after: 120, // 6pt spacing after
        },
      })
    );
  }

  // Extract lists
  const ulMatches = cleanHtml.match(/<ul[^>]*>(.*?)<\/ul>/gs) || [];
  for (const ulMatch of ulMatches) {
    const listItemMatches = ulMatch.match(/<li[^>]*>(.*?)<\/li>/gs) || [];
    for (const listItemMatch of listItemMatches) {
      const listItemContent = listItemMatch
        .replace(/<li[^>]*>(.*?)<\/li>/s, "$1")
        .trim();
      if (!listItemContent) continue;

      const textRuns = processTextFormatting(listItemContent);
      elements.push(
        new Paragraph({
          children: textRuns,
          bullet: {
            level: 0,
          },
          spacing: {
            after: 120,
          },
        })
      );
    }
  }

  // Extract ordered lists
  const olMatches = cleanHtml.match(/<ol[^>]*>(.*?)<\/ol>/gs) || [];
  for (const olMatch of olMatches) {
    const listItemMatches = olMatch.match(/<li[^>]*>(.*?)<\/li>/gs) || [];
    for (const listItemMatch of listItemMatches) {
      const listItemContent = listItemMatch
        .replace(/<li[^>]*>(.*?)<\/li>/s, "$1")
        .trim();
      if (!listItemContent) continue;

      const textRuns = processTextFormatting(listItemContent);
      elements.push(
        new Paragraph({
          children: textRuns,
          numbering: {
            reference: 1,
            level: 0,
          },
          spacing: {
            after: 120,
          },
        })
      );
    }
  }

  // Extract div elements (often used for sections)
  const divMatches = cleanHtml.match(/<div[^>]*>(.*?)<\/div>/gs) || [];
  for (const divMatch of divMatches) {
    const divContent = divMatch.replace(/<div[^>]*>(.*?)<\/div>/s, "$1").trim();
    if (!divContent) continue;

    // Skip if this div only contains elements we've already processed
    if (divContent.match(/<(p|h[1-6]|ul|ol)[^>]*>/)) continue;

    const textRuns = processTextFormatting(divContent);
    elements.push(
      new Paragraph({
        children: textRuns,
        spacing: {
          after: 240,
          line: 360,
          lineRule: LineRuleType.AUTO,
        },
      })
    );
  }

  // If no elements were extracted (other than the title), try a different approach
  if (elements.length === 1) {
    // Split the content by line breaks and create paragraphs
    const lines = cleanHtml
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      elements.push(
        new Paragraph({
          text: trimmedLine,
          spacing: {
            after: 240,
            line: 360,
            lineRule: LineRuleType.AUTO,
          },
        })
      );
    }
  }

  return elements;
}

/**
 * Process text formatting (bold, italic, etc.)
 * @param {string} text - Text to process
 * @returns {Array} - Array of TextRun objects
 */
function processTextFormatting(text) {
  // If text is empty, return empty array
  if (!text.trim()) return [];

  // Track formatting
  const textRuns = [];

  // First, extract all the plain text without any tags
  const plainText = text.replace(/<[^>]+>/g, "").trim();

  // If there are no formatting tags, just return the plain text
  if (text === plainText || !text.match(/<(strong|b|em|i)[^>]*>/i)) {
    // Check for special patterns in plain text

    // Job titles and companies (e.g., "Software Engineer at Google")
    const jobTitleMatch = plainText.match(/^(.+?)\s+at\s+(.+?)$/i);
    if (jobTitleMatch) {
      return [
        new TextRun({ text: jobTitleMatch[1], bold: true }),
        new TextRun({ text: " at " }),
        new TextRun({ text: jobTitleMatch[2], bold: true }),
      ];
    }

    // Dates (e.g., "Jan 2020 - Present" or "2018-2022")
    const dateMatch = plainText.match(
      /^((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*-\s*.+|(?:\d{4}\s*-\s*(?:\d{4}|Present)))$/i
    );
    if (dateMatch) {
      return [new TextRun({ text: plainText, italics: true })];
    }

    // Education degrees (e.g., "Bachelor of Science in Computer Science")
    const degreeMatch = plainText.match(
      /^(Bachelor|Master|Doctor|PhD|B\.S\.|M\.S\.|Ph\.D\.|B\.A\.|M\.A\.|M\.B\.A\.|B\.Tech|M\.Tech)/i
    );
    if (degreeMatch) {
      return [new TextRun({ text: plainText, bold: true })];
    }

    // Skills section often has comma-separated lists
    const skillsMatch = plainText.match(
      /^([A-Za-z\+\#]+(?:,\s*[A-Za-z\+\#]+)+)$/
    );
    if (skillsMatch) {
      // Convert comma-separated list to bullet points in the next function
      return [new TextRun({ text: plainText })];
    }

    // Default - just return the plain text
    return [new TextRun({ text: plainText })];
  }

  // Process the HTML to extract formatting
  // This is a simplified approach - for complex documents, consider using a proper HTML parser

  // Process bold text
  const boldRegex = /<(strong|b)>(.*?)<\/(strong|b)>/gi;
  let boldMatch;
  let lastIndex = 0;

  // First, handle bold text
  while ((boldMatch = boldRegex.exec(text)) !== null) {
    // Add text before the bold section
    const beforeText = text
      .substring(lastIndex, boldMatch.index)
      .replace(/<[^>]+>/g, "");
    if (beforeText.trim()) {
      textRuns.push(new TextRun({ text: beforeText.trim() }));
    }

    // Add the bold text
    const boldText = boldMatch[2].replace(/<[^>]+>/g, "");
    if (boldText.trim()) {
      textRuns.push(new TextRun({ text: boldText.trim(), bold: true }));
    }

    lastIndex = boldMatch.index + boldMatch[0].length;
  }

  // Process italic text
  const italicRegex = /<(em|i)>(.*?)<\/(em|i)>/gi;
  let italicMatch;

  // Reset lastIndex if no bold matches were found
  if (lastIndex === 0) {
    while ((italicMatch = italicRegex.exec(text)) !== null) {
      // Add text before the italic section
      const beforeText = text
        .substring(lastIndex, italicMatch.index)
        .replace(/<[^>]+>/g, "");
      if (beforeText.trim()) {
        textRuns.push(new TextRun({ text: beforeText.trim() }));
      }

      // Add the italic text
      const italicText = italicMatch[2].replace(/<[^>]+>/g, "");
      if (italicText.trim()) {
        textRuns.push(new TextRun({ text: italicText.trim(), italics: true }));
      }

      lastIndex = italicMatch.index + italicMatch[0].length;
    }
  }

  // Add any remaining text
  const remainingText = text.substring(lastIndex).replace(/<[^>]+>/g, "");
  if (remainingText.trim()) {
    textRuns.push(new TextRun({ text: remainingText.trim() }));
  }

  // If no text runs were created, just return the plain text
  if (textRuns.length === 0) {
    return [new TextRun({ text: plainText })];
  }

  return textRuns;
}

/**
 * Generate a simple DOCX document
 * @param {string} content - Document content
 * @param {string} title - Document title
 * @returns {Promise<Buffer>} - DOCX buffer
 */
exports.generateSimpleDocx = async (content, title) => {
  try {
    console.log("Generating simple DOCX document with direct HTML conversion");

    // Create a footer with CareerPilotAI branding
    const footer = new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Generated by CareerPilotAI | Professional Career Documents",
              size: 18, // 9pt font
              color: "7F8C8D", // Gray color
            }),
          ],
        }),
      ],
    });

    // Convert HTML content to DOCX elements
    const docElements = convertHtmlToDocxElements(content, title);

    // Create a document with a single section containing all content
    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 24, // 12pt font
              font: "Calibri",
            },
            paragraph: {
              spacing: {
                line: 360, // 1.5 line spacing
                lineRule: LineRuleType.AUTO,
                before: 0,
                after: 240, // 12pt spacing after paragraphs
              },
            },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 32, // 16pt font
              bold: true,
              font: "Calibri",
            },
            paragraph: {
              spacing: {
                before: 240, // 12pt spacing before
                after: 120, // 6pt spacing after
              },
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 28, // 14pt font
              bold: true,
              font: "Calibri",
            },
            paragraph: {
              spacing: {
                before: 240, // 12pt spacing before
                after: 120, // 6pt spacing after
              },
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440, // 1 inch
                bottom: 1440, // 1 inch
                left: 1440, // 1 inch
              },
            },
          },
          children: docElements,
          footers: {
            default: footer,
          },
        },
      ],
    });

    // Create a buffer with the document
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error) {
    console.error("Simple DOCX Generation Error:", error);

    // Create a fallback document with error message
    try {
      // Create a footer for the fallback document
      const fallbackFooter = new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Generated by CareerPilotAI | Professional Career Documents",
                size: 18, // 9pt font
                color: "7F8C8D", // Gray color
              }),
            ],
          }),
        ],
      });

      // Create children array with all content
      const fallbackChildren = [
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: "An error occurred while generating the document.",
          spacing: {
            after: 200,
          },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Error details: ",
              bold: true,
            }),
            new TextRun({
              text: error.message,
            }),
          ],
        }),
      ];

      const fallbackDoc = new Document({
        sections: [
          {
            properties: {},
            children: fallbackChildren,
            footers: {
              default: fallbackFooter,
            },
          },
        ],
      });

      const buffer = await Packer.toBuffer(fallbackDoc);
      return buffer;
    } catch (fallbackError) {
      console.error("Fallback DOCX Generation Error:", fallbackError);
      throw new Error("Failed to generate DOCX document");
    }
  }
};
