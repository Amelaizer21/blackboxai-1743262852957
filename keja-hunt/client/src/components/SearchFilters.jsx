import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Slider, 
  Button, 
  Row, 
  Col,
  Divider
} from 'antd';
import axios from 'axios';

const { Option } = Select;

const SearchFilters = ({ onFilter }) => {
  const [counties, setCounties] = useState([]);
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [form] = Form.useForm();

  // Fetch Kenya counties
  useEffect(() => {
    const fetchCounties = async () => {
      setLoadingCounties(true);
      try {
        const response = await axios.get('/api/jiji-listings/counties');
        setCounties(response.data);
      } catch (error) {
        console.error('Error fetching counties:', error);
      } finally {
        setLoadingCounties(false);
      }
    };
    fetchCounties();
  }, []);

  const handleSubmit = (values) => {
    onFilter(values);
  };

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  const priceMarks = {
    0: 'KSh 0',
    50000: '50K',
    200000: '200K',
    500000: '500K',
    1000000: '1M'
  };

  return (
    <div className="search-filters">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          priceRange: [0, 1000000],
          propertyType: undefined,
          bedrooms: undefined,
          furnishing: undefined
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="keyword" label="Keyword">
              <Input placeholder="e.g. 'apartment in Kilimani'" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="county" label="County">
              <Select
                loading={loadingCounties}
                placeholder="Select county"
                showSearch
                optionFilterProp="children"
                allowClear
              >
                {counties.map(county => (
                  <Option key={county} value={county}>{county}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="propertyType" label="Property Type">
              <Select 
                placeholder="All property types" 
                allowClear
              >
                <Option value="Apartment">Apartment</Option>
                <Option value="House">House</Option>
                <Option value="Land">Land</Option>
                <Option value="Commercial">Commercial</Option>
                <Option value="Hostel">Hostel</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="priceRange" label="Price Range (KSh)">
              <Slider 
                range 
                min={0} 
                max={1000000} 
                step={10000}
                marks={priceMarks}
                tipFormatter={value => `KSh ${value?.toLocaleString()}`}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="bedrooms" label="Bedrooms">
              <Select placeholder="Any" allowClear>
                <Option value={1}>1+</Option>
                <Option value={2}>2+</Option>
                <Option value={3}>3+</Option>
                <Option value={4}>4+</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="furnishing" label="Furnishing">
              <Select placeholder="Any" allowClear>
                <Option value="furnished">Furnished</Option>
                <Option value="unfurnished">Unfurnished</Option>
                <Option value="partially furnished">Partially Furnished</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Divider />
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Search Properties
              </Button>
            </Form.Item>
            <Button block onClick={handleReset}>
              Reset Filters
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchFilters;