/**
 * Application configuration
 */
module.exports = {
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || "30d",
  },

  // OpenAI configuration (legacy)
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo", // Default model
    temperature: 0.7,
    maxTokens: 2048,
  },

  // Gemini configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash", // Updated to current stable model (2025)
    fallbackModels: [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-pro"
    ], // Multiple fallback options for reliability
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7,
    maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 8192,
  },

  // Razorpay configuration
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },

  // Application plans (prices in Indian Rupees)
  plans: {
    free: {
      name: "Free",
      price: 0,
      currency: "inr",
      features: {
        resumeGenerations: 1,
        coverLetterGenerations: 1,
        linkedinGenerations: 1,
        pdfExport: true,
        pdfPreview: true,
        docxExport: false,
        txtExport: true,
      },
    },
    basic: {
      name: "Basic",
      price: 499,
      currency: "inr",
      features: {
        resumeGenerations: 5,
        coverLetterGenerations: 5,
        linkedinGenerations: 3,
        pdfExport: true,
        pdfPreview: true,
        docxExport: true,
        txtExport: true,
      },
    },
    premium: {
      name: "Premium",
      price: 999,
      currency: "inr",
      features: {
        resumeGenerations: -1, // Unlimited
        coverLetterGenerations: -1, // Unlimited
        linkedinGenerations: -1, // Unlimited
        pdfExport: true,
        pdfPreview: true,
        docxExport: true,
        txtExport: true,
      },
    },
  },
};
