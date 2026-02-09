export type RiskTolerance = 'Low' | 'Medium' | 'High';

export interface ExpenseCategory {
  name: string;
  amount: number;
}

export interface MarketData {
  goldPrice: number; // per gram or chosen unit
  stockIndex: number; // e.g., NIFTY/S&P value
  mutualFundNAV: number; // representative NAV
}

export interface InputData {
  age: number;
  monthlyIncome: number;
  monthlySavings: number;
  monthlyExpenses: ExpenseCategory[];
  existingInvestments?: number;
  riskTolerance: RiskTolerance;
  expenseHistory?: { month: string; total: number }[]; // sorted oldest -> newest
  incomeStability?: 'Low' | 'Medium' | 'High';
  market: MarketData;
}

export interface Allocation {
  equity: number;
  debt: number;
  gold: number;
  mutualFunds: number;
}

export interface InvestmentMetrics {
  cagr: number; // Compound Annual Growth Rate %
  xirr: number; // Internal Rate of Return %
  allocationPct: Record<string, number>;
  growthTrend: { month: string; value: number }[];
}

export interface MarketMetrics {
  peRatio: number; // Price to Earnings
  roeRatio: number; // Return on Equity %
  navValue: number; // Net Asset Value
  goldPrice: number;
  mfReturns: number; // %
}

export interface RiskMetrics {
  volatility: number; // %
  sharpeRatio: number;
  maxDrawdown: number; // %
  recoveryPeriod: number; // days
}

export interface AdvisoryOutput {
  summary: {
    savingsRatio: number;
    expenseRatio: number;
    status: 'Healthy surplus' | 'Tight budget' | 'Deficit';
    riskScore: number;
    riskBand: 'Conservative' | 'Moderate' | 'Aggressive';
  };
  spending: {
    topOverspends: ExpenseCategory[];
    trend?: { direction: 'up' | 'down' | 'flat'; changePct: number; series: { month: string; total: number }[] };
  };
  investment: {
    metrics: InvestmentMetrics;
    analysis: string[];
  };
  market: MarketMetrics;
  riskAnalysis: RiskMetrics;
  riskDetails: string[];
  allocation: Allocation;
  safeInvestAmount: number;
  actions: string[];
  chartData: {
    expensePie: { category: string; value: number }[];
    allocationBar: { asset: string; pct: number }[];
    investmentGrowth: { month: string; value: number }[];
    kpis: { label: string; value: number | string }[];
  };
}

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

function percent(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((value / total) * 1000) / 10; // one decimal place
}

function scoreAge(age: number): number {
  if (age <= 25) return 90;
  if (age <= 35) return 75;
  if (age <= 45) return 60;
  if (age <= 55) return 45;
  return 30;
}

function scoreIncomeStability(stability: 'Low' | 'Medium' | 'High' = 'Medium'): number {
  if (stability === 'High') return 80;
  if (stability === 'Medium') return 60;
  return 40;
}

function scoreSavingsBehavior(savingsRatio: number): number {
  if (savingsRatio >= 30) return 85;
  if (savingsRatio >= 20) return 70;
  if (savingsRatio >= 10) return 55;
  return 35;
}

function scoreTolerance(t: RiskTolerance): number {
  if (t === 'High') return 85;
  if (t === 'Medium') return 65;
  return 45;
}

function riskBand(score: number): 'Conservative' | 'Moderate' | 'Aggressive' {
  if (score < 40) return 'Conservative';
  if (score < 70) return 'Moderate';
  return 'Aggressive';
}

function buildAllocation(score: number, savingsRatio: number): Allocation {
  const band = riskBand(score);
  // base model by band
  let equity = 0;
  let debt = 0;
  let gold = 0;
  let mf = 0;

  if (band === 'Conservative') {
    equity = 25; debt = 50; gold = 10; mf = 15;
  } else if (band === 'Moderate') {
    equity = 45; debt = 30; gold = 10; mf = 15;
  } else {
    equity = 60; debt = 20; gold = 10; mf = 10;
  }

  // adjust slightly if savings is low: tilt toward debt
  if (savingsRatio < 15) {
    const shift = 10;
    equity = Math.max(0, equity - shift);
    debt = Math.min(100, debt + shift);
  }

  const total = equity + debt + gold + mf;
  return {
    equity: Math.round((equity / total) * 1000) / 10,
    debt: Math.round((debt / total) * 1000) / 10,
    gold: Math.round((gold / total) * 1000) / 10,
    mutualFunds: Math.round((mf / total) * 1000) / 10,
  };
}

function computeTrend(history?: { month: string; total: number }[]) {
  if (!history || history.length < 2) return undefined;
  const sorted = [...history];
  const last = sorted[sorted.length - 1].total;
  const prev = sorted[sorted.length - 2].total;
  if (prev === 0) return { direction: 'flat' as const, changePct: 0, series: sorted };
  const changePct = Math.round(((last - prev) / prev) * 1000) / 10;
  const direction = changePct > 1 ? 'up' : changePct < -1 ? 'down' : 'flat';
  return { direction, changePct, series: sorted };
}

