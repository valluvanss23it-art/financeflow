# Financial Compass Backend

Node.js/Express + MongoDB backend for the Financial Compass application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

Or from the root directory:
```bash
npm run server:install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/financial-compass
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` to a secure random string in production!

### 3. Install and Start MongoDB

#### Option A: Local MongoDB
1. Download and install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financial-compass?retryWrites=true&w=majority
   ```

### 4. Start the Backend Server

From the backend directory:
```bash
npm run dev
```

Or from the root directory:
```bash
npm run server:dev
```

The backend will run on `http://localhost:5000`

### 5. Configure Frontend

Create/update `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Install Frontend Dependencies

From the root directory:
```bash
npm install
```

### 7. Run Both Frontend and Backend

From the root directory:
```bash
npm run dev:all
```

This will start:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173` (or another available port)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Routes (require authentication)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Data Endpoints
All require authentication (Bearer token in Authorization header)

- **Income**: `/api/income` (GET, POST, PUT, DELETE)
- **Expenses**: `/api/expenses` (GET, POST, PUT, DELETE)
- **Goals**: `/api/goals` (GET, POST, PUT, DELETE)
- **Assets**: `/api/assets` (GET, POST, PUT, DELETE)
- **Liabilities**: `/api/liabilities` (GET, POST, PUT, DELETE)
- **Insurance**: `/api/insurance` (GET, POST, PUT, DELETE)
- **Investments**: `/api/investments` (GET, POST, PUT, DELETE)
- **Savings**: `/api/savings` (GET, POST, PUT, DELETE)
- **Tax**: `/api/tax` (GET, POST, PUT, DELETE)

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js            # User model
│   ├── Income.js          # Income model
│   ├── Expense.js         # Expense model
│   ├── Goal.js            # Goal model
│   ├── Asset.js           # Asset model
│   ├── Liability.js       # Liability model
│   ├── Insurance.js       # Insurance model
│   ├── Investment.js      # Investment model
│   ├── Savings.js         # Savings model
│   └── Tax.js             # Tax model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── profile.js         # Profile routes
│   ├── income.js          # Income routes
│   ├── expenses.js        # Expense routes
│   ├── goals.js           # Goals routes
│   ├── assets.js          # Assets routes
│   ├── liabilities.js     # Liabilities routes
│   ├── insurance.js       # Insurance routes
│   ├── investments.js     # Investments routes
│   ├── savings.js         # Savings routes
│   └── tax.js             # Tax routes
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── server.js              # Express server setup
```

## Testing the API

### Using cURL

Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Get income (replace TOKEN with your JWT):
```bash
curl http://localhost:5000/api/income \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your connection string in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the PORT in `.env` file
- Kill the process using port 5000

### CORS Errors
- Backend is configured to accept requests from all origins in development
- Update CORS settings in `server.js` for production

## Migration from Supabase

The frontend API client has been updated to use the new Express backend. The old Supabase integration files are still present if you need to reference them, but the application now uses MongoDB for data storage and JWT for authentication.

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure CORS to only allow your frontend domain
4. Use MongoDB Atlas or a hosted MongoDB instance
5. Deploy to services like Heroku, Railway, or DigitalOcean
6. Set up proper environment variables on your hosting platform

## License

This backend is part of the Financial Compass project.
