'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import IncomeForm from '@/components/IncomeForm';
import { IncomeProvider, useIncomes } from '@/components/IncomeProvider';

const EditIncomeContent: React.FC = () => {
  const params = useParams();
  const { getIncomeById } = useIncomes();
  const incomeId = params.id as string;
  
  const income = getIncomeById(incomeId);
  
  if (!income) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <IncomeForm initialData={income} />
    </div>
  );
};

const EditIncomePage: React.FC = () => {
  return (
    <IncomeProvider>
      <EditIncomeContent />
    </IncomeProvider>
  );
};

export default EditIncomePage;