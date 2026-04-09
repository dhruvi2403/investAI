// src/components/Card.js
import React from 'react';
import './Card.css';

const Card = ({ title, children }) => {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      {children}
    </div>
  );
};

export default Card;