const express = require('express');
const router = express.Router();
const { generateUploadSignature } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected to ensure only logged-in users can get a signature
router.get('/signature', protect, generateUploadSignature);

module.exports = router;