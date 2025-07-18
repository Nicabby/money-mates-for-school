export interface Income {
  id: string;
  date: string;
  amount: number;
  category: IncomeCategory;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export type IncomeCategory = 
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Gift'
  | 'Other';

export interface IncomeFormData {
  date: string;
  amount: string;
  category: IncomeCategory;
  source: string;
}

export interface IncomeFilter {
  category: IncomeCategory | 'All';
  dateFrom: string;
  dateTo: string;
  searchTerm: string;
}

export interface IncomeSummary {
  totalIncome: number;
  monthlyTotal: number;
  categorySummary: IncomeCategorySummary[];
  topCategories: IncomeCategorySummary[];
}

export interface IncomeCategorySummary {
  category: IncomeCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyIncome {
  month: string;
  amount: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyNet: number;
}