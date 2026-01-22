const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Tax = require('../models/Tax');

// @route   GET /api/tax
// @desc    Get all tax records for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const taxRecords = await Tax.find({ userId: req.userId }).sort({ financialYear: -1 });
    res.json({ success: true, data: taxRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/tax
// @desc    Create new tax record
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const taxRecord = new Tax({
      ...req.body,
      userId: req.userId
    });

    await taxRecord.save();
    res.status(201).json({ success: true, data: taxRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/tax/:id
// @desc    Update tax record
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const taxRecord = await Tax.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!taxRecord) {
      return res.status(404).json({ success: false, message: 'Tax record not found' });
    }

    res.json({ success: true, data: taxRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/tax/:id
// @desc    Delete tax record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const taxRecord = await Tax.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!taxRecord) {
      return res.status(404).json({ success: false, message: 'Tax record not found' });
    }

    res.json({ success: true, message: 'Tax record deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
