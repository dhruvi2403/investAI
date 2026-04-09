# Debugging & Troubleshooting Guide

## 🔍 Common Issues & Solutions

### 1. Application Won't Start

#### Symptom
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

#### Symptom
```
EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Windows (PowerShell)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=5001
```

---

#### Symptom
```
Error: listen EACCES: permission denied 0.0.0.0:5000
```

**Solution:**
```bash
# Use port > 1024
# Edit .env: PORT=3000
```

---

### 2. MongoDB Connection Issues

#### Symptom
```
MongooseError: Cannot connect to MongoDB
```

**Check List:**
1. Is MongoDB running?
   ```bash
   # Check if service is running
   mongod  # or: service mongod status
   ```

2. Is connection string correct?
   ```bash
   # Test with MongoDB Compass GUI
   # Download: https://www.mongodb.com/products/compass
   ```

3. For MongoDB Atlas:
   - Is IP address whitelisted?
     - Go to: Clusters → Security → IP Whitelist
     - Add: 0.0.0.0/0 (for development)
   
   - Is database user created?
     - Clusters → Security → Database Access
     - Create user with password

4. Check .env:
   ```env
   # Local
   MONGODB_URI=mongodb://localhost:27017/investai
   
   # Atlas
   MONGODB_ATLAS_URI=mongodb+srv://user:pass@cluster.mongodb.net/investai
   ```

5. Test connection:
   ```bash
   # Use MongoDB shell
   mongosh "your-connection-string"
   ```

---

### 3. API Key Errors

#### Symptom
```
Error: Invalid API key
HTTP 401: Unauthorized
```

**Solutions:**

**Finnhub:**
- Register: https://finnhub.io
- Get key from Dashboard → API tokens
- Verify: Paste key in Postman test

**Alpha Vantage:**
- Register: https://www.alphavantage.co
- Key sent instantly via email
- Check SPAM folder

**Twelve Data:**
- Register: https://twelvedata.com
- Get key from Dashboard → API tokens
- Free tier: 800 calls/day

**Polygon:**
- Register: https://polygon.io
- Get key from Dashboard
- Free tier: Limited but sufficient

```bash
# Test API key validity
curl "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY"
```

---

#### Symptom
```
Error: Rate limit exceeded
```

**Solutions:**
- Free API keys have rate limits (5-60 calls/minute)
- Wait 60 seconds
- Upgrade to paid tier
- Or remove API key to use mock data

---

### 4. CORS Errors

#### Symptom
```
Access to XMLHttpRequest blocked by CORS policy
```

**Causes:**
- Frontend and backend on different origins
- CORS not configured properly

**Solution 1: Check .env**
```env
# Must match your frontend URL
CLIENT_URL=http://localhost:5173
```

**Solution 2: Check vite.config.js**
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
},
```

**Solution 3: Full CORS config in backend**
```javascript
// server.js
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
```

---

### 5. ML Model Issues

#### Symptom
```
Model not found
Cannot predict investor profile
```

**Solution:**
```bash
# Train the model
npm run train-model

# Should output:
# ✓ Generated 1000 training samples
# ✓ Model training complete
# ✓ Model saved to: server/ml/investor_profile_model.json
```

#### Symptom
```
Model accuracy is too low
```

**Check:**
1. File exists: `server/ml/investor_profile_model.json`
2. File not corrupted: Check file size > 50KB
3. Retrain if needed:
   ```bash
   rm server/ml/investor_profile_model.json
   npm run train-model
   ```

---

### 6. Authentication Issues

#### Symptom
```
401 Unauthorized
Invalid or expired token
```

**Solutions:**

1. Clear browser storage:
   ```javascript
   // In browser console (F12)
   localStorage.clear()
   sessionStorage.clear()
   ```

2. Re-login to get new token

3. Check JWT_SECRET:
   ```env
   # .env must have JWT_SECRET set
   JWT_SECRET=any-random-string
   ```

4. Check token format:
   ```javascript
   // Must be:
   Authorization: Bearer <token>
   
   // NOT:
   Authorization: <token>
   Authorization: Token <token>
   ```

---

#### Symptom
```
Password not matching during login
```

**Causes:**
- Password never hashed during registration
- Database corruption

**Solution:**
- Delete user from database and re-register
- Or use MongoDB Compass to check password format

---

### 7. Stock Data Issues

#### Symptom
```
GET /api/stocks/live/AAPL returns empty
```

**Causes:**
1. All API keys invalid/rate limited
2. Network error

**Solutions:**
```bash
# Check API connectivity
curl https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY

# Check terminal logs for detailed error
# Should see fallback to mock data
```

#### Symptom
```
Historical data is very limited
```

**Normal behavior:**
- First run has no data (empty database)
- Wait for cron jobs to populate (5 minute update)
- Or manually trigger:

```bash
# Would need to add endpoint to manually trigger
# Or use MongoDB directly to insert sample data
```

---

### 8. Chat/Chatbot Not Responding

#### Symptom
```
POST /api/chat/query returns empty response
```

**Solutions:**

1. Initialize RAG documents:
   ```bash
   curl http://localhost:5000/api/chat/initialize
   ```

2. Check MongoDB for documents:
   ```javascript
   // In MongoDB Compass
   // Collection: ragdocuments
   // Should have 5+ default documents
   ```

3. Check query format:
   ```javascript
   // Correct:
   { "query": "What is RSI?" }
   
   // Incorrect:
   { "message": "What is RSI?" }
   ```

---

### 9. Performance Issues

#### Symptom
```
API calls taking > 2 seconds
```

**Causes:**
- Slow MongoDB connection
- Large result set
- Complex calculation

**Solutions:**

1. Check MongoDB connection:
   ```bash
   # Use MongoDB Compass for timing
   # Look for query time in logs
   ```

2. Optimize query:
   ```javascript
   // Add indexes:
   db.StockData.createIndex({ symbol: 1, date: -1 })
   ```

3. Reduce data range:
   ```javascript
   // Instead of all history, use last 30 days
   stockAPI.getHistory('AAPL', 30)
   ```

---

### 10. Frontend Not Showing Live Data

#### Symptom
```
Charts show empty or placeholder text
```

**Causes:**
- API not returning data
- Frontend not calling API
- State not updating

**Debug Steps:**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform action that should fetch data
4. Check if API call appears
5. Check response status (200 = success)
6. Check response body has data

**If no API calls:**
```javascript
// Check apiClient is imported
import { stockAPI } from './services/apiClient';

