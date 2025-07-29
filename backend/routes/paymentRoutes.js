const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const config = require("../config/config");
const { protect } = require("../middleware/auth");
const responseFormatter = require("../utils/responseFormatter");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

/**
 * @desc    Get available plans
 * @route   GET /api/payment/plans
 * @access  Public
 */
router.get("/plans", (req, res) => {
  responseFormatter.success(res, "Plans retrieved successfully", {
    plans: config.plans,
  });
});

/**
 * @desc    Create a Razorpay order
 * @route   POST /api/payment/create-order
 * @access  Private
 */
router.post("/create-order", protect, async (req, res, next) => {
  try {
    const { planType } = req.body;

    // Validate plan type
    if (!config.plans[planType]) {
      return responseFormatter.error(res, "Invalid plan type", 400);
    }

    const plan = config.plans[planType];

    // Create Razorpay order
    const options = {
      amount: Math.round(plan.price * 100), // Amount in paise
      currency: plan.currency || "INR",
      receipt: `receipt_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id,
        planType: planType,
        planName: plan.name,
      },
    };

    const order = await razorpay.orders.create(options);

    responseFormatter.success(res, "Order created successfully", {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: config.razorpay.keyId,
      planName: plan.name,
      userEmail: req.user.email,
      userName: req.user.name,
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    next(err);
  }
});

/**
 * @desc    Verify payment and update user plan
 * @route   POST /api/payment/verify
 * @access  Private
 */
router.post("/verify", protect, async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planType,
    } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", config.razorpay.keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return responseFormatter.error(res, "Payment verification failed", 400);
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status === "captured") {
      // Update user's plan
      await User.findByIdAndUpdate(req.user.id, { planType });

      console.log(
        `User ${req.user.id} upgraded to ${planType} plan via payment ${razorpay_payment_id}`
      );

      responseFormatter.success(
        res,
        "Payment verified and plan updated successfully",
        {
          paymentId: razorpay_payment_id,
          planType,
        }
      );
    } else {
      responseFormatter.error(res, "Payment not captured", 400);
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    next(err);
  }
});

/**
 * @desc    Razorpay webhook handler
 * @route   POST /api/payment/webhook
 * @access  Public
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const webhookBody = req.body;

    try {
      // Verify webhook signature
      const expectedSignature = crypto
        .createHmac("sha256", config.razorpay.webhookSecret)
        .update(webhookBody)
        .digest("hex");

      if (expectedSignature !== webhookSignature) {
        return res.status(400).send("Webhook signature verification failed");
      }

      const event = JSON.parse(webhookBody);

      // Handle payment captured event
      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        try {
          // Fetch order details to get user info
          const order = await razorpay.orders.fetch(orderId);
          const { userId, planType } = order.notes;

          if (userId && planType) {
            // Update user's plan
            await User.findByIdAndUpdate(userId, { planType });
            console.log(
              `Webhook: User ${userId} upgraded to ${planType} plan via payment ${payment.id}`
            );
          }
        } catch (error) {
          console.error("Error processing payment webhook:", error);
        }
      }

      // Return a response to acknowledge receipt of the event
      res.json({ status: "ok" });
    } catch (err) {
      console.error("Webhook processing error:", err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

module.exports = router;
