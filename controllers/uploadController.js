const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary with the credentials from your server's .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Generate a secure signature for Cloudinary upload
// @route   GET /api/upload/signature
// @access  Private
exports.generateUploadSignature = (req, res) => {
    // Get the timestamp in seconds
    const timestamp = Math.round((new Date).getTime()/1000);

    // Use the Cloudinary SDK to create a signature
    // This uses your API_SECRET securely on the server
    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
    }, process.env.CLOUDINARY_API_SECRET);

    // Send the signature, timestamp, and api_key back to the client
    res.status(200).json({
        signature,
        timestamp,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY
    });
};