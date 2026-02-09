const mongoose = require('mongoose');

const liabilitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  principal_amount: {
    type: Number,
    required: true
  },
  outstanding_balance: {
    type: Number,
    required: true
  },
  interest_rate: {
    type: Number,
    required: true
  },
  tenure_months: {
    type: Number,
    required: false
  },
  emi_amount: Number,
  start_date: Date,
  next_emi_date: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Liability', liabilitySchema);
