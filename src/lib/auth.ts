// Authentication functions for MoneyMates
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInAnonymously as firebaseSignInAnonymously,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserDocument } from './firestore';

/**
 * Sign up with email and password (for parents)
 * @param {string} email 
 * @param {string} password 
 * @param {string} displayName 
 * @returns {Promise<Object>} User object
 */
export const signUpWithEmailPassword = async (email, password, displayName = '') => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name if provided
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Create user document in Firestore
    await createUserDocument(user, {
      role: 'parent',
      displayName: displayName || user.email?.split('@')[0] || 'Parent',
      email: user.email
    });

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || displayName,
      role: 'parent'
    };
  } catch (error) {
    console.error('Error signing up:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with email and password (for parents)
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User object
 */
export const signInWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Ensure user document exists
    await createUserDocument(user, {
      role: 'parent',
      displayName: user.displayName || user.email?.split('@')[0] || 'Parent',
      email: user.email
    });

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: 'parent'
    };
  } catch (error) {
    console.error('Error signing in:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in anonymously (for kids)
 * @param {string} kidName - The child's name
 * @returns {Promise<Object>} User object
 */
export const signInAnonymously = async (kidName = 'Kid') => {
  try {
    console.log('Creating anonymous account for kid:', kidName);
    const userCredential = await firebaseSignInAnonymously(auth);
    const user = userCredential.user;
    console.log('Anonymous user created:', user.uid);

    // Create user document for the kid
    const userData = {
      role: 'kid',
      displayName: kidName,
      email: null
    };
    console.log('Creating user document with data:', userData);
    
    await createUserDocument(user, userData);
    console.log('Kid account created successfully');

    return {
      uid: user.uid,
      email: null,
      displayName: kidName,
      role: 'kid'
    };
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    
    // If anonymous auth is disabled, provide helpful error message
    if (error.code === 'auth/admin-restricted-operation') {
      throw new Error('Anonymous authentication is disabled. Please enable it in Firebase Console under Authentication > Sign-in method > Anonymous.');
    }
    
    throw new Error(`Failed to create kid account: ${error.message}`);
  }
};

/**
 * Create kid account with auto-generated email (alternative to anonymous)
 * @param {string} kidName - The child's name
 * @returns {Promise<Object>} User object
 */
export const signUpKidWithGeneratedEmail = async (kidName = 'Kid') => {
  try {
    console.log('Creating kid account with generated email for:', kidName);
    
    // Generate a unique email for the kid
    const timestamp = Date.now();
    const kidEmail = `kid_${timestamp}@moneymates.local`;
    const kidPassword = `kid_${timestamp}_${Math.random().toString(36).substring(2, 8)}`;
    
    console.log('Generated email:', kidEmail);
    
    const userCredential = await createUserWithEmailAndPassword(auth, kidEmail, kidPassword);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName: kidName });

    // Create user document for the kid
    const userData = {
      role: 'kid',
      displayName: kidName,
      email: kidEmail,
      isGeneratedAccount: true // Flag to indicate this is a system-generated account
    };
    
    await createUserDocument(user, userData);
    console.log('Kid account created successfully with generated email');

    return {
      uid: user.uid,
      email: kidEmail,
      displayName: kidName,
      role: 'kid'
    };
  } catch (error) {
    console.error('Error creating kid account with generated email:', error);
    throw new Error(`Failed to create kid account: ${error.message}`);
  }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

/**
 * Create child account without signing in (for parents to create multiple kids)
 * @param {string} kidName - The child's name
 * @param {string} parentUid - Parent's UID to link to
 * @returns {Promise<Object>} Child user data
 */
export const createChildAccount = async (kidName, parentUid) => {
  try {
    console.log('Creating child account for:', kidName, 'with parent:', parentUid);
    
    // Generate a unique email for the kid (we'll use email method to avoid auth state change)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const kidEmail = `kid_${timestamp}_${random}@moneymates.local`;
    const kidPassword = `kid_${timestamp}_${random}`;
    
    // Create the account using Firebase Admin-like approach (but we'll use regular createUser)
    // Since we can't use Firebase Admin SDK in client, we'll create via regular auth
    // but immediately sign back to parent
    
    const currentUser = auth.currentUser; // Store current parent user
    
    // Create kid account
    const userCredential = await createUserWithEmailAndPassword(auth, kidEmail, kidPassword);
    const kidUser = userCredential.user;
    
    // Update display name
    await updateProfile(kidUser, { displayName: kidName });

    // Create user document for the kid
    const userData = {
      role: 'kid',
      displayName: kidName,
      email: kidEmail,
      parentId: parentUid,
      isGeneratedAccount: true
    };
    
    await createUserDocument(kidUser, userData);
    
    // Sign out the kid and sign back in as parent
    await signOut(auth);
    
    // Re-authenticate the parent
    if (currentUser) {
      // We'll need to handle this differently since we can't re-auth without password
      // For now, let's return the kid data and handle re-auth in the component
    }
    
    console.log('Child account created successfully');

    return {
      uid: kidUser.uid,
      email: kidEmail,
      displayName: kidName,
      role: 'kid',
      parentId: parentUid
    };
  } catch (error) {
    console.error('Error creating child account:', error);
    throw new Error(`Failed to create child account: ${error.message}`);
  }
};

/**
 * Get current authenticated user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Convert Firebase auth error codes to user-friendly messages
 * @param {string} errorCode 
 * @returns {string}
 */
const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};