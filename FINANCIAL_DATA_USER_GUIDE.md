# 📊 Financial Data Management - User Guide

## Quick Start

### Access the Financial Data Management Page
1. Click **"Financial Data"** in the navigation bar
2. Or navigate to: `http://localhost:3000/financial-data`

---

## 📥 Adding Income

### Step-by-Step:

1. **Click "Add Income" Tab**
   
2. **Fill in Required Fields:**
   - **Amount** ⭐ - Enter the income amount (e.g., 5000)
   - **Income Source** ⭐ - What's the source? (e.g., "Monthly Salary", "Freelance Project")
   - **Category** ⭐ - Select from:
     - 💼 Salary
     - 💻 Freelance Work
     - 🏢 Business Income
     - 📈 Investment Returns
     - 🏠 Rental Income
     - 💰 Dividends
     - 🏦 Interest Income
     - 🎁 Bonus
     - 📊 Commission
     - 🎀 Gifts & Grants
     - 📝 Other Income

3. **Optional Fields:**
   - **Date** - When did you receive it? (defaults to today)
   - **Description** - Add notes (max 500 characters)
   - **Recurring** - Is this a recurring income?
     - If YES → Select frequency:
       - Weekly
       - Bi-weekly
       - Monthly
       - Quarterly
       - Yearly

4. **Click "Add Income" Button**
   - You'll see a success message
   - Form will reset for next entry

---

## 📤 Adding Expense

### Step-by-Step:

1. **Click "Add Expense" Tab**

2. **Fill in Required Fields:**
   - **Amount** ⭐ - How much was spent? (e.g., 250)
   - **Category** ⭐ - Select from:
     - 🛒 Groceries
     - 🍔 Food & Dining
     - 🚗 Transport & Fuel
     - 💡 Utilities
     - 🏠 Rent & Housing
     - 🏥 Healthcare & Medical
     - 📚 Education
     - 🎬 Entertainment
     - 🛍️ Shopping & Clothing
     - 🛡️ Insurance
     - 📱 Subscriptions
     - ✈️ Travel & Vacation
     - 💅 Personal Care
     - 🏡 Household & Repairs
     - 🎁 Gifts & Donations
     - 📝 Other

3. **Optional Fields:**
   - **Merchant/Store** - Where did you spend? (e.g., "Whole Foods", "Amazon")
   - **Date** - When did you spend it? (defaults to today)
   - **Payment Method** - How did you pay?
     - 💵 Cash
     - 💳 Credit Card
     - 💳 Debit Card
     - 📱 UPI
     - 🏦 Net Banking
     - 👛 Digital Wallet
     - 📋 Cheque
   - **Description** - Add notes (max 500 characters)
   - **Recurring** - Is this a recurring expense?
     - If YES → Select frequency (Weekly, Bi-weekly, Monthly, Quarterly, Yearly)

4. **Click "Add Expense" Button**
   - Success message appears
   - Form resets for next entry

---

## 👁️ Viewing All Data

### Step-by-Step:

1. **Click "All Data" Tab**

2. **View Summary Cards:**
   - 📊 **Total Income** (green) - All income combined
   - 📊 **Total Expenses** (red) - All expenses combined
   - 📊 **Net Balance** (blue) - Income minus expenses

3. **Filter Transactions:**
   - **By Type:**
     - All Transactions
     - Income Only
     - Expenses Only
   
   - **By Search:**
     - Search box searches:
       - Category name
       - Description
       - Merchant/Source
       - Amount

4. **Sort Transactions:**
   - **Date (Recent First)** - Newest transactions at top
   - **Amount (High to Low)** - Largest amounts first

5. **View Transaction Details:**
   - Date of transaction
   - Type (Income/Expense)
   - Category
   - Source/Merchant name
   - Description/Notes
   - Amount (with +/- sign)
   - Payment method
   - Recurring status

---

## 📊 Data Displayed in Table

| Column | Info | Example |
|--------|------|---------|
| **Date** | When | Feb 04, 2026 |
| **Type** | Income or Expense | 📥 Income / 📤 Expense |
| **Category** | Type of income/expense | Salary, Groceries |
| **Source/Merchant** | Who paid/Where spent | Employer, Whole Foods |
| **Description** | Additional notes | Monthly salary, Weekly shopping |
| **Amount** | How much | +$5,000 / -$250 |
| **Payment Method** | How paid | Credit Card, Cash |
| **Recurring** | Is it recurring? | Monthly, Weekly, - |

---

## 🎯 Who Added What Tracking

The system automatically tracks:
- ✅ **User ID** - Who added the transaction
- ✅ **Date** - When the transaction was recorded
- ✅ **Type** - Income or Expense
- ✅ **Amount** - How much
- ✅ **Category** - Classification
- ✅ **Details** - Source/Merchant, Description, Payment Method
- ✅ **Recurring Info** - If recurring, what frequency

All data is **stored securely** in MongoDB Atlas and associated with your user account.

---

## 💡 Tips & Tricks

1. **Quick Add:** You can add multiple transactions quickly by using the form reset feature
2. **Search:** Use the search to find specific transactions quickly
3. **Categorize:** Use consistent categories for better tracking
4. **Recurring:** Mark recurring items to track patterns
5. **Payment Method:** Tracking payment methods helps identify spending patterns
6. **Sync:** Data syncs instantly with the backend

---

## 🔒 Data Privacy

- ✅ All data is user-specific (you only see YOUR data)
- ✅ JWT authentication ensures security
- ✅ MongoDB encryption protects data
- ✅ Automatic logout on session end

---

## ❓ Common Questions

**Q: Can I edit transactions?**
A: Currently, you can delete and re-add. Future versions will support editing.

**Q: How do I delete a transaction?**
A: Delete functionality coming soon. For now, carefully review before adding.

**Q: Can I export my data?**
A: Export to CSV/PDF coming soon!

**Q: Are recurring transactions automatically added?**
A: Currently marked as recurring for tracking. Auto-add coming soon.

**Q: What's the maximum description length?**
A: 500 characters

**Q: Can I add transactions for past dates?**
A: Yes! Use the date picker to select any date.

---

## 📞 Support

If you encounter any issues:
1. Check that you're logged in
2. Ensure backend server is running
3. Check browser console for errors
4. Try refreshing the page

---

**Last Updated:** February 2026
**Version:** 1.0
