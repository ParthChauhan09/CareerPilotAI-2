const { validationResult, body } = require("express-validator");

/**
 * Middleware to check validation results
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
exports.registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot be more than 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

/**
 * Validation rules for user login
 */
exports.loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

/**
 * Validation rules for resume generation
 */
exports.resumeValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot be more than 100 characters"),
  body("promptData.jobTitle")
    .trim()
    .notEmpty()
    .withMessage("Job title is required"),
  body("promptData.experience")
    .trim()
    .notEmpty()
    .withMessage("Experience details are required"),
  body("promptData.education")
    .trim()
    .notEmpty()
    .withMessage("Education details are required"),
];

/**
 * Validation rules for cover letter generation
 */
exports.coverLetterValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot be more than 100 characters"),
  body("promptData.jobTitle")
    .trim()
    .notEmpty()
    .withMessage("Job title is required"),
  body("promptData.companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required"),
];

/**
 * Validation rules for LinkedIn bio generation
 */
exports.linkedinValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot be more than 100 characters"),
  body("profile.firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  body("profile.lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),
  body("profile.location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),
  body("profile.industry")
    .trim()
    .notEmpty()
    .withMessage("Industry is required"),
  body("profile.currentPosition")
    .trim()
    .notEmpty()
    .withMessage("Current position is required"),
  body("experience.professionalExperience")
    .trim()
    .notEmpty()
    .withMessage("Professional experience is required"),
  body("experience.education")
    .trim()
    .notEmpty()
    .withMessage("Education is required"),
  body("preferences.tone")
    .trim()
    .notEmpty()
    .withMessage("Tone is required")
    .isIn(["professional", "friendly", "creative"])
    .withMessage("Tone must be professional, friendly, or creative"),
  body("preferences.targetRole")
    .trim()
    .notEmpty()
    .withMessage("Target role is required"),
];

/**
 * Validation rules for updating user profile
 */
exports.updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Name cannot be more than 50 characters"),
  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Please provide a valid email"),
];

/**
 * Validation rules for updating user password
 */
exports.updatePasswordValidation = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
