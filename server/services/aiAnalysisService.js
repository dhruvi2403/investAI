import TechnicalIndicatorsService from '../utils/technicalIndicators.js';
import StockData from '../models/StockData.js';

export class AIAnalysisService {
  // Classify trend based on SMA and price position
  static classifyTrend(indicators) {
    if (!indicators || !indicators.sma20 || !indicators.sma50) return 'sideways';

    const { sma20, sma50, sma200 } = indicators;

    if (sma20 > sma50 && sma50 > sma200) return 'bullish';
    if (sma20 < sma50 && sma50 < sma200) return 'bearish';

    return 'sideways';
  }

  // Calculate trend strength (0-100)
  static calculateTrendStrength(indicators, currentPrice) {
    if (!indicators || !indicators.rsi) return 50;

    const rsi = indicators.rsi;
    let strength = 50;

    // RSI-based strength
    if (rsi > 70) strength += 20;
    else if (rsi > 60) strength += 10;
    else if (rsi < 30) strength -= 20;
    else if (rsi < 40) strength -= 10;

    // MACD-based strength
    if (indicators.macd) {
      if (indicators.macd.histogram > 0) strength += 10;
      else strength -= 10;
    }

    return Math.max(0, Math.min(100, strength));
  }

  // Calculate volatility (0-100)
  static calculateVolatility(data, period = 20) {
    if (data.length < period) return 50;

    const returns = [];
    for (let i = 1; i < data.length; i++) {
      const ret = (data[i].close - data[i - 1].close) / data[i - 1].close;
      returns.push(ret);
    }

    const subset = returns.slice(-period);
    const mean = subset.reduce((a, b) => a + b, 0) / period;
    const variance = subset.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    // Convert std dev to 0-100 scale
    const volatility = Math.min(100, stdDev * 1000);

    return volatility;
  }

  // Calculate risk score (0-100)
  static calculateRiskScore(indicators, volatility) {
    if (!indicators) return 50;

    let riskScore = 50;

    // RSI-based risk
    if (indicators.rsi > 80 || indicators.rsi < 20) riskScore += 25;
    else if (indicators.rsi > 70 || indicators.rsi < 30) riskScore += 15;

    // Volatility-based risk
    riskScore = (riskScore + volatility) / 2;

    // ATR-based risk (high ATR = higher risk)
    if (indicators.atr) {
      const atrRisk = Math.min(25, indicators.atr * 10);
      riskScore = (riskScore + atrRisk) / 2;
    }

    return Math.max(0, Math.min(100, riskScore));
  }

  // Determine market condition
  static determineMarketCondition(trend, trendStrength, volatility) {
    if (trend === 'bullish') {
      return trendStrength > 75 ? 'strong-bullish' : 'bullish';
    } else if (trend === 'bearish') {
      return trendStrength > 75 ? 'strong-bearish' : 'bearish';
    }
    return 'neutral';
  }

  // Generate recommendation
  static generateRecommendation(trend, riskScore, indicators) {
    if (!indicators || !indicators.rsi) return 'hold';

    const rsi = indicators.rsi;
    const isBullish = trend === 'bullish';

    // Oversold conditions
    if (rsi < 30 && isBullish) return 'strong-buy';
    if (rsi < 40 && isBullish) return 'buy';

    // Overbought conditions
    if (rsi > 70 && !isBullish) return 'strong-sell';
    if (rsi > 60 && !isBullish) return 'sell';

    // Trend-based
    if (isBullish && riskScore < 40) return 'buy';
    if (!isBullish && riskScore > 60) return 'sell';

    return 'hold';
  }

  // Support and resistance levels
  static calculateSupportResistance(data) {
    const closes = data.map((d) => d.close);

    // Support: lowest low in period
    const support = Math.min(...closes);

    // Resistance: highest high in period
    const resistance = Math.max(...closes);

    return { support, resistance };
  }

  // Complete analysis
  static async analyzeStock(symbol, lookback = 100) {
    try {
      // Fetch stock data
      const stockData = await StockData.find({ symbol })
        .sort({ date: -1 })
        .limit(lookback);

      if (stockData.length === 0) {
        console.warn(`No data for ${symbol}`);
        return null;
      }

      const data = stockData.reverse();
      const currentPrice = data[data.length - 1].close;

      // Calculate all indicators
      const indicators = await TechnicalIndicatorsService.calculateAllIndicators(symbol, lookback);

      // Calculate metrics
      const volatility = this.calculateVolatility(data);
      const trend = this.classifyTrend(indicators);
      const trendStrength = this.calculateTrendStrength(indicators, currentPrice);
      const riskScore = this.calculateRiskScore(indicators, volatility);
      const marketCondition = this.determineMarketCondition(trend, trendStrength, volatility);
      const recommendation = this.generateRecommendation(trend, riskScore, indicators);
      const { support, resistance } = this.calculateSupportResistance(data);

      return {
        trend,
        trendStrength,
        volatility,
        riskScore,
        marketCondition,
        recommendation,
        confidenceScore: Math.max(50, 100 - riskScore),
        supportLevel: support,
        resistanceLevel: resistance,
        indicators,
      };
    } catch (error) {
      console.error(`Error analyzing ${symbol}:`, error.message);
      return null;
    }
  }
}

export default AIAnalysisService;
