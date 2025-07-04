const Resume = require("../models/Resume");
const CoverLetter = require("../models/CoverLetter");
const LinkedInBio = require("../models/LinkedInBio");
const docxGenerator = require("../utils/docxGenerator");
const simpleDocxGenerator = require("../utils/simpleDocxGenerator");
const txtGenerator = require("../utils/txtGenerator");
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

    // Extract name from job title or use defaults
    let firstName = "First";
    let lastName = "Last";

    if (resume.promptData.jobTitle) {
      // Use job title as name if no name is provided
      const nameParts = resume.promptData.jobTitle.split(" ");
      if (nameParts.length > 1) {
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(" ");
      } else {
        firstName = resume.promptData.jobTitle;
      }
    }

    // Use the simple DOCX generator
    const docxBuffer = await simpleDocxGenerator.generateSimpleDocx(
      resume.resultText,
      resume.title
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

    // For TXT export, we can simply use the resultText directly
    let txtContent = "";

    if (resume.resultText) {
      // Use the AI-generated content directly
      txtContent = resume.resultText;
    } else {
      // Fallback to a simple formatted version using the prompt data
      txtContent = `${resume.title.toUpperCase()}\n\n`;
      txtContent += `JOB TITLE: ${resume.promptData.jobTitle || "N/A"}\n\n`;

      txtContent += "SKILLS:\n";
      if (
        Array.isArray(resume.promptData.skills) &&
        resume.promptData.skills.length > 0
      ) {
        txtContent += resume.promptData.skills.join(", ") + "\n\n";
      } else {
        txtContent += "N/A\n\n";
      }

      txtContent += "EXPERIENCE:\n";
      txtContent += `${resume.promptData.experience || "N/A"}\n\n`;

      txtContent += "EDUCATION:\n";
      txtContent += `${resume.promptData.education || "N/A"}\n\n`;

      if (resume.promptData.additionalInfo) {
        txtContent += "ADDITIONAL INFORMATION:\n";
        txtContent += `${resume.promptData.additionalInfo}\n`;
      }
    }

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

    // Use the simple DOCX generator
    const docxBuffer = await simpleDocxGenerator.generateSimpleDocx(
      coverLetter.resultText,
      coverLetter.title
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

    // Generate TXT
    const txtContent = txtGenerator.generateTxt(
      {
        job: {
          title: coverLetter.promptData.jobTitle,
          company: coverLetter.promptData.companyName,
          hiringManager: coverLetter.promptData.hiringManager || "",
        },
        personal: {
          firstName: coverLetter.promptData.firstName || "First",
          lastName: coverLetter.promptData.lastName || "Last",
        },
        content: coverLetter.resultText,
      },
      "coverLetter",
      coverLetter.title
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

    // Use the simple DOCX generator
    const docxBuffer = await simpleDocxGenerator.generateSimpleDocx(
      linkedinBio.resultText || JSON.stringify(linkedinBio.content, null, 2),
      linkedinBio.title
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

    // Generate TXT
    const txtContent = txtGenerator.generateTxt(
      {
        profile: linkedinBio.profile,
        content: linkedinBio.content,
      },
      "linkedin",
      linkedinBio.title
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
