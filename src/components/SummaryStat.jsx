// src/components/SummaryStat.js
import React from 'react';
import './SummaryStat.css';

const SummaryStat = ({ value, label, isPositive = false }) => {
  return (
    <div className="summary-stat">
      <div className={`summary-value ${isPositive ? 'positive' : ''}`}>{value}</div>
      <div className="summary-label">{label}</div>
    </div>
  );
};

export default SummaryStat;