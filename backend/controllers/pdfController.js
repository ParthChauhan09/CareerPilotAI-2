const Resume = require("../models/Resume");
const CoverLetter = require("../models/CoverLetter");
const LinkedInBio = require("../models/LinkedInBio");
const pdfGenerator = require("../utils/pdfGenerator");
const responseFormatter = require("../utils/responseFormatter");

/**
 * @desc    Generate PDF for a resume
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
      resultText: resume.resultText
        ? resume.resultText.substring(0, 100) + "..."
        : "No result text",
    });

    // Convert resume content to HTML
    const htmlContent = pdfGenerator.formatToHtml(
      resume.resultText,
      "resume",
      resume.title
    );

    // Generate PDF
    const pdfBuffer = await pdfGenerator.generatePdf(
      htmlContent,
      "resume",
      resume.title
    );

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resume.title.replace(/\s+/g, "_")}_resume.pdf"`
    );

    // Send PDF
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Generate PDF for a cover letter
 * @route   GET /api/pdf/cover-letter/:id
 * @access  Private
 */
exports.generateCoverLetterPdf = async (req, res, next) => {
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

    // Convert cover letter content to HTML
    const htmlContent = pdfGenerator.formatToHtml(
      coverLetter.resultText,
      "coverLetter",
      coverLetter.title
    );

    // Generate PDF
    const pdfBuffer = await pdfGenerator.generatePdf(
      htmlContent,
      "coverLetter",
      coverLetter.title
    );

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${coverLetter.title.replace(
        /\s+/g,
        "_"
      )}_cover_letter.pdf"`
    );

    // Send PDF
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Generate PDF for a LinkedIn bio
 * @route   GET /api/pdf/linkedin/:id
 * @access  Private
 */
exports.generateLinkedInPdf = async (req, res, next) => {
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

    // Format LinkedIn content for PDF
    const fullName = `${linkedinBio.profile.firstName} ${linkedinBio.profile.lastName}`;
    const headline =
      linkedinBio.content.headline || linkedinBio.profile.headline;
    const about = linkedinBio.content.about || "";
    const experience = linkedinBio.content.experience || "";

    const contentHtml = `
      <h1>${fullName}</h1>
      <h2>${headline}</h2>
      <p class="subtitle">${linkedinBio.profile.location} | ${
      linkedinBio.profile.industry
    }</p>

      <h3>About</h3>
      <div class="section">
        ${about.replace(/\n/g, "<br>")}
      </div>

      <h3>Experience</h3>
      <div class="section">
        <h4>${linkedinBio.profile.currentPosition}</h4>
        ${experience.replace(/\n/g, "<br>")}
      </div>

      <h3>Skills</h3>
      <div class="section">
        ${linkedinBio.experience.skills.replace(/,\s*/g, ", ")}
      </div>
    `;

    // Convert LinkedIn bio content to HTML
    const htmlContent = pdfGenerator.formatToHtml(
      contentHtml,
      "linkedin",
      linkedinBio.title,
      true
    );

    // Generate PDF
    const pdfBuffer = await pdfGenerator.generatePdf(
      htmlContent,
      "linkedin",
      linkedinBio.title
    );

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${linkedinBio.title.replace(
        /\s+/g,
        "_"
      )}_linkedin_bio.pdf"`
    );

    // Send PDF
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};
