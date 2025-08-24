const Resume = require("../models/Resume");
const CoverLetter = require("../models/CoverLetter");
const LinkedInBio = require("../models/LinkedInBio");
const latexToPdfService = require("../utils/latexToPdfService");
const pdfGenerator = require("../utils/pdfGenerator");
const responseFormatter = require("../utils/responseFormatter");

/**
 * @desc    Generate PDF for a resume using LaTeX compilation with fallback
 * @route   GET /api/pdf/resume/:id
 * @access  Private
 */
exports.generateResumePdf = async (req, res, next) => {
  try {
    console.log("Generating PDF for resume ID:", req.params.id);
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return responseFormatter.error(res, "Resume not found", 404);
    }

    // Check if the resume belongs to the user
    if (resume.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to access this resume",
        401
      );
    }

    console.log("Resume data for PDF generation:", {
      id: resume._id,
      title: resume.title,
      promptData: resume.promptData,
      hasResultText: !!resume.resultText,
      resultTextLength: resume.resultText ? resume.resultText.length : 0
    });

    // Validate that we have LaTeX content
    if (!resume.resultText) {
      return responseFormatter.error(res, "No LaTeX content found for this resume", 400);
    }

    // Generate PDF with fallback approach
    let pdfBuffer;
    try {
      console.log("Attempting LaTeX-to-PDF compilation...");
      
      // Try online LaTeX compilation first
      try {
        pdfBuffer = await latexToPdfService.compileLatexToPdf(
          resume.resultText,
          resume.title.replace(/\s+/g, "_")
        );
        
        // Check if PDF is valid size (should be at least 70 bytes for a real PDF)
        if (pdfBuffer.length < 70) {
          throw new Error("Generated PDF is too small, likely corrupted");
        }
        
        console.log("Online LaTeX compilation successful, PDF size:", pdfBuffer.length, "bytes");
      } catch (onlineError) {
        console.warn("Online LaTeX compilation failed, using Puppeteer fallback:", onlineError.message);
        
        // Use Puppeteer fallback for reliable PDF generation
        pdfBuffer = await pdfGenerator.generatePdfFromLatex(
          resume.resultText,
          resume.title.replace(/\s+/g, "_"),
          resume.promptData
        );
        console.log("Puppeteer fallback PDF generation successful, PDF size:", pdfBuffer.length, "bytes");
      }
      
    } catch (allError) {
      console.error("All PDF generation methods failed:", allError.message);
      return responseFormatter.error(
        res, 
        `PDF generation failed: ${allError.message}`, 
        500
      );
    }

    // Validate final PDF
    if (!pdfBuffer || pdfBuffer.length < 70) {
      return responseFormatter.error(
        res, 
        "Generated PDF is invalid or corrupted", 
        500
      );
    }

    // Set response headers for PDF download
    const fileName = `${resume.title.replace(/\s+/g, "_")}_resume.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send PDF
    console.log("Sending PDF response, size:", pdfBuffer.length, "bytes");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Resume PDF generation error:", err);
    next(err);
  }
};

/**
 * @desc    Generate PDF for a cover letter using LaTeX compilation with fallback
 * @route   GET /api/pdf/cover-letter/:id
 * @access  Private
 */
exports.generateCoverLetterPdf = async (req, res, next) => {
  try {
    console.log("Generating PDF for cover letter ID:", req.params.id);
    const coverLetter = await CoverLetter.findById(req.params.id);

    if (!coverLetter) {
      return responseFormatter.error(res, "Cover letter not found", 404);
    }

    // Check if the cover letter belongs to the user
    if (coverLetter.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to access this cover letter",
        401
      );
    }

    console.log("Cover letter data for PDF generation:", {
      id: coverLetter._id,
      title: coverLetter.title,
      hasResultText: !!coverLetter.resultText,
      resultTextLength: coverLetter.resultText ? coverLetter.resultText.length : 0
    });

    // Validate that we have LaTeX content
    if (!coverLetter.resultText) {
      return responseFormatter.error(res, "No LaTeX content found for this cover letter", 400);
    }

    // Generate PDF with fallback approach
    let pdfBuffer;
    try {
      console.log("Attempting LaTeX-to-PDF compilation...");
      
      // Try online LaTeX compilation first
      try {
        pdfBuffer = await latexToPdfService.compileLatexToPdf(
          coverLetter.resultText,
          coverLetter.title.replace(/\s+/g, "_")
        );
        
        // Check if PDF is valid size
        if (pdfBuffer.length < 70) {
          throw new Error("Generated PDF is too small, likely corrupted");
        }
        
        console.log("Online LaTeX compilation successful, PDF size:", pdfBuffer.length, "bytes");
      } catch (onlineError) {
        console.warn("Online LaTeX compilation failed, using Puppeteer fallback:", onlineError.message);
        
        // Use Puppeteer fallback for reliable PDF generation
        pdfBuffer = await pdfGenerator.generatePdfFromLatex(
          coverLetter.resultText,
          coverLetter.title.replace(/\s+/g, "_"),
          coverLetter.promptData
        );
        console.log("Puppeteer fallback PDF generation successful, PDF size:", pdfBuffer.length, "bytes");
      }
      
    } catch (allError) {
      console.error("All PDF generation methods failed:", allError.message);
      return responseFormatter.error(
        res, 
        `PDF generation failed: ${allError.message}`, 
        500
      );
    }

    // Validate final PDF
    if (!pdfBuffer || pdfBuffer.length < 70) {
      return responseFormatter.error(
        res, 
        "Generated PDF is invalid or corrupted", 
        500
      );
    }

    // Set response headers for PDF download
    const fileName = `${coverLetter.title.replace(/\s+/g, "_")}_cover_letter.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send PDF
    console.log("Sending PDF response, size:", pdfBuffer.length, "bytes");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Cover letter PDF generation error:", err);
    next(err);
  }
};

