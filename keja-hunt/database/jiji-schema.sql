-- Jiji.com Kenya Property Listings Schema
CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type VARCHAR(100) CHECK (property_type IN ('Apartment', 'House', 'Land', 'Commercial', 'Hostel')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  price NUMERIC(12,2),
  price_period VARCHAR(20) CHECK (price_period IN ('monthly', 'daily', 'yearly', 'negotiable')),
  location VARCHAR(255),
  county VARCHAR(100) NOT NULL,
  neighborhood VARCHAR(100),
  contact_phone VARCHAR(20) NOT NULL,
  contact_name VARCHAR(100),
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  furnishing VARCHAR(50) CHECK (furnishing IN ('furnished', 'unfurnished', 'partially furnished')),
  images TEXT[],
  amenities TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_listings_county ON listings(county);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_featured ON listings(featured);