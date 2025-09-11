import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const MinimalHelpNavbar = ({ userType }) => (
  <nav className="custom-navbar">
    <Link className="navbar-brand" to="/">
      <img
        src="https://png.pngtree.com/png-clipart/20200727/original/pngtree-agriculture-logo-template-farm-logo-template-png-image_5180811.jpg"
        alt="Logo"
        className="navbar-logo"
      />
      Bharat Kisansetu
    </Link>
    <ul className="navbar-links">
      <li>
        <Link
          to={userType === 'farmer' ? '/help/farmer' : '/help/consumer'}
          className="nav-link highlight"
        >
          Help
        </Link>
      </li>
    </ul>
  </nav>
);

export default MinimalHelpNavbar;
