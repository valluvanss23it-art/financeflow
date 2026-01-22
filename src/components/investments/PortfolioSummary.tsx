import { TrendingUp, TrendingDown, PieChart, BarChart3, Percent } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

interface Asset {
  id: string;
  name: string;
  type: string;
  current_value: number;
  purchase_value: number | null;
  purchase_date: string | null;
}

interface PortfolioSummaryProps {
  assets: Asset[];
  loading?: boolean;
}

export function PortfolioSummary({ assets, loading }: PortfolioSummaryProps) {
  const totalCurrentValue = assets.reduce((sum, a) => sum + Number(a.current_value), 0);
  const totalPurchaseValue = assets.reduce((sum, a) => sum + Number(a.purchase_value || 0), 0);
  const totalGainLoss = totalCurrentValue - totalPurchaseValue;
  const totalReturnPercent = totalPurchaseValue > 0 
    ? ((totalGainLoss / totalPurchaseValue) * 100).toFixed(2) 
    : '0.00';

  // Calculate XIRR approximation (simplified annual return)
  const calculateAnnualReturn = () => {
    const assetsWithDates = assets.filter(a => a.purchase_date && a.purchase_value);
    if (assetsWithDates.length === 0) return '0.00';

    let totalWeightedReturn = 0;
    let totalWeight = 0;

    assetsWithDates.forEach(asset => {
      const purchaseDate = new Date(asset.purchase_date!);
      const today = new Date();
      const years = (today.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      
      if (years > 0 && asset.purchase_value) {
        const absoluteReturn = (Number(asset.current_value) - Number(asset.purchase_value)) / Number(asset.purchase_value);
        const annualReturn = Math.pow(1 + absoluteReturn, 1 / years) - 1;
        totalWeightedReturn += annualReturn * Number(asset.purchase_value);
        totalWeight += Number(asset.purchase_value);
      }
    });

    return totalWeight > 0 ? ((totalWeightedReturn / totalWeight) * 100).toFixed(2) : '0.00';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted/50 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Portfolio Value"
        value={totalCurrentValue}
        icon={<PieChart className="w-5 h-5" />}
        variant="income"
      />
      <StatCard
        title="Invested Amount"
        value={totalPurchaseValue}
        icon={<BarChart3 className="w-5 h-5" />}
        variant="neutral"
      />
      <StatCard
        title="Total Returns"
        value={totalGainLoss}
        icon={totalGainLoss >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
        variant={totalGainLoss >= 0 ? 'income' : 'expense'}
        subtitle={`${totalGainLoss >= 0 ? '+' : ''}${totalReturnPercent}%`}
      />
      <StatCard
        title="Annual Return (CAGR)"
        value={`${calculateAnnualReturn()}%`}
        icon={<Percent className="w-5 h-5" />}
        variant="savings"
        subtitle="Compound growth rate"
      />
    </div>
  );
}
