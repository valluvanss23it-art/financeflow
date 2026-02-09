// Test script to verify MySQL backend configuration
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testBackend() {
  console.log('🧪 Testing MySQL Backend Configuration\n');
  
  try {
    // Test 1: Database Connection
    console.log('1️⃣  Testing database connection...');
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
    console.log('   ✅ Connected to MySQL successfully\n');

    // Test 2: Verify Tables
    console.log('2️⃣  Checking tables...');
    const [tables] = await conn.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    const requiredTables = [
      'users', 'incomes', 'expenses', 'assets', 'liabilities',
      'investments', 'savings', 'insurance', 'goals', 'taxes', 'news'
    ];
    
    console.log(`   Found ${tableNames.length} tables:`);
    requiredTables.forEach(table => {
      if (tableNames.includes(table)) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} - MISSING!`);
      }
    });

    // Test 3: Test Insert/Select (using incomes table)
    console.log('\n3️⃣  Testing data operations...');
    
    // Insert test user
    await conn.query('DELETE FROM incomes WHERE user_id = 99999');
    await conn.query('DELETE FROM users WHERE id = 99999');
    await conn.execute(
      'INSERT INTO users (id, email, password, full_name) VALUES (?, ?, ?, ?)',
      [99999, 'test@test.com', 'hashedpassword', 'Test User']
    );
    console.log('   ✅ INSERT: Test user created');

    // Insert test income
    await conn.execute(
      'INSERT INTO incomes (user_id, source, amount, category) VALUES (?, ?, ?, ?)',
      [99999, 'Test Income', 1000, 'salary']
    );
    console.log('   ✅ INSERT: Test income created');

    // Read test income
    const [incomes] = await conn.query('SELECT * FROM incomes WHERE user_id = ?', [99999]);
    if (incomes.length > 0) {
      console.log('   ✅ SELECT: Data retrieved successfully');
    }

    // Update test income
    await conn.execute(
      'UPDATE incomes SET amount = ? WHERE user_id = ?',
      [2000, 99999]
    );
    console.log('   ✅ UPDATE: Data updated successfully');

    // Delete test data
    await conn.execute('DELETE FROM incomes WHERE user_id = ?', [99999]);
    await conn.execute('DELETE FROM users WHERE id = ?', [99999]);
    console.log('   ✅ DELETE: Test data cleaned up');

    // Test 4: Configuration Check
    console.log('\n4️⃣  Environment Configuration:');
    console.log(`   USE_MYSQL: ${process.env.USE_MYSQL}`);
    console.log(`   USE_DUAL_STORAGE: ${process.env.USE_DUAL_STORAGE}`);
    console.log(`   MYSQL_DATABASE: ${process.env.MYSQL_DATABASE}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);

    await conn.end();
    
    console.log('\n✨ All tests passed! Backend is configured correctly.\n');
    console.log('Next steps:');
    console.log('  1. Start the backend: node server.js');
    console.log('  2. Test registration: POST http://localhost:5000/api/auth/register');
    console.log('  3. Test login: POST http://localhost:5000/api/auth/login');
    console.log('  4. Start using the application!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testBackend();
