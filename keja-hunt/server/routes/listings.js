const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { auth, role } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get all listings with optional filters
router.get('/', async (req, res) => {
  try {
    const { 
      minPrice, 
      maxPrice, 
      bedrooms, 
      location, 
      rentalType,
      propertyType,
      amenities
    } = req.query;

    let queryText = 'SELECT * FROM listings WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (minPrice) {
      queryText += ` AND price >= $${paramCount++}`;
      params.push(minPrice);
    }

    if (maxPrice) {
      queryText += ` AND price <= $${paramCount++}`;
      params.push(maxPrice);
    }

    if (bedrooms) {
      queryText += ` AND bedrooms = $${paramCount++}`;
      params.push(bedrooms);
    }

    if (location) {
      queryText += ` AND location ILIKE $${paramCount++}`;
      params.push(`%${location}%`);
    }

    if (rentalType) {
      queryText += ` AND rental_type = $${paramCount++}`;
      params.push(rentalType);
    }

    if (propertyType) {
      queryText += ` AND property_type = $${paramCount++}`;
      params.push(propertyType);
    }

    if (amenities) {
      const amenityList = amenities.split(',');
      amenityList.forEach((amenity, index) => {
        queryText += ` AND $${paramCount++} = ANY(amenities)`;
        params.push(amenity.trim());
      });
    }

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create new listing (protected route)
router.post('/', auth, role(['landlord', 'admin']), upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      property_type,
      rental_type,
      price,
      bedrooms,
      bathrooms,
      square_meters,
      location,
      latitude,
      longitude,
      amenities,
      available_from,
      minimum_stay
    } = req.body;

    // Process uploaded images (would be uploaded to Cloudinary/S3 in production)
    const imageUrls = req.files.map(file => file.path);

    const queryText = `
      INSERT INTO listings (
        landlord_id, title, description, property_type, rental_type, 
        price, bedrooms, bathrooms, square_meters, location, 
        latitude, longitude, amenities, available_from, minimum_stay
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const params = [
      req.user.id,
      title,
      description,
      property_type,
      rental_type,
      price,
      bedrooms,
      bathrooms,
      square_meters,
      location,
      latitude,
      longitude,
      amenities ? amenities.split(',') : [],
      available_from,
      minimum_stay
    ];

    const result = await query(queryText, params);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM listings WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update listing (protected route)
router.put('/:id', auth, role(['landlord', 'admin']), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      square_meters,
      amenities,
      available_from,
      minimum_stay
    } = req.body;

    // Verify listing belongs to user (unless admin)
    const listing = await query('SELECT * FROM listings WHERE id = $1', [req.params.id]);
    if (listing.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (req.user.user_type !== 'admin' && listing.rows[0].landlord_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const queryText = `
      UPDATE listings SET
        title = $1,
        description = $2,
        price = $3,
        bedrooms = $4,
        bathrooms = $5,
        square_meters = $6,
        amenities = $7,
        available_from = $8,
        minimum_stay = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `;

    const params = [
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      square_meters,
      amenities ? amenities.split(',') : [],
      available_from,
      minimum_stay,
      req.params.id
    ];

    const result = await query(queryText, params);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete listing (protected route)
router.delete('/:id', auth, role(['landlord', 'admin']), async (req, res) => {
  try {
    // Verify listing belongs to user (unless admin)
    const listing = await query('SELECT * FROM listings WHERE id = $1', [req.params.id]);
    if (listing.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (req.user.user_type !== 'admin' && listing.rows[0].landlord_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await query('DELETE FROM listings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Proximity search (using geolocation)
router.get('/search/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    
    const queryText = `
      SELECT * FROM listings 
      WHERE ST_Distance(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint($1, $2)::geography
      ) <= $3
    `;

    const result = await query(queryText, [lng, lat, radius || 5000]); // Default 5km radius
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;