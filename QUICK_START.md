# Quick Reference: Running InvestAI

## ⚡ TL;DR - 5 Minute Setup

### 1️⃣ Clone & Setup
```bash
cd d:\AU HACKATHON\au1
cp .env.example .env
```

### 2️⃣ Configure MongoDB
**Option A: MongoDB Atlas (Cloud - Recommended)**
```
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (free M0)
4. Get connection string
5. Paste into .env as MONGODB_ATLAS_URI
```

**Option B: Local MongoDB**
```bash
# Windows: Download from mongodb.com
# Linux: sudo apt-get install mongodb
# Mac: brew install mongodb-community

# Run MongoDB
mongod
```

Then set in .env:
```env
MONGODB_URI=mongodb://localhost:27017/investai
```

### 3️⃣ Add Stock API (Optional - Falls back to mock data)
```
FINNHUB_API_KEY=get_free_key_from_finnhub.io
```

### 4️⃣ Start Application
```bash
npm install
npm run train-model
npm run dev
```

### 5️⃣ Open Browser
```
http://localhost:5173
```

Done! ✅

---

## 📋 .env Complete Template

```env
# ===== REQUIRED =====
MONGODB_ATLAS_URI=mongodb+srv://user:pass@cluster.mongodb.net/investai
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=any-random-string-here

# ===== OPTIONAL (Use Free Keys) =====
FINNHUB_API_KEY=
ALPHA_VANTAGE_API_KEY=
TWELVE_DATA_API_KEY=
POLYGON_API_KEY=

# ===== OPTIONAL (Advanced) =====
OPENAI_API_KEY=
HUGGINGFACE_API_KEY=
REDIS_URL=redis://localhost:6379
PINECONE_API_KEY=

# ===== CRON JOBS =====
STOCK_UPDATE_INTERVAL=*/5 * * * *
ANALYSIS_UPDATE_INTERVAL=0 * * * *
```

---

## 🔗 Free API Keys (2 minutes each)

| API | Setup Time | Link |
|-----|-----------|------|
| Finnhub | 1 min | https://finnhub.io (sign up → API key) |
| Alpha Vantage | 2 min | https://www.alphavantage.co (sign up) |
| Twelve Data | 2 min | https://twelvedata.com (sign up) |
| Polygon | 1 min | https://polygon.io (sign up) |

**You only need 1 API key to get started!**

---

## 🎯 What You Get

| Feature | Status | Example |
|---------|--------|---------|
| Real-time stocks | ✅ | `GET /api/stocks/live/AAPL` |
| 10+ indicators | ✅ | RSI, MACD, Bollinger Bands, etc. |
| AI analysis | ✅ | Trend, volatility, risk scoring |
| Investor profiling | ✅ | Conservative/Moderate/Aggressive |
| Chatbot | ✅ | `POST /api/chat/query` |
| Auth | ✅ | JWT login/register |
| Database | ✅ | 8 MongoDB collections |

---

## 🖥️ Commands Reference

```bash
# Development (Frontend + Backend together)
npm run dev

# Train ML model
npm run train-model

# Build for production
npm run build

# Code quality check
npm run lint

# Preview production build
npm run preview
```

---

## 📍 URLs When Running

| Part | URL |
|------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Docs | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

---

## ✅ Verification Checklist

After running `npm run dev`, verify:

- [ ] Frontend loads at http://localhost:5173
- [ ] Backend running on port 5000
- [ ] `npm run train-model` completed successfully
- [ ] MongoDB connected (no errors in terminal)
- [ ] Can see "✓ Server is running" message

---

## 🚨 Troubleshooting

### "Cannot find module 'express'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "MongoDB connection failed"
- Check MONGODB_ATLAS_URI is correct
- Ensure IP address is whitelisted in MongoDB Atlas
- Check network connection

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### "API returns 401"
- Check API key is correct in .env
- Regenerate key from API provider

### "CORS Error"
- Verify CLIENT_URL=http://localhost:5173 in .env
- Restart backend

---

## 🔄 Data Flow Example

### Get Stock Analysis:
```
Client (React) 
  → GET /api/analysis/analyze/AAPL
  → Backend fetches from Finnhub API
  → Cleans data (removes outliers)
  → Calculates 10+ indicators
  → Generates trend/risk analysis
  → Returns to frontend
  → Display in chart
```

### Predict Investor Profile:
```
Client sends user form
  → POST /api/investor/profile/predict
  → Features engineered
  → Random Forest model predicts
  → Returns risk class + recommendations
  → Saves to database
  → Display to user
```

### Chat Query:
```
User asks: "What is RSI?"
  → POST /api/chat/query
  → Query embedded
  → RAG search finds best docs
  → Response generated
  → Returns with sources
  → Display in chat UI
```

---

## 📊 Sample API Responses

### Stock Live Data
```json
{
  "symbol": "AAPL",
  "current": {
    "close": 169.85,
    "open": 169.50,
    "high": 170.00,
    "low": 169.00,
    "volume": 52000000
  }
}
```

### Stock Analysis
```json
{
  "trend": "bullish",
  "trendStrength": 75,
  "volatility": 45,
  "riskScore": 35,
  "recommendation": "buy",
  "confidence": 82
}
```

### Investor Profile
```json
{
  "riskClass": "Moderate",
  "confidence": 87,
  "recommendations": [
    "Diversify across stocks and bonds",
    "Rebalance quarterly",
    "Use dollar-cost averaging"
  ]
}
```

### Chat Response
```json
{
  "response": "RSI is an oscillator that measures momentum...",
  "confidence": 92,
  "sources": [
    {
      "title": "How to Read Technical Indicators",
      "relevance": "95.23"
    }
  ]
}
```

---

## 🎓 Next Actions

### Immediate
1. Copy .env.example → .env ✅
2. Add MongoDB URI ✅
3. Run `npm run dev` ✅

### First Session
- [ ] Explore API endpoints
- [ ] Train ML model
- [ ] Test with real stock symbol
- [ ] Try chatbot

### Enhancement
- [ ] Add custom RAG documents
- [ ] Connect React components to real data
- [ ] Configure production deployment

---

## 📱 Test the APIs

### Using curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Get stock data
curl http://localhost:5000/api/stocks/live/AAPL

# Analyze stock
curl http://localhost:5000/api/analysis/analyze/AAPL

# Chat query
curl -X POST http://localhost:5000/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"query":"What is portfolio diversification?"}'

# Investor profiling
curl -X POST http://localhost:5000/api/investor/profile/predict \
  -H "Content-Type: application/json" \
  -d '{
    "userData": {
      "age": 35,
      "income": 100000,
      "riskTolerance": 65
    }
  }'
```

---

## 💡 Pro Tips

- **Mock Mode**: All APIs work without keys! They use fallback data.
- **Model Training**: Only need to run once (`npm run train-model`)
- **Database**: Zero config needed if using MongoDB Atlas
- **Logs**: Check terminal for detailed error messages
- **Performance**: Queries are fast (<100ms for most operations)

---

## 🎉 You're Ready!

```bash
npm run dev
```

Then visit: **http://localhost:5173**

Enjoy! 📈💰
