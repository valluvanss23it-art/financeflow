const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Income = require('../models/Income');
const Expense = require('../models/Expense');

// @route   POST /api/transactions
// @desc    Add a new transaction (income or expense)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, category, description, date, source, merchant, payment_method, is_recurring, recurring_frequency } = req.body;

    // Validate type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be either "income" or "expense"' });
    }

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount is required and must be greater than 0' });
    }

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    let result;

    // MongoDB mode - save transaction
    if (type === 'income') {
      const income = new Income({
        userId: req.userId,
        source: source || 'Other',
        amount,
        date: date || new Date(),
        category,
        description,
        is_recurring,
        recurring_frequency
      });
      await income.save();
      result = { ...income.toObject(), type: 'income' };
    } else {
      const expense = new Expense({
        userId: req.userId,
        category,
        amount,
        merchant,
        description,
        date: date || new Date(),
        payment_method,
        is_recurring,
        recurring_frequency
      });
      await expense.save();
      result = { ...expense.toObject(), type: 'expense' };
    }

    res.status(201).json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} transaction added successfully`,
      data: result
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/transactions
// @desc    Get all transactions (income + expenses) for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let transactions = [];

    // Get all income records from MongoDB
    const incomes = await Income.find({ userId: req.userId }).lean();
    const expenses = await Expense.find({ userId: req.userId }).lean();

    const incomeTransactions = incomes.map(income => ({ ...income, type: 'income' }));
    const expenseTransactions = expenses.map(expense => ({ ...expense, type: 'expense' }));

    transactions = [...incomeTransactions, ...expenseTransactions].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/transactions/summary
// @desc    Get summary of total income and expenses
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    let totalIncome = 0;
    let totalExpense = 0;

    // Get data from MongoDB
    const incomes = await Income.find({ userId: req.userId });
    const expenses = await Expense.find({ userId: req.userId });

    totalIncome = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
    totalExpense = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        currency: 'USD'
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
