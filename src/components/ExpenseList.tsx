'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Expense, Category, ExpenseFilter } from '@/types/expense';
import { useExpenses } from '@/components/ExpenseProvider';
import { formatCurrency, formatDate, filterExpenses, getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { storageService } from '@/lib/storage';

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense } = useExpenses();
  const [filter, setFilter] = useState<ExpenseFilter>({
    category: 'All',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
  });

  const categories: (Category | 'All')[] = ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Tech', 'Other'];

  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, filter).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, filter]);

  const handleFilterChange = (key: keyof ExpenseFilter, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = (expense: Expense) => {
    if (window.confirm(`Are you sure you want to delete "${expense.description}"?`)) {
      deleteExpense(expense.id);
    }
  };

  const handleExport = () => {
    const expensesToExport = filteredExpenses.length > 0 ? filteredExpenses : expenses;
    storageService.downloadCSV(expensesToExport);
  };

  return (
    <div className="space-y-8" style={{ paddingTop: '12pt' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">Expenses</h1>
        <p className="text-gray-600 text-lg">
          {filteredExpenses.length} of {expenses.length} expenses
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="btn btn-secondary"
          >
            Export CSV
          </button>
          <Link href="/" className="btn btn-primary">
            Add Expense
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              value={filter.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-input"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dateFrom" className="form-label">
              From Date
            </label>
            <input
              type="date"
              id="dateFrom"
              value={filter.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="dateTo" className="form-label">
              To Date
            </label>
            <input
              type="date"
              id="dateTo"
              value={filter.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="search" className="form-label">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filter.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Search descriptions..."
              className="form-input"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Total: {formatCurrency(filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
          </p>
          <button
            onClick={() => setFilter({
              category: 'All',
              dateFrom: '',
              dateTo: '',
              searchTerm: '',
            })}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses found</h3>
          <p className="text-gray-600 mb-4">
            {expenses.length === 0 
              ? "Get started by adding your first expense."
              : "Try adjusting your filters to see more expenses."
            }
          </p>
          <Link href="/" className="btn btn-primary">
            Add Your First Expense
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-4">
            {filteredExpenses.map(expense => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {expense.description}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(expense.date)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/expenses/${expense.id}/edit`}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDelete(expense)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;