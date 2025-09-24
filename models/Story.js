const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: String, required: true }, // URL to image or video
    caption: { type: String },
    createdAt: { type: Date, default: Date.now, expires: '24h' } // Stories expire after 24 hours
});

module.exports = mongoose.model('Story', StorySchema);