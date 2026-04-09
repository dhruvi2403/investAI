// src/components/PlaceholderChart.js
import React from 'react';
import './PlaceholderChart.css';

const PlaceholderChart = ({ height = '200px', text = 'Chart' }) => {
  return (
    <div className="placeholder-chart" style={{ height }}>
      {text}
    </div>
  );
};

export default PlaceholderChart;