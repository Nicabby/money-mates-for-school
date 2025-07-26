'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Budget, BudgetSummary } from '@/types/budget';
import { storageService } from '@/lib/storage';
import { useExpenses } from './ExpenseProvider';

interface BudgetContextType {
  budgets: Budget[];
  budgetSummary: BudgetSummary;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  refreshBudgets: () => void;
  isLoading: boolean;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
};

interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>({
    totalBudgeted: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overBudgetCount: 0,
    alertCount: 0,
    budgetProgress: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { expenses } = useExpenses();

  // Load budgets from storage on mount
  useEffect(() => {
    const loadBudgets = () => {
      try {
        const storedBudgets = storageService.getBudgets();
        setBudgets(storedBudgets);
      } catch (error) {
        console.error('Error loading budgets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgets();
  }, []);

  // Update budget summary when budgets or expenses change
  useEffect(() => {
    if (budgets.length > 0 || expenses.length > 0) {
      const summary = storageService.generateBudgetSummary(budgets, expenses);
      setBudgetSummary(summary);
    }
  }, [budgets, expenses]);

  const addBudget = (budget: Budget) => {
    try {
      storageService.addBudget(budget);
      setBudgets(prev => [...prev, budget]);
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  };

  const updateBudget = (updatedBudget: Budget) => {
    try {
      storageService.updateBudget(updatedBudget);
      setBudgets(prev => 
        prev.map(budget => 
          budget.id === updatedBudget.id ? updatedBudget : budget
        )
      );
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };

  const deleteBudget = (id: string) => {
    try {
      storageService.deleteBudget(id);
      setBudgets(prev => prev.filter(budget => budget.id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  };

  const refreshBudgets = () => {
    try {
      const storedBudgets = storageService.getBudgets();
      setBudgets(storedBudgets);
    } catch (error) {
      console.error('Error refreshing budgets:', error);
    }
  };

  const contextValue: BudgetContextType = {
    budgets,
    budgetSummary,
    addBudget,
    updateBudget,
    deleteBudget,
    refreshBudgets,
    isLoading
  };

  return (
    <BudgetContext.Provider value={contextValue}>
      {children}
    </BudgetContext.Provider>
  );
};