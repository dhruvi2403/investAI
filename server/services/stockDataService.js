import axios from 'axios';
import { config } from '../config/env.js';

// Finnhub - Most reliable for real-time quotes with free tier
export const fetchFromFinnhub = async (symbol, timeframe = 'daily') => {
  if (!config.finnhubKey) {
    console.warn('⚠ Finnhub API key not configured');
    return null;
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${config.finnhubKey}`;
    const response = await axios.get(url, { timeout: 5000 });

    if (response.data && response.data.c) {
      return {
        symbol,
        date: new Date(),
        open: response.data.o,
        high: response.data.h,
        low: response.data.l,
        close: response.data.c,
        volume: response.data.v,
        source: 'finnhub',
      };
    }
  } catch (error) {
    console.error(`Error fetching ${symbol} from Finnhub:`, error.message);
  }
  return null;
};

// Alpha Vantage - Good for historical data
export const fetchFromAlphaVantage = async (symbol) => {
  if (!config.alphaVantageKey) {
    console.warn('⚠ Alpha Vantage API key not configured');
    return null;
  }

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${config.alphaVantageKey}`;
    const response = await axios.get(url, { timeout: 5000 });

    const data = response.data['Global Quote'];
    if (data && data['05. price']) {
      return {
        symbol,
        date: new Date(),
        open: parseFloat(data['02. open']),
        high: parseFloat(data['03. high']),
        low: parseFloat(data['04. low']),
        close: parseFloat(data['05. price']),
        volume: parseFloat(data['06. volume']),
        source: 'alpha-vantage',
      };
    }
  } catch (error) {
    console.error(`Error fetching ${symbol} from Alpha Vantage:`, error.message);
  }
  return null;
};

// Twelve Data - Fast and reliable
export const fetchFromTwelveData = async (symbol) => {
  if (!config.twelveDataKey) {
    console.warn('⚠ Twelve Data API key not configured');
    return null;
  }

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${config.twelveDataKey}`;
    const response = await axios.get(url, { timeout: 5000 });

    if (response.data && response.data.status === 'ok') {
      const data = response.data;
      return {
        symbol,
        date: new Date(),
        open: parseFloat(data.open),
        high: parseFloat(data.high),
        low: parseFloat(data.low),
        close: parseFloat(data.close),
        volume: parseFloat(data.volume),
        source: 'twelve-data',
      };
    }
  } catch (error) {
    console.error(`Error fetching ${symbol} from Twelve Data:`, error.message);
  }
  return null;
};

// Fallback: Mock data for development (can be replaced with real API)
export const fetchMockStockData = (symbol) => {
  const basePrice = 100 + Math.random() * 200;
  return {
    symbol,
    date: new Date(),
    open: basePrice - Math.random() * 5,
    high: basePrice + Math.random() * 5,
    low: basePrice - Math.random() * 5,
    close: basePrice,
    volume: Math.floor(Math.random() * 10000000),
    source: 'mock',
  };
};

export const fetchStockData = async (symbol) => {
  // Try multiple sources in fallback order
  let data = await fetchFromFinnhub(symbol);
  if (data) return data;

  data = await fetchFromAlphaVantage(symbol);
  if (data) return data;

  data = await fetchFromTwelveData(symbol);
  if (data) return data;

  // Use mock data as last resort
  console.warn(`⚠ All APIs failed for ${symbol}, using mock data`);
  return fetchMockStockData(symbol);
};
