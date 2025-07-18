'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Income, IncomeCategory, IncomeFilter } from '@/types/income';
import { useIncomes } from '@/components/IncomeProvider';
import { formatCurrency, formatDate, filterIncomes, getIncomeCategoryColor, getIncomeCategoryIcon } from '@/lib/utils';
import { storageService } from '@/lib/storage';

const IncomeList: React.FC = () => {
  const { incomes, deleteIncome } = useIncomes();
  const [filter, setFilter] = useState<IncomeFilter>({
    category: 'All',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
  });

  const categories: (IncomeCategory | 'All')[] = ['All', 'Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

  const filteredIncomes = useMemo(() => {
    return filterIncomes(incomes, filter).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [incomes, filter]);

  const handleFilterChange = (key: keyof IncomeFilter, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = (income: Income) => {
    if (window.confirm(`Are you sure you want to delete "${income.source}"?`)) {
      deleteIncome(income.id);
    }
  };

  const handleExport = () => {
    const incomesToExport = filteredIncomes.length > 0 ? filteredIncomes : incomes;
    storageService.downloadIncomeCSV(incomesToExport);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-600">
            {filteredIncomes.length} of {incomes.length} income entries
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="btn btn-secondary"
          >
            📥 Export CSV
          </button>
          <Link href="/income/add" className="btn btn-primary">
            ➕ Add Income
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
              placeholder="Search sources..."
              className="form-input"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Total: {formatCurrency(filteredIncomes.reduce((sum, income) => sum + income.amount, 0))}
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

      {filteredIncomes.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No income found</h3>
          <p className="text-gray-600 mb-4">
            {incomes.length === 0 
              ? "Get started by adding your first income entry."
              : "Try adjusting your filters to see more income entries."
            }
          </p>
          <Link href="/income/add" className="btn btn-primary">
            Add Your First Income
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-4">
            {filteredIncomes.map(income => (
              <div
                key={income.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getIncomeCategoryIcon(income.category)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {income.source}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIncomeCategoryColor(income.category)}`}>
                        {income.category}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(income.date)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold text-green-600">
                    +{formatCurrency(income.amount)}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/income/${income.id}/edit`}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDelete(income)}
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

export default IncomeList;