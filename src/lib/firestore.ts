// Firestore database functions for MoneyMates
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Create or update user document in Firestore
 * @param {Object} user - Firebase user object
 * @param {Object} additionalData - Additional user data
 * @returns {Promise<Object>} User document data
 */
export const createUserDocument = async (user: any, additionalData: any = {}) => {
  if (!user) return null;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  // If user document doesn't exist, create it
  if (!userSnap.exists()) {
    const userData = {
      uid: user.uid,
      role: additionalData.role || 'kid', // default to kid
      displayName: additionalData.displayName || user.displayName || 'User',
      email: additionalData.email || user.email || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      balance: 0,
      goals: [],
      transactions: [],
      settings: {
        notifications: true,
        theme: 'light',
        currency: 'USD'
      },
      // Parent-specific fields
      ...(additionalData.role === 'parent' && {
        children: [], // Array of kid UIDs they manage
        isVerified: false
      }),
      // Kid-specific fields
      ...(additionalData.role === 'kid' && {
        parentId: null, // UID of parent who manages this kid
        allowance: {
          amount: 0,
          frequency: 'weekly', // weekly, monthly
          nextPayment: null
        }
      })
    };

    try {
      await setDoc(userRef, userData);
      console.log('User document created successfully');
      return userData;
    } catch (error) {
      console.error('Error creating user document:', error);
      throw new Error('Failed to create user profile');
    }
  } else {
    // Update existing document with any new data
    const existingData = userSnap.data();
    if (Object.keys(additionalData).length > 0) {
      await updateDoc(userRef, {
        ...additionalData,
        updatedAt: serverTimestamp()
      });
    }
    return existingData;
  }
};

/**
 * Get user document by UID
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User document data
 */
export const getUserDocument = async (uid) => {
  if (!uid) return null;

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.log('No user document found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user document:', error);
    throw new Error('Failed to load user profile');
  }
};

/**
 * Update user balance
 * @param {string} uid - User ID
 * @param {number} amount - Amount to add (positive) or subtract (negative)
 * @returns {Promise<void>}
 */
export const updateUserBalance = async (uid, amount) => {
  if (!uid) throw new Error('User ID is required');

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      balance: increment(amount),
      updatedAt: serverTimestamp()
    });
    console.log('Balance updated successfully');
  } catch (error) {
    console.error('Error updating balance:', error);
    throw new Error('Failed to update balance');
  }
};

/**
 * Add a transaction to user's transaction history
 * @param {string} uid - User ID
 * @param {Object} transaction - Transaction object
 * @returns {Promise<void>}
 */
export const addTransaction = async (uid, transaction) => {
  if (!uid) throw new Error('User ID is required');

  const transactionData = {
    id: `transaction_${Date.now()}`,
    timestamp: serverTimestamp(),
    ...transaction
  };

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      transactions: arrayUnion(transactionData),
      updatedAt: serverTimestamp()
    });

    // Also update balance
    const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    await updateUserBalance(uid, balanceChange);

    console.log('Transaction added successfully');
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw new Error('Failed to add transaction');
  }
};

/**
 * Add a goal to user's goals
 * @param {string} uid - User ID
 * @param {Object} goal - Goal object
 * @returns {Promise<void>}
 */
export const addGoal = async (uid, goal) => {
  if (!uid) throw new Error('User ID is required');

  const goalData = {
    id: `goal_${Date.now()}`,
    createdAt: serverTimestamp(),
    isCompleted: false,
    progress: 0,
    ...goal
  };

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      goals: arrayUnion(goalData),
      updatedAt: serverTimestamp()
    });
    console.log('Goal added successfully');
  } catch (error) {
    console.error('Error adding goal:', error);
    throw new Error('Failed to add goal');
  }
};

/**
 * Update a goal's progress
 * @param {string} uid - User ID
 * @param {string} goalId - Goal ID
 * @param {number} progress - New progress amount
 * @returns {Promise<void>}
 */
export const updateGoalProgress = async (uid, goalId, progress) => {
  if (!uid || !goalId) throw new Error('User ID and Goal ID are required');

  try {
    // Get current user document
    const userDoc = await getUserDocument(uid);
    if (!userDoc) throw new Error('User not found');

    // Update the specific goal
    const updatedGoals = userDoc.goals.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, progress };
        // Mark as completed if progress reaches target
        if (progress >= goal.targetAmount) {
          updatedGoal.isCompleted = true;
          updatedGoal.completedAt = Timestamp.now();
        }
        return updatedGoal;
      }
      return goal;
    });

    // Update the document
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      goals: updatedGoals,
      updatedAt: serverTimestamp()
    });

    console.log('Goal progress updated successfully');
  } catch (error) {
    console.error('Error updating goal progress:', error);
    throw new Error('Failed to update goal progress');
  }
};

