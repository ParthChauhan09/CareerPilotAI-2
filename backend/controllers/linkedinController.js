const LinkedInBio = require("../models/LinkedInBio");
const geminiServiceLatex = require("../utils/geminiServiceLatex");
const responseFormatter = require("../utils/responseFormatter");

/**
 * @desc    Generate a new LinkedIn bio with LaTeX output
 * @route   POST /api/generate/linkedin
 * @access  Private
 */
exports.generateLinkedInBio = async (req, res, next) => {
  try {
    const { title, profile, experience, preferences } = req.body;

    console.log(
      "Generating LinkedIn bio with LaTeX service:",
      JSON.stringify({ title, profile, experience, preferences }, null, 2)
    );

    // Validate required fields
    if (!title) {
      return responseFormatter.error(res, "Title is required", 400);
    }

    if (!profile || !profile.firstName || !profile.lastName || !profile.currentPosition || !profile.industry) {
      return responseFormatter.error(res, "Profile information (firstName, lastName, currentPosition, industry) is required", 400);
    }

    if (!experience || !experience.professionalExperience) {
      return responseFormatter.error(res, "Professional experience is required", 400);
    }

    if (!preferences || !preferences.targetRole) {
      return responseFormatter.error(res, "Target role preference is required", 400);
    }

    // Structure the data properly for the Gemini service
    const structuredData = {
      profile,
      experience,
      preferences
    };

    // Generate LinkedIn bio LaTeX content using enhanced Gemini service with user data
    let resultText;
    try {
      resultText = await geminiServiceLatex.generateLinkedInBio(structuredData, req.user);
      console.log("LaTeX generation successful, content length:", resultText.length);
    } catch (geminiError) {
      console.error("LaTeX generation failed:", geminiError);
      return responseFormatter.error(
        res, 
        `LinkedIn bio generation failed: ${geminiError.message}`, 
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

    // Create LinkedIn bio in database with proper structure
    const linkedinBio = await LinkedInBio.create({
      user: req.user.id,
      title,
      profile,
      experience,
      preferences,
      resultText,
    });

    // Increment user's usage counter
    await req.user.incrementUsage("linkedinBio");

    console.log("LinkedIn bio generated successfully with LaTeX content");

    responseFormatter.success(
      res,
      "LinkedIn bio generated successfully",
      { linkedinBio },
      201
    );
  } catch (err) {
    console.error("Error generating LinkedIn bio:", err);
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

    console.log(`Retrieved ${linkedinBios.length} LinkedIn bios for user`);

    responseFormatter.pagination(
      res,
      linkedinBios,
      page,
      limit,
      total,
      "LinkedIn bios retrieved successfully"
    );
  } catch (err) {
    console.error("Error fetching LinkedIn bios:", err);
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

    console.log("Retrieved single LinkedIn bio:", linkedinBio._id);

    responseFormatter.success(res, "LinkedIn bio retrieved successfully", {
      linkedinBio,
    });
  } catch (err) {
    console.error("Error fetching single LinkedIn bio:", err);
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

    // Update only allowed fields
    const { title } = req.body;

    linkedinBio = await LinkedInBio.findByIdAndUpdate(
      req.params.id,
      { title },
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