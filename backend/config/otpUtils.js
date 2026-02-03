const nodemailer = require('nodemailer');
const logger = require('./logger');

// Initialize email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calculate OTP expiry time (10 minutes from now)
 */
const getOTPExpiry = () => {
  const now = new Date();
  return new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
};

/**
 * Send OTP to email
 */
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'crreddy2326cse@gmail.com',
      to: email,
      subject: 'Your OTP for College SIS Login',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Polytechnic College - Student Information System</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
          <p style="color: #666;">This OTP is valid for 10 minutes only.</p>
          <p style="color: #666;">If you didn't request this OTP, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">CRR Reddy Polytechnic College</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    logger.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP. Please try again.');
  }
};

/**
 * Verify OTP
 */
const verifyOTP = (storedOTP, storedExpiry, providedOTP) => {
  if (!storedOTP || !storedExpiry) {
    return { valid: false, message: 'No OTP found. Please request a new one.' };
  }

  if (new Date() > storedExpiry) {
    return { valid: false, message: 'OTP has expired. Please request a new one.' };
  }

  if (storedOTP !== providedOTP) {
    return { valid: false, message: 'Invalid OTP. Please try again.' };
  }

  return { valid: true, message: 'OTP verified successfully' };
};

/**
 * Clear OTP from user record
 */
const clearOTP = async (user) => {
  user.otpCode = null;
  user.otpExpiry = null;
  await user.save();
};

module.exports = {
  generateOTP,
  getOTPExpiry,
  sendOTPEmail,
  verifyOTP,
  clearOTP
};
