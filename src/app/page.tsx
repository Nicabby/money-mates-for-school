'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExpenses } from '@/components/ExpenseProvider';
import { useIncomes } from '@/components/IncomeProvider';
import { validateExpenseForm, validateIncomeForm, generateId } from '@/lib/utils';
import { Expense, ExpenseFormData, Category } from '@/types/expense';
import { Income, IncomeFormData, IncomeCategory } from '@/types/income';
import LoadingSpinner from '@/components/LoadingSpinner';
import SampleDataLoader from '@/components/SampleDataLoader';
import MoneyTermsPreview from '@/components/MoneyTermsPreview';
import QuickStartGuide from '@/components/QuickStartGuide';
import ParentDashboard from '@/components/ParentDashboard';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { addExpense } = useExpenses();
  const { addIncome } = useIncomes();
  const { getUserDisplayName, signOut, isAuthenticated, isParent, isKid } = useAuth();
  const router = useRouter();
  const [maxDate, setMaxDate] = useState('');

  const [expenseFormData, setExpenseFormData] = useState<ExpenseFormData>({
    date: '',
    amount: '',
    category: 'Food',
    description: '',
  });

  const [incomeFormData, setIncomeFormData] = useState<IncomeFormData>({
    date: '',
    amount: '',
    category: 'Salary',
    source: '',
  });

  // Set current date after hydration to avoid SSR mismatch
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMaxDate(today);
    setExpenseFormData(prev => ({ ...prev, date: today }));
    setIncomeFormData(prev => ({ ...prev, date: today }));
  }, []);

  const [expenseErrors, setExpenseErrors] = useState<Record<string, string>>({});
  const [incomeErrors, setIncomeErrors] = useState<Record<string, string>>({});
  const [isExpenseSubmitting, setIsExpenseSubmitting] = useState(false);
  const [isIncomeSubmitting, setIsIncomeSubmitting] = useState(false);

  const expenseCategories: Category[] = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Tech', 'Other'];
  const incomeCategories: IncomeCategory[] = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpenseFormData(prev => ({ ...prev, [name]: value }));
    if (expenseErrors[name]) {
      setExpenseErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setIncomeFormData(prev => ({ ...prev, [name]: value }));
    if (incomeErrors[name]) {
      setIncomeErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExpenseSubmitting(true);

    const validation = validateExpenseForm(expenseFormData);
    if (!validation.isValid) {
      setExpenseErrors(validation.errors);
      setIsExpenseSubmitting(false);
      return;
    }

    try {
      const expense: Expense = {
        id: generateId(),
        date: expenseFormData.date,
        amount: parseFloat(expenseFormData.amount),
        category: expenseFormData.category,
        description: expenseFormData.description.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addExpense(expense);
      setExpenseFormData({
        date: expenseFormData.date || new Date().toISOString().split('T')[0],
        amount: '',
        category: 'Food',
        description: '',
      });
      
      // Show success message or redirect
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving expense:', error);
      setExpenseErrors({ submit: 'Failed to save expense. Please try again.' });
    } finally {
      setIsExpenseSubmitting(false);
    }
  };

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIncomeSubmitting(true);

    const validation = validateIncomeForm(incomeFormData);
    if (!validation.isValid) {
      setIncomeErrors(validation.errors);
      setIsIncomeSubmitting(false);
      return;
    }

    try {
      const income: Income = {
        id: generateId(),
        date: incomeFormData.date,
        amount: parseFloat(incomeFormData.amount),
        category: incomeFormData.category,
        source: incomeFormData.source.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addIncome(income);
      setIncomeFormData({
        date: incomeFormData.date || new Date().toISOString().split('T')[0],
        amount: '',
        category: 'Salary',
        source: '',
      });
      
      // Show success message or redirect
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving income:', error);
      setIncomeErrors({ submit: 'Failed to save income. Please try again.' });
    } finally {
      setIsIncomeSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mx-auto" style={{ maxWidth: 'calc(64rem + 6cm)', paddingTop: '12pt' }}>
        <div className="text-center grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center">
            <img src="/MoneyMateslogo.png" alt="MoneyMates" style={{ height: '201.6px', width: 'auto' }} />
          </div>
          <div className="text-center">
            {/* TEMPORARY: Always show welcome message for development */}
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to MoneyMates! 👋
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                Ready to manage your money like a pro? Let&apos;s track your earnings and spending!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📊 View Dashboard
                </button>
              </div>
            </>
          </div>
        </div>
      </div>

      {/* Different content based on user role */}
      {/* TEMPORARY: Always show content for development */}
      
      {/* Four boxes in 2x2 grid - Always show for development */}
      {true && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto" style={{ maxWidth: 'calc(64rem + 6cm)' }}>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-center" style={{ marginBottom: '6px' }}>
              <div className="text-2xl" style={{ margin: '0' }}>🎓</div>
              <h3 className="font-semibold text-lg" style={{ color: '#5e0b15', margin: '0' }}>Get Started Now</h3>
            </div>
            
            <p className="text-sm mb-2 text-left box-text-left" style={{ color: '#5e0b15', lineHeight: '1.5' }}>
              Ready to begin?
            </p>
            <p className="text-sm mb-3 text-left box-text-left" style={{ color: '#5e0b15', lineHeight: '1.5' }}>
              Add your income and expenses to start tracking your money today.
            </p>
            
            <p className="text-xs mb-3 text-left box-text-left" style={{ color: '#5e0b15' }}>
              <strong>Start with:</strong> Adding your first expense, setting up income, creating budgets!
            </p>
            
            <div style={{ width: '100%' }}>
              <button
                onClick={() => window.location.href = '/add-entry'}
                className="btn btn-primary btn-full-width text-center text-sm h-12"
                style={{ 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxSizing: 'border-box'
                }}
              >
                🎓 Get Started Now
              </button>
            </div>
          </div>
          <QuickStartGuide />
          <SampleDataLoader />
          <MoneyTermsPreview />
        </div>
      )}
    </div>
  );
}