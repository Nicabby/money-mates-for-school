'use client';

import React, { useState } from 'react';
import { Budget, BudgetFormData } from '@/types/budget';
import { Category } from '@/types/expense';
import { validateBudgetForm, generateId } from '@/lib/utils';
import { useBudgets } from './BudgetProvider';
import LoadingSpinner from './LoadingSpinner';

interface BudgetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editBudget?: Budget;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSuccess, onCancel, editBudget }) => {
  const { addBudget, updateBudget } = useBudgets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<BudgetFormData>({
    name: editBudget?.name || '',
    category: editBudget?.category || 'Total',
    amount: editBudget?.amount.toString() || '',
    period: editBudget?.period || 'monthly',
    startDate: editBudget?.startDate || new Date().toISOString().split('T')[0],
    endDate: editBudget?.endDate || '',
    alertThreshold: editBudget?.alertThreshold.toString() || '80',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: (Category | 'Total')[] = ['Total', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Tech', 'Other'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateBudgetForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const now = new Date().toISOString();
      const budget: Budget = {
        id: editBudget?.id || generateId(),
        name: formData.name.trim(),
        category: formData.category,
        amount: parseFloat(formData.amount),
        period: formData.period,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        alertThreshold: parseFloat(formData.alertThreshold),
        isActive: true,
        createdAt: editBudget?.createdAt || now,
        updatedAt: now,
      };

      if (editBudget) {
        updateBudget(budget);
      } else {
        addBudget(budget);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      setErrors({ submit: 'Failed to save budget. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="section-title">
        <span className="emoji">{editBudget ? '✏️' : '🎯'}</span>
        <span className="text">{editBudget ? 'Edit My Budget' : 'Create New Budget'}</span>
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name" className="form-label">What should I call this budget?</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Like: Snack Money, Game Savings, Monthly Entertainment"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'Total' ? 'Overall Budget' : category}
              </option>
            ))}
          </select>
          {errors.category && <p className="form-error">{errors.category}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Budget Amount ($)</label>
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
            <label htmlFor="period" className="form-label">Period</label>
            <select
              id="period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="form-input"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            {errors.period && <p className="form-error">{errors.period}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-input"
            />
            {errors.startDate && <p className="form-error">{errors.startDate}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="endDate" className="form-label">End Date (Optional)</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-input"
            />
            {errors.endDate && <p className="form-error">{errors.endDate}</p>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="alertThreshold" className="form-label">
            Alert Threshold (%)
          </label>
          <input
            type="number"
            id="alertThreshold"
            name="alertThreshold"
            value={formData.alertThreshold}
            onChange={handleChange}
            className="form-input"
            placeholder="80"
            min="1"
            max="100"
          />
          <p className="text-sm text-gray-600 mt-1">
            Get notified when you reach this percentage of your budget
          </p>
          {errors.alertThreshold && <p className="form-error">{errors.alertThreshold}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary flex items-center justify-center space-x-2"
          >
            {isSubmitting && <LoadingSpinner size="sm" />}
            <span>{isSubmitting ? 'Saving...' : (editBudget ? 'Update Budget' : 'Create Budget')}</span>
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;