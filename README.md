# financeflow - Financial Compass

A comprehensive full-stack financial management application built with React, TypeScript, and Express.js. Manage your assets, investments, income, expenses, goals, and more all in one place.

## 📸 Screenshots

### Dashboard Overview
![Dashboard Overview](https://via.placeholder.com/1000x600?text=Dashboard+-+Financial+Overview)
*Main dashboard showing comprehensive financial overview and quick actions*

### Asset Management & Allocation
![Asset Allocation Chart](https://via.placeholder.com/1000x600?text=Asset+Allocation+Chart)
*Track and visualize your asset allocation across different categories*

### Investment Portfolio Analysis
![Investment Portfolio](https://via.placeholder.com/1000x600?text=Investment+Portfolio+Analysis)
*Monitor your investments with detailed returns analysis and performance tracking*

### Expense Tracking & Analytics
![Expense Tracking](https://via.placeholder.com/1000x600?text=Expense+Tracking+by+Category)
*Categorize and analyze your expenses with visual breakdowns*

### Income Management
![Income Overview](https://via.placeholder.com/1000x600?text=Income+Management)
*Track multiple income sources and monitor cash flow*

### Financial Calculators
![Calculators Suite](https://via.placeholder.com/1000x600?text=Financial+Calculators)
*Access built-in calculators for SIP, EMI, Lumpsum, and Fixed Deposits*

### Net Worth Tracking
![Net Worth Dashboard](https://via.placeholder.com/1000x600?text=Net+Worth+Tracking)
*Real-time net worth calculation and historical progression*

### Financial Goals
![Financial Goals](https://via.placeholder.com/1000x600?text=Financial+Goals+Tracking)
*Set, monitor, and achieve your financial goals*

### Reports & Analytics
![Reports & Analytics](https://via.placeholder.com/1000x600?text=Reports+and+Analytics)
*Generate comprehensive financial reports and insights*

## ✨ Features

- 💰 **Asset Management** - Track properties, vehicles, and other assets
- 📈 **Investment Portfolio** - Monitor stocks, mutual funds, and crypto
- 💸 **Expense Tracking** - Categorize and analyze spending patterns
- 🎯 **Financial Goals** - Set and track financial goals with progress
- 💼 **Income Management** - Track multiple income sources
- 📊 **Net Worth Dashboard** - Real-time net worth calculation
- 🧮 **Financial Calculators** - SIP, EMI, Lumpsum, FD calculators
- 📋 **Insurance & Liabilities** - Manage policies and debts
- 🏦 **Savings Planning** - Emergency fund calculator
- 📚 **Learning Resources** - Financial education modules
- 🔐 **Secure Authentication** - JWT-based authentication

## 🛠️ Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite - Fast build tool
- shadcn-ui - Component library
- Tailwind CSS - Styling
- React Query - State management
- Recharts - Data visualization

### Backend
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- npm/yarn

### Installation

```bash
# Clone repository
git clone https://github.com/valluvanss23it-art/financeflow.git
cd financeflow

# Install dependencies
npm install
cd backend && npm install && cd ..

# Create environment files
cp .env.example .env
cp backend/.env.example backend/.env
```

### Configuration

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/financeflow
JWT_SECRET=your_secret_key
```

### Running

```bash
# Run both frontend and backend
npm run dev:all

# Or separately:
npm run dev              # Frontend (port 8080)
npm run server:dev       # Backend (port 5000)
```

### Building

```bash
npm run build
```

## 📁 Project Structure

```
financeflow/
├── src/                  # Frontend React app
│   ├── components/      # UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks
│   └── lib/            # Utilities
├── backend/             # Express backend
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── config/         # Configuration
│   └── middleware/     # Express middleware
└── supabase/           # Database migrations
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Environment variables for secrets

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

- GitHub Issues: [Report Issues](https://github.com/valluvanss23it-art/financeflow/issues)
- Documentation: [View Docs](https://github.com/valluvanss23it-art/financeflow/wiki)

---

Made with ❤️ by the financeflow team


