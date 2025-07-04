const Resume = require("../models/Resume");
const geminiService = require("../utils/geminiService");
const responseFormatter = require("../utils/responseFormatter");

/**
 * @desc    Generate a new resume
 * @route   POST /api/generate/resume
 * @access  Private
 */
exports.generateResume = async (req, res, next) => {
  try {
    const { title, promptData } = req.body;

    console.log(
      "Generating resume with data:",
      JSON.stringify({ title, promptData }, null, 2)
    );

    // Generate resume content using Gemini
    const resultText = await geminiService.generateResume(promptData);

    // Create resume in database
    const resume = await Resume.create({
      user: req.user.id,
      title,
      promptData,
      resultText,
    });

    // Increment user's usage counter
    await req.user.incrementUsage("resume");

    // Transform the resume data to match frontend expectations
    const transformedResume = {
      id: resume._id,
      title: resume.title,
      promptData: resume.promptData,
      resultText: resume.resultText,
      createdAt: resume.createdAt,
      updatedAt: resume.createdAt, // MongoDB doesn't have updatedAt by default, so use createdAt
    };

    console.log(
      "Resume generated successfully:",
      JSON.stringify(transformedResume, null, 2)
    );

    responseFormatter.success(
      res,
      "Resume generated successfully",
      { resume: transformedResume },
      201
    );
  } catch (err) {
    console.error("Error generating resume:", err);
    next(err);
  }
};

/**
 * @desc    Get all resumes for a user
 * @route   GET /api/generate/resume
 * @access  Private
 */
exports.getResumes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Get total count
    const total = await Resume.countDocuments({ user: req.user.id });

    // Get resumes with pagination
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Transform the resume data to match frontend expectations
    const transformedResumes = resumes.map((resume) => {
      return {
        id: resume._id,
        title: resume.title,
        promptData: resume.promptData,
        resultText: resume.resultText,
        createdAt: resume.createdAt,
        updatedAt: resume.createdAt, // MongoDB doesn't have updatedAt by default, so use createdAt
      };
    });

    console.log(
      "Sending resumes to frontend:",
      JSON.stringify(transformedResumes, null, 2)
    );

    responseFormatter.pagination(
      res,
      transformedResumes,
      page,
      limit,
      total,
      "Resumes retrieved successfully"
    );
  } catch (err) {
    console.error("Error fetching resumes:", err);
    next(err);
  }
};

/**
 * @desc    Get a single resume
 * @route   GET /api/generate/resume/:id
 * @access  Private
 */
exports.getResume = async (req, res, next) => {
  try {
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

    // Transform the resume data to match frontend expectations
    const transformedResume = {
      id: resume._id,
      title: resume.title,
      promptData: resume.promptData,
      resultText: resume.resultText,
      createdAt: resume.createdAt,
      updatedAt: resume.createdAt, // MongoDB doesn't have updatedAt by default, so use createdAt
    };

    console.log(
      "Sending single resume to frontend:",
      JSON.stringify(transformedResume, null, 2)
    );

    responseFormatter.success(res, "Resume retrieved successfully", {
      resume: transformedResume,
    });
  } catch (err) {
    console.error("Error fetching single resume:", err);
    next(err);
  }
};

/**
 * @desc    Update a resume
 * @route   PUT /api/generate/resume/:id
 * @access  Private
 */
exports.updateResume = async (req, res, next) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return responseFormatter.error(res, "Resume not found", 404);
    }

    // Check if the resume belongs to the user
    if (resume.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to update this resume",
        401
      );
    }

    // Update only allowed fields
    const { title } = req.body;

    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true }
    );

    responseFormatter.success(res, "Resume updated successfully", { resume });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a resume
 * @route   DELETE /api/generate/resume/:id
 * @access  Private
 */
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return responseFormatter.error(res, "Resume not found", 404);
    }

    // Check if the resume belongs to the user
    if (resume.user.toString() !== req.user.id) {
      return responseFormatter.error(
        res,
        "Not authorized to delete this resume",
        401
      );
    }

    await resume.deleteOne();

    responseFormatter.success(res, "Resume deleted successfully");
  } catch (err) {
    next(err);
  }
};
