import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceCommand from '../components/VoiceCommand';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const whyRef = useRef(null);
  const farmersRef = useRef(null);
  const consumersRef = useRef(null);

  // Scroll handlers
  const handleScrollToWhy = () => {
    if (whyRef.current) whyRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const handleScrollToFarmers = () => {
    if (farmersRef.current) farmersRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const handleScrollToConsumers = () => {
    if (consumersRef.current) consumersRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-container">
      <Navbar
        onWhyChooseUsClick={handleScrollToWhy}
        onForFarmersClick={handleScrollToFarmers}
        onForConsumersClick={handleScrollToConsumers}
      />
      <VoiceCommand />
      <div className="main-content-center">
        <img
          src="https://png.pngtree.com/png-clipart/20200727/original/pngtree-agriculture-logo-template-farm-logo-template-png-image_5180811.jpg"
          alt="Bharat Kisansetu Logo"
          className="logo"
        />
        <h1 className="main-title">Bharat Kisansetu</h1>
        <p className="description">
          Empowering Farmers & Consumers through Smart Connectivity
        </p>
        <div className="button-group">
          <button
            className="login-button farmer"
            onClick={() => navigate('/farmer-login')}
          >
            👨‍🌾 Farmer Login
          </button>
          <button
            className="login-button consumer"
            onClick={() => navigate('/consumer-login')}
          >
            🛒 Consumer Login
          </button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section" ref={whyRef}>
        <h2>Why Choose Us</h2>
        <div className="why-features">
          <div className="why-feature-card">
            <img
              src="https://img.freepik.com/vector-premium/granjero-hombre-negocios-estrechando-mano-ilustracion-vectorial-plana_778687-764.jpg"
              alt="Direct Connect"
              className="why-circle-img"
            />
            <h3>Direct Farmer-Consumer Connection</h3>
            <p>No middlemen, better prices for both farmers and consumers.</p>
          </div>
          <div className="why-feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Quality" />
            <h3>Fresh & Quality Produce</h3>
            <p>Get farm-fresh products delivered straight to your doorstep.</p>
          </div>
          <div className="why-feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2917/2917990.png" alt="Support" />
            <h3>Empowering Farmers</h3>
            <p>We support local farmers with fair trade and digital tools.</p>
          </div>
        </div>
      </section>

      {/* For Farmers Section */}
      <section className="for-farmers-section" ref={farmersRef}>
        <h2>For Farmers</h2>
        <div className="why-features">
          <div className="why-feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3076/3076924.png" alt="Easy Product Management" />
            <h3>Easy Product Management</h3>
            <p>List, update, and manage your products effortlessly from your dashboard.</p>
          </div>
          <div className="why-feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2620/2620669.png" alt="Order Tracking" />
            <h3>Order Tracking</h3>
            <p>Track every order and communicate directly with buyers for transparency.</p>
          </div>
          <div className="why-feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="Reports & Insights" />
            <h3>Reports & Insights</h3>
            <p>Get real-time reports on your sales and growth to make informed decisions.</p>
          </div>
        </div>
      </section>

      {/* For Consumers Section */}
      <section className="for-consumers-section" ref={consumersRef}>
        <h2>For Consumers</h2>
        <div className="why-features">
          <div className="why-feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="Browse Products" />
            <h3>Browse Products</h3>
            <p>Explore a wide range of fresh farm products directly from local farmers.</p>
          </div>
          <div className="why-feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3523/3523887.png" alt="Easy Ordering" />
            <h3>Easy Ordering</h3>
            <p>Order with a few clicks and enjoy secure, convenient payment options.</p>
          </div>
          <div className="why-feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" alt="Track Delivery" />
            <h3>Track Delivery</h3>
            <p>Track your orders in real-time and get fresh produce delivered to your door.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
