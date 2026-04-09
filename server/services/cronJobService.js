import fetch from 'node-fetch';
import StockData from '../models/StockData.js';
import { fetchStockData } from '../services/stockDataService.js';
import { DataCleaningService } from '../utils/dataCleaner.js';

export class CronJobService {
  static setupJobs(cron) {
    console.log('⏰ Setting up cron jobs...');

    // Update stock data every 5 minutes (during trading hours)
    cron.schedule('*/5 * 8-17 * * 1-5', async () => {
      console.log('🔄 Running scheduled stock update...');
      await this.updateStockPrices();
    });

    // Run analysis updates hourly
    cron.schedule('0 * * * *', async () => {
      console.log('📊 Running scheduled analysis...');
      await this.updateAnalysis();
    });

    console.log('✓ Cron jobs configured');
  }

  static async updateStockPrices() {
    try {
      const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NIFTY50', 'TCS.NS'];

      for (const symbol of symbols) {
        const freshData = await fetchStockData(symbol);

        if (freshData && freshData.close) {
          const stockRecord = new StockData({
            symbol,
            date: freshData.date,
            open: freshData.open,
            high: freshData.high,
            low: freshData.low,
            close: freshData.close,
            volume: freshData.volume,
            source: freshData.source,
          });

          await stockRecord.save();
          console.log(`✓ Updated ${symbol}`);
        }
      }
    } catch (error) {
      console.error('Cron job error:', error.message);
    }
  }

  static async updateAnalysis() {
    try {
      const AIAnalysisService = (await import('../services/aiAnalysisService.js')).default;

      const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'];

      for (const symbol of symbols) {
        const analysis = await AIAnalysisService.analyzeStock(symbol);

        if (analysis) {
          const StockAnalysis = (await import('../models/StockAnalysis.js')).default;

          await StockAnalysis.create({
            symbol,
            date: new Date(),
            trend: analysis.trend,
            trendStrength: analysis.trendStrength,
            volatility: analysis.volatility,
            riskScore: analysis.riskScore,
            marketCondition: analysis.marketCondition,
            recommendation: analysis.recommendation,
            confidenceScore: analysis.confidenceScore,
          });

          console.log(`✓ Analyzed ${symbol}`);
        }
      }
    } catch (error) {
      console.error('Analysis cron job error:', error.message);
    }
  }
}

export default CronJobService;
