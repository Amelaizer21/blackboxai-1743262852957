const { pool } = require('./server/config/db.js');

// Test landlord data
const testLandlord = {
  email: 'landlord@example.com',
  password_hash: '$2a$10$examplehash',
  first_name: 'Test',
  last_name: 'Landlord',
  phone_number: '+254700000000',
  user_type: 'landlord'
};

// Sample listings data
const listings = [
  {
    title: 'Modern 2-Bedroom Apartment',
    description: 'Spacious apartment with great amenities',
    property_type: 'apartment', 
    rental_type: 'long-term',
    price: 45000,
    bedrooms: 2,
    bathrooms: 2,
    location: 'Kilimani, Nairobi',
    amenities: ['wifi', 'parking'],
    available_from: '2023-12-01',
    minimum_stay: 6
  },
  {
    title: 'Cozy Studio',
    description: 'Fully furnished studio apartment',
    property_type: 'studio',
    rental_type: 'short-term', 
    price: 30000,
    bedrooms: 1,
    bathrooms: 1,
    location: 'Westlands, Nairobi',
    amenities: ['wifi', 'furnished'],
    available_from: '2023-11-15',
    minimum_stay: 1
  }
];

async function insertData() {
  const client = await pool.connect();
  try {
    // Insert landlord
    const landlordRes = await client.query(
      `INSERT INTO users(email, password_hash, first_name, last_name, phone_number, user_type)
       VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      Object.values(testLandlord)
    );
    const landlordId = landlordRes.rows[0].id;

    // Insert listings
    for (const listing of listings) {
      await client.query(
        `INSERT INTO listings(
          landlord_id, title, description, property_type, rental_type, price,
          bedrooms, bathrooms, location, amenities, available_from, minimum_stay  
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          landlordId, 
          listing.title,
          listing.description,
          listing.property_type,
          listing.rental_type,
          listing.price,
          listing.bedrooms,
          listing.bathrooms,
          listing.location,
          listing.amenities,
          listing.available_from,
          listing.minimum_stay
        ]
      );
    }
    console.log('Successfully inserted test data');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

insertData();