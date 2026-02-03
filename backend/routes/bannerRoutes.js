const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { authMiddleware } = require('../middleware/auth');
const logger = require('../config/logger');
const { uploadSingle } = require('../config/multer');
const { uploadImageToS3, deleteFileFromS3 } = require('../config/s3');

// Get all banners for admin (including inactive) - MUST be before generic /
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const banners = await Banner.find().sort({ displayOrder: 1 });
    res.json({
      banners: banners,
      success: true
    });
  } catch (error) {
    logger.error('Error fetching admin banners:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all active banners (sorted by displayOrder)
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json({
      banners: banners,
      success: true
    });
  } catch (error) {
    logger.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create banner
router.post('/', authMiddleware, uploadSingle, async (req, res) => {
  try {
    const { title, displayOrder } = req.body;

    // Validation
    if (!title || !req.file) {
      return res.status(400).json({ 
        message: 'Title and image are required',
        fields: { title, hasFile: !!req.file }
      });
    }

    logger.info('Banner creation request:', {
      title,
      displayOrder: displayOrder || 0,
      fileInfo: req.file ? { name: req.file.originalname, size: req.file.size } : null
    });

    // Upload to S3
    let imageUrl;
    if (req.file) {
      imageUrl = await uploadImageToS3(req.file, `banners/${Date.now()}-${req.file.originalname}`);
      logger.info(`Banner image uploaded to S3: ${imageUrl}`);
    } else {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Create banner
    const banner = new Banner({
      title: title.trim(),
      imageUrl: imageUrl,
      displayOrder: parseInt(displayOrder) || 0,
      isActive: true
    });

    await banner.save();

    logger.info(`Banner created: ${banner.title}`, { bannerId: banner._id });
    res.status(201).json({
      message: 'Banner created successfully',
      banner: banner,
      success: true
    });
  } catch (error) {
    logger.error('Error creating banner:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create banner',
      success: false
    });
  }
});

// Update banner
router.put('/:id', authMiddleware, uploadSingle, async (req, res) => {
  try {
    const { title, displayOrder, isActive } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Update title
    if (title) {
      banner.title = title.trim();
    }

    // Update displayOrder
    if (displayOrder !== undefined) {
      banner.displayOrder = parseInt(displayOrder);
    }

    // Update isActive
    if (isActive !== undefined) {
      banner.isActive = isActive === 'true' || isActive === true;
    }

    // Update image if new one uploaded
    if (req.file) {
      // Delete old image from S3
      if (banner.imageUrl) {
        await deleteFileFromS3(banner.imageUrl);
      }

      // Upload new image
      const imageUrl = await uploadImageToS3(req.file, `banners/${Date.now()}-${req.file.originalname}`);
      banner.imageUrl = imageUrl;
      logger.info(`Banner image updated: ${imageUrl}`);
    }

    banner.updatedAt = new Date();
    await banner.save();

    logger.info(`Banner updated: ${banner.title}`, { bannerId: banner._id });
    res.json({
      message: 'Banner updated successfully',
      banner: banner,
      success: true
    });
  } catch (error) {
    logger.error('Error updating banner:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to update banner',
      success: false
    });
  }
});

// Delete banner
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Delete image from S3
    if (banner.imageUrl) {
      await deleteFileFromS3(banner.imageUrl);
    }

    logger.info(`Banner deleted: ${banner.title}`, { bannerId: banner._id });
    res.json({ 
      message: 'Banner deleted successfully',
      success: true
    });
  } catch (error) {
    logger.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
