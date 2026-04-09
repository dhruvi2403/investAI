// src/components/TickerItem.js
import React from 'react';
import './TickerItem.css';

const TickerItem = ({ symbol, price, change, isPositive }) => {
  return (
    <div className="ticker">
      <div className="ticker-symbol">{symbol}</div>
      <div className="ticker-price">{price}</div>
      <div className={`ticker-change ${isPositive ? 'positive' : 'negative'}`}>
        {change}
      </div>
    </div>
  );
};

export default TickerItem;