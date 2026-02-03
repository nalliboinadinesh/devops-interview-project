const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');
const { uploadSingle } = require('../config/multer');
const { uploadImageToS3, deleteFileFromS3 } = require('../config/s3');
const logger = require('../config/logger');

// Get student by PIN
router.get('/search', async (req, res) => {
  try {
    const { pin, branch, academicYear } = req.query;
    
    if (!pin) {
      return res.status(400).json({ message: 'PIN is required' });
    }
    
    let query = { pin };
    if (branch) query.branch = branch;
    if (academicYear) query.academicYear = academicYear;
    
    const student = await Student.findOne(query);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    logger.error('Error searching student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { branch, academicYear, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (branch) query.branch = branch;
    if (academicYear) query.academicYear = academicYear;
    
    const skip = (page - 1) * limit;
    const students = await Student.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Student.countDocuments(query);
    
    res.json({
      students,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by ID (admin only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    logger.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create student (admin only)
router.post('/', authMiddleware, uploadSingle, async (req, res) => {
  try {
    const studentData = { ...req.body };
    
    // Parse JSON fields if they come as non-empty strings
    if (typeof studentData.personalInfo === 'string' && studentData.personalInfo) {
      try { studentData.personalInfo = JSON.parse(studentData.personalInfo); } catch (e) { studentData.personalInfo = {}; }
    }
    if (typeof studentData.academicInfo === 'string' && studentData.academicInfo) {
      try { studentData.academicInfo = JSON.parse(studentData.academicInfo); } catch (e) { studentData.academicInfo = {}; }
    }
    if (typeof studentData.attendance === 'string' && studentData.attendance) {
      try { studentData.attendance = JSON.parse(studentData.attendance); } catch (e) { studentData.attendance = {}; }
    }
    if (studentData.feeStatus && typeof studentData.feeStatus === 'string' && studentData.feeStatus) {
      try { studentData.feeStatus = JSON.parse(studentData.feeStatus); } catch (e) { studentData.feeStatus = {}; }
    }
    
    // Upload profile picture if provided
    if (req.file) {
      try {
        // Always upload to profile/ folder in S3
        const keyPath = `profile/${Date.now()}-${req.file.originalname}`;
        const imageUrl = await uploadImageToS3(req.file, keyPath);
        if (!studentData.personalInfo) {
          studentData.personalInfo = {};
        }
        studentData.personalInfo.profilePictureUrl = imageUrl;
      } catch (error) {
        logger.error('Error uploading profile picture to S3:', error);
        return res.status(500).json({ message: 'Error uploading profile picture' });
      }
    }
    
    const newStudent = new Student(studentData);
    await newStudent.save();
    
    logger.info(`Student created: ${newStudent.pin}`);
    res.status(201).json(newStudent);
  } catch (error) {
    logger.error('Error creating student:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'PIN already exists' });
    }
    
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Update student (admin only)
router.put('/:id', authMiddleware, uploadSingle, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Parse JSON fields if they come as strings
    if (typeof updateData.personalInfo === 'string') {
      updateData.personalInfo = JSON.parse(updateData.personalInfo);
    }
    if (typeof updateData.academicInfo === 'string') {
      updateData.academicInfo = JSON.parse(updateData.academicInfo);
    }
    if (typeof updateData.attendance === 'string') {
      updateData.attendance = JSON.parse(updateData.attendance);
    }
    if (updateData.feeStatus && typeof updateData.feeStatus === 'string') {
      updateData.feeStatus = JSON.parse(updateData.feeStatus);
    }
    
    // Handle profile picture update
    if (req.file) {
      try {
        // Get current student to delete old image
        const currentStudent = await Student.findById(req.params.id);
        if (currentStudent?.personalInfo?.profilePictureUrl) {
          await deleteFileFromS3(currentStudent.personalInfo.profilePictureUrl);
        }
        
        // Upload new image
        const imageUrl = await uploadImageToS3(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        if (!updateData.personalInfo) {
          updateData.personalInfo = {};
        }
        updateData.personalInfo.profilePictureUrl = imageUrl;
      } catch (error) {
        logger.error('Error uploading profile picture to S3:', error);
        return res.status(500).json({ message: 'Error uploading profile picture' });
      }
    }
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    logger.info(`Student updated: ${student.pin}`);
    res.json(student);
  } catch (error) {
    logger.error('Error updating student:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Delete student (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    logger.info(`Student deleted: ${student.pin}`);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    logger.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
