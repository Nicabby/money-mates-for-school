'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getChildProfilesByParent, generateConnectionCode } from '../lib/firestore';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  allowance: {
    amount: number;
    frequency: string;
  };
  hasFirebaseAccount: boolean;
  firebaseUid?: string;
}

const ParentDashboard: React.FC = () => {
  const { currentUser, getUserDisplayName } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [connectionCode, setConnectionCode] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadChildren();
    }
  }, [currentUser]);

  const loadChildren = async () => {
    try {
      if (!currentUser) return;
      
      const childProfiles = await getChildProfilesByParent(currentUser.uid);
      setChildren(childProfiles);
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      if (!currentUser) return;
      
      setIsGeneratingCode(true);
      const code = await generateConnectionCode(currentUser.uid);
      setConnectionCode(code);
    } catch (error) {
      console.error('Error generating connection code:', error);
      alert('Failed to generate connection code. Please try again.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(connectionCode);
    alert('Connection code copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Welcome, {getUserDisplayName()}! 👨‍👩‍👧‍👦
        </h2>
        <p className="text-blue-700">
          Manage your family's money journey. Track allowances, monitor progress, and teach financial responsibility.
        </p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Connection Code */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">🔗</div>
            <h3 className="font-semibold text-lg text-gray-900">Connection Code</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Generate a code for your kids to connect their accounts to yours.
          </p>
          
          {connectionCode ? (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-mono font-bold text-green-800">
                  {connectionCode}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Expires in 24 hours
                </div>
              </div>
              <button
                onClick={copyCodeToClipboard}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm"
              >
                📋 Copy Code
              </button>
              <button
                onClick={handleGenerateCode}
                disabled={isGeneratingCode}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 text-sm"
              >
                🔄 Generate New Code
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerateCode}
              disabled={isGeneratingCode}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {isGeneratingCode ? 'Generating...' : '🔗 Generate Code'}
            </button>
          )}
        </div>

        {/* Family Overview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
            <h3 className="font-semibold text-lg text-gray-900">Family Overview</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Children:</span>
              <span className="font-semibold">{children.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Accounts:</span>
              <span className="font-semibold">
                {children.filter(child => child.hasFirebaseAccount).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Allowances:</span>
              <span className="font-semibold text-green-600">
                ${children.reduce((total, child) => total + child.allowance.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-lg text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 text-sm"
            >
              📊 View Full Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/add-entry'}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm"
            >
              💰 Track Money
            </button>
            <button
              onClick={() => alert('Coming soon!')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm"
            >
              🎯 Set Family Goals
            </button>
          </div>
        </div>
      </div>

      {/* Children List */}
      {children.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Children</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children.map((child) => (
              <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{child.name}</h4>
                    <p className="text-sm text-gray-600">Age: {child.age}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    child.hasFirebaseAccount 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {child.hasFirebaseAccount ? 'Active' : 'Setup Pending'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Allowance:</span>
                    <span className="font-semibold">
                      ${child.allowance.amount} {child.allowance.frequency}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert('Edit feature coming soon!')}
                      className="flex-1 bg-blue-100 text-blue-800 py-1 px-3 rounded text-xs hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    {child.hasFirebaseAccount && (
                      <button
                        onClick={() => alert('View feature coming soon!')}
                        className="flex-1 bg-green-100 text-green-800 py-1 px-3 rounded text-xs hover:bg-green-200"
                      >
                        View Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Children State */}
      {!isLoading && children.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">👶</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Children Added Yet</h3>
          <p className="text-gray-600 mb-4">
            Start by adding your children to help them learn money management skills.
          </p>
          <button
            onClick={() => alert('Add children feature coming soon!')}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Add Your First Child
          </button>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;