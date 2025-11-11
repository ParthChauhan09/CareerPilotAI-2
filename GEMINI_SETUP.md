# Google Gemini API Setup Guide

## Overview
CareerPilotAI uses Google's Gemini AI API for generating professional LaTeX content for resumes, cover letters, and LinkedIn bios. This guide will help you set up and configure the Gemini API for optimal performance.

## Quick Setup

### 1. Get Your API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

#### Backend Configuration
Add to `backend/.env`:
```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=8192
```

#### Frontend Configuration (Next.js)
Add to `frontend/.env.local`:
```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

## Model Selection

### Current Stable Models (2025)

| Model | Best For | Token Limit | Speed |
|-------|----------|-------------|-------|
| **gemini-2.5-flash** ⭐ | Production use, balanced performance | 1M input / 65K output | Fast |
| **gemini-2.0-flash** | Legacy support, reliable fallback | 1M input / 8K output | Very Fast |
| **gemini-1.5-pro** | Complex tasks, highest quality | 2M input / 8K output | Moderate |

**Recommended:** Use `gemini-2.5-flash` for production (default in config)

### Automatic Fallback System
The application automatically tries multiple models if one fails:
1. Primary model (from config)
2. `gemini-2.5-flash`
3. `gemini-2.0-flash`
4. `gemini-1.5-pro`

This ensures maximum reliability even if a specific model is temporarily unavailable.

## Configuration Options

### Temperature (0.0 - 1.0)
Controls creativity vs consistency:
- **0.6-0.7** (Recommended): Balanced, professional output
- **0.3-0.5**: More consistent, conservative
- **0.8-1.0**: More creative, varied

### Max Output Tokens
Controls document length:
- **8192** (Recommended): Full-length documents
- **4096**: Shorter documents
- **16384**: Very long documents (if supported)

## Rate Limits & Quotas

### Free Tier
- **60 requests per minute**
- **1,500 requests per day**
- Suitable for development and testing

### Paid Tier (Pay-as-you-go)
- **1,000 requests per minute**
- **Unlimited daily requests**
- Recommended for production

### Handling Rate Limits
The application includes built-in rate limit handling:
1. **Automatic Retry**: Retries with exponential backoff
2. **Fallback Templates**: Uses pre-built templates if API fails
3. **Development Cache**: Caches responses for 5 minutes in development

## Production Best Practices

### 1. Environment-Specific Configuration
```javascript
// Development
NODE_ENV=development
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TEMPERATURE=0.7

// Production
NODE_ENV=production
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TEMPERATURE=0.6  // Slightly more conservative
```

### 2. API Key Security
- ✅ Store in environment variables
- ✅ Never commit to version control
- ✅ Use different keys for dev/staging/prod
- ✅ Rotate keys periodically
- ❌ Never hardcode in source files
- ❌ Never expose in client-side code

### 3. Error Handling
The application handles errors gracefully:
- **404 Model Not Found**: Tries fallback models
- **429 Rate Limit**: Uses exponential backoff + fallback templates
- **500 Server Error**: Retries with backoff
- **Network Issues**: Retries with timeout

### 4. Monitoring & Logging
Monitor these metrics in production:
- API response times
- Error rates by type
- Model fallback frequency
- Token usage per request
- Cache hit rates (development)

### 5. Cost Optimization
```javascript
// Optimize token usage
GEMINI_MAX_TOKENS=8192  // Sufficient for most documents

// Use caching in development
NODE_ENV=development  // Enables 5-minute cache

// Monitor usage
// Check Google AI Studio dashboard regularly
```

## Troubleshooting

### Error: "models/gemini-1.5-flash is not found"
**Solution**: Update to `gemini-2.5-flash` in your config
```env
GEMINI_MODEL=gemini-2.5-flash
```

### Error: "Rate limit exceeded"
**Solutions**:
1. Wait for quota reset (1 minute for free tier)
2. Upgrade to paid tier
3. Application will use fallback templates automatically

### Error: "API key not valid"
**Solutions**:
1. Verify API key in Google AI Studio
2. Check for extra spaces in `.env` file
3. Regenerate API key if needed

### Error: "Empty response from Gemini API"
**Solutions**:
1. Check internet connection
2. Verify API key is active
3. Check Google AI Studio status page

## Testing Your Setup

### 1. Test API Connection
```bash
cd backend
node -e "
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
model.generateContent('Hello').then(r => console.log('✓ API Working!'));
"
```

### 2. Test Document Generation
1. Start the backend server
2. Create a test resume through the UI
3. Check logs for successful generation
4. Verify PDF output

## Upgrading from Old Models

If you're using `gemini-1.5-flash` or `gemini-pro`:

### Step 1: Update Config Files
```bash
# backend/config/config.js - Already updated ✓
# backend/utils/geminiServiceLatex.js - Already updated ✓
```

### Step 2: Update Environment Variables
```env
# Change from:
GEMINI_MODEL=gemini-1.5-flash

# To:
GEMINI_MODEL=gemini-2.5-flash
```

### Step 3: Restart Application
```bash
# Backend
cd backend
npm restart

# Frontend
cd frontend
npm run dev
```

## Support & Resources

- **Google AI Studio**: https://aistudio.google.com
- **API Documentation**: https://ai.google.dev/gemini-api/docs
- **Model List**: https://ai.google.dev/gemini-api/docs/models
- **Pricing**: https://ai.google.dev/pricing
- **Status Page**: https://status.cloud.google.com

## Summary

✅ **Fixed Issues:**
- Updated from deprecated `gemini-1.5-flash` to stable `gemini-2.5-flash`
- Added automatic model fallback system
- Enhanced error handling and retry logic
- Improved production configuration

✅ **Production Ready:**
- Environment-based configuration
- Secure API key management
- Automatic fallback mechanisms
- Comprehensive error handling
- Rate limit protection

Your CareerPilotAI application is now configured with the latest Gemini models and production-ready error handling!
