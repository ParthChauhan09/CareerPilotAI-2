const CoverLetter = require("../models/CoverLetter");
const geminiService = require("../utils/geminiService");
const responseFormatter = require("../utils/responseFormatter");

/**
 * @desc    Generate a new cover letter
 * @route   POST /api/generate/cover-letter
 * @access  Private
 */
exports.generateCoverLetter = async (req, res, next) => {
  try {
    const { title, promptData } = req.body;

    // Generate cover letter content using Gemini
    const resultText = await geminiService.generateCoverLetter(promptData);

    // Create cover letter in database
    const coverLetter = await CoverLetter.create({
      user: req.user.id,
      title,
      promptData,
      resultText,
    });

    // Increment user's usage counter
    await req.user.incrementUsage("coverLetter");

    responseFormatter.success(
      res,
      "Cover letter generated successfully",
      { coverLetter },
      201
    );
  } catch (err) {
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

    responseFormatter.pagination(
      res,
      coverLetters,
      page,
      limit,
      total,
      "Cover letters retrieved successfully"
    );
  } catch (err) {
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

    responseFormatter.success(res, "Cover letter retrieved successfully", {
      coverLetter,
    });
  } catch (err) {
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
