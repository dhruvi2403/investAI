import mongoose from 'mongoose';

const RAGDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['faq', 'documentation', 'knowledge-base', 'tax-rules', 'portfolio-data'],
    },
    embedding: [Number],
    source: String,
    keywords: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('RAGDocument', RAGDocumentSchema);