/**
 * Link a kid to a parent account
 * @param {string} parentUid - Parent's UID
 * @param {string} kidUid - Kid's UID
 * @returns {Promise<void>}
 */
export const linkKidToParent = async (parentUid, kidUid) => {
  if (!parentUid || !kidUid) throw new Error('Both parent and kid UIDs are required');

  try {
    // Add kid to parent's children array
    const parentRef = doc(db, 'users', parentUid);
    await updateDoc(parentRef, {
      children: arrayUnion(kidUid),
      updatedAt: serverTimestamp()
    });

    // Set parent ID for the kid
    const kidRef = doc(db, 'users', kidUid);
    await updateDoc(kidRef, {
      parentId: parentUid,
      updatedAt: serverTimestamp()
    });

    console.log('Kid linked to parent successfully');
  } catch (error) {
    console.error('Error linking kid to parent:', error);
    throw new Error('Failed to link accounts');
  }
};

/**
 * Get all kids managed by a parent
 * @param {string} parentUid - Parent's UID
 * @returns {Promise<Array>} Array of kid documents
 */
export const getKidsByParent = async (parentUid) => {
  if (!parentUid) throw new Error('Parent UID is required');

  try {
    const q = query(collection(db, 'users'), where('parentId', '==', parentUid));
    const querySnapshot = await getDocs(q);
    
    const kids = [];
    querySnapshot.forEach((doc) => {
      kids.push({ id: doc.id, ...doc.data() });
    });

    return kids;
  } catch (error) {
    console.error('Error getting kids:', error);
    throw new Error('Failed to load kids');
  }
};

/**
 * Update user profile information
 * @param {string} uid - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (uid, updates) => {
  if (!uid) throw new Error('User ID is required');

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }
};

/**
 * Generate a unique connection code for parent-child linking
 * @param {string} parentUid - Parent's UID
 * @returns {Promise<string>} Connection code
 */
export const generateConnectionCode = async (parentUid) => {
  if (!parentUid) throw new Error('Parent UID is required');

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Code expires in 24 hours

  try {
    const codeRef = doc(db, 'connectionCodes', code);
    await setDoc(codeRef, {
      parentUid,
      code,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      used: false
    });

    console.log('Connection code generated:', code);
    return code;
  } catch (error) {
    console.error('Error generating connection code:', error);
    throw new Error('Failed to generate connection code');
  }
};

/**
 * Verify and use a connection code to link kid to parent
 * @param {string} code - Connection code
 * @param {string} kidUid - Kid's UID
 * @returns {Promise<string>} Parent UID
 */
export const verifyConnectionCode = async (code, kidUid) => {
  if (!code || !kidUid) throw new Error('Code and kid UID are required');

  try {
    const codeRef = doc(db, 'connectionCodes', code.toUpperCase());
    const codeSnap = await getDoc(codeRef);

    if (!codeSnap.exists()) {
      throw new Error('Invalid connection code');
    }

    const codeData = codeSnap.data();
    
    // Check if code is expired
    if (codeData.expiresAt.toDate() < new Date()) {
      throw new Error('Connection code has expired');
    }

    // Check if code has already been used
    if (codeData.used) {
      throw new Error('Connection code has already been used');
    }

    // Link the kid to parent
    await linkKidToParent(codeData.parentUid, kidUid);

    // Mark code as used
    await updateDoc(codeRef, {
      used: true,
      usedAt: serverTimestamp(),
      usedBy: kidUid
    });

    console.log('Connection code verified and accounts linked');
    return codeData.parentUid;
  } catch (error) {
    console.error('Error verifying connection code:', error);
    throw error;
  }
};

/**
 * Find parent by email for connection request
 * @param {string} email - Parent's email
 * @returns {Promise<Object|null>} Parent document
 */
