import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VoiceCommand from '../components/VoiceCommand';
import { useAuth } from '../context/AuthContext';
import MinimalHelpNavbar from '../components/MinimalHelpNavbar';
import './FarmerLogin.css';

function FarmerLogin() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    password: '',
  });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVoiceInput = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? 'http://localhost:5000/api/farmers/login'
      : 'http://localhost:5000/api/farmers/register';

    try {
      const response = await axios.post(endpoint, formData);
      const farmerData = response.data.farmer || formData;
      login({ role: 'farmer', ...farmerData });
      navigate('/farmer-profile', { state: { farmer: farmerData } });
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="farmer-login-container">
      <MinimalHelpNavbar userType="farmer" /> {/* Navbar at the very top */}
      <VoiceCommand onResult={handleVoiceInput} />
      <div className="form-glass animate-fadein">
        <img
          src="https://png.pngtree.com/png-clipart/20200727/original/pngtree-agriculture-logo-template-farm-logo-template-png-image_5180811.jpg"
          alt="Farmer Logo"
          className="farmer-logo"
        />
        <h2 className="form-title">{isLogin ? 'Farmer Login' : 'Farmer Registration'}</h2>
        <form onSubmit={handleSubmit} className="farmer-form">
          {!isLogin && (
            <>
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                autoComplete="name"
              />
              <label htmlFor="address" className="form-label">Address</label>
              <input
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="form-input"
                autoComplete="street-address"
              />
            </>
          )}
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            id="phone"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="form-input"
            autoComplete="tel"
          />
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
            autoComplete="current-password"
          />
          <button type="submit" className="form-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already registered?'}
          <button onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin ? ' Register' : ' Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default FarmerLogin;
