import React from 'react';
import { Card } from 'antd';
import ListingUploadForm from '../components/ListingUploadForm';

const ListingUpload = () => {
  return (
    <div className="listing-upload-page">
      <Card title="Post Your Rental Property" bordered={false}>
        <ListingUploadForm />
      </Card>
    </div>
  );
};

export default ListingUpload;