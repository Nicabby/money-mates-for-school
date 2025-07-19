'use client';

import React, { useState, useMemo } from 'react';
import { useExpenses } from '@/components/ExpenseProvider';
import { useIncomes } from '@/components/IncomeProvider';
import { storageService } from '@/lib/storage';
import { formatCurrency } from '@/lib/utils';

const ExportPage: React.FC = () => {
  const { expenses } = useExpenses();
  const { incomes } = useIncomes();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [filterType, setFilterType] = useState('all');

  const availableMonths = useMemo(() => {
    const months = new Set<number>();
    [...expenses, ...incomes].forEach(item => {
      const date = new Date(item.date);
      months.add(date.getMonth());
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [expenses, incomes]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    [...expenses, ...incomes].forEach(item => {
      const date = new Date(item.date);
      years.add(date.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [expenses, incomes]);

  const filteredData = useMemo(() => {
    let filteredExpenses = expenses;
    let filteredIncomes = incomes;

    if (selectedMonth && selectedYear) {
      const targetMonth = parseInt(selectedMonth);
      const targetYear = parseInt(selectedYear);
      
      filteredExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
      });
      
      filteredIncomes = incomes.filter(income => {
        const date = new Date(income.date);
        return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
      });
    }

    return { filteredExpenses, filteredIncomes };
  }, [expenses, incomes, selectedMonth, selectedYear]);

  const monthlyReport = useMemo(() => {
    const { filteredExpenses, filteredIncomes } = filteredData;
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
    const netIncome = totalIncome - totalExpenses;

    return {
      totalExpenses,
      totalIncome,
      netIncome,
      expenseCount: filteredExpenses.length,
      incomeCount: filteredIncomes.length,
    };
  }, [filteredData]);

  const handleExport = (type: 'csv' | 'monthly-report') => {
    const { filteredExpenses, filteredIncomes } = filteredData;
    
    if (type === 'csv') {
      if (filterType === 'expenses' || filterType === 'all') {
        storageService.downloadCSV(filteredExpenses, `expenses-${selectedYear}-${selectedMonth || 'all'}.csv`);
      }
      if (filterType === 'income' || filterType === 'all') {
        storageService.downloadIncomeCSV(filteredIncomes, `income-${selectedYear}-${selectedMonth || 'all'}.csv`);
      }
    } else if (type === 'monthly-report') {
      generateMonthlyReport();
    }
  };

  const generateMonthlyReport = () => {
    const { filteredExpenses, filteredIncomes } = filteredData;
    const monthName = selectedMonth ? new Date(0, parseInt(selectedMonth)).toLocaleString('default', { month: 'long' }) : 'All';
    
    const reportContent = `Monthly Financial Report - ${monthName} ${selectedYear}
================================================================

SUMMARY
-------
Total Income: ${formatCurrency(monthlyReport.totalIncome)}
Total Expenses: ${formatCurrency(monthlyReport.totalExpenses)}
Net Income: ${formatCurrency(monthlyReport.netIncome)}

INCOME BREAKDOWN (${monthlyReport.incomeCount} entries)
${'-'.repeat(50)}
${filteredIncomes.map(income => 
  `${income.date} | ${income.category.padEnd(12)} | ${formatCurrency(income.amount).padStart(10)} | ${income.source}`
).join('\n')}

EXPENSE BREAKDOWN (${monthlyReport.expenseCount} entries)
${'-'.repeat(50)}
${filteredExpenses.map(expense => 
  `${expense.date} | ${expense.category.padEnd(12)} | ${formatCurrency(expense.amount).padStart(10)} | ${expense.description}`
).join('\n')}

Report generated on: ${new Date().toLocaleString()}
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `monthly-report-${selectedYear}-${selectedMonth || 'all'}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-8" style={{ paddingTop: '12pt' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">Export Center</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Export your financial data and generate monthly reports with advanced filtering options.
        </p>
      </div>

      <div className="card max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Filter Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="form-group">
            <label htmlFor="year" className="form-label">Year</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="form-input"
            >
              <option value="">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="month" className="form-label">Month</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-input"
            >
              <option value="">All Months</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>{monthNames[month]}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="filterType" className="form-label">Data Type</label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-input"
            >
              <option value="all">All Data</option>
              <option value="income">Income Only</option>
              <option value="expenses">Expenses Only</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card income-card">
            <h3 className="text-lg font-semibold mb-2">Total Income</h3>
            <p className="text-2xl font-bold">{formatCurrency(monthlyReport.totalIncome)}</p>
            <p className="text-sm opacity-90">{monthlyReport.incomeCount} entries</p>
          </div>

          <div className="card expense-card">
            <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
            <p className="text-2xl font-bold">{formatCurrency(monthlyReport.totalExpenses)}</p>
            <p className="text-sm opacity-90">{monthlyReport.expenseCount} entries</p>
          </div>

          <div className={`card ${monthlyReport.netIncome >= 0 ? 'income-card' : 'expense-card'}`}>
            <h3 className="text-lg font-semibold mb-2">Net Income</h3>
            <p className="text-2xl font-bold">{formatCurrency(monthlyReport.netIncome)}</p>
            <p className="text-sm opacity-90">
              {monthlyReport.netIncome >= 0 ? 'Profit' : 'Loss'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => handleExport('csv')}
            className="btn btn-primary"
          >
            Export as CSV
          </button>
          <button
            onClick={() => handleExport('monthly-report')}
            className="btn btn-secondary"
          >
            Generate Monthly Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;