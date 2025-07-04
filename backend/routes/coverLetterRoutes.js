const express = require('express');
const router = express.Router();
const { 
  generateCoverLetter, 
  getCoverLetters, 
  getCoverLetter, 
  updateCoverLetter, 
  deleteCoverLetter 
} = require('../controllers/coverLetterController');
const { protect, checkUsageLimit } = require('../middleware/auth');
const { coverLetterValidation, validate } = require('../middleware/validator');

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .post(coverLetterValidation, validate, checkUsageLimit('coverLetter'), generateCoverLetter)
  .get(getCoverLetters);

router.route('/:id')
  .get(getCoverLetter)
  .put(updateCoverLetter)
  .delete(deleteCoverLetter);

module.exports = router;
