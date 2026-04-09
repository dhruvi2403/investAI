import React, { useState, useEffect } from 'react';

const VirtualTrading = () => {
  // Use localStorage to initialize state
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('vt_portfolio');
    return saved ? JSON.parse(saved) : [];
  });
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('vt_balance');
    return saved ? JSON.parse(saved) : 100000.00;
  });
  const availableSymbols = ['AAPL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'GOOGL', 'META', 'NFLX', 'NIFTY50', 'TCS.NS', 'RELIANCE.NS', 'BTC-USD', 'ETH-USD', 'JPM'];
  const [symbol, setSymbol] = useState(availableSymbols[0]);
  const [shares, setShares] = useState(1);
  const [message, setMessage] = useState('');

  // Save to localStorage whenever portfolio or balance changes
  useEffect(() => {
    localStorage.setItem('vt_portfolio', JSON.stringify(portfolio));
    localStorage.setItem('vt_balance', JSON.stringify(balance));
  }, [portfolio, balance]);

  const handleBuy = () => {
    if (!symbol) return;
    const price = Math.floor(Math.random() * 200) + 50; // Simulated live price
    const cost = price * shares;
    
    if (balance >= cost) {
      setBalance(b => b - cost);
      setPortfolio([...portfolio, { symbol: symbol.toUpperCase(), shares, price, cost, status: 'ACTIVE' }]);
      setMessage(`Successfully bought ${shares} shares of ${symbol.toUpperCase()} at $${price}`);
      setSymbol('');
    } else {
      setMessage("Insufficient virtual funds!");
    }
  };

  const sellAll = (index, currentShares, buyPrice) => {
    const sellPrice = buyPrice + (Math.random() * 20 - 5); // Simulated dynamic sell price
    const revenue = sellPrice * currentShares;
    const pnl = revenue - (buyPrice * currentShares);
    setBalance(b => b + revenue);
    
    const newPort = [...portfolio];
    newPort[index] = { ...newPort[index], status: 'SOLD', sellPrice, pnl };
    setPortfolio(newPort);
    setMessage(`Sold ${currentShares} shares for $${revenue.toFixed(2)} (Net P/L: $${pnl.toFixed(2)})`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Virtual Trading Sandbox</h2>
      <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>Paper Trading Environment</h3>
        
        <div style={{ fontSize: '24px', color: '#10b981', fontWeight: 'bold', marginBottom: '20px' }}>
          Purchasing Power: ${balance.toFixed(2)}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <select 
            value={symbol} onChange={e => setSymbol(e.target.value)} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: 'white' }}
          >
            {availableSymbols.map((sym) => (
               <option key={sym} value={sym}>{sym}</option>
            ))}
          </select>
          <input 
            type="number" 
            min="1" 
            value={shares} onChange={e => setShares(parseInt(e.target.value))} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }}
          />
          <button onClick={handleBuy} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            BUY (Simulate)
          </button>
        </div>
        {message && <p style={{ color: '#64748b' }}>{message}</p>}
      </div>

      <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '15px' }}>Current Virtual Holdings</h3>
        {portfolio.length === 0 ? <p>No holdings yet.</p> : (
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
             <thead>
               <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                 <th style={{ padding: '10px' }}>Asset</th>
                 <th style={{ padding: '10px' }}>Shares</th>
                 <th style={{ padding: '10px' }}>Avg Cost</th>
                 <th style={{ padding: '10px' }}>Action</th>
               </tr>
             </thead>
             <tbody>
               {portfolio.map((pos, idx) => (
                 <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                   <td style={{ padding: '10px', fontWeight: 'bold' }}>
                     {pos.symbol}
                     {pos.status === 'SOLD' && <span style={{ marginLeft: '10px', fontSize: '12px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>SOLD</span>}
                   </td>
                   <td style={{ padding: '10px' }}>{pos.shares}</td>
                   <td style={{ padding: '10px' }}>
                     {pos.status === 'ACTIVE' 
                       ? `$${pos.price?.toFixed(2) || '0.00'}` 
                       : <span style={{ color: (pos.pnl || 0) >= 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                           P/L: ${(pos.pnl || 0).toFixed(2)}
                         </span>
                     }
                   </td>
                   <td style={{ padding: '10px' }}>
                     {pos.status === 'ACTIVE' ? (
                       <button onClick={() => sellAll(idx, pos.shares, pos.price)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                          SELL
                       </button>
                     ) : (
                       <span style={{ color: '#64748b', fontSize: '14px' }}>Closed</span>
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        )}
      </div>
    </div>
  );
};

export default VirtualTrading;
