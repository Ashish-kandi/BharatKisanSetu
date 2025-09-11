import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VoiceCommand from '../components/VoiceCommand';
import { useAuth } from '../context/AuthContext';
import MinimalHelpNavbar from '../components/MinimalHelpNavbar';
import './ConsumerLogin.css';

function ConsumerLogin() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    const url = `http://localhost:5000/api/consumers/${endpoint}`;

    try {
      const response = await axios.post(url, formData);
      const consumerData = response.data.consumer || formData; // fallback to formData if backend response lacks consumer data
      login({ role: 'consumer', ...consumerData }); // call auth context login to save user info/state
      navigate('/consumer-profile', { state: { consumer: consumerData } }); // navigate after login
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="consumer-login-container">
      <MinimalHelpNavbar userType="consumer" />
      <VoiceCommand />
      <div className="consumer-form-glass animate-fadein">
        <img
          src="https://png.pngtree.com/png-clipart/20200727/original/pngtree-agriculture-logo-template-farm-logo-template-png-image_5180811.jpg"
          alt="Consumer Logo"
          className="consumer-logo"
        />
        <h2 className="consumer-form-title">
          {isRegistering ? 'Register as Consumer' : 'Consumer Login'}
        </h2>
        <form onSubmit={handleSubmit} className="consumer-login-form">
          {isRegistering && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="consumer-login-input"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="consumer-login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="consumer-login-input"
          />
          <button type="submit" className="consumer-login-button">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="consumer-login-toggle-text">
          {isRegistering ? 'Already have an account?' : 'New user?'}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="consumer-login-toggle"
            type="button"
          >
            {isRegistering ? ' Login' : ' Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default ConsumerLogin;
