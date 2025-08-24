const express = require("express");
const router = express.Router();
const {
  generateResumePdf,
  generateCoverLetterPdf,
  generateLinkedInPdf,
  generateResumePdfPreview,
  generateCoverLetterPdfPreview,
  generateLinkedInPdfPreview,
} = require("../controllers/pdfController");
const { protect, checkPdfPermission } = require("../middleware/auth");

// All routes are protected
router.use(protect);

// PDF Download Routes
router.get("/resume/:id", checkPdfPermission, generateResumePdf);
router.get("/cover-letter/:id", checkPdfPermission, generateCoverLetterPdf);
router.get("/linkedin/:id", checkPdfPermission, generateLinkedInPdf);

// PDF Preview Routes (inline display)
router.get("/resume/:id/preview", generateResumePdfPreview);
router.get("/cover-letter/:id/preview", generateCoverLetterPdfPreview);
router.get("/linkedin/:id/preview", generateLinkedInPdfPreview);

module.exports = router;
