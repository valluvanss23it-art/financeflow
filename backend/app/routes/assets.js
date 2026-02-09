const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Asset = require('../models/Asset');
const useMySQL = process.env.USE_MYSQL === 'true';
const useDualStorage = process.env.USE_DUAL_STORAGE === 'true';

// @route   GET /api/assets
// @desc    Get all assets for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (useMySQL || useDualStorage) {
      const [rows] = await req.db.query('SELECT * FROM assets WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
      return res.json({ success: true, data: rows });
    }

    const assets = await Asset.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: assets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/assets
// @desc    Create new asset
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, current_value, purchase_value, purchase_date, notes } = req.body;

    if (useMySQL || useDualStorage) {
      const [result] = await req.db.execute(
        `INSERT INTO assets (user_id, name, type, current_value, purchase_value, purchase_date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.userId, name, type, current_value, purchase_value || null, purchase_date || null, notes || null]
      );

      if (useDualStorage) {
        try {
          const asset = new Asset({ ...req.body, userId: req.userId });
          await asset.save();
        } catch (mongoErr) {
          console.warn('MongoDB save failed');
        }
      }

      const [rows] = await req.db.query('SELECT * FROM assets WHERE id = ?', [result.insertId]);
      return res.status(201).json({ success: true, data: rows[0] });
    }

    const asset = new Asset({ ...req.body, userId: req.userId });
    await asset.save();
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/assets/:id
// @desc    Update asset
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    if (useMySQL || useDualStorage) {
      const { name, type, current_value, purchase_value, purchase_date, notes } = req.body;
      
      await req.db.execute(
        `UPDATE assets SET name = ?, type = ?, current_value = ?, purchase_value = ?, purchase_date = ?, notes = ?
         WHERE id = ? AND user_id = ?`,
        [name, type, current_value, purchase_value, purchase_date, notes, req.params.id, req.userId]
      );

      if (useDualStorage) {
        try {
          await Asset.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body);
        } catch (mongoErr) {
          console.warn('MongoDB update failed');
        }
      }

      const [rows] = await req.db.query('SELECT * FROM assets WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Asset not found' });
      }
      return res.json({ success: true, data: rows[0] });
    }

    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    res.json({ success: true, data: asset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/assets/:id
// @desc    Delete asset
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    if (useMySQL || useDualStorage) {
      const [result] = await req.db.execute('DELETE FROM assets WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
      
      if (useDualStorage) {
        try {
          await Asset.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        } catch (mongoErr) {
          console.warn('MongoDB delete failed');
        }
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Asset not found' });
      }
      return res.json({ success: true, message: 'Asset deleted' });
    }

    const asset = await Asset.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    res.json({ success: true, message: 'Asset deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
