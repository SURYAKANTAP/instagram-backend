const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        const { caption, media } = req.body;
        if (!media) {
            return res.status(400).json({ message: 'Media URL is required' });
        }

        const newPost = await Post.create({
            user: req.user._id, // from protect middleware
            caption,
            media
        });

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get posts for the user's feed (from people they follow)
// @route   GET /api/posts
// @access  Private
exports.getFeedPosts = async (req, res) => {
    try {
        // Find posts where the user is in the current user's following list
        const posts = await Post.find({})
            .populate('user', 'username profilePhoto') // Populate user details
            .populate('comments.user', 'username') // Populate commenter details
            .sort({ createdAt: -1 }); // Show newest posts first

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Like or Unlike a post
// @route   PATCH /api/posts/:id/like
// @access  Private
exports.toggleLikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the post has already been liked by this user
        if (post.likes.includes(req.user._id)) {
            // Unlike the post
            await post.updateOne({ $pull: { likes: req.user._id } });
            res.status(200).json({ message: 'Post unliked' });
        } else {
            // Like the post
            await post.updateOne({ $push: { likes: req.user._id } });
            res.status(200).json({ message: 'Post liked' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }
        
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            user: req.user._id,
            text
        };

        post.comments.push(newComment);
        await post.save();
        
        // Populate the new comment before sending it back
        const updatedPost = await Post.findById(req.params.id)
                                    .populate('comments.user', 'username');

        res.status(201).json(updatedPost.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        // Ensure the user deleting the post is the one who created it
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User not authorized to delete this post' });
        }
        
        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};