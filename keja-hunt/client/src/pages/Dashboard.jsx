import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Card, 
  List, 
  Avatar, 
  Button, 
  Badge,
  message
} from 'antd';
import { 
  UserOutlined, 
  HeartOutlined, 
  MessageOutlined, 
  SettingOutlined,
  EnvironmentOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;
const { Meta } = Card;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [savedListings, setSavedListings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'saved') {
          const response = await axios.get('/api/user/saved-listings');
          setSavedListings(response.data);
        } else if (activeTab === 'messages') {
          const response = await axios.get('/api/user/messages');
          setMessages(response.data);
        } else if (activeTab === 'profile') {
          const response = await axios.get('/api/user/profile');
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to load data');
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="dashboard-page">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabPosition="left"
        size="large"
      >
        <TabPane
          tab={
            <span>
              <HeartOutlined />
              Saved Listings
            </span>
          }
          key="saved"
        >
          <div className="saved-listings">
            {savedListings.length > 0 ? (
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={savedListings}
                renderItem={item => (
                  <List.Item>
                    <Card
                      hoverable
                      cover={
                        <img 
                          alt={item.title}
                          src={item.images?.[0] || 'https://via.placeholder.com/300x200'}
                        />
                      }
                    >
                      <Meta
                        title={item.title}
                        description={
                          <>
                            <div>
                              <EnvironmentOutlined /> {item.location}
                            </div>
                            <div>
                              KSh {item.price.toLocaleString()}
                              {item.rental_type === 'short-term' ? '/night' : '/month'}
                            </div>
                          </>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <div className="empty-state">
                <p>You haven't saved any listings yet</p>
                <Button type="primary">Browse Listings</Button>
              </div>
            )}
          </div>
        </TabPane>

        <TabPane
          tab={
            <span>
              <MessageOutlined />
              Messages
              <Badge count={messages.length} offset={[10, -5]} />
            </span>
          }
          key="messages"
        >
          <div className="messages-list">
            {messages.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={messages}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.sender.avatar} />}
                      title={item.sender.name}
                      description={item.preview}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="empty-state">
                <p>No messages yet</p>
              </div>
            )}
          </div>
        </TabPane>

        <TabPane
          tab={
            <span>
              <UserOutlined />
              Profile
            </span>
          }
          key="profile"
        >
          {userData && (
            <div className="profile-section">
              <Card
                cover={
                  <div className="profile-header">
                    <Avatar size={100} src={userData.avatar} icon={<UserOutlined />} />
                    <h2>{userData.name}</h2>
                    <p>{userData.email}</p>
                  </div>
                }
              >
                <div className="profile-details">
                  <p><PhoneOutlined /> {userData.phone || 'Not provided'}</p>
                  <p>Member since {new Date(userData.created_at).toLocaleDateString()}</p>
                </div>
                <Button type="primary">Edit Profile</Button>
              </Card>
            </div>
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <SettingOutlined />
              Settings
            </span>
          }
          key="settings"
        >
          <div className="settings-section">
            <Card title="Account Settings">
              <p>Notification Preferences</p>
              <p>Change Password</p>
              <p>Subscription Management</p>
            </Card>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard;