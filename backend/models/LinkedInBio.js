const mongoose = require("mongoose");

const LinkedInBioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  profile: {
    firstName: {
      type: String,
      required: [true, "Please add your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please add your last name"],
    },
    headline: String,
    location: {
      type: String,
      required: [true, "Please add your location"],
    },
    industry: {
      type: String,
      required: [true, "Please add your industry"],
    },
    currentPosition: {
      type: String,
      required: [true, "Please add your current position"],
    },
  },
  experience: {
    skills: String,
    professionalExperience: {
      type: String,
      required: [true, "Please add your professional experience"],
    },
    education: {
      type: String,
      required: [true, "Please add your education"],
    },
    certifications: String,
  },
  preferences: {
    tone: {
      type: String,
      enum: ["professional", "friendly", "creative"],
      default: "professional",
    },
    targetRole: {
      type: String,
      required: [true, "Please add your target role"],
    },
    focusPoints: String,
    keywords: String,
  },
  content: {
    about: String,
    headline: String,
    experience: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for faster queries
LinkedInBioSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("LinkedInBio", LinkedInBioSchema);
