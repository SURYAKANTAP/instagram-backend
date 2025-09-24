const Reel = require('../models/Reel');
const User = require('../models/User');

// @desc    Create a new reel
// @route   POST /api/reels
// @access  Private
exports.createReel = async (req, res) => {
    try {
        const { caption, video } = req.body;
        if (!video) {
            return res.status(400).json({ message: 'Video URL is required' });
        }
        const newReel = await Reel.create({ user: req.user._id, caption, video });
        res.status(201).json(newReel);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get reels for the feed
// @route   GET /api/reels
// @access  Private
exports.getFeedReels = async (req, res) => {
    try {
        const reels = await Reel.find({})
            .populate('user', 'username profilePhoto')
            .sort({ createdAt: -1 });
        res.status(200).json(reels);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Like or Unlike a reel
// @route   PATCH /api/reels/:id/like
// @access  Private
exports.toggleLikeReel = async (req, res) => {
    try {
        const reel = await Reel.findById(req.params.id);
        if (!reel) return res.status(404).json({ message: 'Reel not found' });
        if (reel.likes.includes(req.user._id)) {
            await reel.updateOne({ $pull: { likes: req.user._id } });
            res.status(200).json({ message: 'Reel unliked' });
        } else {
            await reel.updateOne({ $push: { likes: req.user._id } });
            res.status(200).json({ message: 'Reel liked' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// Other controllers like addComment and deleteReel would be very similar to the postController



// @desc    Add a comment to a reel
// @route   POST /api/reels/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const reel = await Reel.findById(req.params.id);
        if (!reel) {
            return res.status(404).json({ message: 'Reel not found' });
        }

        const newComment = {
            user: req.user._id,
            text
        };

        reel.comments.push(newComment);
        await reel.save();

        // Populate the new comment before sending it back
        const updatedReel = await Reel.findById(req.params.id)
            .populate('comments.user', 'username');

        res.status(201).json(updatedReel.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};



// @desc    Delete a reel
// @route   DELETE /api/reels/:id
// @access  Private
exports.deleteReel = async (req, res) => {
    try {
        const reel = await Reel.findById(req.params.id);
        if (!reel) {
            return res.status(404).json({ message: 'Reel not found' });
        }

        // Ensure the user deleting the reel is the one who created it
        if (reel.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User not authorized to delete this reel' });
        }

        await Reel.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Reel deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};