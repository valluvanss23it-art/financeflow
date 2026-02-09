// Database Configuration
// Reads from environment variables for security
module.exports = Object.freeze({
  DB_HOST: process.env.DB_HOST || 'database-1.c3k0g0ii6s8a.ap-south-2.rds.amazonaws.com',
  DB_USER: process.env.DB_USER || 'admin',
  DB_PWD: process.env.DB_PWD || 'Black_17_x',
  DB_DATABASE: process.env.DB_DATABASE || 'webapp',
  DB_PORT: process.env.DB_PORT || 3306,
});
