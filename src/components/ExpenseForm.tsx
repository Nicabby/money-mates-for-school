'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Expense, ExpenseFormData } from '@/types/expense';
import { useExpenses } from '@/components/ExpenseProvider';
import { validateExpenseForm, generateId } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit?: (expense: Expense) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSubmit }) => {
  const { addExpense, updateExpense } = useExpenses();
  const router = useRouter();
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: initialData?.date || '',
    amount: initialData?.amount.toString() || '',
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
  });
  const [maxDate, setMaxDate] = useState('');

  // Set current date after hydration to avoid SSR mismatch
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMaxDate(today);
    if (!initialData && !formData.date) {
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [initialData, formData.date]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: Category[] = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Tech', 'Other'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateExpenseForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const expense: Expense = {
        id: initialData?.id || generateId(),
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (initialData) {
        updateExpense(expense);
      } else {
        addExpense(expense);
      }

      if (onSubmit) {
        onSubmit(expense);
      } else {
        router.push('/expenses');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      setErrors({ submit: 'Failed to save expense. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8" style={{ paddingTop: '12pt' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {initialData ? 'Edit Expense' : 'Add New Expense'}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="form-container max-w-md mx-auto">

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errors.submit}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="date" className="form-label">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="form-input"
          max={maxDate}
        />
        {errors.date && <p className="form-error">{errors.date}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="amount" className="form-label">
          Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="form-input"
          placeholder="0.00"
          step="0.01"
          min="0"
        />
        {errors.amount && <p className="form-error">{errors.amount}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-input"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <p className="form-error">{errors.category}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-input"
          rows={3}
          placeholder="Enter a description for this expense..."
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-secondary flex-1 flex items-center justify-center space-x-2"
        >
          {isSubmitting && <LoadingSpinner size="sm" />}
          <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}</span>
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
    </div>
  );
};

export default ExpenseForm;