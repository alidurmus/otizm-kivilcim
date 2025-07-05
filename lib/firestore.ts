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
  return firestore !== null;
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
  if (!isFirestoreAvailable() || !firestore) {
    console.log('Using mock Firestore for development');
    return true;
  }

  try {
    const userRef = doc(firestore, 'users', userId);
    await setDoc(userRef, userData);
    return true;
  } catch (error) {
    console.error('Error creating user data:', error);
    return false;
  }
};

// Get user data
export const getUserData = async (userId: string): Promise<UserData | null> => {
  if (!isFirestoreAvailable() || !firestore) {
    console.log('Using mock Firestore for development');
    return mockUserData;
  }

  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Update module progress
export const updateModuleProgress = async (
  userId: string, 
  moduleId: string, 
  progress: Partial<ModuleProgress>
) => {
  if (!isFirestoreAvailable() || !firestore) {
    console.log('Using mock Firestore for development');
    return true;
  }

  try {
    const moduleRef = doc(firestore, 'users', userId, 'modules', moduleId);
    await updateDoc(moduleRef, {
      ...progress,
      lastActivity: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating module progress:', error);
    return false;
  }
};

// Get module progress
export const getModuleProgress = async (
  userId: string, 
  moduleId: string
): Promise<ModuleProgress | null> => {
  if (!isFirestoreAvailable() || !firestore) {
    console.log('Using mock Firestore for development');
    return null;
  }

  try {
    const moduleRef = doc(firestore, 'users', userId, 'modules', moduleId);
    const moduleSnap = await getDoc(moduleRef);
    
    if (moduleSnap.exists()) {
      return moduleSnap.data() as ModuleProgress;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting module progress:', error);
    return null;
  }
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
  if (!isFirestoreAvailable() || !firestore) {
    console.log('Using mock Firestore for development');
    // Return mock data for development
    return {
      'vocabulary': {
        status: 'in_progress',
        lastActivity: Timestamp.now(),
        overallAccuracy: 85,
        progress: 60
      },
      'social_communication': {
        status: 'in_progress',
        lastActivity: Timestamp.now(),
        overallAccuracy: 78,
        progress: 40
      },
      'basic_concepts': {
        status: 'completed',
        lastActivity: Timestamp.now(),
        overallAccuracy: 92,
        progress: 100
      }
    };
  }

  try {
    const modulesRef = collection(firestore, 'users', userId, 'modules');
    const querySnapshot = await getDocs(modulesRef);
    
    const modules: Record<string, ModuleProgress> = {};
    querySnapshot.forEach((doc) => {
      modules[doc.id] = doc.data() as ModuleProgress;
    });
    
    return modules;
  } catch (error) {
    console.error('Error getting all modules progress:', error);
    return {};
  }
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