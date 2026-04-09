// src/components/TradesTable.js
import React from 'react';
import './TradesTable.css';

const TradesTable = ({ trades }) => {
  return (
    <table className="trades-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Asset</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((trade, index) => (
          <tr key={index}>
            <td>{trade.date}</td>
            <td>{trade.asset}</td>
            <td>{trade.type}</td>
            <td>{trade.amount}</td>
            <td>
              <span className={`badge ${trade.status.toLowerCase()}`}>
                {trade.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TradesTable;