import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class InvestorProfilePredictor {
  constructor() {
    this.model = null;
    this.statsData = null;
    this.loadModel();
  }

  loadModel() {
    try {
      const modelPath = path.join(__dirname, 'investor_profile_model.json');
      const statsPath = path.join(__dirname, 'dataset_stats.json');

      if (!fs.existsSync(modelPath)) {
        console.warn('⚠ Model not found. Please run: npm run train-model');
        return;
      }

      const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf-8'));
      const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

      this.model = modelData;
      this.statsData = statsData;
      console.log('✓ Investor Profile Model loaded');
    } catch (error) {
      console.error('✗ Error loading model:', error.message);
    }
  }

  predictProfile(userData) {
    if (!this.model) {
      return this._generateMockPrediction(userData);
    }

    // Prepare features
    const features = [
      userData.age,
      userData.income || 100000,
      userData.savingsRate || 20,
      userData.tradingFrequency || 10,
      userData.investmentHorizon || 10,
      userData.riskTolerance || 50,
      (userData.preferredAssets || []).length,
      userData.gainReactionScore || 50,
      userData.lossReactionScore || 50,
      userData.volatilityTolerance || 50,
    ];

    // Simple prediction based on weighted scoring
    const riskScore = this._calculateRiskScore(features);

    let riskClass;
    if (riskScore < 40) {
      riskClass = 'Conservative';
    } else if (riskScore < 65) {
      riskClass = 'Moderate';
    } else {
      riskClass = 'Aggressive';
    }

    const confidence = 50 + Math.abs(riskScore - 50) * 0.2;

    // Feature importance based on model
    const topFeatures = (this.model.featureImportance || [])
      .slice(0, 5)
      .map((item) => ({
        feature: item.feature.replace('feature_', 'Feature '),
        importance: item.importance,
      }));

    return {
      riskClass,
      confidence: Math.min(95, Math.max(50, confidence)),
      riskScore,
      topFeatures,
      recommendations: this._generateRecommendations(riskClass, userData),
    };
  }

  _calculateRiskScore(features) {
    const weights = [
      0.15, 0.1, 0.1, 0.15, 0.1, 0.2, 0.05, 0.08, 0.05, 0.02,
    ];

    let score = 0;
    for (let i = 0; i < features.length; i++) {
      const normalized = Math.min(100, (features[i] / 100) * 100);
      score += normalized * weights[i];
    }

    return score;
  }

  _generateRecommendations(riskClass, userData) {
    const recommendations = {
      Conservative: [
        'Focus on blue-chip stocks and bonds',
        'Maintain 6-12 months of emergency fund',
        'Consider low-cost index funds',
        'Limit allocation to high-risk assets (<10%)',
        'Use stop-loss orders to protect capital',
      ],
      Moderate: [
        'Diversify across stocks, bonds, and alternatives',
        'Maintain 60/40 stock-bond allocation or similar',
        'Rebalance quarterly to maintain target allocation',
        'Consider sector rotation based on market cycles',
        'Use dollar-cost averaging for purchases',
      ],
      Aggressive: [
        'Consider growth stocks and emerging markets',
        'Allocate to high-volatility sectors (tech, biotech)',
        'Use leverage cautiously if experienced',
        'Focus on long-term capital appreciation',
        'Monitor portfolio regularly but avoid panic selling',
      ],
    };

    return recommendations[riskClass] || recommendations.Moderate;
  }

  _generateMockPrediction(userData) {
    const baseRiskScore = userData.riskTolerance || 50;
    let riskClass = 'Moderate';

    if (baseRiskScore < 35) riskClass = 'Conservative';
    else if (baseRiskScore > 65) riskClass = 'Aggressive';

    return {
      riskClass,
      confidence: 70,
      riskScore: baseRiskScore,
      topFeatures: [
        { feature: 'Investment Horizon', importance: 25 },
        { feature: 'Risk Tolerance', importance: 20 },
        { feature: 'Trading Frequency', importance: 18 },
        { feature: 'Income Level', importance: 15 },
        { feature: 'Savings Rate', importance: 12 },
      ],
      recommendations: this._generateRecommendations(riskClass, userData),
    };
  }

  getModelInfo() {
    return {
      status: this.model ? 'ready' : 'not-loaded',
      accuracy: this.model?.accuracy || 'unknown',
      trainingDate: this.model?.trainingDate || 'unknown',
      stats: this.statsData || { totalSamples: 1000 },
    };
  }
}

export default InvestorProfilePredictor;
