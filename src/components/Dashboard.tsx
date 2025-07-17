'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useExpenses } from '@/components/ExpenseProvider';
import { storageService } from '@/lib/storage';
import { formatCurrency, formatDate, getCategoryColor, getCategoryIcon } from '@/lib/utils';
import CloudExportHub from '@/components/CloudExportHub';

const Dashboard: React.FC = () => {
  const { expenses } = useExpenses();
  const [isCloudExportOpen, setIsCloudExportOpen] = useState(false);

  const summary = useMemo(() => {
    return storageService.generateExpenseSummary(expenses);
  }, [expenses]);

  const monthlySpending = useMemo(() => {
    return storageService.getMonthlySpending(expenses).slice(-6);
  }, [expenses]);

  const recentExpenses = useMemo(() => {
    return expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Your business expense tracking overview</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsCloudExportOpen(true)}
            className="btn btn-secondary"
            disabled={expenses.length === 0}
          >
            ☁️ Cloud Export
          </button>
          <Link href="/add" className="btn btn-primary">
            ➕ Add Expense
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalExpenses)}
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.monthlyTotal)}
              </p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.categorySummary.length}
              </p>
            </div>
            <div className="text-3xl">🏷️</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. per Day</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalExpenses / Math.max(1, new Date().getDate()))}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h2>
          {summary.topCategories.length > 0 ? (
            <div className="space-y-3">
              {summary.topCategories.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">{getCategoryIcon(category.category)}</div>
                    <div>
                      <span className="font-medium text-gray-900">{category.category}</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.category)}`}>
                        {category.count} items
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(category.amount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {category.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No expenses yet</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h2>
          {monthlySpending.length > 0 ? (
            <div className="space-y-3">
              {monthlySpending.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">
                    {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(month.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No spending data yet</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
          <Link href="/expenses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">{getCategoryIcon(expense.category)}</div>
                  <div>
                    <div className="font-medium text-gray-900">{expense.description}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(expense.date)} • {expense.category}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-gray-900">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💸</div>
            <p className="text-gray-600 mb-4">No expenses yet</p>
            <Link href="/add" className="btn btn-primary">
              Add Your First Expense
            </Link>
          </div>
        )}
      </div>

      {/* Cloud Export Hub */}
      <CloudExportHub
        isOpen={isCloudExportOpen}
        onClose={() => setIsCloudExportOpen(false)}
        expenses={expenses}
      />
    </div>
  );
};

export default Dashboard;