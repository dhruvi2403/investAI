import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { connectDB } from './server/config/database.js';
import { config } from './server/config/env.js';
import { errorHandler, notFoundHandler } from './server/middleware/errorHandler.js';
import RAGService from './server/services/ragService.js';
import CronJobService from './server/services/cronJobService.js';

// Routes
import authRoutes from './server/routes/authRoutes.js';
import stockRoutes from './server/routes/stockRoutes.js';
import analysisRoutes from './server/routes/analysisRoutes.js';
import chatRoutes from './server/routes/chatRoutes.js';
import investorRoutes from './server/routes/investorRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stocks', analysisRoutes); // Expose analysis endpoints under /api/stocks/
app.use('/api/chat', chatRoutes);
app.use('/api/investor', investorRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize RAG documents
    await RAGService.initializeDefaultDocuments();

    // Setup cron jobs
    CronJobService.setupJobs(cron);

    // Start server
    const server = app.listen(config.port, () => {
      console.log(`\n🚀 Backend Server Running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Client URL: ${config.clientUrl}`);
      console.log(`✓ API available at http://localhost:${config.port}/api\n`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('✗ Server start failed:', error.message);
    process.exit(1);
  }
};

// Start if this is main module
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     process.argv[1].endsWith('server.js');
if (isMainModule) {
  startServer();
}

export default app;
