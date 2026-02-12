require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';

function requireIfProd(key) {
  if (NODE_ENV === 'production' && !process.env[key]) {
    throw new Error(`${key} is required in production`);
  }
  return process.env[key];
}

module.exports = {
  NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/polytechnic-sis',

  // JWT secrets must be provided via env in production
  JWT_SECRET: requireIfProd('JWT_SECRET') || process.env.JWT_SECRET || 'dev-jwt-secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '2d',
  JWT_REFRESH_SECRET: requireIfProd('JWT_REFRESH_SECRET') || process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',

  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 50 * 1024 * 1024, // 50MB

  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_PDF_TYPES: ['application/pdf'],

  // CORS origin can be a comma-separated list. In production it's recommended to set explicit origins.
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001',
};
