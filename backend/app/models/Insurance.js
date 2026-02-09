const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  policy_number: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  coverage_amount: {
    type: Number,
    required: true
  },
  premium_amount: {
    type: Number,
    required: true
  },
  premium_frequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'half-yearly', 'yearly'],
    required: true
  },
  start_date: Date,
  end_date: Date,
  next_premium_date: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Insurance', insuranceSchema);
