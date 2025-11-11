import mongoose, { Document, Schema } from 'mongoose';

export interface ILinkedInBio extends Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  profile: {
    firstName: string;
    lastName: string;
    headline?: string;
    location: string;
    industry: string;
    currentPosition: string;
  };
  experience: {
    skills?: string;
    professionalExperience: string;
    education: string;
    certifications?: string;
  };
  preferences: {
    tone: 'professional' | 'friendly' | 'creative';
    targetRole: string;
    focusPoints?: string;
    keywords?: string;
  };
  resultText: string;
  createdAt: Date;
  updatedAt: Date;
}

const LinkedInBioSchema = new Schema<ILinkedInBio>({
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
  profile: {
    firstName: {
      type: String,
      required: [true, 'Please add your first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please add your last name'],
    },
    headline: String,
    location: {
      type: String,
      required: [true, 'Please add your location'],
    },
    industry: {
      type: String,
      required: [true, 'Please add your industry'],
    },
    currentPosition: {
      type: String,
      required: [true, 'Please add your current position'],
    },
  },
  experience: {
    skills: String,
    professionalExperience: {
      type: String,
      required: [true, 'Please add your professional experience'],
    },
    education: {
      type: String,
      required: [true, 'Please add your education'],
    },
    certifications: String,
  },
  preferences: {
    tone: {
      type: String,
      enum: ['professional', 'friendly', 'creative'],
      default: 'professional',
    },
    targetRole: {
      type: String,
      required: [true, 'Please add your target role'],
    },
    focusPoints: String,
    keywords: String,
  },
  resultText: {
    type: String,
    required: [true, 'LinkedIn bio content is required'],
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

export default mongoose.models.LinkedInBio || mongoose.model<ILinkedInBio>('LinkedInBio', LinkedInBioSchema);
