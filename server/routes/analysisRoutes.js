import express from 'express';
import AnalysisController from '../controllers/analysisController.js';

const router = express.Router();

router.get('/analyze/:symbol', AnalysisController.analyzeStock);
router.get('/signal/:symbol', AnalysisController.getSignal);

export default router;
