const express = require('express');
const router = express.Router();
const { createReel, getFeedReels, toggleLikeReel, addComment, deleteReel } = require('../controllers/reelController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createReel)
    .get(getFeedReels);

router.patch('/:id/like', protect, toggleLikeReel);
router.post('/:id/comment', protect, addComment);


router.route('/:id')
    .delete(protect, deleteReel);


module.exports = router;