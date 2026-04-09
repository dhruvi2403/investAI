import AIAnalysisService from '../services/aiAnalysisService.js';
import StockAnalysis from '../models/StockAnalysis.js';

export class AnalysisController {
  // GET /api/stocks/analyze/:symbol
  static async analyzeStock(req, res) {
    try {
      const { symbol } = req.params;
      const { days = 100 } = req.query;

      // Perform analysis
      const analysis = await AIAnalysisService.analyzeStock(symbol, parseInt(days));

      if (!analysis) {
        return res.status(404).json({ error: `Could not analyze ${symbol}` });
      }

      // Save to database
      const savedAnalysis = new StockAnalysis({
        symbol,
        date: new Date(),
        trend: analysis.trend,
        trendStrength: analysis.trendStrength,
        volatility: analysis.volatility,
        riskScore: analysis.riskScore,
        marketCondition: analysis.marketCondition,
        recommendation: analysis.recommendation,
        confidenceScore: analysis.confidenceScore,
        supportLevel: analysis.supportLevel,
        resistanceLevel: analysis.resistanceLevel,
        analysts: [
          { metric: 'RSI', value: analysis.indicators?.rsi, signal: 'momentum' },
          { metric: 'MACD', value: analysis.indicators?.macd?.histogram, signal: 'trend' },
        ],
      });

      await savedAnalysis.save();

      return res.json({
        symbol,
        analysis,
        saved: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/stocks/signal/:symbol
  static async getSignal(req, res) {
    try {
      const { symbol } = req.params;

      // Get latest analysis
      const latestAnalysis = await StockAnalysis.findOne({ symbol })
        .sort({ date: -1 })
        .lean();

      if (!latestAnalysis) {
        return res.status(404).json({ error: `No analysis found for ${symbol}` });
      }

      return res.json({
        symbol,
        signal: latestAnalysis.recommendation,
        trend: latestAnalysis.trend,
        confidence: latestAnalysis.confidenceScore,
        analysis: latestAnalysis,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AnalysisController;
