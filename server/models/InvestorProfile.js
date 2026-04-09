import mongoose from 'mongoose';

const InvestorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    age: Number,
    income: Number,
    savingsPattern: String,
    tradingFrequency: Number,
    investmentHorizon: String,
    riskToleranceAnswers: [
      {
        question: String,
        answer: String,
      },
    ],
    preferredAssets: [String],
    pastGainReaction: String,
    pastLossReaction: String,
    volatilityHandling: String,
    predictedRiskClass: {
      type: String,
      enum: ['Conservative', 'Moderate', 'Aggressive'],
    },
    predictionConfidence: {
      type: Number,
      min: 0,
      max: 100,
    },
    topFeatures: [
      {
        feature: String,
        importance: Number,
      },
    ],
    recommendations: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('InvestorProfile', InvestorProfileSchema);
