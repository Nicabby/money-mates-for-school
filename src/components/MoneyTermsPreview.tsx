'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const MoneyTermsPreview: React.FC = () => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/money-terms');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-center" style={{ marginBottom: '6px' }}>
        <div className="text-2xl" style={{ margin: '0' }}>📚</div>
        <h3 className="font-semibold text-lg" style={{ color: '#5e0b15', margin: '0' }}>Money Terms Guide</h3>
      </div>
      
      <p className="text-sm mb-2 text-left box-text-left" style={{ color: '#5e0b15', lineHeight: '1.5' }}>
        New to budgeting?
      </p>
      <p className="text-sm mb-3 text-left box-text-left" style={{ color: '#5e0b15', lineHeight: '1.5' }}>
        Learn key money terms like &quot;budget&quot;, &quot;income&quot;, &quot;expenses&quot;, and &quot;savings&quot; with simple definitions.
      </p>
      
      <p className="text-xs mb-3 text-left box-text-left" style={{ color: '#5e0b15' }}>
        <strong>Learn about:</strong> Budget, Income, Expenses, Savings, Interest, and more!
      </p>
      
      <div style={{ width: '100%' }}>
        <button
          onClick={handleClick}
          className="btn btn-primary btn-full-width text-center text-sm h-12"
          style={{ 
            alignItems: 'center', 
            justifyContent: 'center',
            boxSizing: 'border-box'
          }}
        >
          📖 View Money Dictionary
        </button>
      </div>
    </div>
  );
};

export default MoneyTermsPreview;