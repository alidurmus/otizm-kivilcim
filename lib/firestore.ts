// Firebase Firestore service for Kıvılcım platform
// Development version with mock data fallback
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  setDoc,
  query, 
  orderBy, 
  limit,
  Timestamp,
  deleteDoc,
  writeBatch,
  Firestore
} from 'firebase/firestore';
// @ts-ignore
import { db } from './firebase';

// Type assertion for db
// @ts-ignore
const firestore = db as Firestore | null;

// User Data Types
export interface UserProfile {
  name: string;
  createdAt: Timestamp;
}

export interface SensorySettings {
  visualTheme: 'calm' | 'focus' | 'high-contrast';
  soundVolume: number;
  reduceMotion: boolean;
  hapticFeedback: boolean;
  rewardStyle: 'simple' | 'animated' | 'celebration';
}

export interface ModuleProgress {
  status: 'not_started' | 'in_progress' | 'completed';
  lastActivity: Timestamp;
  overallAccuracy: number;
  progress: number;
  difficultSounds?: string[];
  exercises?: ExerciseResult[];
}

export interface ExerciseResult {
  exerciseType: string;
  score: number;
  completedAt: Timestamp;
  timeSpent: number;
  details?: any;
}

export interface UserData {
  profile: UserProfile;
  sensory_settings: SensorySettings;
  avatar: {
    character: string;
    color: string;
    accessories: string[];
  };
  modules?: Record<string, ModuleProgress>;
}

// Check if Firestore is available
const isFirestoreAvailable = () => {
  try {
    return firestore !== null && typeof firestore.doc === 'function';
  } catch {
    return false;
  }
};

// Test Firestore connectivity with timeout
const testFirestoreConnectivity = async (): Promise<boolean> => {
  if (!isFirestoreAvailable()) return false;
  
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore connectivity test timeout')), 3000)
    );
    
    const testPromise = new Promise((resolve) => {
      try {
        // Simple test to check if Firestore is accessible
        const testRef = doc(firestore!, 'test', 'connectivity');
        getDoc(testRef).then(() => resolve(true)).catch(() => resolve(false));
      } catch {
        resolve(false);
      }
    });
    
    await Promise.race([testPromise, timeoutPromise]);
    return true;
  } catch (error) {
    console.warn('🔥 Firestore connectivity test failed:', error);
    return false;
  }
};

// Wrapper for Firestore operations with error handling
const executeFirestoreOperation = async <T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  operationName: string
): Promise<T> => {
  if (!isFirestoreAvailable()) {
    console.log(`🔄 Firestore not available for ${operationName}, using fallback`);
    return fallbackValue;
  }

  try {
    // Test connectivity first for write operations
    if (operationName.includes('create') || operationName.includes('update')) {
      const isConnected = await testFirestoreConnectivity();
      if (!isConnected) {
        console.warn(`🌐 Firestore connectivity failed for ${operationName}, using fallback`);
        return fallbackValue;
      }
    }

    // Execute operation with timeout
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`${operationName} timeout`)), 10000)
    );
    
    const result = await Promise.race([operation(), timeoutPromise]);
    console.log(`✅ ${operationName} completed successfully`);
    return result;
    
  } catch (error: any) {
    // Handle specific Firebase errors
    if (error?.code) {
      switch (error.code) {
        case 'unavailable':
          console.warn(`🌐 Firestore unavailable for ${operationName}, using fallback`);
          break;
        case 'deadline-exceeded':
          console.warn(`⏱️ Firestore timeout for ${operationName}, using fallback`);
          break;
        case 'permission-denied':
          console.warn(`🔒 Firestore permission denied for ${operationName}, using fallback`);
          break;
        case 'unauthenticated':
          console.warn(`🔐 Firestore unauthenticated for ${operationName}, using fallback`);
          break;
        default:
          console.warn(`🔥 Firestore error (${error.code}) for ${operationName}:`, error.message);
      }
    } else {
      console.warn(`🔥 ${operationName} failed:`, error.message || error);
    }
    
    return fallbackValue;
  }
};

