import React, { useState, useEffect } from 'react';
import { stockAPI } from '../services/apiClient';

const Portfolio = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [vtAssets, setVtAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await stockAPI.getWatchlist();
        setWatchlist(res.watchlist || []);
      } catch (error) {
        console.error("DB Watchlist error:", error);
      }
      
      const savedVt = localStorage.getItem('vt_portfolio');
      if (savedVt) setVtAssets(JSON.parse(savedVt));

      setLoading(false);
    };
    fetchHoldings();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading portfolio data...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Portfolio Management</h2>
      
      <p style={{ color: 'gray', marginBottom: '10px' }}>Your Saved Real-World Watchlist Assets</p>
      {watchlist.length === 0 ? (
        <div style={{ padding: '15px', background: 'white', borderRadius: '8px', marginBottom: '30px' }}>
          Your real watchlist is empty. Add symbols via AI Insights.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
          {watchlist.map((item, id) => (
            <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>{item.symbol}</span>
              <span>Latest Close: ${item.data?.close || 'No data'}</span>
            </div>
          ))}
        </div>
      )}

      <p style={{ color: 'gray', marginBottom: '10px' }}>Your Virtual Simulator Holdings</p>
      {vtAssets.length === 0 ? (
        <div style={{ padding: '15px', background: 'white', borderRadius: '8px' }}>
          No virtual assets found. Head over to Virtual Trading to build a sandbox portfolio!
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {vtAssets.map((item, id) => (
            <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>
                {item.shares} Shares of {item.symbol} {item.status === 'SOLD' && <span style={{ fontSize: '12px', background: '#e2e8f0', margin: '0 5px', padding: '2px 6px', borderRadius: '4px' }}>SOLD</span>}
              </span>
              {item.status === 'SOLD' ? (
                <span style={{ color: (item.pnl || 0) >= 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>P/L: ${(item.pnl || 0).toFixed(2)}</span>
              ) : (
                 <span style={{ color: '#10b981' }}>Purchased at: ${item.price?.toFixed(2) || '0.00'}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
