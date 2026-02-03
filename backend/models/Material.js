const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  branch: {
    type: String,
    required: true,
    index: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  subject: {
    type: String,
    required: true,
    index: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['PDF', 'DOC', 'PPT'],
    required: true
  },
  fileSize: Number,
  uploadedBy: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

materialSchema.index({ branch: 1, semester: 1 });
materialSchema.index({ subject: 1 });
materialSchema.index({ tags: 1 });

module.exports = mongoose.model('Material', materialSchema);
