const { pool } = require('./server/config/db.js');

const listings = [
  {
    title: 'Modern 2-Bedroom Apartment in Nairobi',
    description: 'Spacious apartment with balcony, secure parking, and 24/7 security',
    price: 45000,
    location: 'Kilimani, Nairobi',
    bedrooms: 2,
    bathrooms: 2,
    type: 'apartment',
    amenities: ['wifi', 'parking', 'gym', 'pool']
  },
  {
    title: 'Cozy Studio in Westlands',
    description: 'Fully furnished studio with kitchenette, perfect for professionals',
    price: 30000,
    location: 'Westlands, Nairobi',
    bedrooms: 1,
    bathrooms: 1,
    type: 'studio',
    amenities: ['wifi', 'parking', 'furnished']
  }
];

async function insertListings() {
  const client = await pool.connect();
  try {
    for (const listing of listings) {
      await client.query(
        `INSERT INTO listings(title, description, price, location, bedrooms, bathrooms, type, amenities) 
         VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
        [listing.title, listing.description, listing.price, listing.location, 
         listing.bedrooms, listing.bathrooms, listing.type, listing.amenities]
      );
    }
    console.log('Successfully added sample listings');
  } catch (err) {
    console.error('Error adding listings:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

insertListings();