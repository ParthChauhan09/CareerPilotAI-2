const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");
const config = require("../config/config");
const { protect } = require("../middleware/auth");
const responseFormatter = require("../utils/responseFormatter");

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
 * @desc    Create a checkout session
 * @route   POST /api/payment/create-checkout-session
 * @access  Private
 */
router.post("/create-checkout-session", protect, async (req, res, next) => {
  try {
    const { planType } = req.body;

    // Validate plan type
    if (!config.plans[planType]) {
      return responseFormatter.error(res, "Invalid plan type", 400);
    }

    const plan = config.plans[planType];

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: plan.currency || "inr", // Use INR as default currency for Indian market
            product_data: {
              name: `CareerPilotAI ${plan.name} Plan`,
              description: `Upgrade to the ${plan.name} plan for enhanced career document generation capabilities.`,
            },
            unit_amount: Math.round(plan.price * 100), // Convert to paise (Indian cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment/cancel`,
      metadata: {
        userId: req.user.id,
        planType,
      },
    });

    responseFormatter.success(res, "Checkout session created", {
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @desc    Stripe webhook handler
 * @route   POST /api/payment/webhook
 * @access  Public
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Fulfill the order
      try {
        const { userId, planType } = session.metadata;

        // Update user's plan
        await User.findByIdAndUpdate(userId, { planType });

        console.log(`User ${userId} upgraded to ${planType} plan`);
      } catch (error) {
        console.error("Error processing payment webhook:", error);
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

module.exports = router;