// Check API function exists
console.log(stockAPI.getLiveData); // Should not be undefined

// Add logging
const data = await stockAPI.getLiveData('AAPL');
console.log('API response:', data); // Should show data
```

---

## 🧪 Debugging Tools & Commands

### Terminal Debugging

```bash
# 1. Check if ports are open
netstat -ano  # Windows
lsof -i :5000  # Mac/Linux

# 2. Check process is running
ps aux | grep node  # Linux/Mac
tasklist | findstr node  # Windows

# 3. Check file exists
ls -la server/ml/investor_profile_model.json

# 4. Check logs in real-time
npm run dev  # Terminal shows all logs

# 5. Kill specific process
kill -9 12345  # Linux/Mac
taskkill /PID 12345 /F  # Windows
```

### Browser DevTools

```javascript
// F12 → Console tab

// Check localStorage
console.log(localStorage.getItem('token'));

// Check API client
import { apiClient } from './services/apiClient';
apiClient.get('/health').then(console.log);

// Test API call
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### MongoDB Debugging

```javascript
// MongoDB Compass GUI:
// 1. Connect to your MongoDB
// 2. Browse collections
// 3. View documents
// 4. Run queries in "Aggregations" tab

// Example query:
db.stockdata.find({ symbol: 'AAPL' }).limit(5)

// Check document count
db.stockdata.countDocuments()

// Check indexes
db.stockdata.getIndexes()
```

### API Testing Tools

```bash
# Using curl (command line)
curl http://localhost:5000/api/health

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Using Postman (GUI):
# 1. Download Postman
# 2. Create request
# 3. Set URL: http://localhost:5000/api/health
# 4. Click Send
```

---

## 📊 Status Checks

### Quick Health Check

```bash
# 1. Frontend running?
# Browse: http://localhost:5173
# Page should load

# 2. Backend running?
curl http://localhost:5000/api/health
# Should return: { "status": "Server is running", ... }

# 3. MongoDB connected?
# Check terminal for: "✓ MongoDB Connected"

# 4. Models trained?
ls -la server/ml/investor_profile_model.json
# Should exist and be > 50KB

# 5. API keys working?
curl "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY"
# Should return price data
```

### Environment Check

```bash
# 1. .env file exists?
ls -la .env

# 2. .env has required variables?
cat .env | grep MONGODB_ATLAS_URI
cat .env | grep JWT_SECRET

# 3. Dependencies installed?
ls -la node_modules | head
# Should show many folders

# 4. Backend files exist?
ls -la server/
# Should show models, controllers, routes, etc.
```

---

## 🔧 Manual Fixes

### Reset Everything

```bash
# 1. Clear node modules
rm -rf node_modules package-lock.json

# 2. Clear browser cache
# DevTools (F12) → Application → Clear All

# 3. Clear localStorage
# Browser console: localStorage.clear()

# 4. Delete generated files
rm server/ml/investor_profile_model.json
rm server/ml/dataset_stats.json

# 5. Reinstall fresh
npm install

# 6. Retrain model
npm run train-model

# 7. Start fresh
npm run dev
```

### MongoDB Reset (if needed)

```bash
# ⚠️ WARNING: This deletes all data!

# Using MongoDB Shell:
mongosh

# In mongosh:
use investai
db.dropDatabase()
exit

# Database is now empty - will be repopulated on first run
```

---

## 📞 Getting Help

### Check Logs

1. **Backend logs** (Terminal running `npm run dev`)
   - Errors shown in real-time
   - Look for ✓ or ✗ symbols

2. **Frontend logs** (Browser F12 → Console)
   - JavaScript errors
   - Network request details

3. **Database logs** (MongoDB)
   - Connection errors
   - Query problems

### Error Code Meanings

```
200 - OK (Success)
400 - Bad Request (Invalid input)
401 - Unauthorized (Need login)
403 - Forbidden (Not allowed)
404 - Not Found (Resource missing)
500 - Internal Server Error (Backend crashed)
```

### Resources

- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com
- **React Docs**: https://react.dev
- **Finnhub API**: https://finnhub.io/docs
- **Official Issues**: https://github.com/issues/search

---

## 💡 Pro Tips

1. **Always check terminal** - Most errors logged there
2. **Use DevTools Network tab** - See every API request/response
3. **Keep .env clean** - One setting per line, no extra spaces
4. **Restart after .env changes** - Configuration not hot-reloaded
5. **Test with curl first** - Isolate frontend from backend issues
6. **Check logs before asking** - Answer is usually there

---

**Last Updated**: 2025-03-02  
**For additional support**: Check QUICK_START.md, ENV_SETUP_GUIDE.md, or COMPLETE_SUMMARY.md
