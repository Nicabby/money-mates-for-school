import { Expense } from '@/types/expense';
import { Income } from '@/types/income';
import { Budget } from '@/types/budget';

// Sample data for a typical teenager learning budgeting
export const sampleExpenses: Expense[] = [
  // November 2024 expenses
  {
    id: 'exp-1',
    date: '2024-11-01',
    amount: 12.50,
    category: 'Food',
    description: 'Lunch at school cafeteria',
    createdAt: '2024-11-01T12:00:00Z',
    updatedAt: '2024-11-01T12:00:00Z'
  },
  {
    id: 'exp-2',
    date: '2024-11-02',
    amount: 25.00,
    category: 'Entertainment',
    description: 'Movie ticket with friends',
    createdAt: '2024-11-02T19:00:00Z',
    updatedAt: '2024-11-02T19:00:00Z'
  },
  {
    id: 'exp-3',
    date: '2024-11-03',
    amount: 8.75,
    category: 'Food',
    description: 'Coffee and muffin',
    createdAt: '2024-11-03T10:00:00Z',
    updatedAt: '2024-11-03T10:00:00Z'
  },
  {
    id: 'exp-4',
    date: '2024-11-05',
    amount: 45.00,
    category: 'Shopping',
    description: 'New t-shirt from mall',
    createdAt: '2024-11-05T16:00:00Z',
    updatedAt: '2024-11-05T16:00:00Z'
  },
  {
    id: 'exp-5',
    date: '2024-11-07',
    amount: 15.25,
    category: 'Transportation',
    description: 'Bus fare for weekend trip',
    createdAt: '2024-11-07T09:00:00Z',
    updatedAt: '2024-11-07T09:00:00Z'
  },
  {
    id: 'exp-6',
    date: '2024-11-10',
    amount: 32.00,
    category: 'Tech',
    description: 'Mobile game subscription and in-app purchases',
    createdAt: '2024-11-10T20:00:00Z',
    updatedAt: '2024-11-10T20:00:00Z'
  },
  {
    id: 'exp-7',
    date: '2024-11-12',
    amount: 18.50,
    category: 'Entertainment',
    description: 'Arcade games with friends',
    createdAt: '2024-11-12T15:00:00Z',
    updatedAt: '2024-11-12T15:00:00Z'
  },
  {
    id: 'exp-8',
    date: '2024-11-15',
    amount: 22.75,
    category: 'Food',
    description: 'Pizza dinner with family',
    createdAt: '2024-11-15T18:00:00Z',
    updatedAt: '2024-11-15T18:00:00Z'
  },
  {
    id: 'exp-9',
    date: '2024-11-18',
    amount: 55.00,
    category: 'Shopping',
    description: 'New sneakers on sale',
    createdAt: '2024-11-18T14:00:00Z',
    updatedAt: '2024-11-18T14:00:00Z'
  },
  {
    id: 'exp-10',
    date: '2024-11-20',
    amount: 12.00,
    category: 'Transportation',
    description: 'Uber ride home from school',
    createdAt: '2024-11-20T16:30:00Z',
    updatedAt: '2024-11-20T16:30:00Z'
  },
  {
    id: 'exp-11',
    date: '2024-11-22',
    amount: 28.00,
    category: 'Entertainment',
    description: 'Concert ticket for local band',
    createdAt: '2024-11-22T19:00:00Z',
    updatedAt: '2024-11-22T19:00:00Z'
  },
  {
    id: 'exp-12',
    date: '2024-11-25',
    amount: 16.50,
    category: 'Food',
    description: 'Thanksgiving dessert ingredients',
    createdAt: '2024-11-25T11:00:00Z',
    updatedAt: '2024-11-25T11:00:00Z'
  },
  
  // December 2024 expenses (partial month)
  {
    id: 'exp-13',
    date: '2024-12-02',
    amount: 35.00,
    category: 'Shopping',
    description: 'Holiday gifts for friends',
    createdAt: '2024-12-02T13:00:00Z',
    updatedAt: '2024-12-02T13:00:00Z'
  },
  {
    id: 'exp-14',
    date: '2024-12-05',
    amount: 14.25,
    category: 'Food',
    description: 'Hot chocolate and cookies',
    createdAt: '2024-12-05T15:30:00Z',
    updatedAt: '2024-12-05T15:30:00Z'
  },
  {
    id: 'exp-15',
    date: '2024-12-08',
    amount: 42.00,
    category: 'Tech',
    description: 'New phone case and screen protector',
    createdAt: '2024-12-08T17:00:00Z',
    updatedAt: '2024-12-08T17:00:00Z'
  },
  
  // Recent January 2025 expenses
  {
    id: 'exp-16',
    date: '2025-01-15',
    amount: 19.75,
    category: 'Food',
    description: 'Fast food lunch with friends',
    createdAt: '2025-01-15T12:30:00Z',
    updatedAt: '2025-01-15T12:30:00Z'
  },
  {
    id: 'exp-17',
    date: '2025-01-18',
    amount: 27.50,
    category: 'Entertainment',
    description: 'Streaming service subscription',
    createdAt: '2025-01-18T20:00:00Z',
    updatedAt: '2025-01-18T20:00:00Z'
  },
  {
    id: 'exp-18',
    date: '2025-01-22',
    amount: 38.00,
    category: 'Shopping',
    description: 'Winter jacket from thrift store',
    createdAt: '2025-01-22T14:15:00Z',
    updatedAt: '2025-01-22T14:15:00Z'
  }
];

