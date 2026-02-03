const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    enum: ['CSE', 'ECE', 'Civil', 'Mech', 'EEE', 'AIML', 'CCN'],
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  hod: {
    type: String,
    default: ''
  },
  regulations: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);
