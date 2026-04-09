const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  async get(endpoint) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  async post(endpoint, data) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  async put(endpoint, data) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
};

// Auth APIs
export const authAPI = {
  register: (email, password, name) => apiClient.post('/auth/register', { email, password, name }),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

// Stock APIs
export const stockAPI = {
  getLiveData: (symbol) => apiClient.get(`/stocks/live/${symbol}`),
  getHistory: (symbol, days = 30) => apiClient.get(`/stocks/history/${symbol}?days=${days}`),
  addToWatchlist: (symbol) => apiClient.post('/stocks/add-to-watchlist', { symbol }),
  getWatchlist: () => apiClient.get('/stocks/watchlist'),
  buyRealStock: (symbol, shares, price) => apiClient.post('/stocks/buy', { symbol, shares, price }),
  sellRealStock: (tradeId) => apiClient.post('/stocks/sell', { tradeId }),
  getRealPortfolio: () => apiClient.get('/stocks/portfolio'),
};

// Analysis APIs
export const analysisAPI = {
  analyze: (symbol, days = 100) => apiClient.get(`/stocks/analyze/${symbol}?days=${days}`),
  getSignal: (symbol) => apiClient.get(`/stocks/signal/${symbol}`),
};

// Chat APIs
export const chatAPI = {
  query: (query, sessionId) => apiClient.post('/chat/query', { query, sessionId }),
  train: (documents) => apiClient.post('/chat/train', { documents }),
  initialize: () => apiClient.get('/chat/initialize'),
};

// Investor APIs
export const investorAPI = {
  predictProfile: (userData) => apiClient.post('/investor/profile/predict', { userData }),
  getProfile: (profileId) => apiClient.get(`/investor/profile/${profileId}`),
  getModelInfo: () => apiClient.get('/investor/model-info'),
};

export default apiClient;
