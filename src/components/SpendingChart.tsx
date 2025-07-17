'use client';

import React from 'react';
import { CategorySummary } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';

interface SpendingChartProps {
  categories: CategorySummary[];
  title: string;
}

const SpendingChart: React.FC<SpendingChartProps> = ({ categories, title }) => {
  const maxAmount = Math.max(...categories.map(cat => cat.amount));

  if (categories.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 text-center py-8">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {category.category}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(category.amount)} ({category.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(category.amount / maxAmount) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {category.count} transaction{category.count !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingChart;