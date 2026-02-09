const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  target_amount: {
    type: Number,
    required: true
  },
  current_amount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: false
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  notes: String,
  recurring_amount: {
    type: Number,
    default: 0
  },
  recurring_frequency: {
    type: String,
    enum: ['none', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'],
    default: 'none'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Goal', goalSchema);
