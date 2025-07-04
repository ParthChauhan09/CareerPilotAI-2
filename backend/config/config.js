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
    model: "gemini-2.0-flash", // Safe default model
    fallbackModel: "gemini-pro", // Fallback model if primary is unavailable
    temperature: 0.7,
    maxOutputTokens: 4096,
  },

  // Stripe configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
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
        docxExport: true,
        txtExport: true,
      },
    },
  },
};
