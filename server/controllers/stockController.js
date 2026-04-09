import User from '../models/User.js';
import StockData from '../models/StockData.js';
import StockAnalysis from '../models/StockAnalysis.js';
import { fetchStockData } from '../services/stockDataService.js';
import { DataCleaningService } from '../utils/dataCleaner.js';
import AIAnalysisService from '../services/aiAnalysisService.js';

export class StockController {
  // GET /api/stocks/live/:symbol
  static async getStockLiveData(req, res) {
    try {
      const { symbol } = req.params;

      // Fetch latest from API
      const freshData = await fetchStockData(symbol);

      if (!freshData) {
        return res.status(404).json({ error: `Could not fetch data for ${symbol}` });
      }

      // Also try to get latest from database
      const dbData = await StockData.findOne({ symbol }).sort({ date: -1 }).lean();

      return res.json({
        symbol,
        current: freshData,
        lastUpdate: new Date(),
        dbLatest: dbData || null,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/stocks/history/:symbol?days=30
  static async getStockHistory(req, res) {
    try {
      const { symbol } = req.params;
      const { days = 30 } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      const data = await StockData.find({
        symbol,
        date: { $gte: startDate },
      })
        .sort({ date: 1 })
        .lean();

      return res.json({
        symbol,
        period: `${days} days`,
        data,
        count: data.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/stocks/add-to-watchlist
  static async addToWatchlist(req, res) {
    try {
      const { symbol } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.watchlist.includes(symbol)) {
        user.watchlist.push(symbol);
        await user.save();
      }

      return res.json({ message: 'Added to watchlist', watchlist: user.watchlist });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/stocks/watchlist
  static async getWatchlist(req, res) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Fetch latest data for all watchlist items
      const watchlistData = await Promise.all(
        user.watchlist.map(async (symbol) => {
          const data = await StockData.findOne({ symbol }).sort({ date: -1 }).lean();
          return { symbol, data };
        })
      );

      return res.json({ watchlist: watchlistData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // POST /api/stocks/buy
  static async buyStock(req, res) {
    try {
      const { symbol, shares, price } = req.body;
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const user = await User.findById(userId);
      user.portfolio.push({
        symbol,
        shares,
        entryPrice: price,
        currentPrice: price,
        entryDate: new Date()
      });
      await user.save();
      return res.json({ message: 'Stock added to real portfolio', portfolio: user.portfolio });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/stocks/portfolio
  static async getPortfolio(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const user = await User.findById(userId);
      return res.json({ portfolio: user.portfolio });
    } catch(error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/stocks/sell
  static async sellStock(req, res) {
    try {
      const { tradeId } = req.body;
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      // Natively guard against completely empty IDs terminating logic structurally
      if (tradeId === undefined || tradeId === null) {
          return res.status(400).json({ error: 'Logical ID physically missing' });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      let legallySold = false;
      if (tradeId.toString().length < 10) {
        if (user.portfolio[parseInt(tradeId)]) {
           user.portfolio[parseInt(tradeId)].status = 'SOLD';
           legallySold = true;
        }
      } else {
        const matchingAsset = user.portfolio.find(item => item._id && item._id.toString() === tradeId.toString());
        if (matchingAsset) {
           matchingAsset.status = 'SOLD';
           legallySold = true;
        }
      }
      
      if(!legallySold) return res.status(404).json({ error: 'Asset mapping heavily failed securely avoiding crash.' });

      await user.save();
      return res.json({ message: 'Stock securely liquidated logically', portfolio: user.portfolio });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default StockController;
