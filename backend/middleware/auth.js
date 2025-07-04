const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");

/**
 * Protect routes - Middleware to verify JWT token and attach user to request
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Attach user to request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
};

/**
 * Check if user has reached usage limits for a specific generation type
 * @param {string} generationType - Type of generation (resume, coverLetter, linkedin)
 */
exports.checkUsageLimit = (generationType) => async (req, res, next) => {
  try {
    // Skip check for premium users
    if (req.user.planType === "premium") {
      return next();
    }

    // Check if user has reached their limit
    if (req.user.hasReachedLimit(generationType)) {
      return res.status(403).json({
        success: false,
        error: `You have reached your ${generationType} generation limit. Please upgrade your plan.`,
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Error checking usage limits",
    });
  }
};

/**
 * Check if user's plan allows DOCX exports
 */
exports.checkDocxExportPermission = async (req, res, next) => {
  try {
    // Check if user's plan allows DOCX export
    if (!req.user.canUseExportFormat("docx")) {
      return res.status(403).json({
        success: false,
        error:
          "DOCX export is only available for Basic and Premium plans. Please upgrade your plan.",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Error checking export permissions",
    });
  }
};

/**
 * Check if user's plan allows PDF generation
 */
exports.checkPdfPermission = async (req, res, next) => {
  try {
    // Check if user's plan allows PDF export
    if (!req.user.canUseExportFormat("pdf")) {
      return res.status(403).json({
        success: false,
        error:
          "PDF export is only available for paid plans. Please upgrade your plan.",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Error checking PDF permissions",
    });
  }
};

/**
 * Check if user's plan allows TXT exports
 */
exports.checkTxtExportPermission = async (req, res, next) => {
  try {
    // Check if user's plan allows TXT export
    if (!req.user.canUseExportFormat("txt")) {
      return res.status(403).json({
        success: false,
        error:
          "TXT export is only available for paid plans. Please upgrade your plan.",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Error checking export permissions",
    });
  }
};
