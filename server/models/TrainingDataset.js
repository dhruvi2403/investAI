import mongoose from 'mongoose';

const TrainingDatasetSchema = new mongoose.Schema(
  {
    recordId: String,
    age: Number,
    income: Number,
    savingsRate: Number,
    tradingFrequency: Number,
    investmentHorizon: String,
    riskTolerance: Number,
    preferredAssetCount: Number,
    gainReactionScore: Number,
    lossReactionScore: Number,
    volatilityTolerance: Number,
    riskClass: {
      type: String,
      enum: ['Conservative', 'Moderate', 'Aggressive'],
    },
    source: {
      type: String,
      enum: ['kaggle', 'fred', 'synthetic'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('TrainingDataset', TrainingDatasetSchema);
