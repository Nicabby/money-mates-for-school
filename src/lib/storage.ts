import { Expense, ExpenseSummary, CategorySummary, MonthlySpending, Category } from '@/types/expense';
import { Income, IncomeSummary, IncomeCategorySummary, MonthlyIncome, IncomeCategory, FinancialSummary } from '@/types/income';

const STORAGE_KEY = 'expense-tracker-expenses';
const INCOME_STORAGE_KEY = 'expense-tracker-income';

export const storageService = {
  getExpenses(): Expense[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveExpenses(expenses: Expense[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  addExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    expenses.push(expense);
    this.saveExpenses(expenses);
  },

  updateExpense(updatedExpense: Expense): void {
    const expenses = this.getExpenses();
    const index = expenses.findIndex(expense => expense.id === updatedExpense.id);
    if (index !== -1) {
      expenses[index] = updatedExpense;
      this.saveExpenses(expenses);
    }
  },

  deleteExpense(id: string): void {
    const expenses = this.getExpenses();
    const filtered = expenses.filter(expense => expense.id !== id);
    this.saveExpenses(filtered);
  },

  getExpenseById(id: string): Expense | undefined {
    const expenses = this.getExpenses();
    return expenses.find(expense => expense.id === id);
  },

  generateExpenseSummary(expenses: Expense[]): ExpenseSummary {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = expenses.filter(expense => 
      expense.date.startsWith(currentMonth)
    );
    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryCounts = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categorySummary: CategorySummary[] = Object.entries(categoryTotals).map(([category, amount]) => ({
      category: category as Category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      count: categoryCounts[category] || 0,
    }));

    const topCategories = categorySummary
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalExpenses,
      monthlyTotal,
      categorySummary,
      topCategories,
    };
  },

  getMonthlySpending(expenses: Expense[]): MonthlySpending[] {
    const monthlyData = expenses.reduce((acc, expense) => {
      const month = expense.date.slice(0, 7);
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },

  exportToCSV(expenses: Expense[]): string {
    if (expenses.length === 0) return 'No expenses to export';

    const headers = ['Date', 'Amount', 'Category', 'Description'];
    const rows = expenses.map(expense => [
      expense.date,
      expense.amount.toString(),
      expense.category,
      expense.description
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  },

  downloadCSV(expenses: Expense[], filename: string = 'expenses.csv'): void {
    const csvContent = this.exportToCSV(expenses);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  // Income methods
  getIncomes(): Income[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(INCOME_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading income from localStorage:', error);
      return [];
    }
  },

  saveIncomes(incomes: Income[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(incomes));
    } catch (error) {
      console.error('Error saving income to localStorage:', error);
    }
  },

  addIncome(income: Income): void {
    const incomes = this.getIncomes();
    incomes.push(income);
    this.saveIncomes(incomes);
  },

  updateIncome(updatedIncome: Income): void {
    const incomes = this.getIncomes();
    const index = incomes.findIndex(income => income.id === updatedIncome.id);
    if (index !== -1) {
      incomes[index] = updatedIncome;
      this.saveIncomes(incomes);
    }
  },

  deleteIncome(id: string): void {
    const incomes = this.getIncomes();
    const filtered = incomes.filter(income => income.id !== id);
    this.saveIncomes(filtered);
  },

  getIncomeById(id: string): Income | undefined {
    const incomes = this.getIncomes();
    return incomes.find(income => income.id === id);
  },

  generateIncomeSummary(incomes: Income[]): IncomeSummary {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyIncomes = incomes.filter(income => 
      income.date.startsWith(currentMonth)
    );
    const monthlyTotal = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0);

    const categoryTotals = incomes.reduce((acc, income) => {
      acc[income.category] = (acc[income.category] || 0) + income.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryCounts = incomes.reduce((acc, income) => {
      acc[income.category] = (acc[income.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categorySummary: IncomeCategorySummary[] = Object.entries(categoryTotals).map(([category, amount]) => ({
      category: category as IncomeCategory,
      amount,
      percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
      count: categoryCounts[category] || 0,
    }));

    const topCategories = categorySummary
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalIncome,
      monthlyTotal,
      categorySummary,
      topCategories,
    };
  },

  getMonthlyIncome(incomes: Income[]): MonthlyIncome[] {
    const monthlyData = incomes.reduce((acc, income) => {
      const month = income.date.slice(0, 7);
      acc[month] = (acc[month] || 0) + income.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },

  generateFinancialSummary(expenses: Expense[], incomes: Income[]): FinancialSummary {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const netIncome = totalIncome - totalExpenses;
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = expenses.filter(expense => 
      expense.date.startsWith(currentMonth)
    );
    const monthlyIncomes = incomes.filter(income => 
      income.date.startsWith(currentMonth)
    );
    
    const monthlyExpensesTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyIncomeTotal = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0);
    const monthlyNet = monthlyIncomeTotal - monthlyExpensesTotal;

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      monthlyIncome: monthlyIncomeTotal,
      monthlyExpenses: monthlyExpensesTotal,
      monthlyNet,
    };
  },

  exportIncomeToCSV(incomes: Income[]): string {
    if (incomes.length === 0) return 'No income to export';

    const headers = ['Date', 'Amount', 'Category', 'Source'];
    const rows = incomes.map(income => [
      income.date,
      income.amount.toString(),
      income.category,
      income.source
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  },

  downloadIncomeCSV(incomes: Income[], filename: string = 'income.csv'): void {
    const csvContent = this.exportIncomeToCSV(incomes);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};