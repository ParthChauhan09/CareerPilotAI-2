const express = require("express");
const router = express.Router();
const {
  generateResumePdf,
  generateCoverLetterPdf,
  generateLinkedInPdf,
} = require("../controllers/pdfController");
const { protect, checkPdfPermission } = require("../middleware/auth");

// All routes are protected
router.use(protect);

// Routes
router.get("/resume/:id", checkPdfPermission, generateResumePdf);
router.get("/cover-letter/:id", checkPdfPermission, generateCoverLetterPdf);
router.get("/linkedin/:id", checkPdfPermission, generateLinkedInPdf);

module.exports = router;
