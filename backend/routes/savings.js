const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Savings = require('../models/Savings');

// @route   GET /api/savings
// @desc    Get all savings accounts for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const savings = await Savings.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: savings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/savings
// @desc    Create new savings account
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const savings = new Savings({
      ...req.body,
      userId: req.userId
    });

    await savings.save();
    res.status(201).json({ success: true, data: savings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/savings/:id
// @desc    Update savings account
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const savings = await Savings.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!savings) {
      return res.status(404).json({ success: false, message: 'Savings account not found' });
    }

    res.json({ success: true, data: savings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/savings/:id
// @desc    Delete savings account
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const savings = await Savings.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!savings) {
      return res.status(404).json({ success: false, message: 'Savings account not found' });
    }

    res.json({ success: true, message: 'Savings account deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
