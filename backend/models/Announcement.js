const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['General', 'Academic', 'Exam', 'Event', 'Holiday'],
    required: true,
    index: true
  },
  fileUrl: String,
  publishedBy: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiryDate: Date,
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

announcementSchema.index({ publishDate: -1 });
announcementSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);
