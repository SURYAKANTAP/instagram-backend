const User = require('../models/User');
const Post = require('../models/Post');
const Reel = require('../models/Reel');


exports.getMyProfile = async (req, res) => {
    try {
        // req.user is already populated by the 'protect' middleware
        const userId = req.user._id;

        // Find all posts and reels for the current user
        const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
        const reels = await Reel.find({ user: userId }).sort({ createdAt: -1 });

        // The user object from req.user might not be the most up-to-date.
        // It's good practice to fetch it fresh from the DB.
        const user = await User.findById(userId).select('-password');
        
        res.status(200).json({ user, posts, reels });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        
        const users = await User.find()
            .select('username profilePhoto'); // Only send necessary data

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};