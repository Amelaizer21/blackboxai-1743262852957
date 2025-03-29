import React, { useEffect, useState, useRef } from 'react';
import { Card, Col, Row, Tag, Button, Badge, Spin, Alert, Empty, Image } from 'antd';
import { 
  EnvironmentOutlined, 
  HomeOutlined, 
  CoffeeOutlined,
  StarFilled,
  CheckOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Meta } = Card;

const PropertyList = ({ filters }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const imageRefs = useRef([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/jiji-listings', {
          params: {
            county: filters?.county,
            minPrice: filters?.priceRange?.[0],
            maxPrice: filters?.priceRange?.[1],
            propertyType: filters?.propertyType,
            bedrooms: filters?.bedrooms
          }
        });
        setProperties(response.data);
      } catch (err) {
        setError(err);
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  // Set up Intersection Observers for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    imageRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [properties]);

  if (error) {
    return (
      <Alert
        message="Error Loading Properties"
        description={error.message}
        type="error"
        showIcon
      />
    );
  }

  if (loading) {
    return <Spin size="large" />;
  }

  if (!properties.length) {
    return <Empty description="No properties found matching your criteria" />;
  }

  return (
    <div className="property-list">
      <Row gutter={[16, 16]}>
        {properties.map((property, index) => (
          <Col xs={24} sm={12} lg={8} key={property._id}>
            <Card
              hoverable
              cover={
                <div className="property-image-container">
                  <Image
                    ref={el => imageRefs.current[index] = el}
                    alt={`${property.title} - ${property.property_type} in ${property.county}`}
                    data-src={property.images?.[0] || 'https://via.placeholder.com/300x200?text=Property+Image'}
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f0f0f0'/%3E%3C/svg%3E"
                    placeholder={
                      <div style={{
                        backgroundColor: '#f0f0f0',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        Loading...
                      </div>
                    }
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available'
                    }}
                  />
                  {property.featured && (
                    <div className="featured-badge">
                      <StarFilled /> Featured
                    </div>
                  )}
                </div>
              }
              actions={[
                <Button type="primary">View Details</Button>,
                <Button>Save</Button>
              ]}
            >
              <Meta
                title={
                  <div className="property-title">
                    {property.title}
                    {property.verified && (
                      <Badge 
                        count={<CheckOutlined style={{ color: '#fff' }} />} 
                        style={{ backgroundColor: '#52c41a', marginLeft: 8 }}
                      />
                    )}
                  </div>
                }
                description={
                  <>
                    <div className="property-location">
                      <EnvironmentOutlined /> {property.neighborhood || property.county}
                    </div>
                    <div className="property-details">
                      <Tag icon={<HomeOutlined />}>{property.property_type}</Tag>
                      {property.bedrooms && (
                        <Tag icon={<CoffeeOutlined />}>{property.bedrooms} Bed</Tag>
                      )}
                    </div>
                    <div className="property-price">
                      KSh {property.price?.toLocaleString() || 'Negotiable'} 
                      {property.price_period && (
                        <span className="price-period"> / {property.price_period}</span>
                      )}
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PropertyList;