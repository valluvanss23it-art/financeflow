import { useState, useEffect } from 'react';
import {
  incomeAPI,
  expensesAPI,
  assetsAPI,
  liabilitiesAPI,
  insuranceAPI,
  goalsAPI,
} from '@/lib/api';
import { useAuth } from './useAuth';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

interface NetWorthData {
  month: string;
  netWorth: number;
}

interface AssetAllocation {
  name: string;
  value: number;
  color: string;
}

interface GoalSummary {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  progress: number;
  priority: string;
  category: string;
}

interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  investments: number;
  assets: number;
  liabilities: number;
  netWorth: number;
  insuranceCoverage: number;
  loanOutstanding: number;
  activeGoals: number;
}

interface DashboardData {
  stats: DashboardStats;
  monthlyData: MonthlyData[];
  netWorthData: NetWorthData[];
  assetAllocation: AssetAllocation[];
  goals: GoalSummary[];
  loading: boolean;
}

const ASSET_TYPE_COLORS: Record<string, string> = {
  cash: 'hsl(var(--primary))',
  bank: 'hsl(var(--secondary))',
  fd: 'hsl(var(--accent))',
  stocks: 'hsl(var(--info))',
  mutual_funds: 'hsl(142 76% 36%)',
  crypto: 'hsl(45 93% 47%)',
  gold: 'hsl(38 92% 50%)',
  property: 'hsl(var(--muted-foreground))',
  other: 'hsl(var(--muted))',
};

