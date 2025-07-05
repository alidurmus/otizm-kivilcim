import { 
  signInAnonymously, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserData, getUserData, UserData } from './firestore';
import { Timestamp } from 'firebase/firestore';

// Mock user for development and network failures
const mockUser = {
  uid: 'mock-user-id',
  email: null,
  displayName: 'Test User',
  isAnonymous: true,
  // Add additional properties to match User interface
  emailVerified: false,
  phoneNumber: null,
  photoURL: null,
  providerId: 'anonymous',
  refreshToken: '',
  tenantId: null,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString()
  }
} as User;

// Track authentication mode
let isUsingMockAuth = false;

// Check if Firebase is properly initialized and available
const isFirebaseAvailable = () => {
  try {
    return auth !== null && typeof signInAnonymously === 'function';
  } catch {
    return false;
  }
};

// Test Firebase connectivity
const testFirebaseConnectivity = async (): Promise<boolean> => {
  if (!isFirebaseAvailable()) return false;
  
  try {
    // Try a simple auth check with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 3000)
    );
    
    const connectivityTest = new Promise((resolve) => {
      try {
        // Test if we can access auth state
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unsubscribe = onAuthStateChanged(auth as any, () => {
          unsubscribe();
          resolve(true);
        });
      } catch {
        resolve(false);
      }
    });
    
    await Promise.race([connectivityTest, timeoutPromise]);
    return true;
  } catch (_error) {
    return false;
  }
};

// Anonymous sign in with robust error handling
export const signInAnonymous = async (): Promise<User | null> => {
  // First check if Firebase is available
  if (!isFirebaseAvailable()) {
    isUsingMockAuth = true;
    return mockUser;
  }

  try {
    // Test connectivity first
    const isConnected = await testFirebaseConnectivity();
    if (!isConnected) {
      isUsingMockAuth = true;
      return mockUser;
    }

    // Try to sign in anonymously with timeout - with type safety
    if (!auth || typeof auth.currentUser === 'undefined') {
      throw new Error('Auth not properly initialized');
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const signInPromise = signInAnonymously(auth as any); // Type assertion for Firebase compatibility
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Sign in timeout')), 5000)
    );
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await Promise.race([signInPromise, timeoutPromise]) as any;
    
    if (result && typeof result === 'object' && 'user' in result && result.user) {
      // Firebase authentication successful
      isUsingMockAuth = false;
      const user = result.user as User;
      
      // Try to create user data (with fallback)
      try {
        const userData = await getUserData(user.uid);
        
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
          
          await createUserData(user.uid, initialUserData);
          // User data created successfully
        }
      } catch (_firestoreError) {
        console.warn('⚠️ Firestore not available, continuing with authentication only');
      }
      
      return user;
    }
    
    throw new Error('Invalid sign in result');
    
  } catch (error: unknown) {
    // Handle specific Firebase errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firebaseError = error as any;
    if (firebaseError?.code) {
      switch (firebaseError.code) {
        case 'auth/network-request-failed':
          console.warn('🌐 Network request failed, using mock authentication');
          break;
        case 'auth/timeout':
          console.warn('⏱️ Authentication timeout, using mock authentication');
          break;
        case 'auth/too-many-requests':
          console.warn('🚫 Too many requests, using mock authentication');
          break;
        default:
          console.warn(`🔥 Firebase auth error (${firebaseError.code}):`, firebaseError.message);
      }
    } else {
      const errorMessage = firebaseError?.message || firebaseError;
      console.warn('🔥 Firebase authentication failed:', errorMessage);
    }
    
    // Always fallback to mock user
    isUsingMockAuth = true;
    return mockUser;
  }
};

// Monitor auth state with robust error handling
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!isFirebaseAvailable()) {
    console.warn('🔄 Using mock auth state listener');
    // Mock implementation with slight delay to simulate real behavior
    setTimeout(() => callback(mockUser), 100);
    return () => {};
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return onAuthStateChanged(auth as any, (user) => {
      if (user) {
        console.warn('👤 Auth state changed: User signed in');
        isUsingMockAuth = false;
        callback(user);
      } else if (isUsingMockAuth) {
        console.warn('👤 Auth state changed: Using mock user');
        callback(mockUser);
      } else {
        console.warn('👤 Auth state changed: No user');
        callback(null);
      }
    }, (error) => {
      console.warn('🔥 Auth state listener error:', error);
      // Fallback to mock user on error
      console.warn('🔄 Auth state error, using mock user');
      isUsingMockAuth = true;
      callback(mockUser);
    });
  } catch (error) {
    console.error('🔥 Error setting up auth state listener:', error);
    // Fallback to mock
    console.warn('🔄 Using mock auth state listener due to setup error');
    setTimeout(() => {
      isUsingMockAuth = true;
      callback(mockUser);
    }, 100);
    return () => {};
  }
};

// Get current user with error handling
export const getCurrentUser = (): User | null => {
  if (!isFirebaseAvailable()) {
    return mockUser;
  }

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return currentUser;
    } else if (isUsingMockAuth) {
      return mockUser;
    } else {
      return null;
    }
  } catch (error) {
    console.error('🔥 Error getting current user:', error);
    return mockUser;
  }
};

// Helper to check if using mock authentication
export const isUsingMockAuthentication = (): boolean => {
  return isUsingMockAuth || !isFirebaseAvailable();
};

// Reset authentication state (useful for development)
export const resetAuthState = () => {
  isUsingMockAuth = false;
  console.warn('🔄 Authentication state reset');
}; 