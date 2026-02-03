const jwt = require('jsonwebtoken');
const config = require('../config/constants');
const logger = require('../config/logger');

const authMiddleware = (req, res, next) => {
  try {
    // Try to get token from Authorization header first
    let token = req.headers.authorization?.split(' ')[1];
    
    // If not in header, try to get from cookies
    if (!token && req.cookies) {
      token = req.cookies.adminToken;
    }
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(401).json({ message: 'Invalid token' });
  }
};

const optionalAuthMiddleware = (req, res, next) => {
  try {
    // Try to get token from Authorization header first
    let token = req.headers.authorization?.split(' ')[1];
    
    // If not in header, try to get from cookies
    if (!token && req.cookies) {
      token = req.cookies.adminToken;
    }
    
    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = decoded;
    }
    next();
  } catch (error) {
    logger.warn('Optional auth failed:', error.message);
    next();
  }
};

const generateTokens = (userId, username) => {
  const accessToken = jwt.sign(
    { id: userId, username },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
  
  const refreshToken = jwt.sign(
    { id: userId, username },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRE }
  );
  
  return { accessToken, refreshToken };
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Authorization middleware - Check user role
 * @param {string} requiredRole - Role required (e.g., 'admin')
 */
const authorize = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        message: `Forbidden: Required role ${requiredRole}` 
      });
    }
    
    next();
  };
};

module.exports = {
  authMiddleware,
  authenticate: authMiddleware,
  optionalAuthMiddleware,
  generateTokens,
  verifyRefreshToken,
  authorize
};
