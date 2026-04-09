import mongoose from 'mongoose';

const TechnicalIndicatorSchema = new mongoose.Schema(
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
    rsi: Number,
    macd: Number,
    signal: Number,
    histogram: Number,
    sma20: Number,
    sma50: Number,
    sma200: Number,
    ema12: Number,
    ema26: Number,
    bollingerUpper: Number,
    bollingerMiddle: Number,
    bollingerLower: Number,
    atr: Number,
    stoch: Number,
    adx: Number,
  },
  { timestamps: true }
);

TechnicalIndicatorSchema.index({ symbol: 1, date: -1 });

export default mongoose.model('TechnicalIndicator', TechnicalIndicatorSchema);