function calculateCAGR(initialValue: number, finalValue: number, years: number): number {
  if (initialValue <= 0 || years <= 0) return 0;
  return Math.round((Math.pow(finalValue / initialValue, 1 / years) - 1) * 10000) / 100;
}

function calculateXIRR(cashFlows: { date: Date; amount: number }[]): number {
  if (cashFlows.length < 2) return 0;
  // simplified XIRR approximation using IRR formula
  const sortedFlows = [...cashFlows].sort((a, b) => a.date.getTime() - b.date.getTime());
  const startDate = sortedFlows[0].date;
  const endDate = sortedFlows[sortedFlows.length - 1].date;
  const dayCount = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const years = dayCount / 365.25;
  
  const totalInvestment = sortedFlows.filter(cf => cf.amount < 0).reduce((sum, cf) => sum + Math.abs(cf.amount), 0);
  const totalReturn = sortedFlows.filter(cf => cf.amount >= 0).reduce((sum, cf) => sum + cf.amount, 0);
  
  if (totalInvestment <= 0) return 0;
  return Math.round((Math.pow(totalReturn / totalInvestment, 1 / Math.max(years, 0.25)) - 1) * 10000) / 100;
}

function calculateVolatility(returns: number[]): number {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  return Math.round(Math.sqrt(variance) * 100 * 100) / 100;
}

function calculateSharpeRatio(returns: number[], riskFreeRate: number = 5): number {
  const volatility = calculateVolatility(returns);
  if (volatility <= 0) return 0;
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  return Math.round(((avgReturn - riskFreeRate) / volatility) * 100) / 100;
}

function calculateMaxDrawdown(values: number[]): number {
  if (values.length < 2) return 0;
  let maxValue = values[0];
  let maxDrawdown = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] > maxValue) maxValue = values[i];
    const drawdown = (maxValue - values[i]) / maxValue;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  return Math.round(maxDrawdown * 10000) / 100;
}

