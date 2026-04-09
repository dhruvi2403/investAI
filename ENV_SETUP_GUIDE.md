# Environment Variables Setup Guide

## Quick Start

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in the required API keys (see sections below)

3. Start the application:
```bash
npm run dev
```

---

## Database Configuration

### MongoDB Atlas (Cloud - Recommended)

```env
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/investai
```

**Steps:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free tier cluster
3. Create database user (Projects → Security → Database Access)
4. Get connection string (Clusters → Connect → Drivers)
5. Replace `username`, `password`, `cluster` in the URI

### Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/investai
```

**Setup:**
- Install MongoDB Community Edition
- Start MongoDB service: `mongod`

---

## API Keys for Stock Data

### Free APIs (No Credit Card Required)

#### 1. **Finnhub (Recommended for real-time quotes)**
```env
FINNHUB_API_KEY=your_finnhub_key_here
```
- Sign up: https://finnhub.io
- Free tier: 60 API calls/minute
- Get key: Dashboard → API tokens

#### 2. **Alpha Vantage (Good for historical data)**
```env
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```
- Sign up: https://www.alphavantage.co
- Free tier: 5 API calls/minute
- Get key: After signup, instant API key

#### 3. **Twelve Data (Fast & Reliable)**
```env
TWELVE_DATA_API_KEY=your_twelve_data_key_here
```
- Sign up: https://twelvedata.com
- Free tier: 800 API calls/day
- Get key: Dashboard → API tokens

#### 4. **Polygon.io (Limited free tier)**
```env
POLYGON_API_KEY=your_polygon_key_here
```
- Sign up: https://polygon.io
- Free tier: Useful for market news
- Get key: Dashboard after signup

### Optional: Zerodha Kite API (Indian Markets - Paid)
- Only add if you have active Zerodha subscription
- API key available in Zerodha Console

---

## AI/NLP Configuration

### OpenAI (For advanced chatbot features)
```env
OPENAI_API_KEY=your_openai_key_here
```
- Sign up: https://platform.openai.com
- Free trial: $5 credits
- Get key: API keys page

### HuggingFace (For embeddings - Optional)
```env
HUGGINGFACE_API_KEY=your_huggingface_key_here
```
- Sign up: https://huggingface.co
- Free tier: Available
- Get key: Settings → API tokens

---

## Server Configuration

```env
# Server mode
NODE_ENV=development              # development | production

# Port
PORT=5000                          # Backend port (default)

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173   # Vite dev server
```

---

## Authentication Configuration

```env
# JWT Secret (change this in production!)
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d                      # Token expiration
```

**Important:** Generate a strong secret in production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Caching (Optional - Redis)

```env
# Only needed if you want to cache API responses
REDIS_URL=redis://localhost:6379
```

**Setup (local):**
```bash
npm install redis
# On Windows: Use Windows Subsystem for Linux (WSL) or Docker
# On Mac: brew install redis
# On Linux: sudo apt-get install redis-server
```

---

## Scheduled Jobs Configuration

```env
# Cron job intervals (standard cron format)
STOCK_UPDATE_INTERVAL=*/5 * * * *     # Every 5 minutes
ANALYSIS_UPDATE_INTERVAL=0 * * * *    # Every hour
```

---

## RAG/Chatbot Configuration

```env
# Pinecone Vector Database (Optional)
PINECONE_API_KEY=your_pinecone_key_here
PINECONE_INDEX_NAME=investai-docs
```

---

## Complete Example .env File

```env
# Database
MONGODB_ATLAS_URI=mongodb+srv://user:pass@cluster.mongodb.net/investai

# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Stock APIs
ALPHA_VANTAGE_API_KEY=ABC123XYZ789
FINNHUB_API_KEY=DEF456UVW012
TWELVE_DATA_API_KEY=GHI789RST345
POLYGON_API_KEY=JKL012OPQ678

# AI APIs
OPENAI_API_KEY=sk-proj-xxxxxxxxxx
HUGGINGFACE_API_KEY=hf_xxxxxxxxxx

# JWT
JWT_SECRET=aF9mK2pL4qR6sT8uV0wX2yZ4aB6cD8eF
JWT_EXPIRE=7d

# Cron Jobs
STOCK_UPDATE_INTERVAL=*/5 * * * *
ANALYSIS_UPDATE_INTERVAL=0 * * * *

# RAG
PINECONE_API_KEY=your_key_here
PINECONE_INDEX_NAME=investai-docs
```

---

## Testing without API Keys

The application includes **mock data generators** for development:

1. Stock data: Falls back to mock data if APIs fail
2. Analysis: Works with cached data
3. Chat: Uses default knowledge base documents
4. Investor Profile: Uses synthetic dataset for training

**To test:**
```bash
# Start without any API keys
npm run dev
```

---

## Troubleshooting

### "Cannot fetch stock data"
- Check API keys are correct
- Verify API key limits (some APIs have rate limits)
- Use mock data (automatically falls back)

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check connection string in `.env`
- For MongoDB Atlas, whitelist your IP

### "CORS errors"
- Ensure `CLIENT_URL` matches your Vite dev server URL
- Default: `http://localhost:5173`

### "JWT token errors"
- Generate new `JWT_SECRET` if changed
- Clear browser localStorage: `localStorage.clear()`

---

## Production Deployment

### For MongoDB Atlas:
```env
MONGODB_ATLAS_URI=mongodb+srv://prod_user:secure_password@cluster.mongodb.net/investai_prod
NODE_ENV=production
PORT=3000
```

### Generate secure JWT secret:
```bash
openssl rand -hex 32
```

### Use environment-specific configs:
- Never commit `.env` files
- Use `.env.example` as template
- Deploy secrets via platform-specific methods (Vercel, Heroku, AWS, etc.)

---

## Support

For API issues:
- Finnhub Support: https://finnhub.io/docs
- Alpha Vantage Docs: https://www.alphavantage.co/documentation/
- Twelve Data Docs: https://twelvedata.com/docs
- OpenAI Docs: https://platform.openai.com/docs

For application issues:
- Check server logs: `npm run dev` output
- Browser console: F12 → Console tab
- Check MongoDB: Use MongoDB Compass to inspect data
