'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useExpenses } from '@/components/ExpenseProvider';
import { useIncomes } from '@/components/IncomeProvider';
import { storageService } from '@/lib/storage';
import { formatCurrency, formatDate, getCategoryColor, getIncomeCategoryColor } from '@/lib/utils';
import CloudExportHub from '@/components/CloudExportHub';

const Dashboard: React.FC = () => {
  const { expenses } = useExpenses();
  const { incomes } = useIncomes();
  const [isCloudExportOpen, setIsCloudExportOpen] = useState(false);

  const summary = useMemo(() => {
    return storageService.generateExpenseSummary(expenses);
  }, [expenses]);

  const incomeSummary = useMemo(() => {
    return storageService.generateIncomeSummary(incomes);
  }, [incomes]);

  const financialSummary = useMemo(() => {
    return storageService.generateFinancialSummary(expenses, incomes);
  }, [expenses, incomes]);


  const recentExpenses = useMemo(() => {
    return expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [expenses]);

  const recentIncomes = useMemo(() => {
    return incomes
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [incomes]);

  return (
    <div className="space-y-6" style={{ paddingTop: '12pt' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Financial Dashboard</h1>
          <p className="text-gray-600 text-lg">Your complete financial overview.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsCloudExportOpen(true)}
            className="btn btn-secondary"
            disabled={expenses.length === 0}
          >
            Cloud Export
          </button>
          <Link href="/" className="btn btn-primary">
            Quick Entry
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card income-card">
          <div>
            <p className="text-sm font-medium opacity-90">Total Income</p>
            <p className="text-3xl font-bold">
              {formatCurrency(financialSummary.totalIncome)}
            </p>
          </div>
        </div>

        <div className="card expense-card">
          <div>
            <p className="text-sm font-medium opacity-90">Total Expenses</p>
            <p className="text-3xl font-bold">
              {formatCurrency(financialSummary.totalExpenses)}
            </p>
          </div>
        </div>

        <div className={`card ${financialSummary.netIncome >= 0 ? 'income-card' : 'expense-card'}`}>
          <div>
            <p className="text-sm font-medium opacity-90">Net Income</p>
            <p className="text-3xl font-bold">
              {formatCurrency(financialSummary.netIncome)}
            </p>
          </div>
        </div>

        <div className={`card ${financialSummary.monthlyNet >= 0 ? 'income-card' : 'expense-card'}`}>
          <div>
            <p className="text-sm font-medium opacity-90">Monthly Net</p>
            <p className="text-3xl font-bold">
              {formatCurrency(financialSummary.monthlyNet)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Expense Categories</h2>
          {summary.topCategories.length > 0 ? (
            <div className="space-y-3">
              {summary.topCategories.map((category) => (
                <div key={category.category} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <span className="font-semibold text-gray-900">{category.category}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.category)}`}>
                      {category.count} items
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">
                      -{formatCurrency(category.amount)}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Income Categories</h2>
          {incomeSummary.topCategories.length > 0 ? (
            <div className="space-y-3">
              {incomeSummary.topCategories.map((category) => (
                <div key={category.category} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <span className="font-semibold text-gray-900">{category.category}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getIncomeCategoryColor(category.category)}`}>
                      {category.count} items
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      +{formatCurrency(category.amount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {category.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No income yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
            <Link href="/export" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Export
            </Link>
          </div>
          {recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <div className="font-semibold text-gray-900">{expense.description}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(expense.date)} • {expense.category}
                    </div>
                  </div>
                  <div className="font-bold text-red-600">
                    -{formatCurrency(expense.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No expenses yet</p>
              <Link href="/" className="btn btn-primary">
                Add Your First Expense
              </Link>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Income</h2>
            <Link href="/export" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Export
            </Link>
          </div>
          {recentIncomes.length > 0 ? (
            <div className="space-y-3">
              {recentIncomes.map((income) => (
                <div key={income.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <div className="font-semibold text-gray-900">{income.source}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(income.date)} • {income.category}
                    </div>
                  </div>
                  <div className="font-bold text-green-600">
                    +{formatCurrency(income.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No income yet</p>
              <Link href="/" className="btn btn-primary">
                Add Your First Income
              </Link>
            </div>
          )}
        </div>
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