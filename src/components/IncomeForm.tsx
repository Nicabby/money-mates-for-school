'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IncomeCategory, Income, IncomeFormData } from '@/types/income';
import { useIncomes } from '@/components/IncomeProvider';
import { validateIncomeForm, generateId } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

interface IncomeFormProps {
  initialData?: Income;
  onSubmit?: (income: Income) => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ initialData, onSubmit }) => {
  const { addIncome, updateIncome } = useIncomes();
  const router = useRouter();
  const [formData, setFormData] = useState<IncomeFormData>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    amount: initialData?.amount.toString() || '',
    category: initialData?.category || 'Salary',
    source: initialData?.source || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: IncomeCategory[] = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

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

    const validation = validateIncomeForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const income: Income = {
        id: initialData?.id || generateId(),
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category,
        source: formData.source.trim(),
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (initialData) {
        updateIncome(income);
      } else {
        addIncome(income);
      }

      if (onSubmit) {
        onSubmit(income);
      } else {
        router.push('/income');
      }
    } catch (error) {
      console.error('Error saving income:', error);
      setErrors({ submit: 'Failed to save income. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8" style={{ paddingTop: '12pt' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {initialData ? 'Edit Income' : 'Add New Income'}
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
          max={new Date().toISOString().split('T')[0]}
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
        <label htmlFor="source" className="form-label">
          Source
        </label>
        <input
          type="text"
          id="source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter income source (e.g., Company Name, Client, etc.)"
        />
        {errors.source && <p className="form-error">{errors.source}</p>}
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-secondary flex-1 flex items-center justify-center space-x-2"
        >
          {isSubmitting && <LoadingSpinner size="sm" />}
          <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Income' : 'Add Income'}</span>
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

export default IncomeForm;