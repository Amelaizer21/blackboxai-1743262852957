import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Upload, 
  Button, 
  message,
  Row,
  Col,
  Checkbox
} from 'antd';
import { 
  UploadOutlined,
  HomeOutlined,
  PhoneOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const ListingUploadForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 
    'Thika', 'Kitale', 'Malindi', 'Naivasha', 'Nyeri'
  ];

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Process images first
      const images = fileList.map(file => {
        return file.originFileObj ? 
          URL.createObjectURL(file.originFileObj) : 
          file.url;
      });

      const listingData = {
        ...values,
        images,
        price_period: values.price_period || 'monthly',
        county: values.county || 'Nairobi'
      };

      // Here you would typically send to your API
      console.log('Listing data:', listingData);
      message.success('Listing submitted successfully!');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Failed to submit listing');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="listing-upload-form">
      <h2><HomeOutlined /> Post a Rental Listing</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          property_type: 'Apartment',
          bedrooms: 1,
          furnishing: 'unfurnished',
          price_period: 'monthly'
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Listing Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="e.g. Spacious 2 Bedroom Apartment in Kilimani" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea rows={4} placeholder="Describe the property in detail..." />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="property_type"
              label="Property Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Apartment">Apartment</Option>
                <Option value="House">House</Option>
                <Option value="Commercial">Commercial</Option>
                <Option value="Land">Land</Option>
                <Option value="Hostel">Hostel</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="county"
              label="County"
              rules={[{ required: true }]}
            >
              <Select showSearch placeholder="Select county">
                {counties.map(county => (
                  <Option key={county} value={county}>{county}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="neighborhood"
              label="Neighborhood/Area"
            >
              <Input placeholder="e.g. Kilimani, Westlands" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="price"
              label="Price (KSh)"
              rules={[{ required: true }]}
            >
              <InputNumber 
                style={{ width: '100%' }}
                min={0}
                formatter={value => `KSh ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/KSh\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="price_period"
              label="Price Period"
            >
              <Select>
                <Option value="monthly">Monthly</Option>
                <Option value="daily">Daily</Option>
                <Option value="yearly">Yearly</Option>
                <Option value="negotiable">Negotiable</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="bedrooms"
              label="Bedrooms"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="bathrooms"
              label="Bathrooms"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="furnishing"
              label="Furnishing"
            >
              <Select>
                <Option value="furnished">Furnished</Option>
                <Option value="unfurnished">Unfurnished</Option>
                <Option value="partially furnished">Partially Furnished</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="amenities"
              label="Amenities (comma separated)"
            >
              <Input placeholder="e.g. Parking, Gym, Pool, Security" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="images"
              label="Property Images"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Please upload at least one image' }]}
            >
              <Upload {...uploadProps} listType="picture">
                <Button icon={<UploadOutlined />}>Upload Images</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <h3><PhoneOutlined /> Contact Information</h3>
          </Col>

          <Col span={12}>
            <Form.Item
              name="contact_name"
              label="Your Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="contact_phone"
              label="Phone Number"
              rules={[{ 
                required: true,
                pattern: new RegExp(/^[0-9]{10}$/),
                message: 'Please enter a valid 10-digit phone number' 
              }]}
            >
              <Input addonBefore="+254" placeholder="712345678" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item>
              <Checkbox>
                I verify this listing is accurate and I have permission to post it
              </Checkbox>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                Submit Listing
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ListingUploadForm;