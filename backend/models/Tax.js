const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  financialYear: {
    type: String,
    required: true
  },
  totalIncome: {
    type: Number,
    required: true
  },
  deductions: {
    type: Number,
    default: 0
  },
  taxableIncome: {
    type: Number,
    required: true
  },
  taxPaid: {
    type: Number,
    default: 0
  },
  taxLiability: {
    type: Number,
    required: true
  },
  regime: {
    type: String,
    enum: ['old', 'new'],
    default: 'new'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tax', taxSchema);
