import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    age: Number,
    income: Number,
    savingsPattern: String,
    investmentHorizon: String,
    riskTolerance: String,
    preferredAssets: [String],
    riskProfile: {
      type: String,
      enum: ['Conservative', 'Moderate', 'Aggressive'],
      default: 'Moderate',
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    watchlist: [String],
    portfolio: [
      {
        symbol: String,
        shares: Number,
        entryPrice: Number,
        currentPrice: Number,
        status: { type: String, default: 'ACTIVE' },
        entryDate: Date,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
