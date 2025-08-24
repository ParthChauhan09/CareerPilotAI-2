const CoverLetter = require("../models/CoverLetter");
const geminiServiceLatex = require("../utils/geminiServiceLatex");
const responseFormatter = require("../utils/responseFormatter");

/**
 * @desc    Generate a new cover letter with LaTeX output
 * @route   POST /api/generate/cover-letter
 * @access  Private
 */
exports.generateCoverLetter = async (req, res, next) => {
  try {
    const { title, promptData } = req.body;

    console.log(
      "Generating cover letter with LaTeX service:",
      JSON.stringify({ title, promptData }, null, 2)
    );

    // Validate required fields
    if (!title || !promptData) {
      return responseFormatter.error(res, "Title and prompt data are required", 400);
    }

    // Generate cover letter LaTeX content using enhanced Gemini service with user data
    let resultText;
    try {
      resultText = await geminiServiceLatex.generateCoverLetter(promptData, req.user);
      console.log("LaTeX generation successful, content length:", resultText.length);
    } catch (geminiError) {
      console.error("LaTeX generation failed:", geminiError);
      return responseFormatter.error(
        res, 
        `Cover letter generation failed: ${geminiError.message}`, 
        500
      );
    }

    // Validate that we got valid LaTeX content
    if (!resultText || !resultText.includes('\\documentclass')) {
      console.error("Invalid LaTeX content generated");
      return responseFormatter.error(
        res, 
        "Failed to generate valid LaTeX content", 
        500
      );
    }

    // Create cover letter in database
    const coverLetter = await CoverLetter.create({
      user: req.user.id,
      title,
      promptData,
      resultText,
    });

    // Increment user's usage counter
    await req.user.incrementUsage("coverLetter");

    console.log("Cover letter generated successfully with LaTeX content");

    responseFormatter.success(
      res,
      "Cover letter generated successfully",
      { coverLetter },
      201
    );
  } catch (err) {
    console.error("Error generating cover letter:", err);
    next(err);
  }
};

/**
 * @desc    Get all cover letters for a user
 * @route   GET /api/generate/cover-letter
 * @access  Private
 */
exports.getCoverLetters = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Get total count
    const total = await CoverLetter.countDocuments({ user: req.user.id });

    // Get cover letters with pagination
    const coverLetters = await CoverLetter.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    console.log(`Retrieved ${coverLetters.length} cover letters for user`);

    responseFormatter.pagination(
      res,
      coverLetters,
      page,
      limit,
      total,
      "Cover letters retrieved successfully"
    );
  } catch (err) {
    console.error("Error fetching cover letters:", err);
    next(err);
  }
};

/**
 * @desc    Get a single cover letter
 * @route   GET /api/generate/cover-letter/:id
 * @access  Private
 */
exports.getCoverLetter = async (req, res, next) => {
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

    console.log("Retrieved single cover letter:", coverLetter._id);

    responseFormatter.success(res, "Cover letter retrieved successfully", {
      coverLetter,
    });
  } catch (err) {
    console.error("Error fetching single cover letter:", err);
    next(err);
  }
};

/**
 * @desc    Update a cover letter
 * @route   PUT /api/generate/cover-letter/:id
 * @access  Private
 */
exports.updateCoverLetter = async (req, res, next) => {
  try {
    let coverLetter = await CoverLetter.findById(req.params.id);

    if (!coverLetter) {
      return responseFormatter.error(res, "Cover letter not found", 404);
    }

    // Check if the cover letter belongs to the user
    if (coverLetter.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to update this cover letter",
        401
      );
    }

    // Update only allowed fields
    const { title } = req.body;

    coverLetter = await CoverLetter.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true }
    );

    responseFormatter.success(res, "Cover letter updated successfully", {
      coverLetter,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a cover letter
 * @route   DELETE /api/generate/cover-letter/:id
 * @access  Private
 */
exports.deleteCoverLetter = async (req, res, next) => {
  try {
    const coverLetter = await CoverLetter.findById(req.params.id);

    if (!coverLetter) {
      return responseFormatter.error(res, "Cover letter not found", 404);
    }

    // Check if the cover letter belongs to the user
    if (coverLetter.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to delete this cover letter",
        401
      );
    }

    await coverLetter.deleteOne();

    responseFormatter.success(res, "Cover letter deleted successfully");
  } catch (err) {
    next(err);
  }
};