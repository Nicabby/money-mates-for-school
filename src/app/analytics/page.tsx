'use client';

import React from 'react';
import { useExpenses } from '@/components/ExpenseProvider';
import { useIncomes } from '@/components/IncomeProvider';
import { storageService } from '@/lib/storage';
import SpendingChart from '@/components/SpendingChart';
import MonthlyChart from '@/components/MonthlyChart';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const { expenses } = useExpenses();
  const { incomes } = useIncomes();
  const expenseSummary = storageService.generateExpenseSummary(expenses);
  const incomeSummary = storageService.generateIncomeSummary(incomes);
  const financialSummary = storageService.generateFinancialSummary(expenses, incomes);
  const monthlySpending = storageService.getMonthlySpending(expenses);

  return (
    <div className="space-y-8" style={{ paddingTop: '12pt' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">Analytics</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Detailed insights into your financial patterns and spending trends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card income-card text-center">
          <div className="text-3xl font-bold mb-2">
            {formatCurrency(financialSummary.totalIncome)}
          </div>
          <div className="text-sm opacity-90">Total Income</div>
        </div>

        <div className="card expense-card text-center">
          <div className="text-3xl font-bold mb-2">
            {formatCurrency(financialSummary.totalExpenses)}
          </div>
          <div className="text-sm opacity-90">Total Expenses</div>
        </div>

        <div className={`card text-center ${financialSummary.netIncome >= 0 ? 'income-card' : 'expense-card'}`}>
          <div className="text-3xl font-bold mb-2">
            {formatCurrency(financialSummary.netIncome)}
          </div>
          <div className="text-sm opacity-90">Net Income</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart 
          categories={expenseSummary.categorySummary} 
          title="Spending by Category"
        />
        <MonthlyChart 
          monthlyData={monthlySpending.slice(-6)} 
          title="Monthly Spending Trend"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Expense Insights</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {expenses.length}
              </div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {expenseSummary.categorySummary.length}
              </div>
              <div className="text-sm text-gray-600">Categories Used</div>
            </div>
            {expenses.length > 0 && (
              <>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(Math.max(...expenses.map(e => e.amount)))}
                  </div>
                  <div className="text-sm text-gray-600">Highest Expense</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(Math.min(...expenses.map(e => e.amount)))}
                  </div>
                  <div className="text-sm text-gray-600">Lowest Expense</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Income Insights</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {incomes.length}
              </div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {incomeSummary.categorySummary.length}
              </div>
              <div className="text-sm text-gray-600">Sources Used</div>
            </div>
            {incomes.length > 0 && (
              <>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(Math.max(...incomes.map(i => i.amount)))}
                  </div>
                  <div className="text-sm text-gray-600">Highest Income</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(Math.min(...incomes.map(i => i.amount)))}
                  </div>
                  <div className="text-sm text-gray-600">Lowest Income</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {(expenses.length > 0 || incomes.length > 0) && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(financialSummary.totalIncome / Math.max(incomes.length, 1))}
              </div>
              <div className="text-sm text-gray-600">Avg. Income</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(financialSummary.totalExpenses / Math.max(expenses.length, 1))}
              </div>
              <div className="text-sm text-gray-600">Avg. Expense</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {expenseSummary.topCategories[0]?.category || 'None'}
              </div>
              <div className="text-sm text-gray-600">Top Expense Category</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {incomeSummary.topCategories[0]?.category || 'None'}
              </div>
              <div className="text-sm text-gray-600">Top Income Source</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}