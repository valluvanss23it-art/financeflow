const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const useMySQL = process.env.USE_MYSQL === 'true';
const useDualStorage = process.env.USE_DUAL_STORAGE === 'true';

// @route   GET /api/expenses
// @desc    Get all expenses for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (useMySQL || useDualStorage) {
      const [rows] = await req.db.query('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC', [req.userId]);
      return res.json({ success: true, data: rows });
    }

    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    res.json({ success: true, data: expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { category, amount, merchant, description, date, payment_method, is_recurring, recurring_frequency } = req.body;

    if (useMySQL || useDualStorage) {
      const [result] = await req.db.execute(
        `INSERT INTO expenses (user_id, category, amount, merchant, description, date, payment_method, is_recurring, recurring_frequency)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.userId, category, amount, merchant || null, description || null, date || new Date(), payment_method || null, is_recurring ? 1 : 0, recurring_frequency || null]
      );

      if (useDualStorage) {
        try {
          const expense = new Expense({ ...req.body, userId: req.userId });
          await expense.save();
        } catch (mongoErr) {
          console.warn('MongoDB save failed, but MySQL saved successfully');
        }
      }

      const [rows] = await req.db.query('SELECT * FROM expenses WHERE id = ?', [result.insertId]);
      return res.status(201).json({ success: true, data: rows[0] });
    }

    const expense = new Expense({ ...req.body, userId: req.userId });
    await expense.save();
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    if (useMySQL || useDualStorage) {
      const { category, amount, merchant, description, date, payment_method, is_recurring, recurring_frequency } = req.body;
      
      await req.db.execute(
        `UPDATE expenses SET category = ?, amount = ?, merchant = ?, description = ?, date = ?, 
         payment_method = ?, is_recurring = ?, recurring_frequency = ?
         WHERE id = ? AND user_id = ?`,
        [category, amount, merchant, description, date, payment_method, is_recurring ? 1 : 0, recurring_frequency, req.params.id, req.userId]
      );

      if (useDualStorage) {
        try {
          await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body);
        } catch (mongoErr) {
          console.warn('MongoDB update failed, but MySQL updated successfully');
        }
      }

      const [rows] = await req.db.query('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }
      return res.json({ success: true, data: rows[0] });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    if (useMySQL || useDualStorage) {
      const [result] = await req.db.execute('DELETE FROM expenses WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
      
      if (useDualStorage) {
        try {
          await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        } catch (mongoErr) {
          console.warn('MongoDB delete failed, but MySQL deleted successfully');
        }
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }
      return res.json({ success: true, message: 'Expense deleted' });
    }

    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