/**
 * @desc    Generate PDF preview for a resume (inline display)
 * @route   GET /api/pdf/resume/:id/preview
 * @access  Private
 */
exports.generateResumePdfPreview = async (req, res, next) => {
  try {
    console.log("Generating PDF preview for resume ID:", req.params.id);
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return responseFormatter.error(res, "Resume not found", 404);
    }

    // Check if the resume belongs to the user
    if (resume.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to access this resume",
        401
      );
    }

    // Validate that we have LaTeX content
    if (!resume.resultText) {
      return responseFormatter.error(res, "No LaTeX content found for this resume", 400);
    }

    // Generate PDF with fallback approach
    let pdfBuffer;
    try {
      // Try online LaTeX compilation first
      try {
        pdfBuffer = await latexToPdfService.compileLatexToPdf(
          resume.resultText,
          resume.title.replace(/\s+/g, "_")
        );
        
        if (pdfBuffer.length < 70) {
          throw new Error("Generated PDF is too small, likely corrupted");
        }
      } catch (onlineError) {
        console.warn("Online LaTeX compilation failed, using Puppeteer fallback:", onlineError.message);
        
        pdfBuffer = await pdfGenerator.generatePdfFromLatex(
          resume.resultText,
          resume.title.replace(/\s+/g, "_"),
          resume.promptData
        );
      }
      
    } catch (allError) {
      console.error("All PDF generation methods failed:", allError.message);
      return responseFormatter.error(
        res, 
        `PDF generation failed: ${allError.message}`, 
        500
      );
    }

    // Validate final PDF
    if (!pdfBuffer || pdfBuffer.length < 70) {
      return responseFormatter.error(
        res, 
        "Generated PDF is invalid or corrupted", 
        500
      );
    }

    // Set response headers for PDF preview (inline display)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Resume PDF preview generation error:", err);
    next(err);
  }
};

/**
 * @desc    Generate PDF preview for a cover letter (inline display)
 * @route   GET /api/pdf/cover-letter/:id/preview
 * @access  Private
 */
exports.generateCoverLetterPdfPreview = async (req, res, next) => {
  try {
    console.log("Generating PDF preview for cover letter ID:", req.params.id);
    const coverLetter = await CoverLetter.findById(req.params.id);

    if (!coverLetter) {
      return responseFormatter.error(res, "Cover letter not found", 404);
    }

    // Check if the cover letter belongs to the user
    if (coverLetter.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to access this cover letter",
        401
      );
    }

    // Validate that we have LaTeX content
    if (!coverLetter.resultText) {
      return responseFormatter.error(res, "No LaTeX content found for this cover letter", 400);
    }

    // Generate PDF with fallback approach
    let pdfBuffer;
    try {
      // Try online LaTeX compilation first
      try {
        pdfBuffer = await latexToPdfService.compileLatexToPdf(
          coverLetter.resultText,
          coverLetter.title.replace(/\s+/g, "_")
        );
        
        if (pdfBuffer.length < 70) {
          throw new Error("Generated PDF is too small, likely corrupted");
        }
      } catch (onlineError) {
        console.warn("Online LaTeX compilation failed, using Puppeteer fallback:", onlineError.message);
        
        pdfBuffer = await pdfGenerator.generatePdfFromLatex(
          coverLetter.resultText,
          coverLetter.title.replace(/\s+/g, "_"),
          coverLetter.promptData
        );
      }
      
    } catch (allError) {
      console.error("All PDF generation methods failed:", allError.message);
      return responseFormatter.error(
        res, 
        `PDF generation failed: ${allError.message}`, 
        500
      );
    }

    // Validate final PDF
    if (!pdfBuffer || pdfBuffer.length < 70) {
      return responseFormatter.error(
        res, 
        "Generated PDF is invalid or corrupted", 
        500
      );
    }

    // Set response headers for PDF preview (inline display)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Cover letter PDF preview generation error:", err);
    next(err);
  }
};

/**
 * @desc    Generate PDF preview for a LinkedIn bio (inline display)
 * @route   GET /api/pdf/linkedin/:id/preview
 * @access  Private
 */
