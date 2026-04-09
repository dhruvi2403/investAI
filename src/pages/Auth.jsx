import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/apiClient';

const Auth = ({ setIsSignedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let res;
      if (isLogin) {
        res = await authAPI.login(email, password);
      } else {
        res = await authAPI.register(email, password, name);
      }
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setIsSignedIn(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  const formStyle = {
    display: 'flex', flexDirection: 'column', gap: '15px',
    maxWidth: '400px', margin: '40px auto', padding: '30px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '8px',
    backgroundColor: '#fff'
  };

  const inputStyle = {
    padding: '12px', borderRadius: '4px', border: '1px solid #ccc'
  };

  const btnStyle = {
    padding: '12px', backgroundColor: '#2563eb', color: 'white',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
  };

  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isLogin ? 'Login to InvestAI' : 'Create an Account'}
        </h2>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        
        {!isLogin && (
          <input 
            style={inputStyle} type="text" placeholder="Full Name" 
            value={name} onChange={(e) => setName(e.target.value)} required 
          />
        )}
        <input 
          style={inputStyle} type="email" placeholder="Email Address" 
          value={email} onChange={(e) => setEmail(e.target.value)} required 
        />
        <input 
          style={inputStyle} type="password" placeholder="Password" 
          value={password} onChange={(e) => setPassword(e.target.value)} required 
        />
        
        <button type="submit" style={btnStyle}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Auth;