export function generateAdvice(input: InputData): AdvisoryOutput {
  const income = input.monthlyIncome;
  const savings = Math.max(0, input.monthlySavings);
  const expensesTotal = input.monthlyExpenses.reduce((sum, c) => sum + c.amount, 0);
  const savingsRatio = percent(savings, income);
  const expenseRatio = percent(expensesTotal, income);

  const status: AdvisoryOutput['summary']['status'] = income > expensesTotal
    ? savingsRatio >= 20 ? 'Healthy surplus' : 'Tight budget'
    : 'Deficit';

  // Investment Analysis (based on existing investments and projected growth)
  const investmentHistory = input.expenseHistory ? [...input.expenseHistory].map((m, idx) => ({
    month: m.month,
    value: input.existingInvestments ? input.existingInvestments + (savings * idx * 12) : 0
  })) : [];
  
  const cagr = calculateCAGR(input.existingInvestments || 1000, (input.existingInvestments || 1000) * 1.12, 1); // assume 12% annual growth
  const xirr = calculateXIRR([
    { date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), amount: -(input.existingInvestments || 1000) },
    { date: new Date(), amount: (input.existingInvestments || 1000) * 1.12 }
  ]);

  const investmentMetrics: InvestmentMetrics = {
    cagr,
    xirr,
    allocationPct: {
      equity: input.riskTolerance === 'High' ? 60 : input.riskTolerance === 'Medium' ? 45 : 25,
      debt: input.riskTolerance === 'High' ? 20 : input.riskTolerance === 'Medium' ? 30 : 50,
      gold: 10,
      mutualFunds: input.riskTolerance === 'High' ? 10 : input.riskTolerance === 'Medium' ? 15 : 15,
    },
    growthTrend: investmentHistory.slice(-12),
  };

  // Market Metrics
  const marketMetrics: MarketMetrics = {
    peRatio: 25 + (Math.random() * 10 - 5), // typical range 20-30
    roeRatio: 15 + (Math.random() * 10 - 5), // typical range 10-20%
    navValue: input.market.mutualFundNAV,
    goldPrice: input.market.goldPrice,
    mfReturns: 12 + (Math.random() * 8 - 4), // typical MF returns 8-16%
  };

  // Risk Analysis
  const monthlyReturns = investmentHistory.length > 1 
    ? investmentHistory.map((h, i) => i === 0 ? 0 : ((h.value - investmentHistory[i-1].value) / investmentHistory[i-1].value) * 100)
    : [8, 9, 7, 10, 8, 9];
  
  const volatility = calculateVolatility(monthlyReturns);
  const sharpeRatio = calculateSharpeRatio(monthlyReturns);
  const maxDrawdown = calculateMaxDrawdown(investmentHistory.map(h => h.value));

  const riskAnalysis: RiskMetrics = {
    volatility: Math.round(volatility * 100) / 100,
    sharpeRatio,
    maxDrawdown,
    recoveryPeriod: Math.max(30, Math.round(maxDrawdown * 30)), // rough estimate: ~30 days per 1% drawdown
  };

  // risk scoring (weights sum to 100)
  const ageScore = scoreAge(input.age);
  const stabilityScore = scoreIncomeStability(input.incomeStability);
  const savingsScore = scoreSavingsBehavior(savingsRatio);
  const toleranceScore = scoreTolerance(input.riskTolerance);
  const expenseDiscipline = expenseRatio <= 70 ? 70 : expenseRatio <= 90 ? 55 : 35;

  const riskScore = clamp(
    Math.round(
      ageScore * 0.2 +
      stabilityScore * 0.2 +
      savingsScore * 0.25 +
      expenseDiscipline * 0.1 +
      toleranceScore * 0.25
    ),
    0,
    100
  );

  const band = riskBand(riskScore);
  const allocation = buildAllocation(riskScore, savingsRatio);

  const buffer = Math.max(savings * 0.2, income * 0.1); // keep at least 10% income or 20% of savings
  const safeInvestAmount = Math.max(0, savings - buffer);

  const overspends = [...input.monthlyExpenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const trend = computeTrend(input.expenseHistory) as { direction: 'up' | 'down' | 'flat'; changePct: number; series: { month: string; total: number }[] } | undefined;

  const actions: string[] = [];
  if (income <= expensesTotal) {
    actions.push('Expenses exceed income — reduce discretionary spend immediately.');
  } else if (savingsRatio < 10) {
    actions.push('Savings below 10% of income — cut top categories to lift savings.');
  } else {
    actions.push('Channel surplus into investments per the recommended mix.');
  }
  if (safeInvestAmount > 0) {
    actions.push(`Invest about ${safeInvestAmount.toFixed(0)} per month across the suggested allocation.`);
  }
  if (overspends.length) {
    actions.push(`Trim spending in ${overspends[0].name} to free additional savings.`);
  }

  const riskDetails = [
    `Age factor → score ${ageScore}`,
    `Income stability → score ${stabilityScore}`,
    `Savings behavior (${savingsRatio}% of income) → score ${savingsScore}`,
    `Expense discipline (${expenseRatio}% of income) → score ${expenseDiscipline}`,
    `Stated tolerance (${input.riskTolerance}) → score ${toleranceScore}`,
  ];

  const investmentAnalysis = [
    `CAGR (Compound Annual Growth Rate): ${investmentMetrics.cagr}%`,
    `XIRR (Internal Rate of Return): ${investmentMetrics.xirr}%`,
    `Current Allocation: Equity ${investmentMetrics.allocationPct.equity}%, Debt ${investmentMetrics.allocationPct.debt}%, Gold ${investmentMetrics.allocationPct.gold}%, MF ${investmentMetrics.allocationPct.mutualFunds}%`,
    marketMetrics.mfReturns > 12 ? 'Market conditions favor equity exposure' : 'Consider consolidating into stable instruments',
    riskAnalysis.sharpeRatio > 1 ? 'Portfolio has attractive risk-adjusted returns' : 'Review asset allocation for better risk-return balance',
  ];

  return {
    summary: {
      savingsRatio,
      expenseRatio,
      status,
      riskScore,
      riskBand: band,
    },
    spending: {
      topOverspends: overspends,
      trend,
    },
    investment: {
      metrics: investmentMetrics,
      analysis: investmentAnalysis,
    },
    market: marketMetrics,
    riskAnalysis,
    riskDetails,
    allocation,
    safeInvestAmount,
    actions,
    chartData: {
      expensePie: input.monthlyExpenses.map((c) => ({ category: c.name, value: c.amount })),
      allocationBar: [
        { asset: 'Equity', pct: allocation.equity },
        { asset: 'Debt', pct: allocation.debt },
        { asset: 'Gold', pct: allocation.gold },
        { asset: 'Mutual Funds', pct: allocation.mutualFunds },
      ],
      investmentGrowth: investmentHistory.slice(-12),
      kpis: [
        { label: 'Savings Ratio %', value: savingsRatio },
        { label: 'Expense Ratio %', value: expenseRatio },
        { label: 'Risk Score', value: riskScore },
        { label: 'Safe Invest / mo', value: Math.round(safeInvestAmount) },
        { label: 'CAGR', value: `${investmentMetrics.cagr}%` },
        { label: 'Volatility', value: `${riskAnalysis.volatility}%` },
        { label: 'Sharpe Ratio', value: riskAnalysis.sharpeRatio },
        { label: 'Max Drawdown', value: `${riskAnalysis.maxDrawdown}%` },
      ],
    },
  };
}

// Example usage (remove or adapt in UI layer):
// const result = generateAdvice({
//   age: 30,
//   monthlyIncome: 100000,
//   monthlySavings: 20000,
//   monthlyExpenses: [
//     { name: 'Rent', amount: 25000 },
//     { name: 'Food', amount: 12000 },
//     { name: 'Transport', amount: 6000 },
//     { name: 'Shopping', amount: 8000 },
//   ],
//   existingInvestments: 200000,
//   riskTolerance: 'Medium',
//   expenseHistory: [
//     { month: 'Dec', total: 48000 },
//     { month: 'Jan', total: 51000 },
//   ],
//   incomeStability: 'High',
//   market: { goldPrice: 6000, stockIndex: 22000, mutualFundNAV: 42 },
// });
