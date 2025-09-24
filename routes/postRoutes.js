const express = require('express');
const router = express.Router();
const {
    createPost,
    getFeedPosts,
    toggleLikePost,
    addComment,
    deletePost
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// All these routes are protected and require a logged-in user
router.route('/')
    .post(protect, createPost)
    .get(getFeedPosts);

router.route('/:id')
    .delete(protect, deletePost);
    
router.patch('/:id/like', protect, toggleLikePost);
router.post('/:id/comment', protect, addComment);

module.exports = router;