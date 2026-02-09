export type RiskTolerance = "Low" | "Medium" | "High";

interface ExpenseCategory {
  name: string;
  amount: number;
}

interface AdviceInput {
  age: number;
  monthlyIncome: number;
  monthlySavings: number;
  monthlyExpenses: ExpenseCategory[];
  existingInvestments: number;
  riskTolerance: RiskTolerance;
  expenseHistory: Array<{ month: string; total: number }>;
  incomeStability: "Low" | "Medium" | "High";
}

interface Advice {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  action: string;
  timeframe?: string;
}

export function generateAdvice(input: AdviceInput): Advice[] {
  const advice: Advice[] = [];

  const savingsRate =
    input.monthlyIncome > 0
      ? (input.monthlySavings / input.monthlyIncome) * 100
      : 0;

  // Check emergency fund
  if (input.monthlySavings < input.monthlyIncome * 0.2) {
    advice.push({
      title: "Build Your Emergency Fund",
      description:
        "You should aim to save 20-30% of your income. Currently at " +
        savingsRate.toFixed(1) +
        "%.",
      priority: "High",
      action: "Increase monthly savings to reach 3-6 months of expenses",
      timeframe: "6-12 months",
    });
  }

  // Check investment allocations
  if (input.existingInvestments === 0 && input.monthlySavings > 0) {
    advice.push({
      title: "Consider Investing",
      description:
        "With a good savings rate, consider diversifying into investments based on your risk tolerance.",
      priority: input.riskTolerance === "Low" ? "Medium" : "High",
      action:
        input.riskTolerance === "Low"
          ? "Explore conservative investments like bonds"
          : "Consider a diversified portfolio of stocks and bonds",
      timeframe: "3-6 months",
    });
  }

  // Check largest expense category
  if (input.monthlyExpenses.length > 0) {
    const largestExpense = input.monthlyExpenses.reduce((prev, current) =>
      prev.amount > current.amount ? prev : current
    );

    if (
      largestExpense.amount > input.monthlyIncome * 0.3
    ) {
      advice.push({
        title: `Review Your ${largestExpense.name} Spending`,
        description: `Your ${largestExpense.name.toLowerCase()} represents ${((largestExpense.amount / input.monthlyIncome) * 100).toFixed(1)}% of your income.`,
        priority: "Medium",
        action: `Look for ways to reduce ${largestExpense.name.toLowerCase()} expenses`,
        timeframe: "1-3 months",
      });
    }
  }

  // Income stability advice
  if (input.incomeStability === "Low") {
    advice.push({
      title: "Stabilize Your Income",
      description: "Your income appears unstable. Build a larger emergency fund.",
      priority: "High",
      action: "Aim for 6-12 months of expenses in savings",
      timeframe: "12+ months",
    });
  }

  // Age-based advice
  if (input.age < 30 && input.existingInvestments < input.monthlyIncome * 24) {
    advice.push({
      title: "Leverage Your Youth",
      description:
        "You have time for compound growth. Start investing early for long-term wealth.",
      priority: "High",
      action: "Set up a long-term investment plan",
      timeframe: "Ongoing",
    });
  }

  return advice.length > 0
    ? advice
    : [
        {
          title: "You're On Track",
          description:
            "Your finances look healthy. Keep up your current savings rate.",
          priority: "Low",
          action: "Continue current financial habits",
        },
      ];
}
