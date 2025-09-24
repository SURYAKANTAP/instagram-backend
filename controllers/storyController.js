const Story = require('../models/Story');

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private
exports.createStory = async (req, res) => {
    try {
        const { media, caption } = req.body;
        if (!media) {
            return res.status(400).json({ message: 'Media URL is required' });
        }
        const newStory = await Story.create({ user: req.user._id, media, caption });
        res.status(201).json(newStory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get stories for the user's feed (from people they follow)
// @route   GET /api/stories
// @access  Private
exports.getFeedStories = async (req, res) => {
    try {
        const stories = await Story.find({})
            .populate('user', 'username profilePhoto')
            .sort({ createdAt: -1 });
            
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


exports.deleteStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        
        // --- Security Check ---
        // Ensure the user deleting the story is the one who created it
        if (story.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User not authorized to delete this story' });
        }
        
        // In a real-world scenario, you might want to delete the media from Cloudinary here as well.
        // For now, we just delete the database record.
        await Story.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};
