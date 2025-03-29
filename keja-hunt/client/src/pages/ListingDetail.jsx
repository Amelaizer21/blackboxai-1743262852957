import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Carousel, 
  Button, 
  Tag, 
  Divider,
  Tabs,
  message,
  Badge,
  Descriptions,
  Skeleton
} from 'antd';
import { 
  EnvironmentOutlined, 
  HomeOutlined, 
  CoffeeOutlined,
  SkinOutlined,
  PhoneOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CheckOutlined,
  StarFilled,
  SafetyOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/jiji-listings/${id}`);
        setListing(response.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        message.error('Failed to load listing details');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const formatPhoneNumber = (phone) => {
    return phone?.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') || 'Not provided';
  };

  if (loading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (!listing) return <div className="error-message">Listing not found</div>;

  return (
    <div className="listing-detail">
      <div className="gallery-section">
        {listing.featured && (
          <div className="featured-badge">
            <StarFilled /> Featured
          </div>
        )}
        <Carousel autoplay>
          {listing.images?.length > 0 ? (
            listing.images.map((img, index) => (
              <div key={index}>
                <img 
                  src={img} 
                  alt={`Property ${index + 1}`} 
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                />
              </div>
            ))
          ) : (
            <div>
              <img 
                src="https://via.placeholder.com/800x500?text=No+Image+Available" 
                alt="No images available"
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
              />
            </div>
          )}
        </Carousel>
      </div>

      <div className="info-section">
        <div className="header">
          <h1>
            {listing.title}
            {listing.verified && (
              <Badge 
                count={<CheckOutlined style={{ color: '#fff' }} />} 
                style={{ 
                  backgroundColor: '#52c41a', 
                  marginLeft: 10,
                  verticalAlign: 'middle'
                }}
              />
            )}
          </h1>
          <div className="actions">
            <Button icon={<HeartOutlined />} shape="circle" />
            <Button icon={<ShareAltOutlined />} shape="circle" />
          </div>
        </div>

        <Descriptions column={1} className="property-meta">
          <Descriptions.Item label="Location">
            <EnvironmentOutlined /> {listing.neighborhood || listing.county}, {listing.county}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            KSh {listing.price?.toLocaleString() || 'Negotiable'}
            {listing.price_period && (
              <span className="price-period"> / {listing.price_period}</span>
            )}
          </Descriptions.Item>
        </Descriptions>

        <div className="tags">
          <Tag icon={<HomeOutlined />}>{listing.property_type}</Tag>
          {listing.bedrooms && <Tag icon={<CoffeeOutlined />}>{listing.bedrooms} Bed</Tag>}
          {listing.bathrooms && <Tag icon={<SkinOutlined />}>{listing.bathrooms} Bath</Tag>}
          {listing.furnishing && <Tag>{listing.furnishing}</Tag>}
          {listing.verified && <Tag icon={<SafetyOutlined />}>Verified</Tag>}
        </div>

        <Divider />

        <Tabs defaultActiveKey="1">
          <TabPane tab="Description" key="1">
            <p>{listing.description || 'No description provided'}</p>
          </TabPane>
          <TabPane tab="Amenities" key="2">
            {listing.amenities?.length > 0 ? (
              <div className="amenities-grid">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    {amenity}
                  </div>
                ))}
              </div>
            ) : (
              <p>No amenities listed</p>
            )}
          </TabPane>
        </Tabs>

        <div className="contact-section">
          <Button 
            type="primary" 
            size="large"
            onClick={() => setContactVisible(!contactVisible)}
          >
            {contactVisible ? 'Hide Contact' : 'Show Contact'}
          </Button>

          {contactVisible && (
            <div className="contact-details">
              <p><PhoneOutlined /> {formatPhoneNumber(listing.contact_phone)}</p>
              {listing.contact_name && <p>Contact: {listing.contact_name}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;