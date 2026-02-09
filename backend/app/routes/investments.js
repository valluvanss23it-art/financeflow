const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Investment = require('../models/Investment');

// @route   GET /api/investments
// @desc    Get all investments for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Check if using MySQL
    if (req.pool || req.db) {
      const connection = req.pool || req.db;
      const [investments] = await connection.query(
        'SELECT * FROM investments WHERE user_id = ? ORDER BY created_at DESC',
        [req.userId]
      );
      return res.json({ success: true, data: investments });
    }
    
    // MongoDB fallback
    const investments = await Investment.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: investments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/investments
// @desc    Create new investment
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, amount, currentValue, purchaseDate, quantity, purchasePrice, returns, notes } = req.body;
    
    // Check if using MySQL
    if (req.pool || req.db) {
      const connection = req.pool || req.db;
      const [result] = await connection.query(
        `INSERT INTO investments (user_id, name, type, amount, current_value, purchase_date, quantity, purchase_price, expected_return, notes, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [req.userId, name, type, amount, currentValue, purchaseDate || null, quantity || null, purchasePrice || null, returns || null, notes || null]
      );
      
      const [newInvestment] = await connection.query(
        'SELECT * FROM investments WHERE id = ?',
        [result.insertId]
      );
      
      return res.status(201).json({ success: true, data: newInvestment[0] });
    }
    
    // MongoDB fallback
    const investment = new Investment({
      ...req.body,
      userId: req.userId
    });

    await investment.save();
    res.status(201).json({ success: true, data: investment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/investments/:id
// @desc    Update investment
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, amount, currentValue, purchaseDate, quantity, purchasePrice, returns, notes } = req.body;
    
    // Check if using MySQL
    if (req.pool || req.db) {
      const connection = req.pool || req.db;
      await connection.query(
        `UPDATE investments SET 
         name = COALESCE(?, name),
         type = COALESCE(?, type),
         amount = COALESCE(?, amount),
         current_value = COALESCE(?, current_value),
         purchase_date = COALESCE(?, purchase_date),
         quantity = COALESCE(?, quantity),
         purchase_price = COALESCE(?, purchase_price),
         expected_return = COALESCE(?, expected_return),
         notes = COALESCE(?, notes)
         WHERE id = ? AND user_id = ?`,
        [name, type, amount, currentValue, purchaseDate, quantity, purchasePrice, returns, notes, req.params.id, req.userId]
      );
      
      const [updatedInvestment] = await connection.query(
        'SELECT * FROM investments WHERE id = ? AND user_id = ?',
        [req.params.id, req.userId]
      );
      
      if (updatedInvestment.length === 0) {
        return res.status(404).json({ success: false, message: 'Investment not found' });
      }
      
      return res.json({ success: true, data: updatedInvestment[0] });
    }
    
    // MongoDB fallback
    const investment = await Investment.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }

    res.json({ success: true, data: investment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/investments/:id
// @desc    Delete investment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if using MySQL
    if (req.pool || req.db) {
      const connection = req.pool || req.db;
      const [result] = await connection.query(
        'DELETE FROM investments WHERE id = ? AND user_id = ?',
        [req.params.id, req.userId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Investment not found' });
      }
      
      return res.json({ success: true, message: 'Investment deleted' });
    }
    
    // MongoDB fallback
    const investment = await Investment.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }

    res.json({ success: true, message: 'Investment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
