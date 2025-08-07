// Main authentication page component for MoneyMates
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import UnifiedRegistrationForm from './UnifiedRegistrationForm';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register'

  const renderCurrentView = () => {
    switch (currentView) {
      case 'register':
        return (
          <UnifiedRegistrationForm 
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      default:
        return (
          <LoginForm 
            onSwitchToSignup={() => setCurrentView('register')}
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="mx-auto" style={{ maxWidth: 'calc(64rem + 6cm)', paddingTop: '12pt' }}>
        <div className="text-center grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center">
            <img src="/MoneyMateslogo.png" alt="MoneyMates" style={{ height: '201.6px', width: 'auto' }} />
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-2">
              Learn how to manage your money like a pro! 
            </p>
            <p className="text-gray-600 text-lg mb-2">
              Track what you earn (allowance, chores) and what you spend.
            </p>
            <p className="text-gray-600 text-lg mb-4">
              Build smart money habits that will help you reach your goals!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
              <p className="text-blue-800 text-sm">
                <strong>Ready to start?</strong> Sign in or create an account to begin your money journey!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="mx-auto" style={{ maxWidth: 'calc(64rem + 6cm)' }}>
        <div className="flex justify-center">
          {renderCurrentView()}
        </div>
      </div>

    </div>
  );
};

export default AuthPage;