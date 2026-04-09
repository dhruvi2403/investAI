import mongoose from 'mongoose';

const StockDataSchema = new mongoose.Schema(
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
    open: Number,
    high: Number,
    low: Number,
    close: {
      type: Number,
      required: true,
    },
    volume: Number,
    adjustedClose: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    market: {
      type: String,
      default: 'US',
      enum: ['US', 'IN', 'EU'],
    },
    source: {
      type: String,
      enum: ['alpha-vantage', 'finnhub', 'twelve-data', 'polygon', 'manual', 'mock'],
      default: 'manual',
    },
  },
  { timestamps: true }
);

// Compound index for fast lookups
StockDataSchema.index({ symbol: 1, date: -1 });

export default mongoose.model('StockData', StockDataSchema);
