// Document Types
export type DocumentType = "resume" | "coverLetter" | "linkedin"

// User Types
export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface UserProfile extends User {
  planType: string
}

export interface UsageStats {
  usage: {
    resumeGenerations: number
    coverLetterGenerations: number
    linkedinGenerations: number
  }
  limits: {
    resumeGenerations: number
    coverLetterGenerations: number
    linkedinGenerations: number
  }
  planType: string
}

// Auth Types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Resume Types
export interface Resume {
  id: string
  title: string
  content?: string
  resultText?: string
  promptData?: {
    jobTitle: string
    skills: string[]
    experience: string
    education: string
    additionalInfo?: string
  }
  createdAt: string
  updatedAt: string
}

export interface ResumeFormData {
  title: string
  promptData: {
    jobTitle: string
    skills: string[]
    experience: string
    education: string
    additionalInfo?: string
  }
}

// Cover Letter Types
export interface CoverLetter {
  id: string
  title: string
  content?: string
  resultText?: string
  promptData?: {
    jobTitle: string
    companyName: string
    skills: string[]
    experience: string
    jobDescription: string
    additionalInfo?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CoverLetterFormData {
  title: string
  promptData: {
    jobTitle: string
    companyName: string
    skills: string[]
    experience: string
    jobDescription: string
    additionalInfo?: string
  }
}

// LinkedIn Bio Types
export interface LinkedInBio {
  id: string
  title: string
  content?: string
  resultText?: string
  profile?: {
    firstName: string
    lastName: string
    headline: string
    location: string
    industry: string
    currentPosition: string
  }
  experience?: {
    skills: string
    professionalExperience: string
    education: string
    certifications: string
  }
  preferences?: {
    tone: string
    targetRole: string
    focusPoints: string
    keywords: string
  }
  createdAt: string
  updatedAt: string
}

export interface LinkedInBioFormData {
  title: string
  profile: {
    firstName: string
    lastName: string
    headline: string
    location: string
    industry: string
    currentPosition: string
  }
  experience: {
    skills: string
    professionalExperience: string
    education: string
    certifications: string
  }
  preferences: {
    tone: string
    targetRole: string
    focusPoints: string
    keywords: string
  }
}

// Payment Types
export interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency?: string
  features: string[]
  documentsLimit?: number
  exportsLimit?: number
}
