'use client';

import React from 'react';

const QuickStartGuide: React.FC = () => {
  const handleClick = () => {
    window.open('/quick-start', '_blank');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-center" style={{ marginBottom: '6px' }}>
        <div className="text-2xl" style={{ margin: '0' }}>🚀</div>
        <h3 className="font-semibold text-lg" style={{ color: '#5e0b15', margin: '0' }}>Quick Start Guide</h3>
      </div>
      
      <p className="text-sm mb-2 text-left box-text-left" style={{ color: '#5e0b15', lineHeight: '1.5' }}>
        Ready to get started?
      </p>
      <p className="text-sm mb-3 text-left box-text-left" style={{ color: '#5e0b15', lineHeight: '1.5' }}>
        Follow our step-by-step instructions to set up your first budget.
      </p>
      
      <p className="text-xs mb-3 text-left box-text-left" style={{ color: '#5e0b15' }}>
        <strong>Get started with:</strong> Setting up budgets, adding expenses, tracking progress, and more!
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
          🚀 Get Started Now
        </button>
      </div>
    </div>
  );
};

export default QuickStartGuide;