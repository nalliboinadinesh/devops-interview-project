const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const { generateTokens, verifyRefreshToken } = require('../middleware/auth');
const { generateOTP, getOTPExpiry, sendOTPEmail, verifyOTP, clearOTP } = require('../config/otpUtils');
const logger = require('../config/logger');

// ALLOWED EMAIL FOR LOGIN
const ALLOWED_EMAIL = process.env.EMAIL_USER;

// Step 1: Send OTP to email
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email is allowed
    if (email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      return res.status(403).json({ message: 'You are not authorized to login. Only admin email is allowed.' });
    }

    // Find or create admin user
    let user = await AdminUser.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create admin user if doesn't exist
      user = new AdminUser({
        email: email.toLowerCase(),
        username: email.split('@')[0],
        password: 'temp-otp-password', // Temporary password
        firstName: 'Admin',
        lastName: 'User',
        role: 'Admin',
        managedBranches: ['All'],
        isActive: true
      });
      await user.save();
      logger.info(`New admin user created: ${email}`);
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account is inactive. Please contact administrator.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Save OTP to user
    user.otpCode = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    await sendOTPEmail(email, otp);

    logger.info(`OTP sent to ${email}`);

    res.json({
      message: 'OTP sent successfully to your email',
      email: email,
      expiresIn: '10 minutes'
    });
  } catch (error) {
    logger.error('Send OTP error:', error);
    res.status(500).json({ message: error.message || 'Failed to send OTP' });
  }
});

// Step 2: Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Verify email is allowed
    if (email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Find user
    const user = await AdminUser.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Verify OTP
    const otpVerification = verifyOTP(user.otpCode, user.otpExpiry, otp);

    if (!otpVerification.valid) {
      return res.status(401).json({ message: otpVerification.message });
    }

    // Clear OTP
    await clearOTP(user);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.username);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`Admin user logged in via OTP: ${email}`);

    res.json({
      message: 'Login successful',
      tokens: {
        accessToken,
        refreshToken
      },
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        managedBranches: user.managedBranches
      }
    });
  } catch (error) {
    logger.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Old login endpoint (kept for backward compatibility, but restricted to allowed email)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if email is allowed
    if (email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const user = await AdminUser.findOne({ email: email.toLowerCase(), isActive: true });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.username);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`Admin user logged in: ${email}`);

    res.json({
      message: 'Login successful',
      tokens: {
        accessToken,
        refreshToken
      },
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        managedBranches: user.managedBranches
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await AdminUser.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.username);

    res.json({
      message: 'Token refreshed',
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  try {
    logger.info('User logged out');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
