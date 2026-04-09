// src/components/StatItem.js
import React from 'react';
import './StatItem.css';

const StatItem = ({ label, value, isLast = false }) => {
  return (
    <div className={`stat ${isLast ? 'last' : ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
};

export default StatItem;