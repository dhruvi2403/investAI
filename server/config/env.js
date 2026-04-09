import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // Database
  mongoUri: process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI,

  // API Keys - Stock Data
  alphaVantageKey: process.env.ALPHA_VANTAGE_API_KEY,
  finnhubKey: process.env.FINNHUB_API_KEY,
  twelveDataKey: process.env.TWELVE_DATA_API_KEY,
  polygonKey: process.env.POLYGON_API_KEY,

  // API Keys - AI
  openaiKey: process.env.OPENAI_API_KEY,
  huggingfaceKey: process.env.HUGGINGFACE_API_KEY,

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',

  // Redis (optional)
  redisUrl: process.env.REDIS_URL,

  // Cron Jobs
  stockUpdateInterval: process.env.STOCK_UPDATE_INTERVAL || '*/5 * * * *',
  analysisUpdateInterval: process.env.ANALYSIS_UPDATE_INTERVAL || '0 * * * *',

  // RAG
  pineconeKey: process.env.PINECONE_API_KEY,
  pineconeIndex: process.env.PINECONE_INDEX_NAME || 'investai-docs',

  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

export default config;
