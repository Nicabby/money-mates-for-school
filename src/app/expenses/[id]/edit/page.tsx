'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Expense } from '@/types/expense';
import { storageService } from '@/lib/storage';
import ExpenseForm from '@/components/ExpenseForm';

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      const foundExpense = storageService.getExpenseById(id);
      if (foundExpense) {
        setExpense(foundExpense);
      } else {
        router.push('/expenses');
      }
    }
    setLoading(false);
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Expense Not Found</h1>
        <p className="text-gray-600">The expense you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
        <p className="text-gray-600">Update your expense details</p>
      </div>
      <ExpenseForm initialData={expense} />
    </div>
  );
}