const ASSET_TYPE_LABELS: Record<string, string> = {
  cash: 'Cash',
  bank: 'Bank',
  fd: 'Fixed Deposit',
  stocks: 'Stocks',
  mutual_funds: 'Mutual Funds',
  crypto: 'Crypto',
  gold: 'Gold',
  property: 'Property',
  other: 'Other',
};

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpense: 0,
    savings: 0,
    investments: 0,
    assets: 0,
    liabilities: 0,
    netWorth: 0,
    insuranceCoverage: 0,
    loanOutstanding: 0,
    activeGoals: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [netWorthData, setNetWorthData] = useState<NetWorthData[]>([]);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocation[]>([]);
  const [goals, setGoals] = useState<GoalSummary[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        // Fetch all data in parallel
        const [
          incomeResponse,
          expenseResponse,
          assetsResponse,
          liabilitiesResponse,
          insuranceResponse,
          goalsResponse,
        ] = await Promise.all([
          incomeAPI.getAll(),
          expensesAPI.getAll(),
          assetsAPI.getAll(),
          liabilitiesAPI.getAll(),
          insuranceAPI.getAll(),
          goalsAPI.getAll(),
        ]);

        const incomeData = incomeResponse.data.data || [];
        const expenseData = expenseResponse.data.data || [];
        const assetsData = assetsResponse.data.data || [];
        const liabilitiesData = liabilitiesResponse.data.data || [];
        const insuranceData = insuranceResponse.data.data || [];
        const goalsData = goalsResponse.data.data || [];

        // Calculate total income and expense (current month)
        const now = new Date();
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);

        const currentMonthIncome = incomeData
          .filter(i => {
            const date = new Date(i.date);
            return date >= currentMonthStart && date <= currentMonthEnd;
          })
          .reduce((sum, i) => sum + Number(i.amount), 0);

        const currentMonthExpense = expenseData
          .filter(e => {
            const date = new Date(e.date);
            return date >= currentMonthStart && date <= currentMonthEnd;
          })
          .reduce((sum, e) => sum + Number(e.amount), 0);

        // Calculate total assets value
        const totalAssets = assetsData.reduce((sum, a) => sum + Number(a.current_value), 0);

        // Calculate total liabilities (outstanding balance)
        const totalLiabilities = liabilitiesData
          .filter(l => !l.is_paid_off)
          .reduce((sum, l) => sum + Number(l.outstanding_balance), 0);

        // Calculate investment assets (stocks, mutual funds, crypto)
        const investmentAssets = assetsData
          .filter(a => ['stocks', 'mutual_funds', 'crypto', 'fd'].includes(a.type))
          .reduce((sum, a) => sum + Number(a.current_value), 0);

        // Calculate insurance coverage
        const totalInsuranceCoverage = insuranceData
          .filter(i => i.is_active)
          .reduce((sum, i) => sum + Number(i.coverage_amount), 0);

        // Count active goals
        const activeGoals = goalsData.filter(g => !g.is_completed).length;

        // Net worth = assets - liabilities
        const netWorth = totalAssets - totalLiabilities;

        setStats({
          totalIncome: currentMonthIncome,
          totalExpense: currentMonthExpense,
          savings: currentMonthIncome - currentMonthExpense,
          investments: investmentAssets,
          assets: totalAssets,
          liabilities: totalLiabilities,
          netWorth,
          insuranceCoverage: totalInsuranceCoverage,
          loanOutstanding: totalLiabilities,
          activeGoals,
        });

        // Generate monthly income vs expense data for last 6 months
        const monthlyTrends: MonthlyData[] = [];
        for (let i = 5; i >= 0; i--) {
          const monthDate = subMonths(now, i);
          const monthStart = startOfMonth(monthDate);
          const monthEnd = endOfMonth(monthDate);
          const monthLabel = format(monthDate, 'MMM');

          const monthIncome = incomeData
            .filter(item => {
              const date = new Date(item.date);
              return date >= monthStart && date <= monthEnd;
            })
            .reduce((sum, item) => sum + Number(item.amount), 0);

          const monthExpense = expenseData
            .filter(item => {
              const date = new Date(item.date);
              return date >= monthStart && date <= monthEnd;
            })
            .reduce((sum, item) => sum + Number(item.amount), 0);

          monthlyTrends.push({
            month: monthLabel,
            income: monthIncome,
            expense: monthExpense,
          });
        }
        setMonthlyData(monthlyTrends);

        // Generate net worth trend (cumulative assets - liabilities per month)
        // For simplicity, we'll show current net worth trend based on available data
        const netWorthTrend: NetWorthData[] = [];
        let cumulativeNetWorth = 0;
        
        for (let i = 5; i >= 0; i--) {
          const monthDate = subMonths(now, i);
          const monthLabel = format(monthDate, 'MMM');
          
          // Calculate cumulative savings for that month
          const monthEnd = endOfMonth(monthDate);
          
          const cumulativeIncome = incomeData
            .filter(item => new Date(item.date) <= monthEnd)
            .reduce((sum, item) => sum + Number(item.amount), 0);
          
          const cumulativeExpense = expenseData
            .filter(item => new Date(item.date) <= monthEnd)
            .reduce((sum, item) => sum + Number(item.amount), 0);
          
          cumulativeNetWorth = totalAssets - totalLiabilities + (cumulativeIncome - cumulativeExpense);
          
          netWorthTrend.push({
            month: monthLabel,
            netWorth: Math.max(0, cumulativeNetWorth),
          });
        }
        setNetWorthData(netWorthTrend);

        // Calculate asset allocation by type
        const allocationMap: Record<string, number> = {};
        assetsData.forEach(asset => {
          const type = asset.type;
          allocationMap[type] = (allocationMap[type] || 0) + Number(asset.current_value);
        });

        const allocation: AssetAllocation[] = Object.entries(allocationMap)
          .filter(([, value]) => value > 0)
          .map(([type, value]) => ({
            name: ASSET_TYPE_LABELS[type] || type,
            value: Math.round((value / totalAssets) * 100) || 0,
            color: ASSET_TYPE_COLORS[type] || 'hsl(var(--muted))',
          }));
        
        setAssetAllocation(allocation.length > 0 ? allocation : [
          { name: 'No Assets', value: 100, color: 'hsl(var(--muted))' }
        ]);

        // Process goals for summary
        const goalSummaries: GoalSummary[] = goalsData
          .filter(g => !g.is_completed)
          .slice(0, 5)
          .map(g => ({
            id: g.id,
            name: g.name,
            target_amount: g.target_amount,
            current_amount: g.current_amount,
            progress: Math.min(100, Math.round((g.current_amount / g.target_amount) * 100)),
            priority: g.priority,
            category: g.category,
          }));
        
        setGoals(goalSummaries);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return {
    stats,
    monthlyData,
    netWorthData,
    assetAllocation,
    goals,
    loading,
  };
}
