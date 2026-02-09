import { useState, useEffect } from 'react';
import { dashboardAPI } from '@/lib/api';

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
  savingsRate: number;
  assetsCount: number;
  investmentsCount: number;
  goalsCount: number;
  completedGoalsCount: number;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

interface NetWorthPoint {
  date: string;
  value: number;
}

interface AssetAllocationType {
  name: string;
  value: number;
  percentage: number;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  progress: number;
}

interface DashboardData {
  stats: DashboardStats;
  monthlyData: MonthlyData[];
  netWorthData: NetWorthPoint[];
  assetAllocation: AssetAllocationType[];
  goals: Goal[];
  loading: boolean;
  error: Error | null;
}

export function useDashboardData(): DashboardData {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    netWorth: 0,
    savingsRate: 0,
    assetsCount: 0,
    investmentsCount: 0,
    goalsCount: 0,
    completedGoalsCount: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [netWorthData, setNetWorthData] = useState<NetWorthPoint[]>([]);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocationType[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getStats();
        const data = response.data;

        if (data && data.data) {
          const dashData = data.data;
          setStats({
            totalIncome: dashData.totalIncome || 0,
            totalExpenses: dashData.totalExpenses || 0,
            netWorth: dashData.netWorth || 0,
            savingsRate: dashData.savingsRate || 0,
            assetsCount: dashData.assetsCount || 0,
            investmentsCount: dashData.investmentsCount || 0,
            goalsCount: dashData.goalsCount || 0,
            completedGoalsCount: dashData.completedGoalsCount || 0,
          });
          setMonthlyData(dashData.monthlyData || []);
          setNetWorthData(dashData.netWorthData || []);
          setAssetAllocation(dashData.assetAllocation || []);
          setGoals(dashData.goals || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
        // Set default values on error
        setMonthlyData([]);
        setNetWorthData([]);
        setAssetAllocation([]);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    monthlyData,
    netWorthData,
    assetAllocation,
    goals,
    loading,
    error,
  };
}
