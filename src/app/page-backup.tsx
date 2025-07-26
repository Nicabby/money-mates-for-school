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

export default function Home() {
  const { addExpense } = useExpenses();
  const { addIncome } = useIncomes();
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
      <div className="text-center" style={{ paddingTop: '12pt' }}>
        <img src="/MoneyMateslogo.png" alt="MoneyMates" className="mx-auto mb-2" style={{ height: '67.2px', width: 'auto' }} />
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Learn how to manage your money like a pro! 
        </p>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Track what you earn (allowance, chores, gifts) and what you spend.
        </p>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
          Build smart money habits that will help you reach your goals!
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto mb-6">
          <p className="text-blue-800 text-sm">
            <strong>New to budgeting?</strong> Check out our <a href="/money-terms" className="text-blue-600 underline">Money Terms Guide</a> to learn the basics!
          </p>
        </div>
      </div>

      <div className="main-form-grid">
        {/* Income Form */}
        <div className="form-container">
          <h2 className="section-title">
            <span className="emoji">💰</span>
            <span className="text">Money I Earned</span>
          </h2>
          
          <form onSubmit={handleIncomeSubmit} className="space-y-6">
            {incomeErrors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{incomeErrors.submit}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="income-date" className="form-label">Date</label>
              <input
                type="date"
                id="income-date"
                name="date"
                value={incomeFormData.date}
                onChange={handleIncomeChange}
                className="form-input"
                max={maxDate}
              />
              {incomeErrors.date && <p className="form-error">{incomeErrors.date}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="income-amount" className="form-label">Amount ($)</label>
              <input
                type="number"
                id="income-amount"
                name="amount"
                value={incomeFormData.amount}
                onChange={handleIncomeChange}
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {incomeErrors.amount && <p className="form-error">{incomeErrors.amount}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="income-category" className="form-label">Category</label>
              <select
                id="income-category"
                name="category"
                value={incomeFormData.category}
                onChange={handleIncomeChange}
                className="form-input"
              >
                {incomeCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {incomeErrors.category && <p className="form-error">{incomeErrors.category}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="income-source" className="form-label">Where did you get this money?</label>
              <input
                type="text"
                id="income-source"
                name="source"
                value={incomeFormData.source}
                onChange={handleIncomeChange}
                className="form-input"
                placeholder="Like: allowance, chores, birthday gift, job"
              />
              {incomeErrors.source && <p className="form-error">{incomeErrors.source}</p>}
            </div>

            <button
              type="submit"
              disabled={isIncomeSubmitting}
              className="btn btn-secondary w-full flex items-center justify-center space-x-2"
            >
              {isIncomeSubmitting && <LoadingSpinner size="sm" />}
              <span>{isIncomeSubmitting ? 'Saving your money...' : '💰 Record My Earnings!'}</span>
            </button>
          </form>
        </div>

        {/* Expense Form */}
        <div className="form-container">
          <h2 className="section-title">
            <span className="emoji">💸</span>
            <span className="text">Money I Spent</span>
          </h2>
          
          <form onSubmit={handleExpenseSubmit} className="space-y-6">
            {expenseErrors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{expenseErrors.submit}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="expense-date" className="form-label">Date</label>
              <input
                type="date"
                id="expense-date"
                name="date"
                value={expenseFormData.date}
                onChange={handleExpenseChange}
                className="form-input"
                max={maxDate}
              />
              {expenseErrors.date && <p className="form-error">{expenseErrors.date}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="expense-amount" className="form-label">Amount ($)</label>
              <input
                type="number"
                id="expense-amount"
                name="amount"
                value={expenseFormData.amount}
                onChange={handleExpenseChange}
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {expenseErrors.amount && <p className="form-error">{expenseErrors.amount}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="expense-category" className="form-label">Category</label>
              <select
                id="expense-category"
                name="category"
                value={expenseFormData.category}
                onChange={handleExpenseChange}
                className="form-input"
              >
                {expenseCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {expenseErrors.category && <p className="form-error">{expenseErrors.category}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="expense-description" className="form-label">What did you buy?</label>
              <textarea
                id="expense-description"
                name="description"
                value={expenseFormData.description}
                onChange={handleExpenseChange}
                className="form-input"
                rows={1}
                placeholder="Like: lunch, movie ticket, new game, clothes"
                style={{ minHeight: '2.5rem', resize: 'vertical' }}
              />
              {expenseErrors.description && <p className="form-error">{expenseErrors.description}</p>}
            </div>

            <button
              type="submit"
              disabled={isExpenseSubmitting}
              className="btn btn-secondary w-full flex items-center justify-center space-x-2"
            >
              {isExpenseSubmitting && <LoadingSpinner size="sm" />}
              <span>{isExpenseSubmitting ? 'Tracking your spending...' : '💸 Record My Purchase!'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Demo, Money Terms, and Quick Start Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SampleDataLoader />
        <MoneyTermsPreview />
        <QuickStartGuide />
      </div>
    </div>
  );
}