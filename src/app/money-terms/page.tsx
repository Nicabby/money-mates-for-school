'use client';

import React from 'react';
import MoneyGlossary from '@/components/MoneyGlossary';

export default function MoneyTermsPage() {
  return (
    <div className="space-y-8" style={{ paddingTop: '12pt' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">📚 Money Terms Guide</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Learn important financial words and concepts to become a money expert!
        </p>
      </div>

      <MoneyGlossary />
    </div>
  );
}