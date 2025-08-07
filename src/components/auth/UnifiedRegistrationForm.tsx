'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';
import { updateUserProfile } from '../../lib/firestore';
import ParentChildRegistration from './ParentChildRegistration';
import KidParentConnection from './KidParentConnection';

interface UnifiedRegistrationFormProps {
  onSwitchToLogin: () => void;
}

type RegistrationStep = 'initial' | 'role-selection' | 'parent-setup' | 'kid-setup';

const UnifiedRegistrationForm: React.FC<UnifiedRegistrationFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [selectedRole, setSelectedRole] = useState<'parent' | 'kid' | null>(null);
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { signUp, signInAsKid, error, clearError } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear validation error when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleRoleSelection = async (role: 'parent' | 'kid') => {
    setSelectedRole(role);
    
    try {
      // Update user role in Firestore
      const user = auth.currentUser;
      if (user) {
        console.log('Updating user role to:', role);
        await updateUserProfile(user.uid, { role });
        console.log('User role updated successfully');
      }
      
      if (role === 'parent') {
        setCurrentStep('parent-setup');
      } else {
        setCurrentStep('kid-setup');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      // Continue anyway, role can be set later
      if (role === 'parent') {
        setCurrentStep('parent-setup');
      } else {
        setCurrentStep('kid-setup');
      }
    }
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Reset validation errors
    setValidationErrors({});
    
    // Validation - now everyone needs email and password
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name';
    }

    if (!formData.email) {
      errors.email = 'Please enter your email address';
    }
    
    if (!formData.password) {
      errors.password = 'Please enter a password';
    }
    
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    // Create account for everyone first
    try {
      console.log('Starting signup with:', formData.email, formData.name);
      const user = await signUp(formData.email, formData.password, formData.name);
      console.log('Signup successful:', user);
      
      // Wait a bit for auth state to propagate
      console.log('Waiting for auth state to propagate...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After signup, ask for role selection
      console.log('Moving to role selection step');
      setCurrentStep('role-selection');
    } catch (error) {
      console.error('Signup failed:', error);
      setValidationErrors({ submit: error.message || 'Signup failed' });
    }

    setIsLoading(false);
  };

  const renderInitialForm = () => (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Join MoneyMates!</h2>
        <p className="text-gray-600">Start your money learning journey</p>
      </div>

      {(error || validationErrors.submit) && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
          {error || validationErrors.submit}
        </div>
      )}

      <form onSubmit={handleInitialSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            What&apos;s your name? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your name (required)"
          />
          {validationErrors.name && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
          />
          {validationErrors.email && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          {validationErrors.password ? (
            <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          {validationErrors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );

  const renderRoleSelection = () => (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {formData.name}! 🎉</h2>
        <p className="text-gray-600">Your account has been created successfully!</p>
      </div>

      <div className="space-y-4">
        <p className="text-center text-gray-600 font-medium">How will you be using MoneyMates?</p>
        
        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            onClick={() => handleRoleSelection('parent')}
            className="p-6 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-center"
          >
            <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
            <div className="font-semibold text-blue-800 mb-2">I'm Managing Family Finances</div>
            <div className="text-sm text-blue-600">
              Set up accounts for my children, manage allowances, and track family spending
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => handleRoleSelection('kid')}
            className="p-6 border-2 border-green-300 rounded-lg hover:bg-green-50 transition-colors text-center"
          >
            <div className="text-4xl mb-3">🎮</div>
            <div className="font-semibold text-green-800 mb-2">I'm Learning Money Skills</div>
            <div className="text-sm text-green-600">
              Track my money, set savings goals, and learn budgeting skills
            </div>
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              // Skip role selection and go to main dashboard
              window.location.href = '/';
            }}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Skip for now - I'll decide later
          </button>
        </div>
      </div>
    </div>
  );

  // Render based on current step
  if (currentStep === 'role-selection') {
    return renderRoleSelection();
  }

  if (currentStep === 'parent-setup') {
    return (
      <ParentChildRegistration 
        parentName={formData.name}
        onComplete={() => {
          console.log('Parent child registration completed');
          // Registration complete, redirect will happen automatically by AuthWrapper
          // For now, just show success or redirect to main page
          window.location.href = '/';
        }}
        onBack={() => {
          console.log('Going back from parent setup');
          setCurrentStep('role-selection');
          setSelectedRole(null);
        }}
      />
    );
  }

  if (currentStep === 'kid-setup') {
    return (
      <KidParentConnection 
        kidName={formData.name}
        onComplete={() => {
          console.log('Kid parent connection completed');
          // Connection complete, redirect will happen automatically by AuthWrapper
          window.location.href = '/';
        }}
        onSkip={() => {
          console.log('Kid skipped parent connection');
          // Kid chooses to skip parent connection for now
          window.location.href = '/';
        }}
        onBack={() => {
          console.log('Going back from kid setup');
          setCurrentStep('role-selection');
          setSelectedRole(null);
        }}
      />
    );
  }

  return renderInitialForm();
};

export default UnifiedRegistrationForm;