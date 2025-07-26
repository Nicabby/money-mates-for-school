import { Category } from './expense';

export interface Budget {
  id: string;
  name: string;
  category: Category | 'Total'; // 'Total' for overall monthly budget
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate?: string; // Optional for ongoing budgets
  alertThreshold: number; // Percentage (e.g., 80 means alert at 80% of budget)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFormData {
  name: string;
  category: Category | 'Total';
  amount: string;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate?: string;
  alertThreshold: string;
}

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  shouldAlert: boolean;
  daysRemaining: number;
  dailyAllowance: number;
}

export interface BudgetSummary {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  overBudgetCount: number;
  alertCount: number;
  budgetProgress: BudgetProgress[];
}

export type BudgetPeriod = 'monthly' | 'weekly' | 'yearly';