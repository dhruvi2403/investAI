import mongoose from 'mongoose';

const StockAnalysisSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    trend: {
      type: String,
      enum: ['bullish', 'bearish', 'sideways'],
    },
    trendStrength: {
      type: Number,
      min: 0,
      max: 100,
    },
    volatility: {
      type: Number,
      min: 0,
      max: 100,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    marketCondition: {
      type: String,
      enum: ['strong-bullish', 'bullish', 'neutral', 'bearish', 'strong-bearish'],
    },
    supportLevel: Number,
    resistanceLevel: Number,
    analysts: [
      {
        metric: String,
        value: Number,
        signal: String,
      },
    ],
    recommendation: {
      type: String,
      enum: ['strong-buy', 'buy', 'hold', 'sell', 'strong-sell'],
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

StockAnalysisSchema.index({ symbol: 1, date: -1 });

export default mongoose.model('StockAnalysis', StockAnalysisSchema);
