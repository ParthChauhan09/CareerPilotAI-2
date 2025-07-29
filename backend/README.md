# CareerPilotAI Backend

This is the backend application for CareerPilotAI, built with Node.js, Express, and MongoDB.

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the backend directory with the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# AI Service Configuration
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

# Razorpay Payment Gateway Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### Environment Variable Descriptions

- **PORT**: Port number for the server (default: 5000)
- **NODE_ENV**: Environment mode (development/production)
- **MONGO_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for JWT token generation
- **JWT_EXPIRE**: JWT token expiration time
- **OPENAI_API_KEY**: OpenAI API key (legacy support)
- **GEMINI_API_KEY**: Google Gemini API key for AI generation
- **RAZORPAY_KEY_ID**: Razorpay Key ID from your Razorpay dashboard
- **RAZORPAY_KEY_SECRET**: Razorpay Key Secret from your Razorpay dashboard
- **RAZORPAY_WEBHOOK_SECRET**: Webhook secret for verifying Razorpay webhooks

## Razorpay Integration

The application uses Razorpay as the payment gateway for handling subscriptions in the Indian market.

### Setup Instructions

1. **Create Razorpay Account**:
   - Sign up at [https://razorpay.com](https://razorpay.com)
   - Complete KYC verification
   - Get your API keys from the dashboard

2. **Configure Environment Variables**:
   - Add your Razorpay Key ID and Key Secret to the `.env` file
   - Set up webhook secret for secure webhook verification

3. **Webhook Configuration**:
   - In your Razorpay dashboard, go to Settings > Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payment/webhook`
   - Select events: `payment.captured`
   - Add the webhook secret to your environment variables

### Payment Flow

1. **Create Order**: Frontend calls `/api/payment/create-order` to create a Razorpay order
2. **Checkout**: Razorpay checkout modal opens with order details
3. **Payment**: User completes payment through Razorpay
4. **Verification**: Frontend calls `/api/payment/verify` to verify payment signature
5. **Webhook**: Razorpay sends webhook for payment confirmation (backup verification)

### API Endpoints

- `GET /api/payment/plans` - Get available subscription plans
- `POST /api/payment/create-order` - Create Razorpay order for subscription
- `POST /api/payment/verify` - Verify payment and update user subscription
- `POST /api/payment/webhook` - Handle Razorpay webhooks

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Dependencies

- **razorpay**: Payment gateway integration
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **@google/generative-ai**: Gemini AI integration
- **puppeteer**: PDF generation
- **docx**: Word document generation

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Razorpay signature verification
- Webhook signature validation
- Input validation and sanitization
