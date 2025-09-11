import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ onWhyChooseUsClick, onForFarmersClick, onForConsumersClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect if the farmer is new (adjust logic as needed)
  const isNewFarmer =
    user &&
    user.role === 'farmer' &&
    (
      user.isNew ||
      !user.name ||
      !user.address
    );

  let navItems;

  if (!user) {
    navItems = [
      { label: 'Why Choose Us', to: '#why', onClick: onWhyChooseUsClick },
      { label: 'For Farmers', to: '#farmers', onClick: onForFarmersClick },
      { label: 'For Consumers', to: '#consumers', onClick: onForConsumersClick },
      { label: 'Login/Register', dropdown: true, highlight: true }
    ];
  } else if (user.role === 'farmer' && isNewFarmer) {
    navItems = [
      { label: 'Complete Registration', to: '/farmer-onboarding', highlight: true },
      { label: 'Help', to: '/help' },
      { label: 'Logout', to: '#', onClick: () => {
          logout();
          navigate('/');
        }, highlight: true }
    ];
  } else if (user.role === 'farmer') {
    navItems = [
      { label: 'Profile', to: '/farmer-profile' },
      { label: 'Dashboard', to: '/farmer-dashboard' },
      { label: 'My Products', to: '/farmer-products' },
      { label: 'Orders', to: '/farmer-orders' },
      { label: 'Messages', to: '/farmer-messages' },
      { label: 'Reports', to: '/farmer-reports' },
      { label: 'Logout', to: '#', onClick: () => {
          logout();
          navigate('/');
        }, highlight: true }
    ];
  } else if (user.role === 'consumer') {
    navItems = [
      { label: 'Profile', to: '/consumer-profile' },
      { label: 'Products', to: '/products' },
      { label: 'My Orders', to: '/consumer-orders' },
      { label: 'Cart', to: '/cart' },
      { label: 'Logout', to: '#', onClick: () => {
          logout();
          navigate('/');
        }, highlight: true }
    ];
  }

  return (
    <nav className="custom-navbar">
      <Link className="navbar-brand" to="/">
        <img
          src="https://png.pngtree.com/png-clipart/20200727/original/pngtree-agriculture-logo-template-farm-logo-template-png-image_5180811.jpg"
          alt="Logo"
          className="navbar-logo"
        />
        <span className="brand-title">Bharat Kisansetu</span>
      </Link>
      <ul className="navbar-links">
        {navItems.map((item, idx) => (
          <li
            key={idx}
            ref={item.dropdown ? dropdownRef : null}
            className={`navbar-item${item.dropdown && dropdownOpen ? ' dropdown-open' : ''}`}
            style={{ position: 'relative' }}
          >
            {item.dropdown ? (
              <>
                <button
                  className={`nav-link${item.highlight ? ' highlight' : ''}`}
                  onClick={() => setDropdownOpen((open) => !open)}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  tabIndex={0}
                >
                  {item.label} <span className="dropdown-arrow">▼</span>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu" role="menu">
                    <Link
                      to="/farmer-login"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      👨‍🌾 Farmer Login
                    </Link>
                    <Link
                      to="/consumer-login"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      🛒 Consumer Login
                    </Link>
                  </div>
                )}
              </>
            ) : item.onClick ? (
              <button
                className={`nav-link${item.highlight ? ' highlight' : ''}`}
                onClick={item.onClick}
                type="button"
                tabIndex={0}
              >
                {item.label}
              </button>
            ) : (
              <Link
                to={item.to}
                className={`nav-link${location.pathname === item.to ? ' active' : ''}${item.highlight ? ' highlight' : ''}`}
                tabIndex={0}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