export const findParentByEmail = async (email) => {
  if (!email) throw new Error('Email is required');

  try {
    console.log('Searching for parent with email:', email.toLowerCase());
    
    // First, let's check all users to see what's in the database
    const allUsersQuery = query(collection(db, 'users'));
    const allUsersSnapshot = await getDocs(allUsersQuery);
    console.log('All users in database:');
    allUsersSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('User:', doc.id, 'Email:', data.email, 'Role:', data.role);
    });
    
    const q = query(
      collection(db, 'users'), 
      where('email', '==', email.toLowerCase()),
      where('role', '==', 'parent')
    );
    const querySnapshot = await getDocs(q);
    
    console.log('Query results:', querySnapshot.size, 'documents found');
    
    if (querySnapshot.empty) {
      console.log('No parent found with email:', email.toLowerCase());
      return null;
    }

    const doc = querySnapshot.docs[0];
    const parentData = { id: doc.id, ...doc.data() };
    console.log('Found parent:', parentData);
    return parentData;
  } catch (error) {
    console.error('Error finding parent by email:', error);
    throw new Error('Failed to find parent account');
  }
};

/**
 * Create a connection request for kid to parent via email
 * @param {string} kidUid - Kid's UID
 * @param {string} parentEmail - Parent's email
 * @returns {Promise<void>}
 */
export const createConnectionRequest = async (kidUid, parentEmail) => {
  if (!kidUid || !parentEmail) throw new Error('Kid UID and parent email are required');

  try {
    console.log('Looking for parent with email:', parentEmail);
    const parent = await findParentByEmail(parentEmail);
    console.log('Parent found:', parent);
    
    if (!parent) {
      throw new Error('No parent account found with that email address. Make sure your parent has registered first.');
    }

    const requestId = `request_${Date.now()}`;
    const requestRef = doc(db, 'connectionRequests', requestId);
    
    const requestData = {
      id: requestId,
      kidUid,
      parentUid: parent.id,
      parentEmail: parentEmail.toLowerCase(),
      status: 'pending',
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 days
    };
    
    console.log('Creating connection request:', requestData);
    await setDoc(requestRef, requestData);

    console.log('Connection request created successfully');
  } catch (error) {
    console.error('Error creating connection request:', error);
    throw error;
  }
};

/**
 * Setup allowance for a child
 * @param {string} kidUid - Kid's UID
 * @param {Object} allowanceData - Allowance configuration
 * @returns {Promise<void>}
 */
export const setupChildAllowance = async (kidUid, allowanceData) => {
  if (!kidUid) throw new Error('Kid UID is required');

  const { amount, frequency } = allowanceData;
  
  try {
    const kidRef = doc(db, 'users', kidUid);
    await updateDoc(kidRef, {
      'allowance.amount': amount || 0,
      'allowance.frequency': frequency || 'weekly',
      'allowance.nextPayment': frequency === 'weekly' 
        ? Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        : Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      updatedAt: serverTimestamp()
    });

    console.log('Child allowance setup successfully');
  } catch (error) {
    console.error('Error setting up child allowance:', error);
    throw new Error('Failed to setup allowance');
  }
};

/**
 * Create a child profile without Firebase Auth account (for parent setup)
 * @param {string} parentUid - Parent's UID
 * @param {Object} childData - Child information
 * @returns {Promise<string>} Child profile ID
 */
export const createChildProfile = async (parentUid, childData) => {
  if (!parentUid) throw new Error('Parent UID is required');

  try {
    const childId = `child_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const childRef = doc(db, 'childProfiles', childId);
    
    const profileData = {
      id: childId,
      parentUid,
      name: childData.name,
      age: parseInt(childData.age),
      allowance: {
        amount: parseFloat(childData.allowance) || 0,
        frequency: childData.allowanceFrequency || 'weekly',
        nextPayment: null
      },
      hasFirebaseAccount: false, // Will be true when kid first logs in
      firebaseUid: null, // Will be set when kid creates Firebase account
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(childRef, profileData);

    // Add child to parent's children array
    const parentRef = doc(db, 'users', parentUid);
    await updateDoc(parentRef, {
      children: arrayUnion(childId),
      updatedAt: serverTimestamp()
    });

    console.log('Child profile created successfully:', childId);
    return childId;
  } catch (error) {
    console.error('Error creating child profile:', error);
    throw new Error('Failed to create child profile');
  }
};

/**
 * Get child profiles for a parent
 * @param {string} parentUid - Parent's UID
 * @returns {Promise<Array>} Array of child profiles
 */
export const getChildProfilesByParent = async (parentUid) => {
  if (!parentUid) throw new Error('Parent UID is required');

  try {
    const q = query(
      collection(db, 'childProfiles'),
      where('parentUid', '==', parentUid)
    );
    const querySnapshot = await getDocs(q);
    
    const profiles = [];
    querySnapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });

    return profiles;
  } catch (error) {
    console.error('Error getting child profiles:', error);
    throw new Error('Failed to load child profiles');
  }
};