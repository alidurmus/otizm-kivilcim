import { 
  signInAnonymously, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserData, getUserData, UserData } from './firestore';
import { Timestamp } from 'firebase/firestore';

// Mock user for development
const mockUser = {
  uid: 'mock-user-id',
  email: null,
  displayName: 'Test User',
  isAnonymous: true
} as User;

// Check if Firebase is properly initialized
const isFirebaseAvailable = () => {
  return auth !== null;
};

// Anonymous sign in for demo purposes
export const signInAnonymous = async (): Promise<User | null> => {
  if (!isFirebaseAvailable() || !auth) {
    console.log('Using mock authentication for development');
    return mockUser;
  }

  try {
    const result = await signInAnonymously(auth);
    
    // Check if user data exists, if not create initial data
    try {
      const userData = await getUserData(result.user.uid);
      
      if (!userData) {
        const initialUserData: UserData = {
          profile: {
            name: `Çocuk ${Math.floor(Math.random() * 1000)}`,
            createdAt: Timestamp.now()
          },
          sensory_settings: {
            visualTheme: 'calm',
            soundVolume: 50,
            reduceMotion: false,
            hapticFeedback: true,
            rewardStyle: 'animated'
          },
          avatar: {
            character: 'kivilcim',
            color: 'blue',
            accessories: []
          }
        };
        
        await createUserData(result.user.uid, initialUserData);
      }
    } catch (firestoreError) {
      console.warn('Firestore not available, using mock data');
    }
    
    return result.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    // Fallback to mock user
    return mockUser;
  }
};

// Monitor auth state
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!isFirebaseAvailable() || !auth) {
    // Mock implementation
    setTimeout(() => callback(mockUser), 100);
    return () => {};
  }

  try {
    return onAuthStateChanged(auth, callback);
  } catch (error) {
    console.error('Error setting up auth state listener:', error);
    // Fallback to mock
    setTimeout(() => callback(mockUser), 100);
    return () => {};
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (!isFirebaseAvailable() || !auth) {
    return mockUser;
  }

  try {
    return auth.currentUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return mockUser;
  }
}; 