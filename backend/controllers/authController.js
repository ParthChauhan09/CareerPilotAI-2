const User = require("../models/User");
const responseFormatter = require("../utils/responseFormatter");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return responseFormatter.error(res, "Email already registered", 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    sendTokenResponse(user, 201, res, "User registered successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    console.log("Login attempt:", req.body);

    // Validate request body
    if (!req.body || !req.body.email || !req.body.password) {
      console.log("Missing required fields");
      return responseFormatter.error(
        res,
        "Email and password are required",
        400
      );
    }

    const { email, password } = req.body;

    // Check if user exists
    console.log("Finding user with email:", email);
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("User not found");
      return responseFormatter.error(res, "Invalid credentials", 401);
    }

    console.log("User found, checking password");

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Password does not match");
      return responseFormatter.error(res, "Invalid credentials", 401);
    }

    console.log("Password matched, generating token");

    // Generate token
    sendTokenResponse(user, 200, res, "Login successful");
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    responseFormatter.success(res, "User data retrieved", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        planType: user.planType,
        usageStats: user.usageStats,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Log user out / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = (req, res, next) => {
  try {
    responseFormatter.success(res, "Logged out successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * Get token from model, create cookie and send response
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.getSignedJwtToken();

  responseFormatter.success(
    res,
    message,
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        planType: user.planType,
      },
    },
    statusCode
  );
};
