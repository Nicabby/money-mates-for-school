'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Income } from '@/types/income';
import { storageService } from '@/lib/storage';

interface IncomeContextType {
  incomes: Income[];
  addIncome: (income: Income) => void;
  updateIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;
  getIncomeById: (id: string) => Income | undefined;
  refreshIncomes: () => void;
  loading: boolean;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const useIncomes = () => {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error('useIncomes must be used within an IncomeProvider');
  }
  return context;
};

interface IncomeProviderProps {
  children: ReactNode;
}

export const IncomeProvider: React.FC<IncomeProviderProps> = ({ children }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshIncomes = () => {
    setLoading(true);
    const storedIncomes = storageService.getIncomes();
    setIncomes(storedIncomes);
    setLoading(false);
  };

  useEffect(() => {
    refreshIncomes();
  }, []);

  const addIncome = (income: Income) => {
    storageService.addIncome(income);
    setIncomes(prev => [...prev, income]);
  };

  const updateIncome = (updatedIncome: Income) => {
    storageService.updateIncome(updatedIncome);
    setIncomes(prev => prev.map(income => 
      income.id === updatedIncome.id ? updatedIncome : income
    ));
  };

  const deleteIncome = (id: string) => {
    storageService.deleteIncome(id);
    setIncomes(prev => prev.filter(income => income.id !== id));
  };

  const getIncomeById = (id: string) => {
    return incomes.find(income => income.id === id);
  };

  const value: IncomeContextType = {
    incomes,
    addIncome,
    updateIncome,
    deleteIncome,
    getIncomeById,
    refreshIncomes,
    loading,
  };

  return (
    <IncomeContext.Provider value={value}>
      {children}
    </IncomeContext.Provider>
  );
};