exports.generateLinkedInPdfPreview = async (req, res, next) => {
  try {
    console.log("Generating PDF preview for LinkedIn bio ID:", req.params.id);
    const linkedinBio = await LinkedInBio.findById(req.params.id);

    if (!linkedinBio) {
      return responseFormatter.error(res, "LinkedIn bio not found", 404);
    }

    // Check if the LinkedIn bio belongs to the user
    if (linkedinBio.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to access this LinkedIn bio",
        401
      );
    }

    // Validate that we have LaTeX content
    if (!linkedinBio.resultText) {
      return responseFormatter.error(res, "No LaTeX content found for this LinkedIn bio", 400);
    }

    // Generate PDF with fallback approach
    let pdfBuffer;
    try {
      // Try online LaTeX compilation first
      try {
        pdfBuffer = await latexToPdfService.compileLatexToPdf(
          linkedinBio.resultText,
          linkedinBio.title.replace(/\s+/g, "_")
        );
        
        if (pdfBuffer.length < 70) {
          throw new Error("Generated PDF is too small, likely corrupted");
        }
      } catch (onlineError) {
        console.warn("Online LaTeX compilation failed, using Puppeteer fallback:", onlineError.message);
        
        pdfBuffer = await pdfGenerator.generatePdfFromLatex(
          linkedinBio.resultText,
          linkedinBio.title.replace(/\s+/g, "_"),
          linkedinBio.promptData
        );
      }
      
    } catch (allError) {
      console.error("All PDF generation methods failed:", allError.message);
      return responseFormatter.error(
        res, 
        `PDF generation failed: ${allError.message}`, 
        500
      );
    }

    // Validate final PDF
    if (!pdfBuffer || pdfBuffer.length < 70) {
      return responseFormatter.error(
        res, 
        "Generated PDF is invalid or corrupted", 
        500
      );
    }

    // Set response headers for PDF preview (inline display)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (err) {
    console.error("LinkedIn bio PDF preview generation error:", err);
    next(err);
  }
};

/**
 * @desc    Generate PDF for a LinkedIn bio using LaTeX compilation with fallback
 * @route   GET /api/pdf/linkedin/:id
 * @access  Private
 */
exports.generateLinkedInPdf = async (req, res, next) => {
  try {
    console.log("Generating PDF for LinkedIn bio ID:", req.params.id);
    const linkedinBio = await LinkedInBio.findById(req.params.id);

    if (!linkedinBio) {
      return responseFormatter.error(res, "LinkedIn bio not found", 404);
    }

    // Check if the LinkedIn bio belongs to the user
    if (linkedinBio.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to access this LinkedIn bio",
        401
      );
    }

    console.log("LinkedIn bio data for PDF generation:", {
      id: linkedinBio._id,
      title: linkedinBio.title,
      hasResultText: !!linkedinBio.resultText,
      resultTextLength: linkedinBio.resultText ? linkedinBio.resultText.length : 0
    });

    // Validate that we have LaTeX content
    if (!linkedinBio.resultText) {
      return responseFormatter.error(res, "No LaTeX content found for this LinkedIn bio", 400);
    }

    // Generate PDF with fallback approach
    let pdfBuffer;
    try {
      console.log("Attempting LaTeX-to-PDF compilation...");
      
      // Try online LaTeX compilation first
      try {
        pdfBuffer = await latexToPdfService.compileLatexToPdf(
          linkedinBio.resultText,
          linkedinBio.title.replace(/\s+/g, "_")
        );
        
        // Check if PDF is valid size
        if (pdfBuffer.length < 70) {
          throw new Error("Generated PDF is too small, likely corrupted");
        }
        
        console.log("Online LaTeX compilation successful, PDF size:", pdfBuffer.length, "bytes");
      } catch (onlineError) {
        console.warn("Online LaTeX compilation failed, using Puppeteer fallback:", onlineError.message);
        
        // Use Puppeteer fallback for reliable PDF generation
        pdfBuffer = await pdfGenerator.generatePdfFromLatex(
          linkedinBio.resultText,
          linkedinBio.title.replace(/\s+/g, "_"),
          linkedinBio.promptData
        );
        console.log("Puppeteer fallback PDF generation successful, PDF size:", pdfBuffer.length, "bytes");
      }
      
    } catch (allError) {
      console.error("All PDF generation methods failed:", allError.message);
      return responseFormatter.error(
        res, 
        `PDF generation failed: ${allError.message}`, 
        500
      );
    }

    // Validate final PDF
    if (!pdfBuffer || pdfBuffer.length < 70) {
      return responseFormatter.error(
        res, 
        "Generated PDF is invalid or corrupted", 
        500
      );
    }

    // Set response headers for PDF download
    const fileName = `${linkedinBio.title.replace(/\s+/g, "_")}_linkedin_bio.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send PDF
    console.log("Sending PDF response, size:", pdfBuffer.length, "bytes");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("LinkedIn bio PDF generation error:", err);
    next(err);
  }
};