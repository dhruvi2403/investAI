import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import Testimonials from './components/Testimonials.jsx';
import Pricing from './components/Pricing.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';
import InvestorDashboard from './components/InvestorDashboard.jsx';
import Sidebar from './components/Sidebar.jsx';
import './styles.css';

import MarketTrends from './pages/MarketTrends.jsx';
import AIInsights from './pages/AIInsights.jsx';
import Auth from './pages/Auth.jsx';
import Settings from './pages/Settings.jsx';
import Portfolio from './pages/Portfolio.jsx';
import VirtualTrading from './pages/VirtualTrading.jsx';

import Chatbot from './components/Chatbot.jsx';

const DashboardLayout = ({ children, setIsSignedIn }) => {
  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar setIsSignedIn={setIsSignedIn} />
      <div className="main-content" style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {children}
        <Chatbot />
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

// ProtectedRoute component to handle authentication seamlessly
const ProtectedRoute = ({ isSignedIn, children }) => {
  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsSignedIn(true);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth setIsSignedIn={setIsSignedIn} />} />
        
        {/* Protected Dashboard Routes nested with Sidebar Layout */}
        <Route path="/dashboard" element={<ProtectedRoute isSignedIn={isSignedIn}><DashboardLayout setIsSignedIn={setIsSignedIn}><InvestorDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/virtual-trading" element={<ProtectedRoute isSignedIn={isSignedIn}><DashboardLayout setIsSignedIn={setIsSignedIn}><VirtualTrading /></DashboardLayout></ProtectedRoute>} />
        <Route path="/ai-insights" element={<ProtectedRoute isSignedIn={isSignedIn}><DashboardLayout setIsSignedIn={setIsSignedIn}><AIInsights /></DashboardLayout></ProtectedRoute>} />
        <Route path="/market-trends" element={<ProtectedRoute isSignedIn={isSignedIn}><DashboardLayout setIsSignedIn={setIsSignedIn}><MarketTrends /></DashboardLayout></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute isSignedIn={isSignedIn}><DashboardLayout setIsSignedIn={setIsSignedIn}><Portfolio /></DashboardLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute isSignedIn={isSignedIn}><DashboardLayout setIsSignedIn={setIsSignedIn}><Settings /></DashboardLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;