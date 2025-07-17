'use client';

import React from 'react';
import { MonthlySpending } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';

interface MonthlyChartProps {
  monthlyData: MonthlySpending[];
  title: string;
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ monthlyData, title }) => {
  if (monthlyData.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 text-center py-8">No spending data available</p>
      </div>
    );
  }

  const maxAmount = Math.max(...monthlyData.map(month => month.amount));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {monthlyData.map((month) => (
          <div key={month.month} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short' 
                })}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(month.amount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(month.amount / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyChart;