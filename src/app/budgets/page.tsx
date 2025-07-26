'use client';

import React, { useState, useEffect } from 'react';
import { useBudgets } from '@/components/BudgetProvider';
import { useExpenses } from '@/components/ExpenseProvider';
import BudgetForm from '@/components/BudgetForm';
import BudgetStreakBadge from '@/components/BudgetStreakBadge';
import { formatCurrency, getBudgetCategoryColor } from '@/lib/utils';
import { storageService } from '@/lib/storage';
import { Budget } from '@/types/budget';

export default function BudgetsPage() {
  const { budgets, budgetSummary, deleteBudget } = useBudgets();
  const { expenses } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined);
  const [streakSettings, setStreakSettings] = useState({ isVisible: true });
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    // Load streak settings
    const settings = storageService.getStreakSettings();
    setStreakSettings(settings);
    
    // Calculate current streak
    if (budgets.length > 0) {
      const streak = storageService.calculateBudgetStreak(expenses, budgets);
      setStreakDays(streak);
    }
  }, [budgets, expenses]);

  const handleStreakToggle = (visible: boolean) => {
    const newSettings = { isVisible: visible };
    setStreakSettings(newSettings);
    storageService.saveStreakSettings(newSettings);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBudget(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(undefined);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <BudgetForm
          editBudget={editingBudget}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in" style={{ paddingTop: '12pt' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header">
          <h1 className="text-3xl font-bold gradient-text">🎯 MoneyPlan</h1>
          <p className="text-gray-600 text-lg">Set limits for your spending and track your progress!</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {budgets.length > 0 && (
            <>
              {streakSettings.isVisible ? (
                <BudgetStreakBadge
                  streakDays={streakDays}
                  isVisible={streakSettings.isVisible}
                  onToggle={handleStreakToggle}
                />
              ) : (
                <button
                  onClick={() => handleStreakToggle(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                  title="Show streak badge"
                >
                  Show Streak Badge
                </button>
              )}
            </>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Create New Budget
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div>
              <p className="text-sm font-medium text-gray-600">Money I Planned</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(budgetSummary.totalBudgeted)}
              </p>
            </div>
          </div>

          <div className="card">
            <div>
              <p className="text-sm font-medium text-gray-600">Money I Spent</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(budgetSummary.totalSpent)}
              </p>
            </div>
          </div>

          <div className="card">
            <div>
              <p className="text-sm font-medium text-gray-600">Money Left</p>
              <p className={`text-2xl font-bold ${budgetSummary.totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(budgetSummary.totalRemaining)}
              </p>
            </div>
          </div>

          <div className="card">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-orange-600">
                {budgetSummary.alertCount}
              </p>
              {budgetSummary.overBudgetCount > 0 && (
                <p className="text-sm text-red-600 mt-1">
                  {budgetSummary.overBudgetCount} budgets over limit
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Budget Progress List */}
      {budgetSummary.budgetProgress.length > 0 ? (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How I&apos;m Doing</h2>
          <div className="space-y-4">
            {budgetSummary.budgetProgress.map((progress) => (
              <div key={progress.budget.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">{progress.budget.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBudgetCategoryColor(progress.budget.category)}`}>
                      {progress.budget.category === 'Total' ? 'Overall' : progress.budget.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {progress.budget.period}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(progress.budget)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(progress.budget.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {formatCurrency(progress.spent)} of {formatCurrency(progress.budget.amount)}
                    </span>
                    <span className={`font-medium ${progress.isOverBudget ? 'text-red-600' : progress.shouldAlert ? 'text-orange-600' : 'text-green-600'}`}>
                      {progress.percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress.isOverBudget ? 'bg-red-500' : 
                        progress.shouldAlert ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {progress.daysRemaining} days remaining
                    </span>
                    <span>
                      Daily allowance: {formatCurrency(progress.dailyAllowance)}
                    </span>
                  </div>

                  {progress.shouldAlert && (
                    <div className={`p-2 rounded-lg text-sm ${progress.isOverBudget ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'}`}>
                      {progress.isOverBudget ? 
                        `⚠️ Over budget by ${formatCurrency(progress.spent - progress.budget.amount)}` :
                        `⚠️ ${progress.percentage.toFixed(1)}% of budget used`
                      }
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : budgets.length > 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-600 mb-4">No active budgets found</p>
        </div>
      ) : (
        <div className="card text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 No Budgets Yet!</h3>
          <p className="text-gray-600 mb-4">Create your first budget to start reaching your money goals! 🌟</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            🚀 Create My First Budget
          </button>
        </div>
      )}
    </div>
  );
}