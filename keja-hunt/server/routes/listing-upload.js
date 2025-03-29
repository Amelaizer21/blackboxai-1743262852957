const express = require('express');
const router = express.Router();
const multer = require('multer');
const Listing = require('../models/jiji-listing');
const { verifyToken } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Handle listing submission
router.post('/', verifyToken, upload.array('images', 10), async (req, res) => {
  try {
    const { body, files } = req;
    
    // Process uploaded images
    const images = files.map(file => `/uploads/${file.filename}`);

    const listingData = {
      ...body,
      images,
      user: req.userId, // Attach user ID from auth middleware
      verified: false // New listings start unverified
    };

    const newListing = new Listing(listingData);
    await newListing.save();

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing: newListing
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create listing'
    });
  }
});

module.exports = router;