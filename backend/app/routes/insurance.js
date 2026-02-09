const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Insurance = require('../models/Insurance');

// @route   GET /api/insurance
// @desc    Get all insurance policies for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const insurance = await Insurance.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: insurance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/insurance
// @desc    Create new insurance policy
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const insurance = new Insurance({
      ...req.body,
      userId: req.userId
    });

    await insurance.save();
    res.status(201).json({ success: true, data: insurance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/insurance/:id
// @desc    Update insurance policy
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const insurance = await Insurance.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!insurance) {
      return res.status(404).json({ success: false, message: 'Insurance policy not found' });
    }

    res.json({ success: true, data: insurance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/insurance/:id
// @desc    Delete insurance policy
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const insurance = await Insurance.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!insurance) {
      return res.status(404).json({ success: false, message: 'Insurance policy not found' });
    }

    res.json({ success: true, message: 'Insurance policy deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
