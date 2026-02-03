const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const { authMiddleware } = require('../middleware/auth');
const logger = require('../config/logger');
const { uploadSingle } = require('../config/multer');
const { uploadFileToS3, deleteFileFromS3 } = require('../config/s3');

// Get materials with filters
router.get('/', async (req, res) => {
  try {
    const { branch, semester, subject, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (branch) query.branch = branch;
    if (semester) query.semester = parseInt(semester);
    if (subject) query.subject = new RegExp(subject, 'i');
    
    const skip = (page - 1) * limit;
    const materials = await Material.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();
    
    const total = await Material.countDocuments(query);
    
    res.json({
      materials,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching materials:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get material by ID
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Increment download count
    await Material.updateOne({ _id: material._id }, { $inc: { downloadCount: 1 } });
    
    res.json(material);
  } catch (error) {
    logger.error('Error fetching material:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create material (admin only)
router.post('/', authMiddleware, uploadSingle, async (req, res) => {
  try {
    // Log incoming request data
    logger.info('Material creation request:', { 
      hasFile: !!req.file,
      body: req.body,
      fileInfo: req.file ? { name: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size } : null
    });

    const materialData = { ...req.body };
    materialData.uploadedBy = req.user?.id || 'System';
    
    // Convert semester to number (FormData sends as string)
    if (materialData.semester) {
      materialData.semester = parseInt(materialData.semester, 10);
    }
    
    // Parse tags if it's a string
    if (materialData.tags && typeof materialData.tags === 'string') {
      materialData.tags = materialData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    // If file is uploaded, upload to S3
    if (req.file) {
      try {
        const fileUrl = await uploadFileToS3(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        materialData.fileUrl = fileUrl;
        materialData.fileSize = req.file.size;
      } catch (error) {
        logger.error('Error uploading file to S3:', error);
        return res.status(500).json({ message: 'Error uploading file to S3: ' + error.message });
      }
    } else {
      logger.warn('No file provided in material creation request');
      return res.status(400).json({ message: 'File is required' });
    }

    const newMaterial = new Material(materialData);
    await newMaterial.save();
    
    logger.info(`Material created: ${newMaterial.title}`);
    res.status(201).json(newMaterial);
  } catch (error) {
    logger.error('Error creating material:', error);
    res.status(500).json({ message: error.message || 'Server error', details: error.errors || {} });
  }
});

// Update material (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    logger.info(`Material updated: ${material.title}`);
    res.json(material);
  } catch (error) {
    logger.error('Error updating material:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete material (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Delete file from S3 if it exists
    if (material.fileUrl) {
      await deleteFileFromS3(material.fileUrl);
    }
    
    logger.info(`Material deleted: ${material.title}`);
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    logger.error('Error deleting material:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
