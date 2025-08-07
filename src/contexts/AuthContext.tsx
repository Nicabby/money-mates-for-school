'use client';

// Authentication Context for MoneyMates
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserDocument } from '../lib/firestore';
import { 
  signUpWithEmailPassword, 
  signInWithEmailPassword, 
  signInAnonymously, 
  signUpKidWithGeneratedEmail,
  signOutUser 
} from '../lib/auth';
import { 
  verifyConnectionCode, 
  createConnectionRequest, 
  setupChildAllowance 
} from '../lib/firestore';

// Create Auth Context with proper typing
interface AuthContextType {
  currentUser: any;
  userDocument: any;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInAsKid: (kidName: string) => Promise<any>;
  signOut: () => Promise<void>;
  connectViaCode: (code: string) => Promise<string>;
  connectViaEmail: (parentEmail: string) => Promise<boolean>;
  setupAllowance: (kidUid: string, allowanceData: any) => Promise<void>;
  refreshUserDocument: () => Promise<void>;
  isAuthenticated: boolean;
  isParent: boolean;
  isKid: boolean;
  getUserDisplayName: () => string;
  getUserBalance: () => number;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDocument, setUserDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user document when authentication state changes
  const loadUserDocument = async (user) => {
    if (user) {
      try {
        const userDoc = await getUserDocument(user.uid);
        setUserDocument(userDoc);
      } catch (error) {
        console.error('Error loading user document:', error);
        setError('Failed to load user profile');
      }
    } else {
      setUserDocument(null);
    }
  };

  // Refresh user document (useful after updates)
  const refreshUserDocument = async () => {
    const user = currentUser || auth.currentUser;
    if (user) {
      console.log('Refreshing user document for:', user.uid);
      await loadUserDocument(user);
    } else {
      console.log('No user found to refresh document for');
    }
  };

  // Authentication functions with error handling
  const signUp = async (email, password, displayName) => {
    setError(null);
    try {
      const user = await signUpWithEmailPassword(email, password, displayName);
      // Refresh user document after signup
      await refreshUserDocument();
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    try {
      const user = await signInWithEmailPassword(email, password);
      // Refresh user document after signin
      await refreshUserDocument();
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInAsKid = async (kidName) => {
    setError(null);
    try {
      // Try anonymous authentication first
      const user = await signInAnonymously(kidName);
      // Wait for auth state to update, then refresh user document
      await new Promise(resolve => setTimeout(resolve, 1000));
      await refreshUserDocument();
      return user;
    } catch (error) {
      console.log('Anonymous auth failed, trying generated email method:', error.message);
      
      // If anonymous auth fails, try the generated email method
      if (error.message.includes('Anonymous authentication is disabled')) {
        try {
          const user = await signUpKidWithGeneratedEmail(kidName);
          await new Promise(resolve => setTimeout(resolve, 1000));
          await refreshUserDocument();
          return user;
        } catch (fallbackError) {
          setError(`Failed to create kid account: ${fallbackError.message}`);
          throw fallbackError;
        }
      } else {
        setError(error.message);
        throw error;
      }
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await signOutUser();
      setCurrentUser(null);
      setUserDocument(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Add a small delay to ensure Firestore document is created
        // For anonymous users, wait longer as document creation might take more time
        const delay = user.isAnonymous ? 500 : 100;
        setTimeout(async () => {
          await loadUserDocument(user);
          setLoading(false);
        }, delay);
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!currentUser;

  // Check if user is a parent
  const isParent = userDocument?.role === 'parent';

  // Check if user is a kid
  const isKid = userDocument?.role === 'kid';

  // Get user's display name
  const getUserDisplayName = () => {
    // For anonymous users, prioritize the document displayName
    if (currentUser?.isAnonymous) {
      return userDocument?.displayName || 'User';
    }
    // For regular users, check both sources
    return userDocument?.displayName || currentUser?.displayName || 'User';
  };

  // Get user's balance
  const getUserBalance = () => {
    return userDocument?.balance || 0;
  };

  // Parent-child connection functions
  const connectViaCode = async (code) => {
    setError(null);
    try {
      if (!currentUser) throw new Error('User must be logged in');
      
      // Add a small delay to ensure Firestore document is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const parentUid = await verifyConnectionCode(code, currentUser.uid);
      await refreshUserDocument();
      return parentUid;
    } catch (error) {
      console.error('Connect via code error:', error);
      setError(error.message);
      throw error;
    }
  };

  const connectViaEmail = async (parentEmail) => {
    setError(null);
    try {
      if (!currentUser) throw new Error('User must be logged in');
      
      // Add a small delay to ensure Firestore document is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await createConnectionRequest(currentUser.uid, parentEmail);
      return true;
    } catch (error) {
      console.error('Connect via email error:', error);
      setError(error.message);
      throw error;
    }
  };

  const setupAllowance = async (kidUid, allowanceData) => {
    setError(null);
    try {
      await setupChildAllowance(kidUid, allowanceData);
      await refreshUserDocument();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Context value
  const value = {
    // User state
    currentUser,
    userDocument,
    loading,
    error,
    
    // Authentication methods
    signUp,
    signIn,
    signInAsKid,
    signOut,
    
    // Parent-child connection methods
    connectViaCode,
    connectViaEmail,
    setupAllowance,
    
    // Utility methods
    refreshUserDocument,
    isAuthenticated,
    isParent,
    isKid,
    getUserDisplayName,
    getUserBalance,
    
    // Clear error
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;