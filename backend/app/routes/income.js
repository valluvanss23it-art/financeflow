const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Income = require('../models/Income');
const useMySQL = process.env.USE_MYSQL === 'true';
const useDualStorage = process.env.USE_DUAL_STORAGE === 'true';

// @route   GET /api/income
// @desc    Get all income records for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Use MongoDB for reading when dual storage is enabled (more reliable)
    if (useDualStorage) {
      const incomes = await Income.find({ userId: req.userId }).sort({ date: -1 });
      return res.json({ success: true, data: incomes });
    }

    if (useMySQL) {
      const [rows] = await req.db.query('SELECT * FROM incomes WHERE user_id = ? ORDER BY date DESC', [req.userId]);
      return res.json({ success: true, data: rows });
    }

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
    // Dual storage: Save to both MongoDB and MySQL
    if (useDualStorage && useMySQL) {
      const {
        source, amount, date, category, description, is_recurring, recurring_frequency
      } = req.body;

      // Save to MongoDB first
      const income = new Income({
        ...req.body,
        userId: req.userId
      });
      await income.save();

      // Also save to MySQL
      try {
        await req.db.execute(
          `INSERT INTO incomes (user_id, source, amount, date, category, description, is_recurring, recurring_frequency)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [req.userId, source, amount, date || new Date(), category || 'salary', description || null, is_recurring ? 1 : 0, recurring_frequency || null]
        );
        console.log('Income saved to both MongoDB and MySQL');
      } catch (mysqlErr) {
        console.warn('MySQL save failed, but MongoDB saved successfully:', mysqlErr.message);
      }

      return res.status(201).json({ success: true, data: income });
    }

    if (useMySQL) {
      const {
        source, amount, date, category, description, is_recurring, recurring_frequency
      } = req.body;

      const [result] = await req.db.execute(
        `INSERT INTO incomes (user_id, source, amount, date, category, description, is_recurring, recurring_frequency)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.userId, source, amount, date || new Date(), category || 'salary', description || null, is_recurring ? 1 : 0, recurring_frequency || null]
      );

      const [rows] = await req.db.query('SELECT * FROM incomes WHERE id = ?', [result.insertId]);
      return res.status(201).json({ success: true, data: rows[0] });
    }

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
    // Dual storage: Update both MongoDB and MySQL
    if (useDualStorage && useMySQL) {
      // Update MongoDB
      const income = await Income.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true, runValidators: true }
      );

      if (!income) {
        return res.status(404).json({ success: false, message: 'Income record not found' });
      }

      // Also update MySQL
      try {
        const fields = [];
        const values = [];
        for (const [k, v] of Object.entries(req.body)) {
          fields.push(`${k} = ?`);
          values.push(v);
        }
        if (fields.length > 0) {
          values.push(req.params.id, req.userId);
          const sql = `UPDATE incomes SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
          await req.db.execute(sql, values);
        }
      } catch (mysqlErr) {
        console.warn('MySQL update failed, but MongoDB updated successfully:', mysqlErr.message);
      }

      return res.json({ success: true, data: income });
    }

    if (useMySQL) {
      const fields = [];
      const values = [];
      for (const [k, v] of Object.entries(req.body)) {
        fields.push(`${k} = ?`);
        values.push(v);
      }
      if (fields.length === 0) return res.json({ success: true, data: null });

      values.push(req.params.id, req.userId);
      const sql = `UPDATE incomes SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
      const [result] = await req.db.execute(sql, values);
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Income record not found' });
      const [rows] = await req.db.query('SELECT * FROM incomes WHERE id = ?', [req.params.id]);
      return res.json({ success: true, data: rows[0] });
    }

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
    // Dual storage: Delete from both MongoDB and MySQL
    if (useDualStorage && useMySQL) {
      // Delete from MongoDB
      const income = await Income.findOneAndDelete({ _id: req.params.id, userId: req.userId });

      if (!income) {
        return res.status(404).json({ success: false, message: 'Income record not found' });
      }

      // Also delete from MySQL
      try {
        await req.db.execute('DELETE FROM incomes WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
      } catch (mysqlErr) {
        console.warn('MySQL delete failed, but MongoDB deleted successfully:', mysqlErr.message);
      }

      return res.json({ success: true, message: 'Income record deleted' });
    }

    if (useMySQL) {
      const [result] = await req.db.execute('DELETE FROM incomes WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Income record not found' });
      return res.json({ success: true, message: 'Income record deleted' });
    }

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
