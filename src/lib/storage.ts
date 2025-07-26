import { Expense, ExpenseSummary, CategorySummary, MonthlySpending, Category } from '@/types/expense';
import { Income, IncomeSummary, IncomeCategorySummary, MonthlyIncome, IncomeCategory, FinancialSummary } from '@/types/income';
import { Budget, BudgetProgress, BudgetSummary } from '@/types/budget';

const STORAGE_KEY = 'expense-tracker-expenses';
const INCOME_STORAGE_KEY = 'expense-tracker-income';
const BUDGET_STORAGE_KEY = 'expense-tracker-budgets';
const STREAK_SETTINGS_KEY = 'expense-tracker-streak-settings';

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
  },

  // Budget Management Methods
  getBudgets(): Budget[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(BUDGET_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading budgets from localStorage:', error);
      return [];
    }
  },

  saveBudgets(budgets: Budget[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving budgets to localStorage:', error);
    }
  },

  addBudget(budget: Budget): void {
    const budgets = this.getBudgets();
    budgets.push(budget);
    this.saveBudgets(budgets);
  },

  updateBudget(updatedBudget: Budget): void {
    const budgets = this.getBudgets();
    const index = budgets.findIndex(budget => budget.id === updatedBudget.id);
    if (index !== -1) {
      budgets[index] = updatedBudget;
      this.saveBudgets(budgets);
    }
  },

  deleteBudget(id: string): void {
    const budgets = this.getBudgets();
    const filtered = budgets.filter(budget => budget.id !== id);
    this.saveBudgets(filtered);
  },

  calculateBudgetProgress(budget: Budget, expenses: Expense[]): BudgetProgress {
    const now = new Date();
    const startDate = new Date(budget.startDate);
    const endDate = budget.endDate ? new Date(budget.endDate) : null;

    // Calculate period dates based on budget type
    let periodStart: Date;
    let periodEnd: Date;

    if (budget.period === 'monthly') {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (budget.period === 'weekly') {
      const dayOfWeek = now.getDay();
      periodStart = new Date(now.getTime() - (dayOfWeek * 24 * 60 * 60 * 1000));
      periodEnd = new Date(periodStart.getTime() + (6 * 24 * 60 * 60 * 1000));
    } else { // yearly
      periodStart = new Date(now.getFullYear(), 0, 1);
      periodEnd = new Date(now.getFullYear(), 11, 31);
    }

    // Filter expenses for this budget period and category
    const relevantExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const isInPeriod = expenseDate >= periodStart && expenseDate <= periodEnd;
      const isInCategory = budget.category === 'Total' || expense.category === budget.category;
      return isInPeriod && isInCategory;
    });

    const spent = relevantExpenses.reduce((total, expense) => total + expense.amount, 0);
    const remaining = Math.max(0, budget.amount - spent);
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    const isOverBudget = spent > budget.amount;
    const shouldAlert = percentage >= budget.alertThreshold;

    // Calculate days remaining in period
    const daysRemaining = Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const dailyAllowance = daysRemaining > 0 ? remaining / daysRemaining : 0;

    return {
      budget,
      spent,
      remaining,
      percentage,
      isOverBudget,
      shouldAlert,
      daysRemaining,
      dailyAllowance
    };
  },

  generateBudgetSummary(budgets: Budget[], expenses: Expense[]): BudgetSummary {
    const activeBudgets = budgets.filter(budget => budget.isActive);
    const budgetProgress = activeBudgets.map(budget => 
      this.calculateBudgetProgress(budget, expenses)
    );

    const totalBudgeted = activeBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgetProgress.reduce((sum, progress) => sum + progress.spent, 0);
    const totalRemaining = Math.max(0, totalBudgeted - totalSpent);
    const overBudgetCount = budgetProgress.filter(progress => progress.isOverBudget).length;
    const alertCount = budgetProgress.filter(progress => progress.shouldAlert).length;

    return {
      totalBudgeted,
      totalSpent,
      totalRemaining,
      overBudgetCount,
      alertCount,
      budgetProgress
    };
  },

  // Streak Management Methods
  getStreakSettings(): { isVisible: boolean } {
    if (typeof window === 'undefined') return { isVisible: true };
    
    try {
      const data = localStorage.getItem(STREAK_SETTINGS_KEY);
      return data ? JSON.parse(data) : { isVisible: true };
    } catch (error) {
      console.error('Error reading streak settings from localStorage:', error);
      return { isVisible: true };
    }
  },

  saveStreakSettings(settings: { isVisible: boolean }): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STREAK_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving streak settings to localStorage:', error);
    }
  },

  calculateBudgetStreak(expenses: Expense[], budgets: Budget[]): number {
    if (budgets.length === 0) return 0;

    const today = new Date();
    let currentStreak = 0;
    let checkDate = new Date(today);

    // Go back day by day and check if budgets were maintained
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayExpenses = expenses.filter(expense => expense.date === dateStr);
      
      if (dayExpenses.length === 0) {
        // No expenses on this day - consider it a good day for budget
        currentStreak++;
      } else {
        // Check if any budget was exceeded on this day
        let dayExceededBudget = false;
        
        for (const budget of budgets) {
          const budgetStartDate = new Date(budget.startDate);
          const budgetEndDate = budget.endDate ? new Date(budget.endDate) : new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
          
          if (checkDate >= budgetStartDate && checkDate <= budgetEndDate) {
            // Calculate spending in budget period up to this date
            const periodExpenses = expenses.filter(expense => {
              const expenseDate = new Date(expense.date);
              return expenseDate >= budgetStartDate && 
                     expenseDate <= checkDate &&
                     (budget.category === 'Total' || expense.category === budget.category);
            });
            
            const totalSpent = periodExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            
            // Calculate daily budget allowance
            const totalDaysInPeriod = Math.ceil((budgetEndDate.getTime() - budgetStartDate.getTime()) / (1000 * 60 * 60 * 24));
            const dailyBudget = budget.amount / totalDaysInPeriod;
            
            // Calculate days elapsed
            const daysElapsed = Math.ceil((checkDate.getTime() - budgetStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const allowedSpending = dailyBudget * daysElapsed;
            
            if (totalSpent > allowedSpending) {
              dayExceededBudget = true;
              break;
            }
          }
        }
        
        if (dayExceededBudget) {
          break; // Streak ends here
        } else {
          currentStreak++;
        }
      }
      
      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return currentStreak;
  }
};