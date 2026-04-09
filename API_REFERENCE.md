# API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

Response:
{
  "user": {
    "id": "mongo_id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "user": {
    "id": "mongo_id",
    "email": "user@example.com",
    "name": "John Doe",
    "riskProfile": "Moderate"
  },
  "token": "jwt_token_here"
}
```

### Get User Profile (Protected)
```
GET /auth/profile
Authorization: Bearer {token}

Response:
{
  "_id": "mongo_id",
  "email": "user@example.com",
  "name": "John Doe",
  "age": 35,
  "income": 100000,
  "riskProfile": "Moderate",
  "watchlist": ["AAPL", "MSFT"],
  "portfolio": [...]
}
```

### Update User Profile (Protected)
```
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "age": 35,
  "income": 100000,
  "savingsPattern": "25%",
  "investmentHorizon": "20 years",
  "riskTolerance": 65,
  "preferredAssets": ["stocks", "bonds", "etf"]
}

Response:
{
  "_id": "mongo_id",
  "email": "user@example.com",
  ...updated fields...
}
```

---

## Stock Data

### Get Live Stock Data
```
GET /stocks/live/{symbol}

Examples:
  GET /stocks/live/AAPL
  GET /stocks/live/TCS.NS
  GET /stocks/live/SAP.DE

Response:
{
  "symbol": "AAPL",
  "current": {
    "date": "2025-03-02T10:30:00Z",
    "open": 169.50,
    "high": 170.00,
    "low": 169.00,
    "close": 169.85,
    "volume": 52000000,
    "source": "finnhub"
  },
  "lastUpdate": "2025-03-02T10:30:00Z",
  "dbLatest": {
    "date": "2025-03-01T21:00:00Z",
    "close": 168.95,
    ...
  }
}
```

### Get Stock History
```
GET /stocks/history/{symbol}?days={days}

Examples:
  GET /stocks/history/AAPL
  GET /stocks/history/AAPL?days=90
  GET /stocks/history/MSFT?days=365

Query Parameters:
  days: integer (default: 30)

Response:
{
  "symbol": "AAPL",
  "period": "30 days",
  "count": 21,
  "data": [
    {
      "_id": "mongo_id",
      "symbol": "AAPL",
      "date": "2025-02-01T21:00:00Z",
      "open": 165.00,
      "high": 165.50,
      "low": 164.50,
      "close": 165.25,
      "volume": 48000000,
      "source": "alpha-vantage"
    },
    ...more records...
  ]
}
```

### Add to Watchlist (Protected)
```
POST /stocks/add-to-watchlist
Authorization: Bearer {token}
Content-Type: application/json

{
  "symbol": "AAPL"
}

Response:
{
  "message": "Added to watchlist",
  "watchlist": ["AAPL", "MSFT", "GOOGL"]
}
```

### Get Watchlist (Protected)
```
GET /stocks/watchlist
Authorization: Bearer {token}

Response:
{
  "watchlist": [
    {
      "symbol": "AAPL",
      "data": {
        "symbol": "AAPL",
        "date": "2025-03-02T10:30:00Z",
        "close": 169.85,
        ...
      }
    },
    {
      "symbol": "MSFT",
      "data": {
        "symbol": "MSFT",
        "date": "2025-03-02T10:30:00Z",
        "close": 287.65,
        ...
      }
    },
    ...
  ]
}
```

---

## Stock Analysis

### Analyze Stock
```
GET /analysis/analyze/{symbol}?days={days}

Examples:
  GET /analysis/analyze/AAPL
  GET /analysis/analyze/MSFT?days=200

Query Parameters:
  days: integer (default: 100)

Response:
{
  "symbol": "AAPL",
  "analysis": {
    "trend": "bullish",
    "trendStrength": 82,
    "volatility": 38,
    "riskScore": 32,
    "marketCondition": "strong-bullish",
    "recommendation": "buy",
    "confidenceScore": 85,
    "supportLevel": 168.50,
    "resistanceLevel": 171.00,
    "indicators": {
      "rsi": 65,
      "macd": {
        "macd": 2.45,
        "signal": 2.10,
        "histogram": 0.35
      },
      "sma20": 169.20,
      "sma50": 168.50,
      "sma200": 165.80,
      "ema12": 169.30,
      "ema26": 168.90,
      "bollingerBands": {
        "upper": 172.00,
        "middle": 169.50,
        "lower": 167.00
      },
      "atr": 1.25,
      "stochastic": 68
    }
  },
  "saved": true
}
```

### Get Buy/Sell Signal
```
GET /analysis/signal/{symbol}

Examples:
  GET /analysis/signal/AAPL
  GET /analysis/signal/TSLA

Response:
{
  "symbol": "AAPL",
  "signal": "buy",
  "trend": "bullish",
  "confidence": 85,
  "analysis": {
    "symbol": "AAPL",
    "date": "2025-03-02T12:00:00Z",
    "trend": "bullish",
    "trendStrength": 82,
    "volatility": 38,
    "riskScore": 32,
    "marketCondition": "strong-bullish",
    "recommendation": "buy",
    "confidenceScore": 85,
    "supportLevel": 168.50,
    "resistanceLevel": 171.00
  }
}
```

---

## Chat & Chatbot

### Query Chatbot
```
POST /chat/query
Content-Type: application/json
Authorization: Bearer {token} (optional)

{
  "query": "What is portfolio diversification?",
  "sessionId": "session_123"
}