export const sampleIncomes: Income[] = [
  // November 2024 income
  {
    id: 'inc-1',
    date: '2024-11-01',
    amount: 50.00,
    category: 'Salary',
    source: 'Weekly allowance from parents',
    createdAt: '2024-11-01T18:00:00Z',
    updatedAt: '2024-11-01T18:00:00Z'
  },
  {
    id: 'inc-2',
    date: '2024-11-03',
    amount: 25.00,
    category: 'Freelance',
    source: 'Tutoring younger student in math',
    createdAt: '2024-11-03T16:00:00Z',
    updatedAt: '2024-11-03T16:00:00Z'
  },
  {
    id: 'inc-3',
    date: '2024-11-08',
    amount: 50.00,
    category: 'Salary',
    source: 'Weekly allowance from parents',
    createdAt: '2024-11-08T18:00:00Z',
    updatedAt: '2024-11-08T18:00:00Z'
  },
  {
    id: 'inc-4',
    date: '2024-11-10',
    amount: 35.00,
    category: 'Freelance',
    source: 'Dog walking for neighbor Mrs. Johnson',
    createdAt: '2024-11-10T17:00:00Z',
    updatedAt: '2024-11-10T17:00:00Z'
  },
  {
    id: 'inc-5',
    date: '2024-11-15',
    amount: 100.00,
    category: 'Gift',
    source: 'Birthday money from grandparents',
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z'
  },
  {
    id: 'inc-6',
    date: '2024-11-15',
    amount: 50.00,
    category: 'Salary',
    source: 'Weekly allowance from parents',
    createdAt: '2024-11-15T18:00:00Z',
    updatedAt: '2024-11-15T18:00:00Z'
  },
  {
    id: 'inc-7',
    date: '2024-11-17',
    amount: 40.00,
    category: 'Freelance',
    source: 'Helped neighbor with yard work',
    createdAt: '2024-11-17T15:00:00Z',
    updatedAt: '2024-11-17T15:00:00Z'
  },
  {
    id: 'inc-8',
    date: '2024-11-22',
    amount: 50.00,
    category: 'Salary',
    source: 'Weekly allowance from parents',
    createdAt: '2024-11-22T18:00:00Z',
    updatedAt: '2024-11-22T18:00:00Z'
  },
  {
    id: 'inc-9',
    date: '2024-11-29',
    amount: 50.00,
    category: 'Salary',
    source: 'Weekly allowance from parents',
    createdAt: '2024-11-29T18:00:00Z',
    updatedAt: '2024-11-29T18:00:00Z'
  },
  
  // December 2024 income
  {
    id: 'inc-10',
    date: '2024-12-06',
    amount: 50.00,
    category: 'Salary',
    source: 'Weekly allowance from parents',
    createdAt: '2024-12-06T18:00:00Z',
    updatedAt: '2024-12-06T18:00:00Z'
  },
  {
    id: 'inc-11',
    date: '2024-12-13',
    amount: 75.00,
    category: 'Freelance',
    source: 'Holiday babysitting for family friends',
    createdAt: '2024-12-13T20:00:00Z',
    updatedAt: '2024-12-13T20:00:00Z'
  },
  {
    id: 'inc-12',
    date: '2024-12-20',
    amount: 50.00,
    category: 'Salary',
    source: 'Weekly allowance from parents',
    createdAt: '2024-12-20T18:00:00Z',
    updatedAt: '2024-12-20T18:00:00Z'
  },
  {
    id: 'inc-13',
    date: '2024-12-25',
    amount: 150.00,
    category: 'Gift',
    source: 'Christmas money from family',
    createdAt: '2024-12-25T12:00:00Z',
    updatedAt: '2024-12-25T12:00:00Z'
  },
  
  // January 2025 income
  {
    id: 'inc-14',
    date: '2025-01-03',
    amount: 50.00,
    category: 'Salary',
    source: 'Weekly allowance from parents',
    createdAt: '2025-01-03T18:00:00Z',
    updatedAt: '2025-01-03T18:00:00Z'
  },
  {
    id: 'inc-15',
    date: '2025-01-10',
    amount: 30.00,
    category: 'Freelance',
    source: 'Tutoring session with classmate',
    createdAt: '2025-01-10T16:30:00Z',
    updatedAt: '2025-01-10T16:30:00Z'
  },
  {
    id: 'inc-16',
    date: '2025-01-17',
    amount: 50.00,
    category: 'Salary',
    source: 'Weekly allowance from parents',
    createdAt: '2025-01-17T18:00:00Z',
    updatedAt: '2025-01-17T18:00:00Z'
  },
  {
    id: 'inc-17',
    date: '2025-01-24',
    amount: 50.00,
    category: 'Salary',
    source: 'Weekly allowance from parents',
    createdAt: '2025-01-24T18:00:00Z',
    updatedAt: '2025-01-24T18:00:00Z'
  }
];

