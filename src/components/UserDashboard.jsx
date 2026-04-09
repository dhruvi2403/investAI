// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import StatItem from '../components/StatItem';
import TickerItem from '../components/TickerItem';
import PlaceholderChart from '../components/PlaceholderChart';
import Button from '../components/Button';
import TradesTable from '../components/TradesTable';
import SummaryStat from '../components/SummaryStat';
import { stockAPI, investorAPI } from '../services/apiClient';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [realPortfolio, setRealPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = JSON.parse(localStorage.getItem('user'));
        if (u && u.id) {
          const profRes = await investorAPI.getProfile(u.id);
          if (profRes) setProfile(profRes);
        }
        
        const portRes = await stockAPI.getRealPortfolio();
        if (portRes && portRes.portfolio) {
          setRealPortfolio(portRes.portfolio);
        }
        setLoading(false);
      } catch (e) {
        console.error("Dashboard fetch error", e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading Real Portfolio Data...</div>;

  const totalPortfolioValue = realPortfolio.reduce((acc, item) => acc + (item.currentPrice * item.shares), 0);
  const totalCostBasis = realPortfolio.reduce((acc, item) => acc + (item.entryPrice * item.shares), 0);
  const mlCalculatedGain = totalPortfolioValue - totalCostBasis;
  const isPositiveGain = mlCalculatedGain >= 0;

  const getActionAI = () => {
    if (realPortfolio.length === 0) return "You currently own no real assets. Buy standard index trackers first to align with ML foundations.";
    if (profile?.riskProfile === 'Conservative') return "Your Machine Learning profile categorizes as Conservative. Avoid volatile crypto tokens and balance strictly around stable dividends.";
    return "The Random Forest mapping predicts Moderate-to-Aggressive affinity. Consider expanding volatile holdings slowly to boost edge yields.";
  };

  return (
    <div className="main-content">
      <div className="page-title">Personalized Dashboard - Active ML Tracking</div>

      {/* First Row - 3 Column Grid */}
      <div className="grid-3">
        {/* User Summary Card */}
        <Card title="User Summary">
          <StatItem label="Name" value={JSON.parse(localStorage.getItem('user'))?.name || 'Investor'} />
          <StatItem label="Risk Appetite" value={profile?.riskProfile || "Moderate"} />
          <StatItem label="ML Profile Alignment" value={profile?.riskScore ? `${Math.round(profile.riskScore)}/100` : "Pending Baseline"} isLast={true} />
        </Card>

        {/* Portfolio Overview Card */}
        <Card title="Real DB Portfolio Overview">
          {realPortfolio.length === 0 ? (
             <div style={{ padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>Your genuine portfolio is completely empty! Navigate to Global Market Trends to begin accumulating actual holdings.</div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {realPortfolio.map((holding, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '6px' }}>
                  <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{holding.shares}x {holding.symbol}</span>
                  <span style={{ fontWeight: 'bold' }}>Valued: ${(holding.currentPrice * holding.shares).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Live Market Trends Card */}
        <Card title="Market Watchlist">
          <TickerItem symbol="AAPL" price="$169.85" change="+1.2%" isPositive={true} />
          <TickerItem symbol="TSLA" price="$267.19" change="-1.4%" isPositive={false} />
          <TickerItem symbol="NVDA" price="$104.55" change="+3.2%" isPositive={true} />
        </Card>
      </div>

      {/* Second Row - 2 Column Grid */}
      <div className="grid">
        {/* ML Insights Card */}
        <Card title="Predictive AI Model Insights">
          <div className="portfolio-health">
            <div className="section-title">Your Current ML Diagnostics</div>
            <div>
              <div className="risk-level">
                Classified By Random Forest: <span className="risk-badge">{profile?.riskProfile || 'Moderate Risk'}</span>
              </div>
            </div>
          </div>
          <p className="insight-text" style={{ margin: '15px 0', borderLeft: '3px solid #2563eb', paddingLeft: '10px' }}>
            {getActionAI()}
          </p>
          <Button variant="outline" onClick={() => navigate('/ai-insights')}>View Heavy AI Details</Button>

          <div className="next-action" style={{ marginTop: '20px' }}>
             <p>Because you are mapped statically to <strong>{profile?.riskProfile || 'Moderate'}</strong> variables, the neural logic requires mapping specific action boundaries natively here to increase total gains safely.</p>
          </div>
        </Card>

        {/* Genuine DB Trades Activity Card */}
        <Card title="Genuine Trades History">
          {realPortfolio.length === 0 ? (
            <p style={{ color: '#64748b' }}>No real market transactions recorded yet.</p>
          ) : (
             <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
               <thead>
                 <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}><th>Date</th><th>Symbol</th><th>Qty</th><th>At Price</th></tr>
               </thead>
               <tbody>
                  {realPortfolio.map((pos, id) => (
                    <tr key={id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px' }}>{new Date(pos.entryDate).toLocaleDateString()}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{pos.symbol}</td>
                      <td style={{ padding: '10px' }}>{pos.shares}</td>
                      <td style={{ padding: '10px', color: '#10b981' }}>${pos.entryPrice.toFixed(2)}</td>
                    </tr>
                  ))}
               </tbody>
             </table>
          )}
        </Card>
      </div>

      {/* Third Row - Genuine Performance Summary Card */}
      <Card title="Live Account Value Metrics">
        <div className="grid-3 summary-stats">
          <SummaryStat value={`$${totalPortfolioValue.toFixed(2)}`} label="Total Assets" isPositive={true} />
          <SummaryStat value={`${mlCalculatedGain >= 0 ? '+' : ''}$${Math.abs(mlCalculatedGain).toFixed(2)}`} label="Net Portfolio Returns" isPositive={isPositiveGain} />
          <SummaryStat value={realPortfolio.length.toString()} label="Active Equities Held" isPositive={true} />
        </div>
      </Card>
    </div>
  );
};

export default UserDashboard;