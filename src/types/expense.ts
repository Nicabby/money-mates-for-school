export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: Category;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type Category = 
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Tech'
  | 'Other';

export interface ExpenseFormData {
  date: string;
  amount: string;
  category: Category;
  description: string;
}

export interface ExpenseFilter {
  category: Category | 'All';
  dateFrom: string;
  dateTo: string;
  searchTerm: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  monthlyTotal: number;
  categorySummary: CategorySummary[];
  topCategories: CategorySummary[];
}

export interface CategorySummary {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}