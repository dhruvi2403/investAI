import express from 'express';
import StockController from '../controllers/stockController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/live/:symbol', StockController.getStockLiveData);
router.get('/history/:symbol', StockController.getStockHistory);

// Protected routes
router.post('/add-to-watchlist', authMiddleware, StockController.addToWatchlist);
router.get('/watchlist', authMiddleware, StockController.getWatchlist);
router.post('/buy', authMiddleware, StockController.buyStock);
router.post('/sell', authMiddleware, StockController.sellStock);
router.get('/portfolio', authMiddleware, StockController.getPortfolio);

export default router;
