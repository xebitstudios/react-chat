import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>ChatDoctor</h1>
        </div>
        <nav className="navigation">
          <ul className="nav-links">
            <li><a href="/signup" className="nav-link">Sign Up</a></li>
            <li><a href="/pricing" className="nav-link">Pricing</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;