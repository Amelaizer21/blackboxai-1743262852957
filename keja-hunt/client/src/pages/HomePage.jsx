import React, { useState } from 'react';
import SearchFilters from '../components/SearchFilters';
import PropertyList from '../components/PropertyList';
import { Alert, Spin } from 'antd';
import './HomePage.css'; // New dedicated CSS file

const HomePage = () => {
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 100000],
    bedrooms: 0,
    rentalType: 'long-term'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Find Your Perfect Rental Home</h1>
        <SearchFilters 
          filters={filters} 
          setFilters={setFilters}
          setLoading={setLoading}
          setError={setError}
        />
      </header>

      <main className="container">
        {error ? (
          <Alert 
            message="Error Loading Properties"
            description={error.message}
            type="error"
            showIcon
          />
        ) : (
          <Spin spinning={loading}>
            <PropertyList 
              filters={filters}
              setLoading={setLoading}
              setError={setError}
            />
          </Spin>
        )}
      </main>
    </div>
  );
};

export default HomePage;