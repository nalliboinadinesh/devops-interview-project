const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  pin: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  branch: {
    type: String,
    required: true,
    index: true
  },
  academicYear: {
    type: String,
    required: true,
    index: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    profilePictureUrl: {
      type: String,
      default: null
    }
  },
  academicInfo: {
    regulation: String,
    currentSemester: {
      type: Number,
      min: 1,
      max: 8
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },
    semesterMarks: [{
      semester: Number,
      gpa: Number,
      marks: [{
        subject: String,
        marks: Number,
        grade: String
      }]
    }]
  },
  attendance: {
    overallAttendance: {
      type: Number,
      min: 0,
      max: 100
    },
    semesterAttendance: [{
      semester: Number,
      percentage: Number,
      classes: {
        attended: Number,
        total: Number
      }
    }]
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

// Create indexes
studentSchema.index({ pin: 1 });
studentSchema.index({ branch: 1, academicYear: 1 });
studentSchema.index({ 'personalInfo.email': 1 });

module.exports = mongoose.model('Student', studentSchema);
