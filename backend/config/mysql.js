const mysql = require('mysql2/promise');
require('dotenv').config();

// Support both local MySQL and AWS RDS
const isAWSRDS = process.env.USE_AWS_RDS === 'true';

const poolConfig = {
  host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : (process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306),
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASS || process.env.MYSQL_PASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'financial_compass',
  waitForConnections: true,
  connectionLimit: isAWSRDS ? 20 : 10, // Higher limit for cloud
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Add SSL configuration for AWS RDS if enabled
if (isAWSRDS) {
  poolConfig.ssl = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  };
  console.log('Using AWS RDS configuration with SSL');
} else {
  console.log('Using local MySQL configuration');
}

const pool = mysql.createPool(poolConfig);

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log(`MySQL connection successful to: ${poolConfig.host}:${poolConfig.port}/${poolConfig.database}`);
    conn.release();
  } catch (err) {
    console.error('MySQL connection error:', err.message || err);
    throw err;
  }
}

// Export both pool and direct connection function (AWS Lambda style)
async function getConnection() {
  return await mysql.createConnection({
    host: poolConfig.host,
    port: poolConfig.port,
    user: poolConfig.user,
    password: poolConfig.password,
    database: poolConfig.database,
    ssl: poolConfig.ssl
  });
}

module.exports = { pool, testConnection, getConnection };
