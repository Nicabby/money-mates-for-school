import ExpenseForm from '@/components/ExpenseForm';

export default function AddExpensePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
        <p className="text-gray-600">Track your spending by adding a new expense</p>
      </div>
      <ExpenseForm />
    </div>
  );
}