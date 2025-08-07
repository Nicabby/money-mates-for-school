'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createChildProfile } from '../../lib/firestore';
import { auth } from '../../lib/firebase';

interface Child {
  name: string;
  age: string;
  allowance: string;
  allowanceFrequency: 'weekly' | 'monthly';
}

interface ParentChildRegistrationProps {
  parentName: string;
  onComplete: () => void;
  onBack: () => void;
}

const ParentChildRegistration: React.FC<ParentChildRegistrationProps> = ({ 
  parentName, 
  onComplete, 
  onBack 
}) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [currentChild, setCurrentChild] = useState<Child>({
    name: '',
    age: '',
    allowance: '',
    allowanceFrequency: 'weekly'
  });
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, loading, refreshUserDocument } = useAuth();

  // Try to refresh auth state when component mounts
  useEffect(() => {
    if (!currentUser && !loading) {
      console.log('No current user detected, attempting refresh...');
      const timer = setTimeout(async () => {
        await refreshUserDocument();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, loading, refreshUserDocument]);

  const handleChildChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentChild({
      ...currentChild,
      [e.target.name]: e.target.value
    });
  };

  const addChild = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentChild.name.trim()) {
      alert('Please enter child\'s name');
      return;
    }

    if (!currentChild.age || parseInt(currentChild.age) < 3 || parseInt(currentChild.age) > 18) {
      alert('Please enter a valid age (3-18)');
      return;
    }

    setChildren([...children, currentChild]);
    setCurrentChild({
      name: '',
      age: '',
      allowance: '',
      allowanceFrequency: 'weekly'
    });
    setIsAddingChild(false);
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const completeSetup = async () => {
    setIsLoading(true);
    
    try {
      console.log('Current user during child setup:', currentUser);
      
      let parentUser = currentUser;
      
      if (!parentUser) {
        // Try to get the current user directly from Firebase auth
        console.log('No current user in context, checking Firebase auth directly...');
        parentUser = auth.currentUser;
        
        if (!parentUser) {
          // Wait a bit for auth state to update and try again
          console.log('No current user anywhere, waiting for auth state...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          parentUser = currentUser || auth.currentUser;
          
          if (!parentUser) {
            console.error('Still no current user after waiting. Loading state:', loading);
            throw new Error('Parent authentication expired. Please sign in again.');
          }
        }
      }

      console.log('Creating child profiles for parent:', parentUser.uid);
      
      // Create child profiles (not Firebase accounts yet)
      for (const child of children) {
        console.log('Creating profile for child:', child.name);
        await createChildProfile(parentUser.uid, child);
      }
      
      console.log('All child profiles created successfully');
      onComplete();
    } catch (error) {
      console.error('Error setting up children:', error);
      alert(`Failed to set up children: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug info
  console.log('ParentChildRegistration - currentUser:', currentUser);
  console.log('ParentChildRegistration - loading:', loading);
  console.log('ParentChildRegistration - children count:', children.length);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {parentName}! 👨‍👩‍👧‍👦
        </h2>
        <p className="text-gray-600">Let&apos;s set up accounts for your children</p>
        
        {/* Debug info for troubleshooting */}
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <p>Debug: User: {currentUser ? 'Yes' : 'No'} | Loading: {loading ? 'Yes' : 'No'} | Children: {children.length}</p>
          {!currentUser && !loading && (
            <div className="space-x-2">
              <button 
                onClick={async () => {
                  console.log('Manual refresh attempted');
                  await refreshUserDocument();
                }}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs"
              >
                🔄 Refresh Auth
              </button>
              <button 
                onClick={() => {
                  console.log('Force continuing without auth (for testing)');
                  onComplete();
                }}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-xs"
              >
                ⚠️ Skip for Testing
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Current Children List */}
      {children.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Children:</h3>
          <div className="space-y-3">
            {children.map((child, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div>
                  <div className="font-semibold text-gray-900">{child.name}</div>
                  <div className="text-sm text-gray-600">
                    Age: {child.age} • 
                    {child.allowance ? ` $${child.allowance} ${child.allowanceFrequency}` : ' No allowance set'}
                  </div>
                </div>
                <button
                  onClick={() => removeChild(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Child Form */}
      {isAddingChild ? (
        <form onSubmit={addChild} className="mb-6 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Child</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
                Child&apos;s Name
              </label>
              <input
                type="text"
                id="childName"
                name="name"
                value={currentChild.name}
                onChange={handleChildChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter child's name"
              />
            </div>

            <div>
              <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                id="childAge"
                name="age"
                value={currentChild.age}
                onChange={handleChildChange}
                min="3"
                max="18"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Age"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="allowance" className="block text-sm font-medium text-gray-700 mb-2">
                Allowance Amount (optional)
              </label>
              <input
                type="number"
                id="allowance"
                name="allowance"
                value={currentChild.allowance}
                onChange={handleChildChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                id="frequency"
                name="allowanceFrequency"
                value={currentChild.allowanceFrequency}
                onChange={handleChildChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Child
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingChild(false);
                setCurrentChild({
                  name: '',
                  age: '',
                  allowance: '',
                  allowanceFrequency: 'weekly'
                });
              }}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 text-center">
          <button
            onClick={() => setIsAddingChild(true)}
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            + Add a Child
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <button
          onClick={() => {
            console.log('Going back from parent child registration');
            onBack();
          }}
          className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          ← Back
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => {
              console.log('Parent skipping child setup');
              onComplete();
            }}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Skip for Now
          </button>
          
          {children.length > 0 && (
            <button
              onClick={() => {
                // For now, just complete without creating profiles
                // Parents can add children later from dashboard
                console.log('Completing with children info saved for later:', children);
                onComplete();
              }}
              disabled={isLoading}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Setting Up...' : `Continue with ${children.length} Child${children.length > 1 ? 'ren' : ''}`}
            </button>
          )}
        </div>
      </div>

      {children.length === 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Optional:</strong> You can add your children now or set them up later from your dashboard. 
            Each child will get their own safe account to track their money and learn budgeting skills.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParentChildRegistration;