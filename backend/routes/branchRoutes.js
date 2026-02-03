const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const { authMiddleware } = require('../middleware/auth');
const logger = require('../config/logger');

// Get all branches
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find().lean();
    res.json(branches);
  } catch (error) {
    logger.error('Error fetching branches:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get branch by name
router.get('/search/:name', async (req, res) => {
  try {
    const branch = await Branch.findOne({ 
      $or: [
        { name: req.params.name },
        { code: req.params.name }
      ]
    }).lean();
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    res.json(branch);
  } catch (error) {
    logger.error('Error fetching branch by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get branch by ID
router.get('/:id', async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    res.json(branch);
  } catch (error) {
    logger.error('Error fetching branch:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create branch (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newBranch = new Branch(req.body);
    await newBranch.save();
    
    logger.info(`Branch created: ${newBranch.code}`);
    res.status(201).json(newBranch);
  } catch (error) {
    logger.error('Error creating branch:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Branch code already exists' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Update branch (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    logger.info(`Branch updated: ${branch.code}`);
    res.json(branch);
  } catch (error) {
    logger.error('Error updating branch:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Delete branch (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    logger.info(`Branch deleted: ${branch.code}`);
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    logger.error('Error deleting branch:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
