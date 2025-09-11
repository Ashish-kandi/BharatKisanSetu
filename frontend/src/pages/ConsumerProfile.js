import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ConsumerProfile = () => {
  const { user } = useAuth();
  const location = useLocation();
  // Prefer context user, fallback to location.state
  const consumer = user?.role === 'consumer' ? user : location.state?.consumer;

  if (!consumer) return <h2>No profile data available.</h2>;

  return (
    <div className="consumer-profile-container" style={{ maxWidth: 500, margin: "50px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>👤 Consumer Profile</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {consumer.name}</p>
        <p><strong>Email:</strong> {consumer.email}</p>
        {/* Add more fields if available */}
      </div>
      <div style={{ marginTop: 32 }}>
        <a href="/products" className="nav-link highlight" style={{ textDecoration: "none" }}>
          🛒 Go to Products
        </a>
      </div>
    </div>
  );
};

export default ConsumerProfile;
