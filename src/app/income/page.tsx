'use client';

import React from 'react';
import IncomeList from '@/components/IncomeList';
import { IncomeProvider } from '@/components/IncomeProvider';

const IncomePage: React.FC = () => {
  return (
    <IncomeProvider>
      <div className="container mx-auto px-4 py-8">
        <IncomeList />
      </div>
    </IncomeProvider>
  );
};

export default IncomePage;