// Mock user data for development
const mockUserData: UserData = {
  profile: {
    name: 'Test Çocuk',
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

// Create initial user data
export const createUserData = async (userId: string, userData: UserData) => {
  return executeFirestoreOperation(
    async () => {
      const userRef = doc(firestore!, 'users', userId);
      await setDoc(userRef, userData);
      return true;
    },
    true, // fallback value for success
    'createUserData'
  );
};

// Get user data
export const getUserData = async (userId: string): Promise<UserData | null> => {
  return executeFirestoreOperation(
    async () => {
      const userRef = doc(firestore!, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserData;
      } else {
        return null;
      }
    },
    mockUserData, // fallback to mock data
    'getUserData'
  );
};

// Update module progress
export const updateModuleProgress = async (
  userId: string, 
  moduleId: string, 
  progress: Partial<ModuleProgress>
) => {
  return executeFirestoreOperation(
    async () => {
      const moduleRef = doc(firestore!, 'users', userId, 'modules', moduleId);
      await updateDoc(moduleRef, {
        ...progress,
        lastActivity: Timestamp.now()
      });
      return true;
    },
    true, // fallback value for success
    'updateModuleProgress'
  );
};

// Get module progress
export const getModuleProgress = async (
  userId: string, 
  moduleId: string
): Promise<ModuleProgress | null> => {
  return executeFirestoreOperation(
    async () => {
      const moduleRef = doc(firestore!, 'users', userId, 'modules', moduleId);
      const moduleSnap = await getDoc(moduleRef);
      
      if (moduleSnap.exists()) {
        return moduleSnap.data() as ModuleProgress;
      } else {
        return null;
      }
    },
    null, // fallback value
    'getModuleProgress'
  );
};

// Add exercise result
export const addExerciseResult = async (
  userId: string, 
  moduleId: string, 
  exerciseResult: ExerciseResult
) => {
  if (!isFirestoreAvailable() || !firestore) {
    console.log('Using mock Firestore for development');
    return true;
  }

  try {
    const exercisesRef = collection(firestore, 'users', userId, 'modules', moduleId, 'exercises');
    await addDoc(exercisesRef, exerciseResult);
    return true;
  } catch (error) {
    console.error('Error adding exercise result:', error);
    return false;
  }
};

// Get recent exercise results
export const getRecentExercises = async (
  userId: string, 
  moduleId: string, 
  limitCount: number = 10
): Promise<ExerciseResult[]> => {
  if (!isFirestoreAvailable() || !firestore) {
    console.log('Using mock Firestore for development');
    return [];
  }

  try {
    const exercisesRef = collection(firestore, 'users', userId, 'modules', moduleId, 'exercises');
    const q = query(
      exercisesRef, 
      orderBy('completedAt', 'desc'), 
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const exercises: ExerciseResult[] = [];
    querySnapshot.forEach((doc) => {
      exercises.push(doc.data() as ExerciseResult);
    });
    
    return exercises;
  } catch (error) {
    console.error('Error getting recent exercises:', error);
    return [];
  }
};

// Get all modules progress for a user
export const getAllModulesProgress = async (userId: string): Promise<Record<string, ModuleProgress>> => {
  return executeFirestoreOperation(
    async () => {
      const modulesRef = collection(firestore!, 'users', userId, 'modules');
      const snapshot = await getDocs(modulesRef);
      
      const modules: Record<string, ModuleProgress> = {};
      snapshot.forEach((doc) => {
        modules[doc.id] = doc.data() as ModuleProgress;
      });
      
      return modules;
    },
    // Fallback mock data for offline/error state
    {
      'vocabulary': {
        status: 'in_progress',
        lastActivity: Timestamp.now(),
        overallAccuracy: 75,
        progress: 30,
        difficultSounds: ['ş', 'ç'],
        exercises: []
      },
      'social_communication': {
        status: 'in_progress',
        lastActivity: Timestamp.now(),
        overallAccuracy: 80,
        progress: 45,
        exercises: []
      },
      'literacy': {
        status: 'in_progress',
        lastActivity: Timestamp.now(),
        overallAccuracy: 70,
        progress: 25,
        exercises: []
      }
    },
    'getAllModulesProgress'
  );
};

// Calculate overall statistics
export const calculateUserStats = (modules: Record<string, ModuleProgress>) => {
  const moduleEntries = Object.entries(modules);
  
  if (moduleEntries.length === 0) {
    return {
      totalExercises: 0,
      completedExercises: 0,
      averageAccuracy: 0,
      totalTimeSpent: 0,
      activeDays: 0
    };
  }
  
  let totalExercises = 0;
  let completedExercises = 0;
  let totalAccuracy = 0;
  let accuracyCount = 0;
  
  moduleEntries.forEach(([_moduleId, progress]) => {
    totalExercises += Math.round(progress.progress * 10); // Assuming 10 exercises per module
    completedExercises += Math.round(progress.progress * 10 * (progress.progress / 100));
    
    if (progress.overallAccuracy > 0) {
      totalAccuracy += progress.overallAccuracy;
      accuracyCount++;
    }
  });
  
  return {
    totalExercises,
    completedExercises,
    averageAccuracy: accuracyCount > 0 ? Math.round(totalAccuracy / accuracyCount) : 0,
    activeDays: 7 // Mock data for now
  };
}; 