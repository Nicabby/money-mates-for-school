# Firebase Setup Guide for MoneyMates

## Prerequisites
- Firebase account (free tier is sufficient for development)
- Node.js and npm installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `moneymates-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Wait for project creation

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Enable this for parent accounts
   - **Anonymous**: Enable this for kid accounts
3. Save changes

## Step 3: Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (we'll update rules later)
3. Select a location close to your users
4. Click **Done**

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to "Your apps" section
3. Click **Web** icon (`</>`) to add a web app
4. Register app name: `MoneyMates Web App`
5. Copy the firebaseConfig object

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase config values in `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

## Step 6: Deploy Firestore Security Rules

1. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Use `firestore.rules` for rules file
   - Use `firestore.indexes.json` for indexes file

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the authentication page
3. Try creating a parent account
4. Try creating a kid account
5. Check Firebase Console to see users and Firestore documents

## Authentication Flow

### For Parents:
- Email/password registration and login
- Creates user document with `role: "parent"`
- Can manage multiple kid accounts

### For Kids:
- Anonymous authentication (no email required)
- Creates user document with `role: "kid"`
- Can be linked to parent accounts

## User Document Structure

```javascript
{
  uid: "firebase-generated-uid",
  role: "parent" | "kid",
  displayName: "User Name",
  email: "email@example.com" | null,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  balance: 0,
  goals: [],
  transactions: [],
  settings: {
    notifications: true,
    theme: "light",
    currency: "USD"
  },
  // Parent-specific fields
  children: ["kid-uid-1", "kid-uid-2"], // Array of managed kids
  isVerified: false,
  // Kid-specific fields
  parentId: "parent-uid" | null,
  allowance: {
    amount: 0,
    frequency: "weekly",
    nextPayment: null
  }
}
```

## Available Functions

### Authentication Functions (`src/lib/auth.js`)
- `signUpWithEmailPassword(email, password, displayName)`
- `signInWithEmailPassword(email, password)`
- `signInAnonymously(kidName)`
- `signOutUser()`

### Firestore Functions (`src/lib/firestore.js`)
- `createUserDocument(user, additionalData)`
- `getUserDocument(uid)`
- `updateUserBalance(uid, amount)`
- `addTransaction(uid, transaction)`
- `addGoal(uid, goal)`
- `updateGoalProgress(uid, goalId, progress)`
- `linkKidToParent(parentUid, kidUid)`
- `getKidsByParent(parentUid)`

### Auth Context (`src/contexts/AuthContext.jsx`)
- `useAuth()` hook provides:
  - `currentUser`: Firebase user object
  - `userDocument`: Firestore user document
  - `signUp()`, `signIn()`, `signInAsKid()`, `signOut()`
  - `isAuthenticated`, `isParent`, `isKid`
  - `getUserDisplayName()`, `getUserBalance()`

## Security Notes

- Anonymous users (kids) can only access their own data
- Parents can access their own data and their linked kids' data
- Firestore rules prevent unauthorized access
- Environment variables keep Firebase config secure

## Troubleshooting

### Common Issues:

1. **"Firebase config not found"**: Check `.env.local` file exists and has correct values
2. **"Auth domain mismatch"**: Ensure `authDomain` matches your Firebase project
3. **"Permission denied"**: Check Firestore rules are deployed correctly
4. **"Anonymous auth not working"**: Ensure Anonymous provider is enabled in Firebase Console

### Debug Mode:
Add this to see Firebase config:
```javascript
console.log('Firebase Config:', firebaseConfig);
```

## Next Steps

1. Integrate authentication with your existing components
2. Add user profile management
3. Implement transaction tracking
4. Add goal setting features
5. Create parent-kid linking functionality

Your Firebase integration is now ready! 🎉