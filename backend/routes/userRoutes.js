const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserUsage,
  updateUserPassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const {
  updateProfileValidation,
  updatePasswordValidation,
  validate,
} = require("../middleware/validator");

// All routes are protected
router.use(protect);

// Routes
router
  .route("/profile")
  .get(getUserProfile)
  .put(updateProfileValidation, validate, updateUserProfile);

router.put("/password", updatePasswordValidation, validate, updateUserPassword);

router.get("/usage", getUserUsage);

module.exports = router;
