const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  planType: {
    type: String,
    enum: ["free", "basic", "premium"],
    default: "free",
  },
  usageStats: {
    resumeGenerations: {
      type: Number,
      default: 0,
    },
    coverLetterGenerations: {
      type: Number,
      default: 0,
    },
    linkedinGenerations: {
      type: Number,
      default: 0,
    },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has reached usage limits
UserSchema.methods.hasReachedLimit = function (generationType) {
  if (this.planType === "premium") {
    return false; // Premium users have unlimited access
  }

  const plan = config.plans[this.planType];
  const currentUsage = this.usageStats[`${generationType}Generations`];
  const limit = plan.features[`${generationType}Generations`];

  return currentUsage >= limit;
};

// Get plan limit for a specific feature
UserSchema.methods.getPlanLimit = function (feature) {
  const plan = config.plans[this.planType];
  return plan.features[feature] || 0;
};

// Check if user's plan allows a specific export format
UserSchema.methods.canUseExportFormat = function (format) {
  const plan = config.plans[this.planType];
  const featureKey = `${format}Export`;
  return plan.features[featureKey] === true;
};

// Check if user's plan allows PDF preview (should be available for all plans)
UserSchema.methods.canUsePdfPreview = function () {
  const plan = config.plans[this.planType];
  return plan.features.pdfPreview === true;
};

// Increment usage counter
UserSchema.methods.incrementUsage = function (generationType) {
  this.usageStats[`${generationType}Generations`] += 1;
  return this.save();
};

module.exports = mongoose.model("User", UserSchema);
