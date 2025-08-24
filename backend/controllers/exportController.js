const Resume = require("../models/Resume");
const CoverLetter = require("../models/CoverLetter");
const LinkedInBio = require("../models/LinkedInBio");
const latexCompiler = require("../utils/latexCompiler");
const responseFormatter = require("../utils/responseFormatter");

/**
 * @desc    Export resume as DOCX
 * @route   GET /api/export/resume/:id/docx
 * @access  Private
 */
exports.exportResumeDocx = async (req, res, next) => {
  try {
    console.log("Exporting resume as DOCX for ID:", req.params.id);
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

    console.log("Resume data for DOCX export:", {
      id: resume._id,
      title: resume.title,
      promptData: resume.promptData,
      resultText: resume.resultText
        ? resume.resultText.substring(0, 100) + "..."
        : "No result text",
    });

    // Generate DOCX from LaTeX
    const docxBuffer = await latexCompiler.compileToDocx(
      resume.resultText,
      resume.title.replace(/\s+/g, "_"),
      resume.promptData
    );

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resume.title.replace(/\s+/g, "_")}_resume.docx"`
    );

    // Send DOCX
    res.send(docxBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Export resume as TXT
 * @route   GET /api/export/resume/:id/txt
 * @access  Private
 */
exports.exportResumeTxt = async (req, res, next) => {
  try {
    console.log("Exporting resume as TXT for ID:", req.params.id);
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

    console.log("Resume data for TXT export:", {
      id: resume._id,
      title: resume.title,
      promptData: resume.promptData,
      resultText: resume.resultText
        ? resume.resultText.substring(0, 100) + "..."
        : "No result text",
    });

    // Generate TXT from LaTeX
    const txtContent = await latexCompiler.compileToTxt(
      resume.resultText,
      resume.title.replace(/\s+/g, "_"),
      resume.promptData
    );

    // Set response headers
    res.setHeader("Content-Type", "text/plain");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resume.title.replace(/\s+/g, "_")}_resume.txt"`
    );

    // Send TXT
    res.send(txtContent);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Export cover letter as DOCX
 * @route   GET /api/export/cover-letter/:id/docx
 * @access  Private
 */
exports.exportCoverLetterDocx = async (req, res, next) => {
  try {
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

    // Generate DOCX from LaTeX
    const docxBuffer = await latexCompiler.compileToDocx(
      coverLetter.resultText,
      coverLetter.title.replace(/\s+/g, "_"),
      coverLetter.promptData
    );

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${coverLetter.title.replace(
        /\s+/g,
        "_"
      )}_cover_letter.docx"`
    );

    // Send DOCX
    res.send(docxBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Export cover letter as TXT
 * @route   GET /api/export/cover-letter/:id/txt
 * @access  Private
 */
exports.exportCoverLetterTxt = async (req, res, next) => {
  try {
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

    // Generate TXT from LaTeX
    const txtContent = await latexCompiler.compileToTxt(
      coverLetter.resultText,
      coverLetter.title.replace(/\s+/g, "_"),
      coverLetter.promptData
    );

    // Set response headers
    res.setHeader("Content-Type", "text/plain");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${coverLetter.title.replace(
        /\s+/g,
        "_"
      )}_cover_letter.txt"`
    );

    // Send TXT
    res.send(txtContent);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Export LinkedIn bio as DOCX
 * @route   GET /api/export/linkedin/:id/docx
 * @access  Private
 */
exports.exportLinkedInDocx = async (req, res, next) => {
  try {
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

    // Generate DOCX from LaTeX
    const docxBuffer = await latexCompiler.compileToDocx(
      linkedinBio.resultText,
      linkedinBio.title.replace(/\s+/g, "_"),
      linkedinBio.promptData
    );

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${linkedinBio.title.replace(
        /\s+/g,
        "_"
      )}_linkedin_bio.docx"`
    );

    // Send DOCX
    res.send(docxBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Export LinkedIn bio as TXT
 * @route   GET /api/export/linkedin/:id/txt
 * @access  Private
 */
exports.exportLinkedInTxt = async (req, res, next) => {
  try {
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

    // Generate TXT from LaTeX
    const txtContent = await latexCompiler.compileToTxt(
      linkedinBio.resultText,
      linkedinBio.title.replace(/\s+/g, "_"),
      linkedinBio.promptData
    );

    // Set response headers
    res.setHeader("Content-Type", "text/plain");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${linkedinBio.title.replace(
        /\s+/g,
        "_"
      )}_linkedin_bio.txt"`
    );

    // Send TXT
    res.send(txtContent);
  } catch (err) {
    next(err);
  }
};
