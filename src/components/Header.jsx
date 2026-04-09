import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <div className="container">
        <nav>
          <a href="#" className="logo">InvestAI</a>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
          <div className="header-btns">
            <Link to="/auth" className="btn btn-secondary">Login</Link>
            <Link to="/auth" className="btn btn-primary">Get Started</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;