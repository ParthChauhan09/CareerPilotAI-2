import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  promptData: {
    jobTitle: string;
    skills: string[];
    experience: string;
    education: string;
    additionalInfo?: string;
  };
  resultText: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}

const ResumeSchema = new Schema<IResume>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    promptData: {
      jobTitle: {
        type: String,
        required: [true, 'Please add a job title'],
      },
      skills: [String],
      experience: {
        type: String,
        required: [true, 'Please add experience details'],
      },
      education: {
        type: String,
        required: [true, 'Please add education details'],
      },
      additionalInfo: String,
    },
    resultText: {
      type: String,
      required: [true, 'Resume content is required'],
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
ResumeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Update the updatedAt field before saving
ResumeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create index for faster queries
ResumeSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
