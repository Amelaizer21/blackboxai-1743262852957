import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import HomePage from './pages/HomePage';
import ListingDetail from './pages/ListingDetail';
import Dashboard from './pages/Dashboard';
import ListingUpload from './pages/ListingUpload';
import Navbar from './components/Navbar';
import './styles/main.css';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <Navbar />
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload-listing" element={<ListingUpload />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          KejaHunt © {new Date().getFullYear()} - Kenya's Rental Marketplace
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;