import RAGService from '../services/ragService.js';
import ChatHistory from '../models/ChatHistory.js';

export class ChatController {
  // POST /api/chat/query
  static async queryChat(req, res) {
    try {
      const { query, sessionId } = req.body;
      const userId = req.user?.userId;

      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      // Generate response using RAG
      const userContext = userId
        ? await getUserContext(userId)
        : null;

      const response = await RAGService.generateResponse(query, userContext);

      // Save to history
      if (userId && sessionId) {
        const chatDoc = await ChatHistory.findOne({ userId, sessionId });

        if (chatDoc) {
          chatDoc.messages.push(
            { role: 'user', content: query, timestamp: new Date() },
            {
              role: 'assistant',
              content: response.response,
              timestamp: new Date(),
              context: {
                sources: response.sources.map((s) => s.title),
              },
            }
          );
          await chatDoc.save();
        } else {
          const newChat = new ChatHistory({
            userId,
            sessionId,
            messages: [
              { role: 'user', content: query, timestamp: new Date() },
              {
                role: 'assistant',
                content: response.response,
                timestamp: new Date(),
              },
            ],
          });
          await newChat.save();
        }
      }

      return res.json({
        response: response.response,
        confidence: response.confidence,
        sources: response.sources,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/chat/train
  static async trainRAG(req, res) {
    try {
      const { documents } = req.body;

      if (!Array.isArray(documents) || documents.length === 0) {
        return res.status(400).json({ error: 'Documents array required' });
      }

      const ingested = await RAGService.ingestDocuments(documents);

      return res.json({
        message: `Trained on ${ingested.length} documents`,
        ingested,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/chat/initialize
  static async initializeRAG(req, res) {
    try {
      await RAGService.initializeDefaultDocuments();

      return res.json({
        message: 'RAG initialized with default documents',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

async function getUserContext(userId) {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId).lean();

    return {
      riskProfile: user?.riskProfile,
      email: user?.email,
      watchlist: user?.watchlist,
    };
  } catch (error) {
    return null;
  }
}

export default ChatController;
