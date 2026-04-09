import StockData from '../models/StockData.js';

export class TechnicalIndicatorsService {
  // RSI (Relative Strength Index)
  static calculateRSI(closes, period = 14) {
    if (closes.length < period) return null;

    let gains = 0;
    let losses = 0;

    for (let i = closes.length - period; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    return rsi;
  }

  // MACD (Moving Average Convergence Divergence)
  static calculateMACD(closes) {
    if (closes.length < 26) return null;

    const ema12 = this.calculateEMA(closes, 12);
    const ema26 = this.calculateEMA(closes, 26);

    const macdLine = ema12 - ema26;
    const signalLine = this.calculateEMA([macdLine], 9);
    const histogram = macdLine - signalLine;

    return { macd: macdLine, signal: signalLine, histogram };
  }

  // EMA (Exponential Moving Average)
  static calculateEMA(data, period) {
    if (data.length < period) return null;

    const k = 2 / (period + 1);
    let ema = data.slice(0, period).reduce((a, b) => a + b) / period;

    for (let i = period; i < data.length; i++) {
      ema = data[i] * k + ema * (1 - k);
    }

    return ema;
  }

  // SMA (Simple Moving Average)
  static calculateSMA(data, period) {
    if (data.length < period) return null;
    const sum = data.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  // Bollinger Bands
  static calculateBollingerBands(closes, period = 20, stdDev = 2) {
    if (closes.length < period) return null;

    const sma = this.calculateSMA(closes, period);
    const subset = closes.slice(-period);

    const variance = subset.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / period;
    const std = Math.sqrt(variance);

    return {
      upper: sma + stdDev * std,
      middle: sma,
      lower: sma - stdDev * std,
    };
  }

  // ATR (Average True Range)
  static calculateATR(data, period = 14) {
    if (data.length < period) return null;

    const trueRanges = [];
    for (let i = 1; i < data.length; i++) {
      const high = data[i].high;
      const low = data[i].low;
      const prevClose = data[i - 1].close;

      const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
      trueRanges.push(tr);
    }

    const sum = trueRanges.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  // Stochastic Oscillator
  static calculateStochastic(data, period = 14) {
    if (data.length < period) return null;

    const subset = data.slice(-period);
    const high = Math.max(...subset.map((d) => d.high));
    const low = Math.min(...subset.map((d) => d.low));

    const current = data[data.length - 1].close;
    const k = ((current - low) / (high - low)) * 100;

    return k;
  }

  // Calculate all indicators for a symbol
  static async calculateAllIndicators(symbol, lookback = 100) {
    try {
      const stockData = await StockData.find({ symbol })
        .sort({ date: -1 })
        .limit(lookback);

      if (stockData.length === 0) {
        console.warn(`No data found for ${symbol}`);
        return null;
      }

      const data = stockData.reverse();
      const closes = data.map((d) => d.close);

      return {
        rsi: this.calculateRSI(closes),
        macd: this.calculateMACD(closes),
        sma20: this.calculateSMA(closes, 20),
        sma50: this.calculateSMA(closes, 50),
        sma200: this.calculateSMA(closes, 200),
        ema12: this.calculateEMA(closes, 12),
        ema26: this.calculateEMA(closes, 26),
        bollingerBands: this.calculateBollingerBands(closes),
        atr: this.calculateATR(data),
        stochastic: this.calculateStochastic(data),
      };
    } catch (error) {
      console.error(`Error calculating indicators for ${symbol}:`, error.message);
      return null;
    }
  }
}

export default TechnicalIndicatorsService;
