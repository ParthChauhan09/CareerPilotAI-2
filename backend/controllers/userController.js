const User = require("../models/User");
const responseFormatter = require("../utils/responseFormatter");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return responseFormatter.error(res, "User not found", 404);
    }

    responseFormatter.success(res, "User profile retrieved successfully", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        planType: user.planType,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Check if email is already taken
    if (email) {
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return responseFormatter.error(res, "Email already in use", 400);
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return responseFormatter.error(res, "User not found", 404);
    }

    responseFormatter.success(res, "User profile updated successfully", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        planType: user.planType,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get user usage statistics
 * @route   GET /api/users/usage
 * @access  Private
 */
exports.getUserUsage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return responseFormatter.error(res, "User not found", 404);
    }

    // Get plan limits
    const planLimits = {
      resumeGenerations: user.getPlanLimit("resumeGenerations"),
      coverLetterGenerations: user.getPlanLimit("coverLetterGenerations"),
      linkedinGenerations: user.getPlanLimit("linkedinGenerations"),
    };

    // Get export permissions
    const exportPermissions = {
      pdfExport: user.canUseExportFormat("pdf"),
      docxExport: user.canUseExportFormat("docx"),
      txtExport: user.canUseExportFormat("txt"),
    };

    responseFormatter.success(
      res,
      "User usage statistics retrieved successfully",
      {
        usage: user.usageStats,
        limits: planLimits,
        planType: user.planType,
        exportPermissions: exportPermissions,
      }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user password
 * @route   PUT /api/users/password
 * @access  Private
 */
exports.updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return responseFormatter.error(res, "User not found", 404);
    }

    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return responseFormatter.error(res, "Current password is incorrect", 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Return success response with clear message
    responseFormatter.success(res, "Password updated successfully", {
      updated: true,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Password update error:", err);

    // Provide a more specific error message if possible
    if (err.name === "ValidationError") {
      return responseFormatter.error(
        res,
        "Password validation failed: " + err.message,
        400
      );
    }

    next(err);
  }
};