export const sampleBudgets: Budget[] = [
  {
    id: 'budget-1',
    name: 'Monthly Food Budget',
    category: 'Food',
    amount: 80.00,
    period: 'Monthly',
    alertThreshold: 75,
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 'budget-2',
    name: 'Entertainment Budget',
    category: 'Entertainment',
    amount: 60.00,
    period: 'Monthly',
    alertThreshold: 80,
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 'budget-3',
    name: 'Shopping Allowance',
    category: 'Shopping',
    amount: 100.00,
    period: 'Monthly',
    alertThreshold: 70,
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 'budget-4',
    name: 'Transportation Budget',
    category: 'Transportation',
    amount: 40.00,
    period: 'Monthly',
    alertThreshold: 85,
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 'budget-5',
    name: 'Tech & Apps Budget',
    category: 'Tech',
    amount: 50.00,
    period: 'Monthly',
    alertThreshold: 90,
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z'
  },
  // December budgets (some adjusted based on November learnings)
  {
    id: 'budget-6',
    name: 'Holiday Food Budget',
    category: 'Food',
    amount: 70.00,
    period: 'Monthly',
    alertThreshold: 75,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z'
  },
  {
    id: 'budget-7',
    name: 'Holiday Shopping',
    category: 'Shopping',
    amount: 120.00,
    period: 'Monthly',
    alertThreshold: 80,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z'
  },
  // January 2025 budgets (New Year, new goals!)
  {
    id: 'budget-8',
    name: 'New Year Food Budget',
    category: 'Food',
    amount: 75.00,
    period: 'Monthly',
    alertThreshold: 80,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z'
  },
  {
    id: 'budget-9',
    name: 'Winter Entertainment',
    category: 'Entertainment',
    amount: 50.00,
    period: 'Monthly',
    alertThreshold: 75,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z'
  },
  {
    id: 'budget-10',
    name: 'Winter Clothing',
    category: 'Shopping',
    amount: 90.00,
    period: 'Monthly',
    alertThreshold: 70,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z'
  }
];

// Function to load sample data into localStorage
export const loadSampleData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('expense-tracker-expenses', JSON.stringify(sampleExpenses));
    localStorage.setItem('expense-tracker-income', JSON.stringify(sampleIncomes));
    localStorage.setItem('expense-tracker-budgets', JSON.stringify(sampleBudgets));
    console.log('Sample data loaded successfully!');
  } catch (error) {
    console.error('Error loading sample data:', error);
  }
};

// Function to clear all data
export const clearAllData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('expense-tracker-expenses');
    localStorage.removeItem('expense-tracker-income');
    localStorage.removeItem('expense-tracker-budgets');
    localStorage.removeItem('expense-tracker-streak-settings');
    console.log('All data cleared successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};