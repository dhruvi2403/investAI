import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/apiClient';

const Settings = () => {
  const [profile, setProfile] = useState({ name: '', age: '', income: '', riskTolerance: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authAPI.getProfile();
        setProfile({
          name: data.name || '',
          age: data.age || '',
          income: data.income || '',
          riskTolerance: data.riskTolerance || ''
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await authAPI.updateProfile(profile);
      alert('Profile updated intelligently');
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Profile Settings</h2>
      <div style={{ display: 'grid', gap: '15px', maxWidth: '500px', background: '#fff', padding: '20px', borderRadius: '8px' }}>
        <input 
          placeholder="Name" 
          value={profile.name} 
          onChange={e => setProfile({...profile, name: e.target.value})} 
          style={{ padding: '10px', width: '100%' }} 
        />
        <input 
          type="number" 
          placeholder="Age (for ML Profiler)" 
          value={profile.age} 
          onChange={e => setProfile({...profile, age: e.target.value})} 
          style={{ padding: '10px', width: '100%' }} 
        />
        <input 
          type="number" 
          placeholder="Annual Income" 
          value={profile.income} 
          onChange={e => setProfile({...profile, income: e.target.value})} 
          style={{ padding: '10px', width: '100%' }} 
        />
        <select 
          value={profile.riskTolerance || ''} 
          onChange={e => setProfile({...profile, riskTolerance: e.target.value})} 
          style={{ padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="">Select your Risk Tolerance (For ML Profiling)</option>
          <option value="Conservative">Conservative (Low Risk)</option>
          <option value="Moderate">Moderate (Medium Risk)</option>
          <option value="Aggressive">Aggressive (High Risk)</option>
        </select>
        <button onClick={handleUpdate} style={{ padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default Settings;
