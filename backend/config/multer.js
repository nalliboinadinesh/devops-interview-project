const multer = require('multer');
const path = require('path');

// Configure multer for file upload handling
const storage = multer.memoryStorage(); // Store in memory before uploading to S3

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

const limits = {
  fileSize: 50 * 1024 * 1024 // 50MB max
};

// Upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

module.exports = {
  uploadSingle: upload.single('file'),
  uploadMultiple: upload.array('files', 10),
  uploadImage: upload.single('image')
};
