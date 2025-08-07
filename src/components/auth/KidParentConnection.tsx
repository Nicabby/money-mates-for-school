'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createConnectionRequest, verifyConnectionCode } from '../../lib/firestore';

interface KidParentConnectionProps {
  kidName: string;
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const KidParentConnection: React.FC<KidParentConnectionProps> = ({ 
  kidName, 
  onComplete, 
  onSkip, 
  onBack 
}) => {
  const [parentEmail, setParentEmail] = useState('');
  const [connectionCode, setConnectionCode] = useState('');
  const [connectionMethod, setConnectionMethod] = useState<'email' | 'code' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser, connectViaEmail, connectViaCode, signInAsKid } = useAuth();

  const handleEmailConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let kidUser = currentUser;
      
      // First create the kid account if not already created
      if (!kidUser) {
        kidUser = await signInAsKid(kidName);
        // Wait a bit for the auth state to update
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Use the kidUser directly instead of relying on currentUser
      await createConnectionRequest(kidUser.uid, parentEmail);
      setConnectionStatus('success');
      setTimeout(() => {
        onComplete();
      }, 2000);
      
    } catch (error) {
      console.error('Email connection failed:', error);
      setConnectionStatus('failed');
      setErrorMessage(error.message || 'Failed to connect via email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let kidUser = currentUser;
      
      // First create the kid account if not already created
      if (!kidUser) {
        kidUser = await signInAsKid(kidName);
        // Wait a bit for the auth state to update
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Use the kidUser directly instead of relying on currentUser
      await verifyConnectionCode(connectionCode, kidUser.uid);
      setConnectionStatus('success');
      setTimeout(() => {
        onComplete();
      }, 2000);
      
    } catch (error) {
      console.error('Code connection failed:', error);
      setConnectionStatus('failed');
      setErrorMessage(error.message || 'Failed to connect with code. Please check the code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderConnectionMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Connect with your parent?
        </h3>
        <p className="text-gray-600 mb-6">
          Your parent can help you set up allowances and monitor your progress!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setConnectionMethod('email')}
          className="p-6 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-center"
        >
          <div className="text-3xl mb-3">📧</div>
          <div className="font-semibold text-blue-800 mb-2">Parent&apos;s Email</div>
          <div className="text-sm text-blue-600">
            Enter your parent&apos;s email to send a connection request
          </div>
        </button>
        
        <button
          onClick={() => setConnectionMethod('code')}
          className="p-6 border-2 border-green-300 rounded-lg hover:bg-green-50 transition-colors text-center"
        >
          <div className="text-3xl mb-3">🔢</div>
          <div className="font-semibold text-green-800 mb-2">Connection Code</div>
          <div className="text-sm text-green-600">
            Enter a code provided by your parent
          </div>
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={async () => {
            try {
              setIsLoading(true);
              // Create kid account even if they skip connection
              if (!currentUser) {
                const kidUser = await signInAsKid(kidName);
                // Wait a bit for the auth state to update
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
              onSkip();
            } catch (error) {
              console.error('Error creating kid account:', error);
              setConnectionStatus('failed');
              setErrorMessage(error.message || 'Failed to create account. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
          className="text-gray-600 hover:text-gray-800 text-sm disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Skip for now - I\'ll connect later'}
        </button>
      </div>
    </div>
  );

  const renderEmailConnection = () => (
    <form onSubmit={handleEmailConnection} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Connect via Parent&apos;s Email
        </h3>
        <p className="text-gray-600">
          We&apos;ll send your parent a request to connect your accounts
        </p>
      </div>

      <div>
        <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Parent&apos;s Email Address
        </label>
        <input
          type="email"
          id="parentEmail"
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="parent@example.com"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>What happens next:</strong><br />
          1. We&apos;ll send an email to your parent<br />
          2. They&apos;ll click a link to connect your accounts<br />
          3. You&apos;ll be able to share your progress with them!
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setConnectionMethod(null)}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending Request...' : 'Send Connection Request'}
        </button>
      </div>
    </form>
  );

  const renderCodeConnection = () => (
    <form onSubmit={handleCodeConnection} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Enter Connection Code
        </h3>
        <p className="text-gray-600">
          Ask your parent for the connection code from their account
        </p>
      </div>

      <div>
        <label htmlFor="connectionCode" className="block text-sm font-medium text-gray-700 mb-2">
          Connection Code
        </label>
        <input
          type="text"
          id="connectionCode"
          value={connectionCode}
          onChange={(e) => setConnectionCode(e.target.value.toUpperCase())}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-mono"
          placeholder="ABC123"
          maxLength={10}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          <strong>How to get a code:</strong><br />
          1. Ask your parent to log into their MoneyMates account<br />
          2. They can generate a connection code in their settings<br />
          3. Enter the code here to connect your accounts!
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setConnectionMethod(null)}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Connecting...' : 'Connect Accounts'}
        </button>
      </div>
    </form>
  );

  const renderConnectionStatus = () => {
    if (connectionStatus === 'success') {
      return (
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h3 className="text-xl font-semibold text-green-800">
            Connection Successful!
          </h3>
          <p className="text-green-600">
            Your account is now connected with your parent. 
            They can help you set up allowances and monitor your progress!
          </p>
          <div className="animate-pulse text-sm text-gray-600">
            Redirecting to your dashboard...
          </div>
        </div>
      );
    }

    if (connectionStatus === 'failed') {
      return (
        <div className="text-center space-y-4">
          <div className="text-6xl">😔</div>
          <h3 className="text-xl font-semibold text-red-800">
            Connection Failed
          </h3>
          <p className="text-red-600 mb-2">
            We couldn&apos;t connect to your parent&apos;s account.
          </p>
          {errorMessage && (
            <p className="text-red-600 text-sm mb-4">
              {errorMessage}
            </p>
          )}
          <button
            onClick={() => {
              setConnectionStatus(null);
              setConnectionMethod(null);
              setParentEmail('');
              setConnectionCode('');
              setErrorMessage('');
            }}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🎮</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {kidName}!
        </h2>
        <p className="text-gray-600">Your account has been created successfully!</p>
      </div>

      {connectionStatus ? (
        renderConnectionStatus()
      ) : connectionMethod === 'email' ? (
        renderEmailConnection()
      ) : connectionMethod === 'code' ? (
        renderCodeConnection()
      ) : (
        renderConnectionMethodSelection()
      )}

      {!connectionStatus && (
        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Registration
          </button>
        </div>
      )}
    </div>
  );
};

export default KidParentConnection;