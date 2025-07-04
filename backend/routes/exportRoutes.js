const express = require("express");
const router = express.Router();
const {
  exportResumeDocx,
  exportResumeTxt,
  exportCoverLetterDocx,
  exportCoverLetterTxt,
  exportLinkedInDocx,
  exportLinkedInTxt,
} = require("../controllers/exportController");
const {
  protect,
  checkDocxExportPermission,
  checkTxtExportPermission,
} = require("../middleware/auth");

// All routes are protected
router.use(protect);

// Resume export routes
router.get("/resume/:id/docx", checkDocxExportPermission, exportResumeDocx);
router.get("/resume/:id/txt", checkTxtExportPermission, exportResumeTxt);

// Cover letter export routes
router.get(
  "/cover-letter/:id/docx",
  checkDocxExportPermission,
  exportCoverLetterDocx
);
router.get(
  "/cover-letter/:id/txt",
  checkTxtExportPermission,
  exportCoverLetterTxt
);

// LinkedIn export routes
router.get("/linkedin/:id/docx", checkDocxExportPermission, exportLinkedInDocx);
router.get("/linkedin/:id/txt", checkTxtExportPermission, exportLinkedInTxt);

module.exports = router;
