const LinkedInBio = require("../models/LinkedInBio");
const geminiService = require("../utils/geminiService");
const responseFormatter = require("../utils/responseFormatter");

/**
 * @desc    Generate a new LinkedIn bio
 * @route   POST /api/generate/linkedin
 * @access  Private
 */
exports.generateLinkedInBio = async (req, res, next) => {
  try {
    const { title, profile, experience, preferences } = req.body;

    // Generate LinkedIn bio content using Gemini
    const generatedContent = await geminiService.generateLinkedInBio({
      profile,
      experience,
      preferences,
    });

    // Create LinkedIn bio in database
    const linkedinBio = await LinkedInBio.create({
      user: req.user.id,
      title,
      profile,
      experience,
      preferences,
      content: generatedContent,
      updatedAt: Date.now(),
    });

    // Increment user's usage counter
    await req.user.incrementUsage("linkedin");

    responseFormatter.success(
      res,
      "LinkedIn bio generated successfully",
      { linkedinBio },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all LinkedIn bios for a user
 * @route   GET /api/generate/linkedin
 * @access  Private
 */
exports.getLinkedInBios = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Get total count
    const total = await LinkedInBio.countDocuments({ user: req.user.id });

    // Get LinkedIn bios with pagination
    const linkedinBios = await LinkedInBio.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    responseFormatter.pagination(
      res,
      linkedinBios,
      page,
      limit,
      total,
      "LinkedIn bios retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single LinkedIn bio
 * @route   GET /api/generate/linkedin/:id
 * @access  Private
 */
exports.getLinkedInBio = async (req, res, next) => {
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

    responseFormatter.success(res, "LinkedIn bio retrieved successfully", {
      linkedinBio,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a LinkedIn bio
 * @route   PUT /api/generate/linkedin/:id
 * @access  Private
 */
exports.updateLinkedInBio = async (req, res, next) => {
  try {
    let linkedinBio = await LinkedInBio.findById(req.params.id);

    if (!linkedinBio) {
      return responseFormatter.error(res, "LinkedIn bio not found", 404);
    }

    // Check if the LinkedIn bio belongs to the user
    if (linkedinBio.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to update this LinkedIn bio",
        401
      );
    }

    // Update allowed fields
    const { title, profile, experience, preferences, content } = req.body;

    const updateData = {
      updatedAt: Date.now(),
    };

    if (title) updateData.title = title;
    if (profile) updateData.profile = profile;
    if (experience) updateData.experience = experience;
    if (preferences) updateData.preferences = preferences;
    if (content) updateData.content = content;

    linkedinBio = await LinkedInBio.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    responseFormatter.success(res, "LinkedIn bio updated successfully", {
      linkedinBio,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a LinkedIn bio
 * @route   DELETE /api/generate/linkedin/:id
 * @access  Private
 */
exports.deleteLinkedInBio = async (req, res, next) => {
  try {
    const linkedinBio = await LinkedInBio.findById(req.params.id);

    if (!linkedinBio) {
      return responseFormatter.error(res, "LinkedIn bio not found", 404);
    }

    // Check if the LinkedIn bio belongs to the user
    if (linkedinBio.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to delete this LinkedIn bio",
        401
      );
    }

    await linkedinBio.deleteOne();

    responseFormatter.success(res, "LinkedIn bio deleted successfully");
  } catch (err) {
    next(err);
  }
};
