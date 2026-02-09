# MySQL Backend Setup Guide

## Database Configuration

The backend has been configured to work with MySQL database. Follow these steps to set up:

### 1. Create the Database

```sql
CREATE DATABASE financial_compass;
USE financial_compass;
```

The tables will be created automatically when the server starts.

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cd backend
copy .env.example .env
```

Update the following in `.env`:

```env
# Use MySQL exclusively
USE_MYSQL=true
USE_DUAL_STORAGE=false

# MySQL credentials
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password_here
MYSQL_DATABASE=financial_compass

# JWT Secret (change this!)
JWT_SECRET=your_random_secret_key_at_least_32_characters_long

# Optional: MongoDB (only if using dual storage)
# MONGODB_URI=mongodb://localhost:27017/financial_compass
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

The server will:
- Connect to MySQL database
- Automatically create all required tables
- Listen on port 5000 (or PORT from .env)

### 5. Verify Setup

Check the server logs for:
```
MySQL: connection pool created
MySQL: ensured all tables exist
Server running in development mode on port 5000
```

Test the MySQL health endpoint:
```bash
curl http://localhost:5000/api/mysql/health
```

## Database Tables

The following tables are automatically created:

1. **users** - User accounts and authentication
2. **incomes** - Income records
3. **expenses** - Expense tracking
4. **assets** - Asset management
5. **liabilities** - Loans and debts
6. **investments** - Investment portfolio
7. **savings** - Savings accounts
8. **insurance** - Insurance policies
9. **goals** - Financial goals
10. **taxes** - Tax records
11. **news** - Financial news articles

## Storage Modes

The backend supports three modes:

### MySQL Only (Recommended)
```env
USE_MYSQL=true
USE_DUAL_STORAGE=false
```
All data stored in MySQL only.

### MongoDB Only (Default without config)
```env
USE_MYSQL=false
USE_DUAL_STORAGE=false
```
All data stored in MongoDB only.

### Dual Storage (Advanced)
```env
USE_MYSQL=true
USE_DUAL_STORAGE=true
MONGODB_URI=mongodb://localhost:27017/financial_compass
```
Data saved to both MySQL and MongoDB.

## Updated Routes

All routes now support MySQL:
- `/api/auth` - Registration and login
- `/api/income` - Income management
- `/api/expenses` - Expense tracking
- `/api/assets` - Asset management
- `/api/liabilities` - Liability tracking
- `/api/investments` - Investment management
- `/api/savings` - Savings accounts
- `/api/insurance` - Insurance policies
- `/api/goals` - Financial goals
- `/api/tax` - Tax records
- `/api/news` - Financial news

## Troubleshooting

### Connection Issues
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists: `CREATE DATABASE financial_compass;`

### Table Creation Errors
- Check MySQL user permissions
- Ensure user has CREATE TABLE privileges

### Authentication Errors
- Verify JWT_SECRET is set in `.env`
- Check JWT_SECRET is at least 32 characters

## Testing

1. Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'
```

2. Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

3. Create an income record (use token from login):
```bash
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"source":"Salary","amount":5000,"category":"salary"}'
```
