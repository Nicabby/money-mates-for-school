'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import { storageService } from '@/lib/storage';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  refreshExpenses: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const refreshExpenses = () => {
    setExpenses(storageService.getExpenses());
  };

  useEffect(() => {
    refreshExpenses();
  }, []);

  const addExpense = (expense: Expense) => {
    storageService.addExpense(expense);
    refreshExpenses();
  };

  const updateExpense = (expense: Expense) => {
    storageService.updateExpense(expense);
    refreshExpenses();
  };

  const deleteExpense = (id: string) => {
    storageService.deleteExpense(id);
    refreshExpenses();
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        refreshExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};