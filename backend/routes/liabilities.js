const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Liability = require('../models/Liability');

// @route   GET /api/liabilities
// @desc    Get all liabilities for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const liabilities = await Liability.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: liabilities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/liabilities
// @desc    Create new liability
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const liability = new Liability({
      ...req.body,
      userId: req.userId
    });

    await liability.save();
    res.status(201).json({ success: true, data: liability });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/liabilities/:id
// @desc    Update liability
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const liability = await Liability.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!liability) {
      return res.status(404).json({ success: false, message: 'Liability not found' });
    }

    res.json({ success: true, data: liability });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/liabilities/:id
// @desc    Delete liability
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const liability = await Liability.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!liability) {
      return res.status(404).json({ success: false, message: 'Liability not found' });
    }

    res.json({ success: true, message: 'Liability deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
