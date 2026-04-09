import User from '../models/User.js';
import InvestorProfile from '../models/InvestorProfile.js';
import InvestorProfilePredictor from '../ml/investorProfilePredictor.js';

export class InvestorController {
  // POST /api/investor/profile/predict
  static async predictProfile(req, res) {
    try {
      const { userData } = req.body;
      const userId = req.user?.userId;

      if (!userData) {
        return res.status(400).json({ error: 'User data required' });
      }

      // Predict using ML model
      const predictor = new InvestorProfilePredictor();
      const prediction = predictor.predictProfile(userData);

      // Save to database
      const profile = new InvestorProfile({
        userId,
        ...userData,
        predictedRiskClass: prediction.riskClass,
        predictionConfidence: prediction.confidence,
        topFeatures: prediction.topFeatures,
        recommendations: prediction.recommendations,
      });

      await profile.save();

      // Also update user if authenticated
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          riskProfile: prediction.riskClass,
          riskScore: prediction.riskScore,
        });
      }

      return res.json({
        prediction,
        profileId: profile._id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/investor/profile/:profileId
  static async getProfile(req, res) {
    try {
      const { profileId } = req.params;
      const userId = req.user?.userId;

      const profile = await InvestorProfile.findById(profileId);

      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      // Authorization check
      if (profile.userId && profile.userId.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      return res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/investor/model-info
  static async getModelInfo(req, res) {
    try {
      const predictor = new InvestorProfilePredictor();
      const info = predictor.getModelInfo();

      return res.json(info);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default InvestorController;
