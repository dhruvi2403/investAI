import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Virtual Trading', path: '/virtual-trading' },
  { name: 'AI Insights', path: '/ai-insights' },
  { name: 'Market Trends', path: '/market-trends' },
  { name: 'Portfolio Management', path: '/portfolio' },
  { name: 'Settings', path: '/settings' },
];

const Sidebar = ({ setIsSignedIn }) => {
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setIsSignedIn) setIsSignedIn(false);
  };
  
  return (
    <div className="sidebar" style={{ width: '250px', height: '100vh', backgroundColor: '#1e293b', color: 'white' }}>
      <div className="logo" style={{ padding: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        <span>InvestAI</span>
      </div>
      
      <div className="nav-links" style={{ display: 'flex', flexDirection: 'column' }}>
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ 
              padding: '15px 20px', 
              color: 'white', 
              textDecoration: 'none',
              borderLeft: '4px solid transparent'
            }}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      
      <div style={{ marginTop: 'auto', padding: '20px' }}>
        <button 
          onClick={handleSignOut}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            backgroundColor: '#ef4444',
            color: 'white',
            textAlign: 'center',
            border: 'none',
            outline: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;