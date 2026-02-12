require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger');

// Import services and entity routes
const EntityService = require('./services/entityService');
const createEntityRoutes = require('./routes/entityRoutes');

// Import models
const Student = require('./models/Student');
const Branch = require('./models/Branch');
const Material = require('./models/Material');
const QuestionPaper = require('./models/QuestionPaper');
const Announcement = require('./models/Announcement');
const CarouselImage = require('./models/CarouselImage');
const Banner = require('./models/Banner');

const app = express();

const constants = require('./config/constants');

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = constants.CORS_ORIGIN
      ? constants.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:3000', 'http://localhost:3001'];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin) || constants.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Database Connection
mongoose.connect(constants.MONGODB_URI)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Initialize entity services
const studentService = new EntityService(Student, 'Student');
const branchService = new EntityService(Branch, 'Branch');
const materialService = new EntityService(Material, 'Material');
const questionPaperService = new EntityService(QuestionPaper, 'QuestionPaper');
const announcementService = new EntityService(Announcement, 'Announcement');
const carouselService = new EntityService(CarouselImage, 'CarouselImage');

// Legacy auth routes (kept for compatibility)
app.use('/api/auth', require('./routes/authRoutes'));

// Unified entity routes
app.use('/api/entities/student', createEntityRoutes(studentService, 'Student', { readRequiresAuth: false }));
app.use('/api/entities/branch', createEntityRoutes(branchService, 'Branch', { readRequiresAuth: false }));
app.use('/api/entities/material', createEntityRoutes(materialService, 'Material', { readRequiresAuth: false }));
app.use('/api/entities/question-paper', createEntityRoutes(questionPaperService, 'QuestionPaper', { readRequiresAuth: false }));
app.use('/api/entities/announcement', createEntityRoutes(announcementService, 'Announcement', { readRequiresAuth: false }));
app.use('/api/entities/carousel', createEntityRoutes(carouselService, 'CarouselImage', { readRequiresAuth: false }));

// Legacy routes (kept for backwards compatibility)
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/branches', require('./routes/branchRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/question-papers', require('./routes/questionPaperRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/carousel', require('./routes/carouselRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  
  if (err.validation) {
    return res.status(400).json({ message: err.message, details: err.details });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }
  
  if (err.name === 'MongoError') {
    return res.status(500).json({ message: 'Database error' });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;
