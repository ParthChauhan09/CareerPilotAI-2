const express = require('express');
const router = express.Router();
const { 
  generateLinkedInBio, 
  getLinkedInBios, 
  getLinkedInBio, 
  updateLinkedInBio, 
  deleteLinkedInBio 
} = require('../controllers/linkedinController');
const { protect, checkUsageLimit } = require('../middleware/auth');
const { linkedinValidation, validate } = require('../middleware/validator');

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .post(linkedinValidation, validate, checkUsageLimit('linkedin'), generateLinkedInBio)
  .get(getLinkedInBios);

router.route('/:id')
  .get(getLinkedInBio)
  .put(updateLinkedInBio)
  .delete(deleteLinkedInBio);

module.exports = router;
