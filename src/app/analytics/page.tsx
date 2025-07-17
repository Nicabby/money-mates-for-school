'use client';

import React from 'react';
import { useExpenses } from '@/components/ExpenseProvider';
import { storageService } from '@/lib/storage';
import SpendingChart from '@/components/SpendingChart';
import MonthlyChart from '@/components/MonthlyChart';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const { expenses } = useExpenses();
  const summary = storageService.generateExpenseSummary(expenses);
  const monthlySpending = storageService.getMonthlySpending(expenses);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Detailed insights into your business spending patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.totalExpenses)}
          </div>
          <div className="text-sm text-gray-600">Total Expenses</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-gray-900">
            {summary.categorySummary.length}
          </div>
          <div className="text-sm text-gray-600">Categories Used</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.totalExpenses / Math.max(expenses.length, 1))}
          </div>
          <div className="text-sm text-gray-600">Avg. per Transaction</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart 
          categories={summary.categorySummary} 
          title="Spending by Category"
        />
        <MonthlyChart 
          monthlyData={monthlySpending.slice(-6)} 
          title="Monthly Spending Trend"
        />
      </div>

      {expenses.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {expenses.length}
              </div>
              <div className="text-sm text-blue-600">Total Transactions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(Math.max(...expenses.map(e => e.amount)))}
              </div>
              <div className="text-sm text-green-600">Highest Expense</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(Math.min(...expenses.map(e => e.amount)))}
              </div>
              <div className="text-sm text-yellow-600">Lowest Expense</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {summary.topCategories[0]?.category || 'N/A'}
              </div>
              <div className="text-sm text-purple-600">Top Category</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}