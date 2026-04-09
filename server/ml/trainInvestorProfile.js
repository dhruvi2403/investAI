import { RandomForest } from './randomForest.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Synthetic dataset generator for investor profiling
export class SyntheticDatasetGenerator {
  static generateDataset(size = 1000) {
    const data = [];

    for (let i = 0; i < size; i++) {
      const age = Math.floor(Math.random() * 50) + 20; // 20-70
      const income = Math.floor(Math.random() * 200000) + 20000; // 20k-220k
      const savingsRate = Math.random() * 100; // 0-100%
      const tradingFrequency = Math.floor(Math.random() * 100); // trades per year
      const investmentHorizon = Math.floor(Math.random() * 40) + 1; // 1-40 years
      const riskTolerance = Math.random() * 100; // 0-100
      const preferredAssetCount = Math.floor(Math.random() * 5) + 1; // 1-5 asset types
      const gainReactionScore = Math.random() * 100; // how aggressive with gains
      const lossReactionScore = Math.random() * 100; // how defensive with losses
      const volatilityTolerance = Math.random() * 100; // 0-100

      // Derived risk class based on features
      let riskClass;
      const riskScore =
        (age / 100) * 10 +
        (income / 200000) * 10 +
        savingsRate / 10 +
        (tradingFrequency / 100) * 15 +
        (investmentHorizon / 40) * 15 +
        riskTolerance / 10 +
        (preferredAssetCount / 5) * 10 +
        (gainReactionScore / 100) * 10 +
        (100 - lossReactionScore) / 10 +
        volatilityTolerance / 10;

      if (riskScore < 35) {
        riskClass = 'Conservative';
      } else if (riskScore < 65) {
        riskClass = 'Moderate';
      } else {
        riskClass = 'Aggressive';
      }

      data.push({
        recordId: `record_${i}`,
        age,
        income,
        savingsRate,
        tradingFrequency,
        investmentHorizon,
        riskTolerance,
        preferredAssetCount,
        gainReactionScore,
        lossReactionScore,
        volatilityTolerance,
        riskClass,
        source: 'synthetic',
      });
    }

    return data;
  }
}

// Training script
export async function trainInvestorProfileModel() {
  console.log('🚀 Starting Investor Profile Model Training...\n');

  // Generate synthetic dataset
  console.log('📊 Generating synthetic dataset...');
  const dataset = SyntheticDatasetGenerator.generateDataset(1000);
  console.log(`✓ Generated ${dataset.length} training samples\n`);

  // Prepare features and labels
  const X = dataset.map((item) => [
    item.age,
    item.income,
    item.savingsRate,
    item.tradingFrequency,
    item.investmentHorizon,
    item.riskTolerance,
    item.preferredAssetCount,
    item.gainReactionScore,
    item.lossReactionScore,
    item.volatilityTolerance,
  ]);

  const y = dataset.map((item) => item.riskClass);

  // Train model
  console.log('🤖 Training Random Forest model...');
  const model = new RandomForest(10, 8);
  model.fit(X, y);

  console.log('✓ Model training complete\n');

  // Evaluate on training set
  const predictions = model.predict(X);
  const accuracy = predictions.filter((pred, i) => pred === y[i]).length / y.length;
  console.log(`📈 Training Accuracy: ${(accuracy * 100).toFixed(2)}%\n`);

  // Get feature importance
  const importance = model.getFeatureImportance();
  console.log('📊 Top Feature Importance:');
  importance.slice(0, 5).forEach((item) => {
    console.log(`  - ${item.feature}: ${item.importance.toFixed(2)}%`);
  });
  console.log('');

  // Save model
  const modelPath = path.join(__dirname, 'investor_profile_model.json');
  const modelData = {
    trees: model.trees.map((tree) => tree.tree),
    featureNames: model.featureNames,
    nTrees: model.nTrees,
    maxDepth: model.maxDepth,
    featureImportance: importance,
    accuracy,
    trainingDate: new Date().toISOString(),
  };

  fs.writeFileSync(modelPath, JSON.stringify(modelData, null, 2));
  console.log(`✓ Model saved to: ${modelPath}\n`);

  // Save dataset stats
  const statsPath = path.join(__dirname, 'dataset_stats.json');
  const stats = {
    totalSamples: dataset.length,
    classDistribution: {
      Conservative: y.filter((label) => label === 'Conservative').length,
      Moderate: y.filter((label) => label === 'Moderate').length,
      Aggressive: y.filter((label) => label === 'Aggressive').length,
    },
    features: [
      'age',
      'income',
      'savingsRate',
      'tradingFrequency',
      'investmentHorizon',
      'riskTolerance',
      'preferredAssetCount',
      'gainReactionScore',
      'lossReactionScore',
      'volatilityTolerance',
    ],
  };

  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
  console.log(`✓ Dataset stats saved to: ${statsPath}\n`);

  console.log('✅ Training complete!');
  return model;
}

// Run if this is the main module
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     process.argv[1].endsWith('trainInvestorProfile.js');
if (isMainModule) {
  trainInvestorProfileModel().catch((error) => {
    console.error('❌ Training failed:', error.message);
    process.exit(1);
  });
}
