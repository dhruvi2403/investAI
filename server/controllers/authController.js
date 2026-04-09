import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

export class AuthController {
  // POST /api/auth/register
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
      });

      await user.save();

      const token = generateToken(user._id, user.email);

      return res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/auth/login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user._id, user.email);

      return res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          riskProfile: user.riskProfile,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/auth/profile
  static async getProfile(req, res) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await User.findById(userId).select('-password').lean();

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/auth/profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user?.userId;
      const { age, income, savingsPattern, investmentHorizon, riskTolerance, preferredAssets } =
        req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const updateData = {};

      if (age) updateData.age = age;
      if (income) updateData.income = income;
      if (savingsPattern) updateData.savingsPattern = savingsPattern;
      if (investmentHorizon) updateData.investmentHorizon = investmentHorizon;
      if (riskTolerance) updateData.riskTolerance = riskTolerance;
      if (preferredAssets) updateData.preferredAssets = preferredAssets;

      const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select(
        '-password'
      );

      return res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AuthController;
