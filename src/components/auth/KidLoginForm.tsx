// Kid login form component for MoneyMates
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const KidLoginForm = ({ onBackToParent }) => {
  const [kidName, setKidName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInAsKid, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    if (!kidName.trim()) {
      alert('Please enter your name');
      setIsLoading(false);
      return;
    }

    try {
      await signInAsKid(kidName.trim());
      // Redirect will be handled by auth state change
    } catch (error) {
      console.error('Kid login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Hey Kid!</h2>
        <p className="text-gray-600">What&apos;s your name? Let&apos;s start tracking your money!</p>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="kidName" className="block text-lg font-medium text-gray-700 mb-2">
            My name is...
          </label>
          <input
            type="text"
            id="kidName"
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
            required
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your name"
            maxLength={20}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !kidName.trim()}
          className="w-full bg-green-600 text-white py-3 px-4 text-lg rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Getting Ready...' : '🚀 Start My Money Journey!'}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">For Kids:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Track your allowance and spending</li>
            <li>• Set savings goals</li>
            <li>• Learn about money management</li>
            <li>• Safe and private - no email needed!</li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={onBackToParent}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Parent Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default KidLoginForm;