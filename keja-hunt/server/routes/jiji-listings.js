const express = require('express');
const router = express.Router();
const Listing = require('../models/jiji-listing');

// Get all listings with Jiji-style filtering
router.get('/', async (req, res) => {
  try {
    const { county, minPrice, maxPrice, propertyType, bedrooms } = req.query;
    
    const filter = {};
    if (county) filter.county = county;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (propertyType) filter.property_type = propertyType;
    if (bedrooms) filter.bedrooms = Number(bedrooms);

    const listings = await Listing.find(filter)
      .sort({ featured: -1, created_at: -1 })
      .limit(50);

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get popular counties for search suggestions
router.get('/counties', async (req, res) => {
  try {
    const counties = await Listing.distinct('county');
    res.json(counties.slice(0, 10)); // Return top 10 counties
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get listing details
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;