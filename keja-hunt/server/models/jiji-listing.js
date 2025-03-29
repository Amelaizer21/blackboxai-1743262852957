const mongoose = require('mongoose');

const jijiListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  property_type: { 
    type: String, 
    required: true,
    enum: ['Apartment', 'House', 'Land', 'Commercial', 'Hostel']
  },
  bedrooms: Number,
  bathrooms: Number,
  price: { type: Number, required: true },
  price_period: {
    type: String,
    enum: ['monthly', 'daily', 'yearly', 'negotiable'],
    default: 'monthly'
  },
  location: String,
  county: { type: String, required: true },
  neighborhood: String,
  contact_phone: { type: String, required: true },
  contact_name: String,
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  furnishing: {
    type: String,
    enum: ['furnished', 'unfurnished', 'partially furnished']
  },
  images: [String],
  amenities: [String]
}, { timestamps: true });

// Add text index for search functionality
jijiListingSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
  county: 'text',
  neighborhood: 'text'
});

module.exports = mongoose.model('JijiListing', jijiListingSchema);