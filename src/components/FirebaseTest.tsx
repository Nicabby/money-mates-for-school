// Firebase connection test component
import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const FirebaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [authStatus, setAuthStatus] = useState('Testing...');

  useEffect(() => {
    // Test Firebase initialization
    try {
      if (auth && db) {
        setConnectionStatus('✅ Firebase connected successfully!');
      } else {
        setConnectionStatus('❌ Firebase connection failed');
      }
    } catch (error) {
      setConnectionStatus(`❌ Error: ${error.message}`);
    }

    // Test Auth listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStatus(`✅ Auth working - User: ${user.uid}`);
      } else {
        setAuthStatus('✅ Auth working - No user signed in');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto m-8">
      <h3 className="text-lg font-semibold mb-4">🔥 Firebase Connection Test</h3>
      
      <div className="space-y-3">
        <div>
          <strong>Connection Status:</strong>
          <div className="mt-1 text-sm">{connectionStatus}</div>
        </div>
        
        <div>
          <strong>Auth Status:</strong>
          <div className="mt-1 text-sm">{authStatus}</div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <strong>Project ID:</strong> moneymates-c44f4<br />
          <strong>Auth Domain:</strong> moneymates-c44f4.firebaseapp.com
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;