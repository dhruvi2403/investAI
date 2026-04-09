import express from 'express';
import InvestorController from '../controllers/investorController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/profile/predict', optionalAuth, InvestorController.predictProfile);
router.get('/profile/:profileId', optionalAuth, InvestorController.getProfile);
router.get('/model-info', InvestorController.getModelInfo);

export default router;
