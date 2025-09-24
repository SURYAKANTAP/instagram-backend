const express = require('express');
const router = express.Router();
const { createStory, getFeedStories, deleteStory } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createStory)
    .get(getFeedStories);

    router.delete('/:id', protect, deleteStory);

module.exports = router;