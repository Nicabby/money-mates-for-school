'use client';

import React, { useState } from 'react';
import { loadSampleData, clearAllData } from '@/lib/sampleData';

const SampleDataLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoadSampleData = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      loadSampleData();
      setMessage('Sample data loaded! Refresh the page to see the data.');
      
      // Auto-refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage('Error loading sample data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      setIsLoading(true);
      setMessage('');
      
      try {
        clearAllData();
        setMessage('All data cleared! Refresh the page to see changes.');
        
        // Auto-refresh after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        setMessage('Error clearing data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-center" style={{ marginBottom: '6px' }}>
        <div className="text-2xl" style={{ margin: '0' }}>🎯</div>
        <h3 className="font-semibold text-lg" style={{ color: '#5e0b15', margin: '0' }}>Try the Demo!</h3>
      </div>
      
      <p className="text-sm mb-2 text-left box-text-left" style={{ color: '#5e0b15', lineHeight: '1.5' }}>
        Want to see how the app works?
      </p>
      <p className="text-sm mb-3 text-left box-text-left" style={{ color: '#5e0b15', lineHeight: '1.5' }}>
        Load some sample data to explore all features including budgets, analytics, and streak tracking.
      </p>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}
      
      <p className="text-xs mb-3 text-left box-text-left" style={{ color: '#5e0b15' }}>
        <strong>Sample includes:</strong> 18 expenses, 17 income entries, 10 budgets across 3 months
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleLoadSampleData}
          disabled={isLoading}
          className="btn btn-primary text-sm flex items-center justify-center space-x-2 h-12"
        >
          {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
          <span>{isLoading ? 'Loading...' : '📊 Load Sample Data'}</span>
        </button>
        
        <button
          onClick={handleClearData}
          disabled={isLoading}
          className="btn btn-primary text-sm flex items-center justify-center h-12"
        >
          🗑️ Clear All Data
        </button>
      </div>
    </div>
  );
};

export default SampleDataLoader;