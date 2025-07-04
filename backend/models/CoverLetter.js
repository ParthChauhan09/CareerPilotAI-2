const mongoose = require("mongoose");

const CoverLetterSchema = new mongoose.Schema(
  {
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
    promptData: {
      jobTitle: {
        type: String,
        required: [true, "Please add a job title"],
      },
      companyName: {
        type: String,
        required: [true, "Please add a company name"],
      },
      skills: [String],
      experience: String,
      jobDescription: String,
      additionalInfo: String,
    },
    resultText: {
      type: String,
      required: [true, "Cover letter content is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual field for id
CoverLetterSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Update the updatedAt field before saving
CoverLetterSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for faster queries
CoverLetterSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("CoverLetter", CoverLetterSchema);
