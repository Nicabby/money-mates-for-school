'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useExpenses } from '@/components/ExpenseProvider';
import { useIncomes } from '@/components/IncomeProvider';
import { useBudgets } from '@/components/BudgetProvider';
import { storageService } from '@/lib/storage';
import { formatCurrency, formatDate, getCategoryColor, getIncomeCategoryColor, getBudgetCategoryColor } from '@/lib/utils';
import CloudExportHub from '@/components/CloudExportHub';
import LessonProgress from '@/components/LessonProgress';

const Dashboard: React.FC = () => {
  const { expenses } = useExpenses();
  const { incomes } = useIncomes();
  const { budgetSummary } = useBudgets();
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
        <div className="page-header">
          <h1 className="text-3xl font-bold gradient-text">📊 MoneyHub</h1>
          <p className="text-gray-600 text-lg">See all your money information in one place!</p>
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
            ➕ Add New Entry
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card income-card">
          <div>
            <p className="text-sm font-medium opacity-90">Money I&apos;ve Earned</p>
            <p className="text-3xl font-bold">
              {formatCurrency(financialSummary.totalIncome)}
            </p>
          </div>
        </div>

        <div className="card expense-card">
          <div>
            <p className="text-sm font-medium opacity-90">Money I&apos;ve Spent</p>
            <p className="text-3xl font-bold">
              {formatCurrency(financialSummary.totalExpenses)}
            </p>
          </div>
        </div>

        <div className={`card ${financialSummary.netIncome >= 0 ? 'income-card' : 'expense-card'}`}>
          <div>
            <p className="text-sm font-medium opacity-90">Money Left Over</p>
            <p className="text-3xl font-bold">
              {formatCurrency(financialSummary.netIncome)}
            </p>
          </div>
        </div>

        <div className={`card ${financialSummary.monthlyNet >= 0 ? 'income-card' : 'expense-card'}`}>
          <div>
            <p className="text-sm font-medium opacity-90">This Month</p>
            <p className="text-3xl font-bold">
              {formatCurrency(financialSummary.monthlyNet)}
            </p>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetSummary.budgetProgress.length > 0 && (budgetSummary.alertCount > 0 || budgetSummary.overBudgetCount > 0) && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Budget Alerts</h2>
            <Link href="/budgets" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Fix My Budgets
            </Link>
          </div>
          <div className="space-y-3">
            {budgetSummary.budgetProgress
              .filter(progress => progress.shouldAlert || progress.isOverBudget)
              .slice(0, 3)
              .map((progress) => (
                <div key={progress.budget.id} className={`p-3 rounded-lg border ${
                  progress.isOverBudget ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{progress.budget.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBudgetCategoryColor(progress.budget.category)}`}>
                        {progress.budget.category === 'Total' ? 'Overall' : progress.budget.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${progress.isOverBudget ? 'text-red-600' : 'text-orange-600'}`}>
                        {progress.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(progress.spent)} / {formatCurrency(progress.budget.amount)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${progress.isOverBudget ? 'bg-red-500' : 'bg-orange-500'}`}
                        style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                      />
                    </div>
                    <p className={`text-sm mt-1 ${progress.isOverBudget ? 'text-red-700' : 'text-orange-700'}`}>
                      {progress.isOverBudget ? 
                        `Over budget by ${formatCurrency(progress.spent - progress.budget.amount)}` :
                        `${progress.percentage.toFixed(1)}% of budget used`
                      }
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Learning Progress */}
      <LessonProgress />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Where I Spend Most</h2>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Where My Money Comes From</h2>
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
            <h2 className="text-lg font-semibold text-gray-900">What I Bought Recently</h2>
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
              <p className="text-gray-600 mb-4">You haven&apos;t spent any money yet! 🎉</p>
              <Link href="/" className="btn btn-primary">
                Record Your First Purchase
              </Link>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Money I Earned Recently</h2>
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
              <p className="text-gray-600 mb-4">Time to start earning some money! 💪</p>
              <Link href="/" className="btn btn-primary">
                Record Your First Earnings
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* MoneyJars Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">🏺 MoneyJars</h2>
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Coming Soon!</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-green-800 mb-2">Save Jar</h3>
            <p className="text-sm text-green-600">Money you&apos;re saving for future goals</p>
            <div className="mt-3 text-2xl font-bold text-green-700">$0.00</div>
          </div>
          <div className="text-center p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-3xl mb-3">💸</div>
            <h3 className="font-semibold text-orange-800 mb-2">Spend Jar</h3>
            <p className="text-sm text-orange-600">Money for everyday purchases and fun</p>
            <div className="mt-3 text-2xl font-bold text-orange-700">$0.00</div>
          </div>
          <div className="text-center p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-3xl mb-3">💝</div>
            <h3 className="font-semibold text-purple-800 mb-2">Share Jar</h3>
            <p className="text-sm text-purple-600">Money for gifts and helping others</p>
            <div className="mt-3 text-2xl font-bold text-purple-700">$0.00</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Set up your savings goals and automatically split your money into Save, Spend, and Share buckets!
          </p>
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