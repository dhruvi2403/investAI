import express from 'express';
import ChatController from '../controllers/chatController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/query', optionalAuth, ChatController.queryChat);
router.post('/train', authMiddleware, ChatController.trainRAG);
router.get('/initialize', ChatController.initializeRAG);

export default router;
