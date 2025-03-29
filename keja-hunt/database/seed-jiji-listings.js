const mongoose = require('mongoose');
const JijiListing = require('../server/models/jiji-listing');
const config = require('../server/config/db');

// Sample Kenya counties and neighborhoods
const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'];
const nairobiNeighborhoods = ['Kilimani', 'Westlands', 'Karen', 'Runda', 'Lavington'];
const mombasaNeighborhoods = ['Nyali', 'Bamburi', 'Mtwapa', 'Kizingo', 'Likoni'];

// Connect to database
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log(err));

// Sample listings data
const sampleListings = [
  {
    title: 'Spacious 3 Bedroom Apartment in Kilimani',
    description: 'Modern apartment with great amenities near Yaya Center',
    property_type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    price: 85000,
    price_period: 'monthly',
    location: 'Kilimani Road',
    county: 'Nairobi',
    neighborhood: 'Kilimani',
    contact_phone: '+254712345678',
    contact_name: 'John Kamau',
    featured: true,
    verified: true,
    furnishing: 'furnished',
    amenities: ['Parking', 'Swimming Pool', 'Gym', '24/7 Security'],
    images: [
      'https://example.com/apt1.jpg',
      'https://example.com/apt2.jpg'
    ]
  },
  {
    title: 'Beachfront Villa in Nyali',
    description: 'Luxury 4 bedroom villa with private beach access',
    property_type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    price: 350000,
    price_period: 'monthly',
    location: 'Beach Road',
    county: 'Mombasa',
    neighborhood: 'Nyali',
    contact_phone: '+254723456789',
    contact_name: 'Fatima Ali',
    featured: true,
    verified: true,
    furnishing: 'furnished',
    amenities: ['Private Beach', 'Garden', 'Maid Quarters', 'Security'],
    images: [
      'https://example.com/villa1.jpg',
      'https://example.com/villa2.jpg'
    ]
  },
  // Additional sample listings...
  {
    title: 'Commercial Space in Westlands',
    description: '2000 sqft office space ready for occupancy',
    property_type: 'Commercial',
    price: 120000,
    price_period: 'monthly',
    location: 'Woodvale Grove',
    county: 'Nairobi',
    neighborhood: 'Westlands',
    contact_phone: '+254734567890',
    contact_name: 'James Mwangi',
    verified: true,
    amenities: ['Parking', 'Elevator', 'Security'],
    images: [
      'https://example.com/office1.jpg'
    ]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    await JijiListing.deleteMany();
    await JijiListing.insertMany(sampleListings);
    console.log('Database seeded with Jiji-style listings');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();