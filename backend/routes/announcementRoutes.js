const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { authMiddleware } = require('../middleware/auth');
const { uploadSingle } = require('../config/multer');
const { uploadFileToS3, deleteFileFromS3 } = require('../config/s3');
const logger = require('../config/logger');

// Get announcements (public)
router.get('/', async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    if (type) query.type = type;
    
    const skip = (page - 1) * limit;
    const announcements = await Announcement.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ publishDate: -1 })
      .lean();
    
    const total = await Announcement.countDocuments(query);
    
    res.json({
      announcements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Increment view count
    await Announcement.updateOne({ _id: announcement._id }, { $inc: { viewCount: 1 } });
    
    res.json(announcement);
  } catch (error) {
    logger.error('Error fetching announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create announcement (admin only)
router.post('/', authMiddleware, uploadSingle, async (req, res) => {
  try {
    const announcementData = {
      title: req.body.title,
      content: req.body.content,
      type: req.body.type,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      publishedBy: req.user?.id || 'System'
    };

    // Upload file to S3 if provided
    if (req.file) {
      try {
        const fileUrl = await uploadFileToS3(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        announcementData.fileUrl = fileUrl;
      } catch (error) {
        logger.error('Error uploading file to S3:', error);
        return res.status(500).json({ message: 'Error uploading file' });
      }
    }

    const newAnnouncement = new Announcement(announcementData);
    await newAnnouncement.save();
    
    logger.info(`Announcement created: ${newAnnouncement.title}`);
    res.status(201).json(newAnnouncement);
  } catch (error) {
    logger.error('Error creating announcement:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Update announcement (admin only)
router.put('/:id', authMiddleware, uploadSingle, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const updateData = {
      title: req.body.title,
      content: req.body.content,
      type: req.body.type,
      isActive: req.body.isActive === 'true' || req.body.isActive === true
    };

    // Handle file update
    if (req.file) {
      // Delete old file if exists
      if (announcement.fileUrl) {
        await deleteFileFromS3(announcement.fileUrl);
      }
      const fileUrl = await uploadFileToS3(req.file);
      updateData.fileUrl = fileUrl;
    }

    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    logger.info(`Announcement updated: ${updated.title}`);
    res.json(updated);
  } catch (error) {
    logger.error('Error updating announcement:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Delete announcement (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Delete file from S3 if exists
    if (announcement.fileUrl) {
      await deleteFileFromS3(announcement.fileUrl);
    }
    
    logger.info(`Announcement deleted: ${announcement.title}`);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    logger.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
