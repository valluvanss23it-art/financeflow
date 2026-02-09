export const learningContent = {
  budgeting: {
    title: "Budgeting Basics",
    description: "Learn how to create and maintain a budget that works for you",
    sections: [
      {
        title: "What is Budgeting?",
        content:
          "Budgeting is the process of creating a plan for how you'll spend your money. This spending plan is called a budget. Creating this plan allows you to determine in advance whether you will have enough money to do the things you need to do or would like to do.",
        example:
          "If you earn ₹50,000/month, you might allocate ₹25,000 for needs (rent, utilities, groceries), ₹15,000 for wants (entertainment, dining), and ₹10,000 for savings and investments.",
        tips: [
          "Track every expense for a month before creating your first budget",
          "Use the 50/30/20 rule as a starting point",
          "Review and adjust your budget monthly",
        ],
        mistakes: [
          "Setting unrealistic spending limits",
          "Forgetting irregular expenses like insurance premiums",
          "Not having an emergency category",
        ],
      },
      {
        title: "The 50/30/20 Rule",
        content:
          "This simple budgeting framework suggests allocating 50% of your after-tax income to needs, 30% to wants, and 20% to savings and debt repayment. It's a great starting point for beginners.",
        example:
          "On a ₹60,000 monthly income: ₹30,000 goes to needs (rent, food, utilities), ₹18,000 to wants (entertainment, shopping), and ₹12,000 to savings/investments.",
        tips: [
          "Adjust percentages based on your financial goals",
          "In high-cost cities, you may need 60% for needs",
          "Prioritize increasing the savings percentage over time",
        ],
      },
      {
        title: "Zero-Based Budgeting",
        content:
          "In zero-based budgeting, every rupee has a job. Your income minus your expenses should equal zero. This doesn't mean spending everything—savings and investments are part of your budget.",
        example:
          "Income: ₹50,000. Rent: ₹15,000, Groceries: ₹8,000, Utilities: ₹3,000, Transport: ₹4,000, Entertainment: ₹5,000, Savings: ₹10,000, Investments: ₹5,000 = ₹50,000",
        tips: [
          "Plan for the unexpected with a miscellaneous category",
          "Review categories at month-end to improve accuracy",
        ],
        mistakes: [
          "Leaving money unallocated",
          "Being too rigid—allow some flexibility",
        ],
      },
      {
        title: "Tracking Your Spending",
        content:
          "The foundation of any budget is knowing where your money goes. Track every purchase for at least a month to understand your spending patterns before creating a budget.",
        tips: [
          "Use apps or spreadsheets to track expenses",
          "Categorize expenses immediately, not later",
          "Review spending weekly to stay on track",
        ],
        mistakes: [
          "Ignoring small purchases—they add up",
          "Only tracking for a week and assuming patterns",
        ],
      },
    ],
    calculatorLink: "/expense",
  },
  investing: {
    title: "Investing Fundamentals",
    description: "Understand the basics of growing your wealth through investments",
    sections: [
      {
        title: "Why Invest?",
        content:
          "Investing allows your money to grow faster than inflation. While savings accounts offer safety, the interest rarely beats inflation. Investing in assets like stocks, mutual funds, or real estate helps build long-term wealth.",
        example:
          "₹1 lakh in a savings account at 4% becomes ₹1.48 lakh in 10 years. The same in equity mutual funds at 12% becomes ₹3.10 lakh.",
        tips: [
          "Start as early as possible—time is your biggest advantage",
          "Don't wait to 'have more money'—start with what you have",
          "Understand the power of compound interest",
        ],
      },
      {
        title: "Risk vs. Return",
        content:
          "Higher potential returns come with higher risk. Stocks can give 12-15% returns but are volatile. Fixed deposits offer 6-7% with stability. Your risk tolerance depends on age, goals, and financial situation.",
        example:
          "A 25-year-old saving for retirement can take more risk with 80% equity. A 55-year-old near retirement should have only 30-40% in equity.",
        tips: [
          "Assess your risk tolerance honestly",
          "Diversify to manage risk",
          "Rebalance portfolio as you age",
        ],
        mistakes: [
          "Taking too much risk for short-term goals",
          "Being too conservative when young",
          "Panicking during market downturns",
        ],
      },
      {
        title: "SIP - Systematic Investment Plan",
        content:
          "SIP allows you to invest a fixed amount regularly in mutual funds. It averages out market volatility (rupee-cost averaging) and builds discipline. Even small monthly investments can create significant wealth over time.",
        example:
          "₹5,000/month SIP at 12% for 20 years creates ₹49.95 lakhs. You invested only ₹12 lakhs—the rest is returns!",
        tips: [
          "Start with amount you can invest consistently",
          "Increase SIP annually with income growth",
          "Don't stop SIPs during market falls",
        ],
        mistakes: [
          "Stopping SIPs when markets fall (best time to continue!)",
          "Starting too many SIPs in similar funds",
          "Checking portfolio too frequently",
        ],
      },
      {
        title: "Asset Allocation",
        content:
          "Don't put all eggs in one basket. Spread investments across equity, debt, gold, and real estate. The right mix depends on your goals, timeline, and risk tolerance.",
        example:
          "Aggressive: 70% Equity, 20% Debt, 10% Gold. Conservative: 30% Equity, 50% Debt, 20% Gold.",
        tips: [
          "Review allocation annually",
          "Rebalance when allocation drifts significantly",
          "Consider age-based allocation rules",
        ],
      },
      {
        title: "Mutual Funds Basics",
        content:
          "Mutual funds pool money from many investors to invest in stocks, bonds, or other assets. They're managed by professionals and offer diversification even with small investments.",
        tips: [
          "Start with index funds for low cost",
          "Check expense ratio before investing",
          "Understand the fund's investment objective",
        ],
        mistakes: [
          "Chasing past returns",
          "Ignoring expense ratios",
          "Investing based on star ratings alone",
        ],
      },
    ],
    calculatorLink: "/calculators",
  },
  tax: {
    title: "Tax Planning",
    description: "Learn to optimize your taxes legally and effectively",
    sections: [
      {
        title: "Understanding Income Tax",
        content:
          "Income tax is levied on your annual income after deductions. India has a progressive tax system—higher income means higher tax rates. Understanding tax slabs helps you plan better.",
        example:
          "For income ₹10 lakh (Old Regime): Tax = ₹0 (up to ₹2.5L) + ₹12,500 (₹2.5-5L @ 5%) + ₹50,000 (₹5-7.5L @ 10%) + ₹50,000 (₹7.5-10L @ 15%) = ₹1,12,500",
        tips: [
          "Compare old vs new tax regime",
          "Plan investments early in the financial year",
          "Keep all investment proofs organized",
        ],
      },
      {
        title: "Section 80C Deductions",
        content:
          "Section 80C allows deductions up to ₹1.5 lakh for investments in ELSS, PPF, life insurance, EPF, and more. This is the most popular tax-saving section.",
        example:
          "Invest ₹1.5 lakh in ELSS. If you're in 30% tax bracket, you save ₹46,800 in taxes (including cess).",
        tips: [
          "ELSS has shortest lock-in (3 years) among 80C options",
          "EPF contribution counts toward 80C",
          "Don't invest only for tax saving—consider returns too",
        ],
        mistakes: [
          "Rushing investments in March",
          "Ignoring employer's EPF contribution",
          "Choosing wrong products just for tax saving",
        ],
      },
      {
        title: "Section 80D - Health Insurance",
        content:
          "Deduction up to ₹25,000 for health insurance premium for self and family. Additional ₹25,000 for parents (₹50,000 if parents are senior citizens).",
        example:
          "Premium ₹20,000 for family + ₹30,000 for senior citizen parents = ₹50,000 deduction, saving ₹15,600 in taxes (30% bracket).",
        tips: [
          "Buy adequate health cover, not just for tax saving",
          "Preventive health check-up up to ₹5,000 is included",
          "Consider super top-up plans for better coverage",
        ],
      },
      {
        title: "NPS - Section 80CCD",
        content:
          "Additional ₹50,000 deduction under 80CCD(1B) for NPS contributions, over and above 80C limit. NPS offers equity exposure with tax benefits.",
        example:
          "₹50,000 NPS investment saves ₹15,600 in taxes (30% bracket). Total 80C + 80CCD = ₹2 lakh deduction possible.",
        tips: [
          "NPS has lock-in till 60, plan accordingly",
          "Consider employer's NPS contribution for extra tax benefit",
          "Choose appropriate asset allocation within NPS",
        ],
      },
      {
        title: "HRA Exemption",
        content:
          "If you receive HRA and pay rent, you can claim exemption. The exemption is the minimum of: actual HRA received, rent paid minus 10% of salary, or 50%/40% of salary (metro/non-metro).",
        tips: [
          "Keep rent receipts and landlord's PAN if rent > ₹1 lakh/year",
          "Even if you live with parents, you can pay them rent",
          "Compare HRA exemption vs home loan benefits",
        ],
      },
    ],
    calculatorLink: "/tax",
  },
  retirement: {
    title: "Retirement Planning",
    description: "Prepare for a financially secure retirement",
    sections: [
      {
        title: "Why Plan Early?",
        content:
          "The earlier you start, the less you need to save monthly. Compound interest works dramatically in your favor over long periods. Starting at 25 vs 35 can mean the difference of crores in retirement corpus.",
        example:
          "To accumulate ₹5 crore by 60: Starting at 25, invest ₹10,000/month. Starting at 35, you need ₹28,000/month. Starting at 45, you need ₹85,000/month!",
        tips: [
          "Start immediately, even with small amounts",
          "Increase contributions as income grows",
          "Don't withdraw from retirement funds early",
        ],
        mistakes: [
          "Thinking 'I'll start later when I earn more'",
          "Underestimating how much you'll need",
          "Not accounting for inflation",
        ],
      },
      {
        title: "How Much Do You Need?",
        content:
          "A common rule: you need 25-30 times your annual expenses as retirement corpus. Factor in inflation—today's ₹50,000/month becomes ₹2.5 lakh/month in 25 years at 6% inflation.",
        example:
          "Current monthly expense: ₹50,000. At retirement in 25 years: ₹2.14 lakh/month. Annual need: ₹25.7 lakh. Target corpus: ₹6.4 - ₹7.7 crore.",
        tips: [
          "Use retirement calculators to estimate needs",
          "Plan for 25-30 years of retirement",
          "Consider healthcare costs in old age",
        ],
      },
      {
        title: "EPF and PPF",
        content:
          "EPF (Employees' Provident Fund) is mandatory for salaried employees. PPF (Public Provident Fund) is voluntary. Both offer tax-free returns and are extremely safe for retirement planning.",
        example:
          "EPF at 8.15% + PPF at 7.1% form the debt portion of retirement. Maximize EPF contribution through VPF for additional tax-free returns.",
        tips: [
          "Don't withdraw EPF when changing jobs",
          "Consider VPF for extra tax-free returns",
          "PPF has 15-year lock-in, plan accordingly",
        ],
      },
      {
        title: "NPS for Retirement",
        content:
          "National Pension System offers market-linked returns with partial equity exposure. Extra tax benefit of ₹50,000 under 80CCD(1B). At retirement, 60% is tax-free, 40% must buy annuity.",
        tips: [
          "Choose Active choice for control over allocation",
          "Gradually reduce equity as you near retirement",
          "Consider corporate NPS for employer contribution benefits",
        ],
        mistakes: [
          "Choosing too conservative allocation when young",
          "Not understanding annuity purchase requirement",
        ],
      },
      {
        title: "The 4% Rule",
        content:
          "The 4% rule suggests you can withdraw 4% of your corpus annually without running out of money for 30 years. This gives a sustainable income while preserving capital.",
        example:
          "With ₹2 crore corpus, 4% = ₹8 lakh/year or ₹66,667/month. Adjust for inflation annually.",
        tips: [
          "This is a guideline, not a guarantee",
          "Have some flexibility in withdrawal rate",
          "Keep 2-3 years expenses in liquid funds",
        ],
      },
    ],
    calculatorLink: "/calculators",
  },
  emergency: {
    title: "Emergency Fund",
    description: "Build a safety net for unexpected financial situations",
    sections: [
      {
        title: "What is an Emergency Fund?",
        content:
          "An emergency fund is money set aside for unexpected expenses like job loss, medical emergencies, or urgent repairs. It prevents you from going into debt or selling investments at bad times.",
        example:
          "Monthly expenses: ₹50,000. Emergency fund target: ₹3-6 lakh (6-12 months). Keep in savings account or liquid funds for easy access.",
        tips: [
          "Start with ₹10,000-20,000 and build gradually",
          "Automate monthly transfers to emergency fund",
          "Don't invest this money—keep it accessible",
        ],
        mistakes: [
          "Using emergency fund for wants, not emergencies",
          "Keeping too much in low-interest savings",
          "Not replenishing after using it",
        ],
      },
      {
        title: "How Much Do You Need?",
        content:
          "Aim for 3-6 months of essential expenses if you have stable income. Go for 6-12 months if self-employed, single income family, or in unstable industry.",
        tips: [
          "Calculate essential expenses only, not total spending",
          "Review and adjust as life circumstances change",
          "Consider family dependents when calculating",
        ],
      },
      {
        title: "Where to Keep It?",
        content:
          "Keep emergency funds in highly liquid, safe instruments. Savings account, liquid mutual funds, or short-term FDs work well. Don't chase returns—safety and accessibility matter most.",
        example:
          "Split ₹3 lakh emergency fund: ₹50,000 in savings account, ₹2.5 lakh in liquid fund (slightly better returns, accessible in 1-2 days).",
        tips: [
          "Liquid funds offer better returns than savings accounts",
          "Avoid locking in FDs—use sweep-in facility instead",
          "Keep some cash at home for extreme emergencies",
        ],
      },
    ],
  },
  debt: {
    title: "Debt Management",
    description: "Learn to manage and eliminate debt effectively",
    sections: [
      {
        title: "Good Debt vs. Bad Debt",
        content:
          "Good debt helps build wealth (home loan, education loan). Bad debt finances depreciating assets or consumption (credit card debt, personal loans for vacations). Minimize bad debt aggressively.",
        example:
          "Home loan at 8.5% on appreciating asset = Good debt. Credit card balance at 36% APR = Bad debt. Pay off credit cards first!",
        tips: [
          "Never carry credit card balance",
          "Think twice before any non-essential loan",
          "Home and education loans can have tax benefits",
        ],
      },
      {
        title: "Debt Snowball Method",
        content:
          "Pay minimum on all debts, then put extra money toward the smallest debt first. Once paid off, roll that payment into the next smallest. Creates momentum and motivation.",
        example:
          "Debts: ₹20,000 (card A), ₹50,000 (card B), ₹2 lakh (personal loan). Pay off card A first, then use that freed-up payment for card B.",
        tips: [
          "Good for motivation and behavior change",
          "Quick wins keep you motivated",
          "Works well when debt amounts vary significantly",
        ],
      },
      {
        title: "Debt Avalanche Method",
        content:
          "Pay minimum on all debts, then put extra money toward the highest interest debt first. Mathematically optimal—saves the most in interest payments.",
        example:
          "Credit card at 36%, personal loan at 14%, car loan at 9%. Focus extra payments on credit card first regardless of balance.",
        tips: [
          "Saves more money than snowball method",
          "Best for disciplined people who don't need quick wins",
          "Calculate total interest to stay motivated",
        ],
      },
      {
        title: "When to Invest vs. Pay Debt",
        content:
          "Compare after-tax returns on investment vs. interest rate on debt. Generally, pay off high-interest debt (>10-12%) before investing. For low-interest debt, you might invest simultaneously.",
        tips: [
          "Always pay off credit card debt before investing",
          "Don't prepay home loan at cost of retirement investing",
          "Build small emergency fund even while paying debt",
        ],
      },
    ],
    calculatorLink: "/calculators",
  },
};
