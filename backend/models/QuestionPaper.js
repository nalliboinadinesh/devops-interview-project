const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
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
    required: true
  },
  examType: {
    type: String,
    enum: ['Mid', 'Final', 'Supplementary'],
    required: true
  },
  academicYear: {
    type: String,
    required: true,
    index: true
  },
  regulation: {
    type: String,
    required: true,
    index: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
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

questionPaperSchema.index({ branch: 1, semester: 1, academicYear: 1 });
questionPaperSchema.index({ regulation: 1 });

module.exports = mongoose.model('QuestionPaper', questionPaperSchema);
