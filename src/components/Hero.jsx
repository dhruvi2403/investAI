import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Make Smarter Investment Decisions with <span>AI</span></h1>
            <p>InvestAI gives retail investors the power of artificial intelligence to analyze markets, optimize portfolios, and make data-driven investment decisions.</p>
            <div className="hero-cta">
              <Link to="/dashboard" className="btn btn-primary">Start Free Trial</Link>
              <a href="#features" className="btn btn-secondary">Watch Demo</a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">30,000+</span>
                <span className="stat-label">Active Investors</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$1.8B</span>
                <span className="stat-label">Assets Analyzed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.8/5</span>
                <span className="stat-label">User Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="landing.jpg" alt="MarketMind Dashboard" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;