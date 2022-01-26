const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  feedbackLevel: {
    type: String,
    enum: ['Priority', 'Normal'],
  },
  createdDate: {
    type: Date,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  feedbackType: {
    type: String,
    enum: ['floor', 'department', 'room'],
  },
  feedbackLocation: {
    type: Object,
    required: true,
  },
  approvedDate: {
    type: Date,
    required: false,
  },
  completedDate: {
    type: Date,
    required: false,
  },
  archivedDate: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model('Message', messageSchema);
