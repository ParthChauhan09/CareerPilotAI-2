# CareerPilotAI Frontend

This is the frontend application for CareerPilotAI, built with Next.js, React, and Tailwind CSS.

## Environment Variables

The application uses environment variables for configuration. Create a `.env.local` file in the frontend directory with the following variables:

```bash
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=CareerPilotAI
NEXT_PUBLIC_APP_VERSION=1.0.0

# Pricing Configuration (in Indian Rupees - for Razorpay integration)
NEXT_PUBLIC_BASIC_PLAN_PRICE=499
NEXT_PUBLIC_PREMIUM_PLAN_PRICE=999

# Environment
NODE_ENV=development
```

### Environment Variable Descriptions

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for the backend API
- `NEXT_PUBLIC_APP_NAME`: The application name displayed in the UI
- `NEXT_PUBLIC_APP_VERSION`: The application version
- `NEXT_PUBLIC_BASIC_PLAN_PRICE`: Price for the basic subscription plan (in INR)
- `NEXT_PUBLIC_PREMIUM_PLAN_PRICE`: Price for the premium subscription plan (in INR)
- `NODE_ENV`: The environment mode (development/production)

### Important Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- The `.env.local` file is ignored by git for security
- Copy `.env.example` to `.env.local` and modify values as needed
- All pricing is in Indian Rupees (₹)

## Getting Started

1. Copy the environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

The application configuration is centralized in `lib/config.ts`, which reads from environment variables and provides type-safe access to configuration values throughout the application.
