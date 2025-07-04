/**
 * Frontend configuration using environment variables
 */

export const config = {
  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",

  // Application Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "CareerPilotAI",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  },

  // Pricing Configuration (in Indian Rupees)
  pricing: {
    basic: parseInt(process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE || "499"),
    premium: parseInt(process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE || "999"),
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
}

export default config
