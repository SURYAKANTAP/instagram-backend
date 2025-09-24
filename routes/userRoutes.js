const express = require('express');
const router = express.Router();
const { getMyProfile, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
router.get('/', protect, getAllUsers); // <-- ADD THIS NEW ROUTE
router.get('/me', protect, getMyProfile); 

module.exports = router;