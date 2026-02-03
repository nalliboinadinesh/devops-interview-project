const express = require('express');
const router = express.Router();
const CarouselImage = require('../models/CarouselImage');
const { authMiddleware } = require('../middleware/auth');
const logger = require('../config/logger');
const { uploadImage } = require('../config/multer');
const { uploadImageToS3, deleteFileFromS3 } = require('../config/s3');

// Get carousel images (public)
router.get('/', async (req, res) => {
  try {
    const images = await CarouselImage.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .lean();
    
    res.json(images);
  } catch (error) {
    logger.error('Error fetching carousel images:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create carousel image (admin only)
router.post('/', authMiddleware, uploadImage, async (req, res) => {
  try {
    const imageData = { ...req.body };

    // If image is uploaded, upload to S3
    if (req.file) {
      try {
        const imageUrl = await uploadImageToS3(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        imageData.imageUrl = imageUrl;
      } catch (error) {
        logger.error('Error uploading image to S3:', error);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    }

    const newImage = new CarouselImage(imageData);
    await newImage.save();
    
    logger.info(`Carousel image created: ${newImage.title}`);
    res.status(201).json(newImage);
  } catch (error) {
    logger.error('Error creating carousel image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update carousel image (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const image = await CarouselImage.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    logger.info(`Carousel image updated: ${image.title}`);
    res.json(image);
  } catch (error) {
    logger.error('Error updating carousel image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete carousel image (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const image = await CarouselImage.findByIdAndDelete(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    logger.info(`Carousel image deleted: ${image.title}`);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    logger.error('Error deleting carousel image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
