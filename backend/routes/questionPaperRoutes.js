const express = require('express');
const router = express.Router();
const QuestionPaper = require('../models/QuestionPaper');
const { authMiddleware } = require('../middleware/auth');
const logger = require('../config/logger');
const { uploadSingle } = require('../config/multer');
const { uploadFileToS3, deleteFileFromS3 } = require('../config/s3');

// Get question papers with filters
router.get('/', async (req, res) => {
  try {
    const { branch, semester, academicYear, regulation, examType, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (branch) query.branch = branch;
    if (semester) query.semester = parseInt(semester);
    if (academicYear) query.academicYear = academicYear;
    if (regulation) query.regulation = regulation;
    if (examType) query.examType = examType;
    
    const skip = (page - 1) * limit;
    const papers = await QuestionPaper.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();
    
    const total = await QuestionPaper.countDocuments(query);
    
    res.json({
      papers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching question papers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get question paper by ID
router.get('/:id', async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);
    
    if (!paper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    
    // Increment download count
    await QuestionPaper.updateOne({ _id: paper._id }, { $inc: { downloadCount: 1 } });
    
    res.json(paper);
  } catch (error) {
    logger.error('Error fetching question paper:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create question paper (admin only)
router.post('/', authMiddleware, uploadSingle, async (req, res) => {
  try {
    // Log incoming request data
    logger.info('Question paper creation request:', { 
      hasFile: !!req.file,
      body: req.body,
      fileInfo: req.file ? { name: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size } : null
    });

    const paperData = { ...req.body };
    paperData.uploadedBy = req.user?.id || 'System';
    
    // Convert semester to number (FormData sends as string)
    if (paperData.semester) {
      paperData.semester = parseInt(paperData.semester, 10);
    }

    // If file is uploaded, upload to S3
    if (req.file) {
      try {
        const fileUrl = await uploadFileToS3(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        paperData.fileUrl = fileUrl;
        paperData.fileSize = req.file.size;
      } catch (error) {
        logger.error('Error uploading file to S3:', error);
        return res.status(500).json({ message: 'Error uploading file to S3: ' + error.message });
      }
    } else {
      logger.warn('No file provided in question paper creation request');
      return res.status(400).json({ message: 'Question paper file is required' });
    }

    const newPaper = new QuestionPaper(paperData);
    await newPaper.save();
    
    logger.info(`Question paper created: ${newPaper.title}`);
    res.status(201).json(newPaper);
  } catch (error) {
    logger.error('Error creating question paper:', error);
    res.status(500).json({ message: error.message || 'Server error', details: error.errors || {} });
  }
});

// Update question paper (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const paper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!paper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    
    logger.info(`Question paper updated: ${paper.title}`);
    res.json(paper);
  } catch (error) {
    logger.error('Error updating question paper:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete question paper (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const paper = await QuestionPaper.findByIdAndDelete(req.params.id);
    
    if (!paper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }

    // Delete file from S3 if it exists
    if (paper.fileUrl) {
      await deleteFileFromS3(paper.fileUrl);
    }
    
    logger.info(`Question paper deleted: ${paper.title}`);
    res.json({ message: 'Question paper deleted successfully' });
  } catch (error) {
    logger.error('Error deleting question paper:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
