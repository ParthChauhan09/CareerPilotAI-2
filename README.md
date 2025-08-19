# CareerPilotAI

A comprehensive SaaS application for generating professional resumes, cover letters, and LinkedIn bios using AI technology. Built for the Indian market with Razorpay payment integration.

## Features

- **AI-Powered Generation**: Create professional documents using Google Gemini AI
- **Multiple Export Formats**: PDF, DOCX, and TXT exports
- **Subscription Plans**: Free, Basic (₹499), and Premium (₹999) plans
- **Secure Payments**: Razorpay integration for Indian market
- **Modern UI**: Built with React, Next.js, and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Razorpay Checkout**: Payment gateway integration

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **Razorpay**: Payment processing

### AI Integration
- **Google Gemini**: AI content generation
- **Puppeteer**: PDF generation
- **DOCX**: Word document creation

## Payment Integration

CareerPilotAI uses **Razorpay** as the payment gateway, specifically designed for the Indian market:

- **Currency**: Indian Rupees (INR)
- **Plans**: Basic (₹499), Premium (₹999)
- **Payment Methods**: Cards, UPI, Net Banking, Wallets
- **Security**: PCI DSS compliant with signature verification

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- Razorpay account
- Google Gemini API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ParthChauhan09/CareerPilotAI-2.git
   cd CareerPilotAI-2
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure environment variables
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Configure environment variables
   npm run dev
   ```

### Environment Configuration

#### Backend (.env)
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=CareerPilotAI
NEXT_PUBLIC_BASIC_PLAN_PRICE=499
NEXT_PUBLIC_PREMIUM_PLAN_PRICE=999
```

## Project Structure

```
CareerPilotAI-2/
├── backend/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── frontend/               # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and API
│   └── public/             # Static assets
└── README.md
```

## API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Document Generation
- `POST /api/generate/resume` - Generate resume
- `POST /api/generate/cover-letter` - Generate cover letter
- `POST /api/generate/linkedin` - Generate LinkedIn bio

### Payment
- `GET /api/payment/plans` - Get subscription plans
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `POST /api/payment/webhook` - Razorpay webhook handler

## Deployment

### Backend Deployment
- Deploy to platforms like Render, Railway, or Heroku
- Configure environment variables
- Set up MongoDB Atlas for database
- Configure Razorpay webhooks

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar platforms
- Configure environment variables
- Update API base URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Contact: [chauhanparth6100@gmail.com]

---

Built with ❤️ for the Indian market using Razorpay payments
