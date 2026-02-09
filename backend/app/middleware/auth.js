const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { pool } = require('../config/mysql');

const useMySQL = process.env.USE_MYSQL === 'true';
const useDualStorage = process.env.USE_DUAL_STORAGE === 'true';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // MySQL first when enabled
    if (useMySQL || useDualStorage) {
      const db = req.db || pool;
      const [rows] = await db.query('SELECT id, email, full_name FROM users WHERE id = ?', [decoded.userId]);
      if (!rows || rows.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      req.user = rows[0];
      req.userId = rows[0].id;
      return next();
    }

    // MongoDB fallback
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = auth;
