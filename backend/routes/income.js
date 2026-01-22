const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Income = require('../models/Income');

// @route   GET /api/income
// @desc    Get all income records for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.userId }).sort({ date: -1 });
    res.json({ success: true, data: incomes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/income
// @desc    Create new income record
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const income = new Income({
      ...req.body,
      userId: req.userId
    });

    await income.save();
    res.status(201).json({ success: true, data: income });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/income/:id
// @desc    Update income record
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!income) {
      return res.status(404).json({ success: false, message: 'Income record not found' });
    }

    res.json({ success: true, data: income });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/income/:id
// @desc    Delete income record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!income) {
      return res.status(404).json({ success: false, message: 'Income record not found' });
    }

    res.json({ success: true, message: 'Income record deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
