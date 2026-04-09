import mongoose from 'mongoose';

const ChatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: String,
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
        },
        content: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        context: {
          symbol: String,
          analysisDate: Date,
          sources: [String],
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ChatHistory', ChatHistorySchema);