Response:
{
  "response": "Portfolio diversification is a risk management strategy that involves spreading investments across different asset classes...",
  "confidence": 92,
  "sources": [
    {
      "title": "What is Portfolio Diversification?",
      "category": "faq",
      "relevance": "95.23"
    },
    {
      "title": "Understanding Risk Profiles",
      "category": "knowledge-base",
      "relevance": "82.15"
    }
  ]
}
```

### Train Chatbot with Documents
```
POST /chat/train
Authorization: Bearer {token}
Content-Type: application/json

{
  "documents": [
    {
      "title": "My Custom Guide",
      "content": "This is detailed content about investing...",
      "category": "documentation",
      "source": "user-generated"
    }
  ]
}

Response:
{
  "message": "Trained on 1 documents",
  "ingested": [
    {
      "_id": "mongo_id",
      "title": "My Custom Guide",
      "category": "documentation",
      "createdAt": "2025-03-02T12:00:00Z"
    }
  ]
}
```

### Initialize RAG with Default Documents
```
GET /chat/initialize

Response:
{
  "message": "RAG initialized with default documents"
}
```

---

## Investor Profiling

### Predict Investor Profile
```
POST /investor/profile/predict
Content-Type: application/json
Authorization: Bearer {token} (optional)

{
  "userData": {
    "age": 35,
    "income": 100000,
    "savingsRate": 25,
    "tradingFrequency": 10,
    "investmentHorizon": 20,
    "riskTolerance": 65,
    "preferredAssets": ["stocks", "bonds", "etf"],
    "gainReactionScore": 70,
    "lossReactionScore": 40,
    "volatilityTolerance": 60
  }
}

Response:
{
  "prediction": {
    "riskClass": "Moderate",
    "confidence": 87,
    "riskScore": 62,
    "topFeatures": [
      {
        "feature": "Investment Horizon",
        "importance": 25
      },
      {
        "feature": "Risk Tolerance",
        "importance": 20
      },
      {
        "feature": "Trading Frequency",
        "importance": 18
      }
    ],
    "recommendations": [
      "Diversify across stocks, bonds, and alternatives",
      "Maintain 60/40 stock-bond allocation or similar",
      "Rebalance quarterly to maintain target allocation",
      "Consider sector rotation based on market cycles",
      "Use dollar-cost averaging for purchases"
    ]
  },
  "profileId": "mongo_id"
}
```

### Get Investor Profile
```
GET /investor/profile/{profileId}
Authorization: Bearer {token} (optional)

Response:
{
  "_id": "mongo_id",
  "userId": "mongo_id",
  "age": 35,
  "income": 100000,
  "savingsRate": 25,
  "tradingFrequency": 10,
  "investmentHorizon": 20,
  "riskTolerance": 65,
  "preferredAssets": ["stocks", "bonds", "etf"],
  "predictedRiskClass": "Moderate",
  "predictionConfidence": 87,
  "topFeatures": [...],
  "recommendations": [...]
}
```

### Get ML Model Information
```
GET /investor/model-info

Response:
{
  "status": "ready",
  "accuracy": 81.23,
  "trainingDate": "2025-03-02T09:45:00Z",
  "stats": {
    "totalSamples": 1000,
    "classDistribution": {
      "Conservative": 320,
      "Moderate": 380,
      "Aggressive": 300
    }
  }
}
```

---

## Health Check

### Server Health
```
GET /health

Response:
{
  "status": "Server is running",
  "timestamp": "2025-03-02T12:00:00Z"
}
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing fields, invalid data) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (user doesn't have access) |
| 404 | Not found (resource doesn't exist) |
| 500 | Server error |

---

## Authentication

Protected endpoints require Bearer token in header:

```
Authorization: Bearer {your_jwt_token}
```

Get token by:
1. Register: `POST /auth/register`
2. Login: `POST /auth/login`

Store token in localStorage on frontend:
```javascript
localStorage.setItem('token', response.token);
```

---

## Rate Limits

- No built-in rate limits (add if deployed to production)
- External API rate limits apply:
  - Finnhub: 60 calls/minute
  - Alpha Vantage: 5 calls/minute
  - Twelve Data: 800 calls/day

---

## Webhooks & Events

Currently not implemented. Scheduled jobs run automatically:
- Stock data updates: Every 5 minutes
- Analysis updates: Every hour

Configure via `.env`:
```env
STOCK_UPDATE_INTERVAL=*/5 * * * *
ANALYSIS_UPDATE_INTERVAL=0 * * * *
```

---

## Testing with cURL

Test all endpoints without frontend:

```bash
# Health check
curl http://localhost:5000/api/health

# Get stock
curl http://localhost:5000/api/stocks/live/AAPL

# Post with data
curl -X POST http://localhost:5000/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"query":"What is RSI?"}'

# With authentication
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Pagination & Filtering

Currently not implemented for history endpoint. Features:
- Returns last N days (configurable via query param)
- No sorting options (always sorted by date ascending)

Future enhancements:
- Offset/limit pagination
- Multiple filter options
- Custom sorting

---

## Documentation

- **Full Implementation**: [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
- **Setup Instructions**: [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md)
- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **Complete Summary**: [COMPLETE_SUMMARY.md](COMPLETE_SUMMARY.md)

---

**Last Updated**: 2025-03-02
**API Version**: 1.0
**Status**: Production Ready ✅
