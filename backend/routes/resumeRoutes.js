const express = require('express');
const router = express.Router();
const { 
  generateResume, 
  getResumes, 
  getResume, 
  updateResume, 
  deleteResume 
} = require('../controllers/resumeController');
const { protect, checkUsageLimit } = require('../middleware/auth');
const { resumeValidation, validate } = require('../middleware/validator');

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .post(resumeValidation, validate, checkUsageLimit('resume'), generateResume)
  .get(getResumes);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

module.exports = router;
