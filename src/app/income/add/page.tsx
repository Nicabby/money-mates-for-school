'use client';

import React from 'react';
import IncomeForm from '@/components/IncomeForm';
import { IncomeProvider } from '@/components/IncomeProvider';

const AddIncomePage: React.FC = () => {
  return (
    <IncomeProvider>
      <div className="container mx-auto px-4 py-8">
        <IncomeForm />
      </div>
    </IncomeProvider>
  );
};

export default AddIncomePage;