const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Middleware
//app.use(cors());
app.use(
  cors({
    origin: ["https://careerpilotairesume.vercel.app",
      "http://localhost:3000"
    ], // your Vercel frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
  })
);
app.use(express.json({ limit: "10mb" }));

// Special handling for Razorpay webhook
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/generate/resume", require("./routes/resumeRoutes"));
app.use("/api/generate/cover-letter", require("./routes/coverLetterRoutes"));
app.use("/api/generate/linkedin", require("./routes/linkedinRoutes"));
app.use("/api/pdf", require("./routes/pdfRoutes"));
app.use("/api/export", require("./routes/exportRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ResumAI API is running",
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
