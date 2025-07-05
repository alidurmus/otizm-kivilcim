import { initializeApp } from 'firebase/app';
import { getAuth, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Mock Firebase config for development
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-api-key-for-development',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mock-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mock-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:mock-app-id'
};

// Mock interfaces for development
interface MockAuth extends Partial<Auth> {
  currentUser: User | null;
  onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
  signInAnonymously: () => Promise<{ user: { uid: string } }>;
}

interface MockFirestore {
  app: null;
}

// Initialize Firebase with error handling
let app;
let auth: Auth | MockAuth;
let db: Firestore | MockFirestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization failed, using mock services:', error);
  // Create mock objects for development
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInAnonymously: () => Promise.resolve({ user: { uid: 'mock-user-id' } })
  } as MockAuth;
  db = { app: null } as MockFirestore;
}

export { auth, db };
export default app; 