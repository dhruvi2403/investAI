import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { stockAPI, authAPI } from '../services/apiClient';

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [realPortfolio, setRealPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch ML properties isolated safely
      try {
        const profRes = await authAPI.getProfile();
        if (profRes) setProfile(profRes);
      } catch (e) {
        console.warn("Could not fetch user ML profile", e);
      }
        
      // 2. Fetch Portfolio cleanly
      try {
        const portRes = await stockAPI.getRealPortfolio();
        if (portRes && portRes.portfolio) {
          setRealPortfolio(portRes.portfolio);
        }
      } catch (e) {
        console.error("Dashboard DB mapping error", e);
      }
      
      setLoading(false);
    };
    fetchData();
  }, []);

  // Use safe numerical bounds to prevent NaN crashes from partial API responses mapped locally exclusively over ACTIVE metrics
  const activePortfolio = (realPortfolio || []).filter(item => item.status !== 'SOLD');
  const totalPortfolioValue = activePortfolio.reduce((acc, item) => acc + ((item.currentPrice || 0) * (item.shares || 0)), 0);
  const totalCostBasis = activePortfolio.reduce((acc, item) => acc + ((item.entryPrice || 0) * (item.shares || 0)), 0);
  const mlCalculatedGain = totalPortfolioValue - totalCostBasis;
  const isPositiveGain = mlCalculatedGain >= 0;
  // CSS as a JavaScript object
  const styles = {
    root: {
      '--primary': '#2563eb',
      '--secondary': '#10b981',
      '--dark': '#1e293b',
      '--light': '#f8fafc',
      '--gray': '#64748b',
      '--card-bg': 'white',
      '--sidebar-bg': '#f8fafc',
      '--main-bg': '#f8fafc',
      '--hover-bg': '#f1f5f9',
      '--text-dark': '#1e293b',
      '--text-muted': '#64748b',
      '--success': '#10b981',
      '--warning': '#f59e0b',
      '--danger': '#ef4444',
    },
    container: {
      display: 'flex',
      minHeight: '100vh',
    },
    sidebar: {
      width: '160px',
      backgroundColor: 'var(--sidebar-bg)',
      padding: '20px 0',
      boxShadow: '1px 0 3px rgba(0, 0, 0, 0.1)',
    },
    logo: {
      padding: '10px 20px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      color: 'white',
    },
    logoSpan: {
      marginLeft: '8px',
      color: 'var(--secondary)',
    },
    navItem: {
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      borderLeft: '3px solid transparent',
      color: '#94a3b8',
      transition: 'all 0.3s ease',
    },
    navItemActive: {
      backgroundColor: 'var(--primary)',
      borderLeft: '3px solid var(--secondary)',
      color: 'white',
    },
    navItemSpan: {
      marginLeft: '10px',
    },
    mainContent: {
      flex: 1,
      padding: '20px',
    },
    pageTitle: {
      fontSize: '24px',
      marginBottom: '20px',
      color: 'var(--text-dark)',
      fontWeight: 700,
    },
    card: {
      backgroundColor: 'var(--card-bg)',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardHeader: {
      marginBottom: '15px',
      fontSize: '18px',
      fontWeight: 600,
      color: 'var(--text-dark)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
    },
    grid3: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
    },
    button: {
      backgroundColor: 'var(--primary)',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
    },
    stat: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #e5e7eb',
    },
    statLast: {
      borderBottom: 'none',
    },
    statLabel: {
      fontSize: '14px',
      color: 'var(--text-muted)',
    },
    statValue: {
      fontSize: '16px',
      fontWeight: 500,
      color: 'var(--text-dark)',
    },
    positive: {
      color: 'var(--success)',
    },
    negative: {
      color: 'var(--danger)',
    },
    warning: {
      color: 'var(--warning)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '10px 0',
    },
    th: {
      textAlign: 'left',
      padding: '12px 15px',
      borderBottom: '2px solid #e5e7eb',
      color: 'var(--text-muted)',
      fontWeight: 600,
      fontSize: '14px',
    },
    td: {
      padding: '10px 15px',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '14px',
      color: 'var(--text-dark)',
    },
    tr: {
      '&:hover': {
        backgroundColor: 'var(--hover-bg)',
      }
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500,
    },
    badgeCompleted: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: 'var(--success)',
    },
    badgePending: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      color: 'var(--warning)',
    },
    placeholderChart: {
      width: '100%',
      height: '200px',
      backgroundColor: 'var(--hover-bg)',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      fontSize: '14px',
      margin: '15px 0',
    },
    riskBadge: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500,
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      color: 'var(--warning)',
    },
    actionList: {
      listStyle: 'none',
      margin: '10px 0',
    },
    actionListItem: {
      padding: '8px 0',
      display: 'flex',
      alignItems: 'center',
      '&::before': {
        content: '"•"',
        color: 'var(--primary)',
        fontWeight: 'bold',
        display: 'inline-block',
        width: '1em',
        marginLeft: 0,
      }
    },
    viewDetails: {
      color: 'var(--primary)',
      background: 'transparent',
      border: '1px solid var(--primary)',
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 500,
      transition: 'all 0.3s ease',
    },
    takeAction: {
      backgroundColor: 'var(--primary)',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
    },
    ticker: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 15px',
      borderRadius: '6px',
      backgroundColor: 'var(--hover-bg)',
      margin: '5px 0',
    },
    tickerSymbol: {
      fontWeight: 600,
    },
    tickerPrice: {
      fontWeight: 500,
    },
    tickerChange: {
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500,
    },
    summaryStat: {
      backgroundColor: '#f1f5f9',
      padding: '15px',
      borderRadius: '6px',
      textAlign: 'center',
    },
    summaryValue: {
      fontSize: '20px',
      fontWeight: 600,
      marginBottom: '5px',
    },
    summaryLabel: {
      fontSize: '14px',
      color: 'var(--text-muted)',
    },
    // Adding media query as a separate style object
    '@media (max-width: 992px)': {
      grid: {
        gridTemplateColumns: '1fr',
      },
      grid3: {
        gridTemplateColumns: '1fr',
      },
      container: {
        flexDirection: 'column',
      },
      sidebar: {
        width: '100%',
        padding: '10px 0',
      },
      navItem: {
        padding: '8px 15px',
      },
    },
  };

  // Convert the styles object to inline styles for React
  const inlineStyle = (styleObj) => {
    return { ...styleObj };
  };

  const recentTrades = (realPortfolio || []).length > 0 ? realPortfolio.map((item, idx) => ({
    date: item.entryDate ? new Date(item.entryDate).toLocaleDateString() : 'N/A',
    asset: item.symbol || 'Unknown',
    type: item.status === 'SOLD' ? 'Sell' : 'Buy',
    amount: `$${((item.entryPrice || 0) * (item.shares || 0)).toFixed(2)}`,
    status: item.status === 'SOLD' ? 'SOLD' : 'ACTIVE',
    id: item._id || idx
  })) : [];

  const pieData = activePortfolio.length > 0 ? activePortfolio.map((item, idx) => ({
    name: item.symbol || `Asset ${idx}`,
    value: (item.currentPrice || 0) * (item.shares || 0)
  })) : [{name: 'No Holdings Yet', value: 1}];

  const lineData = [{name: 'Initial Investment', val: totalCostBasis}, {name: 'Current Value', val: totalPortfolioValue || totalCostBasis}];

  const tickers = [
    { symbol: 'AAPL', price: '$169.85', change: '+1.2%', isPositive: true },
    { symbol: 'MSFT', price: '$287.65', change: '+0.8%', isPositive: true },
    { symbol: 'TSLA', price: '$267.19', change: '-1.4%', isPositive: false },
    { symbol: 'AMZN', price: '$178.45', change: '+0.5%', isPositive: true },
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleTakeAction = () => {
    alert("AI Recommendation: Execute purchase of 5 NVDA shares based on current volatility and RSI indicators dipping into oversold territory.");
  };

  const handleRealSell = async (tradeId) => {
    try {
      if(window.confirm("Are you sure you want to logically sell this asset heavily from your MongoDB registry?")) {
        setLoading(true);
        const res = await stockAPI.sellRealStock(tradeId);
        if(res && res.portfolio) {
           setRealPortfolio(res.portfolio);
        }
        setLoading(false);
        alert("Stock successfully sold and Portfolio mathematically recalculated!");
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert("Error processing sell transaction.");
    }
  };

  return (
    <div style={{ ...inlineStyle(styles.root) }}>
      <div style={inlineStyle(styles.container)}>

        
        {/* Main Content */}
        <div style={inlineStyle(styles.mainContent)}>
          <div style={inlineStyle(styles.pageTitle)}>Dashboard</div>
          
          {/* First Row - 3 Column Grid */}
          <div style={inlineStyle(styles.grid3)}>
            {/* User Summary Card */}
            <div style={inlineStyle(styles.card)}>
              <div style={inlineStyle(styles.cardHeader)}>User Summary</div>
              <div style={inlineStyle(styles.stat)}>
                <div style={inlineStyle(styles.statValue)}>{JSON.parse(localStorage.getItem('user'))?.name || 'Investor'}</div>
              </div>
              <div style={inlineStyle(styles.stat)}>
                <div style={inlineStyle(styles.statLabel)}>Risk Appetite</div>
                <div style={inlineStyle(styles.statValue)}>{profile?.riskProfile || 'Pending ML Evaluation'}</div>
              </div>
              <div style={inlineStyle(styles.stat)}>
                <div style={inlineStyle(styles.statLabel)}>Real Equity Holdings</div>
                <div style={inlineStyle(styles.statValue)}>{activePortfolio.length} Assets</div>
              </div>
              <div style={inlineStyle({...styles.stat, ...styles.statLast})}>
                <div style={inlineStyle(styles.statLabel)}>RF Model Match Confidence</div>
                <div style={inlineStyle(styles.statValue)}>{profile?.riskScore ? `${profile.riskScore.toFixed(0)}/100` : 'Calibrating'}</div>
              </div>
            </div>
            
            {/* Portfolio Overview Card */}
            <div style={inlineStyle(styles.card)}>
              <div style={inlineStyle(styles.cardHeader)}>Portfolio Overview</div>
              <div style={{ height: '220px', width: '100%', minWidth: '0' }}>
                <ResponsiveContainer width="99%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Live Market Trends Card */}
            <div style={inlineStyle(styles.card)}>
              <div style={inlineStyle(styles.cardHeader)}>Live Market Trends</div>
              
              {tickers.map((ticker, index) => (
                <div key={index} style={inlineStyle(styles.ticker)}>
                  <div style={inlineStyle(styles.tickerSymbol)}>{ticker.symbol}</div>
                  <div style={inlineStyle(styles.tickerPrice)}>{ticker.price}</div>
                  <div style={inlineStyle({
                    ...styles.tickerChange,
                    ...(ticker.isPositive ? styles.positive : styles.negative)
                  })}>
                    {ticker.change}
                  </div>
                </div>
              ))}
              

            </div>
          </div>
          
          {/* Second Row - 2 Column Grid */}
          <div style={inlineStyle(styles.grid)}>
            {/* AI Insights Card */}
            <div style={inlineStyle(styles.card)}>
              <div style={inlineStyle(styles.cardHeader)}>AI Insights</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '5px' }}>Your Portfolio Health</div>
                <div>
                <div style={{ marginBottom: '10px' }}>
                    Profile Assigned: <span style={inlineStyle(styles.riskBadge)}>{profile?.riskProfile || 'Moderate'} Risk</span>
                  </div>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '10px 0' }}>
                {profile?.riskProfile === 'Conservative' ? 'Your actual portfolio bounds indicate heavily stable dividends.' : 'Your neural mapping requires broader exposure. Check out Market Trends to execute Real Portoflio Buys directly.'}
              </p>
              <button onClick={() => navigate('/ai-insights')} style={inlineStyle(styles.viewDetails)}>View Heavy Analytics</button>
              
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontWeight: 600, marginBottom: '10px' }}>AI Recommended Best Action</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>
                  Derived from {realPortfolio.length > 0 ? `your ${realPortfolio.length} real assets` : 'baseline'} paired with Random Forest evaluation:
                </p>
                <ul style={inlineStyle(styles.actionList)}>
                  {activePortfolio.length > 0 ? (
                    activePortfolio.slice(0, 3).map((item, id) => (
                      <li key={id} style={{ ...inlineStyle(styles.actionListItem), '::before': { content: '"•"' } }}>Evaluate holding structural limits for {item.symbol} based on {profile?.riskProfile || ''} mapping</li>
                    ))
                  ) : (
                    <li style={{ ...inlineStyle(styles.actionListItem), '::before': { content: '"•"' } }}>Acquire standard S&P500 trackers in Global Markets</li>
                  )}
                </ul>
                <button onClick={handleTakeAction} style={inlineStyle(styles.takeAction)}>Take Action</button>
              </div>
            </div>
            
            {/* Recent Trades Activity Card */}
            <div style={inlineStyle(styles.card)}>
              <div style={inlineStyle(styles.cardHeader)}>Recent Trades Activity</div>
              <table style={inlineStyle(styles.table)}>
                <thead>
                  <tr>
                    <th style={inlineStyle(styles.th)}>Date</th>
                    <th style={inlineStyle(styles.th)}>Asset</th>
                    <th style={inlineStyle(styles.th)}>Type</th>
                    <th style={inlineStyle(styles.th)}>Amount</th>
                    <th style={inlineStyle(styles.th)}>Status</th>
                    <th style={inlineStyle(styles.th)}>Action</th>
                  </tr>
                </thead>
                <tbody>
               {recentTrades.length > 0 ? recentTrades.map((trade) => (
                    <tr key={trade.id} style={inlineStyle(styles.tr)}>
                      <td style={inlineStyle(styles.td)}>{trade.date}</td>
                      <td style={inlineStyle(styles.td)}>{trade.asset}</td>
                      <td style={inlineStyle(styles.td)}>{trade.type}</td>
                      <td style={inlineStyle(styles.td)}>{trade.amount}</td>
                      <td style={inlineStyle(styles.td)}>
                        <span style={inlineStyle({
                          ...styles.badge,
                          ...(trade.status === 'ACTIVE' ? styles.badgeCompleted : { backgroundColor: '#e2e8f0', color: '#64748b' })
                        })}>
                          {trade.status}
                        </span>
                      </td>
                      <td style={inlineStyle(styles.td)}>
                        {trade.status !== 'SOLD' ? (
                          <button 
                            onClick={() => handleRealSell(trade.id)} 
                            style={{
                               background: '#ef4444', color: '#fff', border: 'none', 
                               padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                               fontSize: '12px', fontWeight: 'bold', transition: 'background 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#dc2626'}
                            onMouseOut={(e) => e.target.style.background = '#ef4444'}
                          >
                            Sell
                          </button>
                        ) : (
                          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 'bold' }}>-- Closed --</span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                        No trades found. Go to Market Trends to begin acquiring specific assets!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Third Row - Performance Summary Card */}
          <div style={inlineStyle(styles.card)}>
            <div style={inlineStyle(styles.cardHeader)}>Performance Summary</div>
            <div style={{ ...inlineStyle(styles.grid3), marginTop: '15px' }}>
              <div style={inlineStyle(styles.summaryStat)}>
                <div style={{ ...inlineStyle(styles.summaryValue), ...inlineStyle(styles.positive) }}>${totalPortfolioValue.toFixed(2)}</div>
                <div style={inlineStyle(styles.summaryLabel)}>Calculated DB Net Value</div>
              </div>
              <div style={inlineStyle(styles.summaryStat)}>
                <div style={{ ...inlineStyle(styles.summaryValue), ...inlineStyle(styles.positive) }}>${totalCostBasis.toFixed(2)}</div>
                <div style={inlineStyle(styles.summaryLabel)}>Original Capital Deposited</div>
              </div>
              <div style={inlineStyle(styles.summaryStat)}>
                <div style={{ ...inlineStyle(styles.summaryValue), color: isPositiveGain ? 'var(--success)' : 'var(--danger)' }}>
                  {isPositiveGain ? '+' : ''}${mlCalculatedGain.toFixed(2)}
                </div>
                <div style={inlineStyle(styles.summaryLabel)}>Unrealized Neural Yields</div>
              </div>
            </div>
            <div style={{ height: '270px', marginTop: '20px', width: '100%', minWidth: '0' }}>
                <ResponsiveContainer width="99%" height={250}>
                  <LineChart data={lineData}>
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;