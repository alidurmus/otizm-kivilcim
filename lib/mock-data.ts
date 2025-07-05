import { Timestamp } from 'firebase/firestore';
import { setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { UserData, ModuleProgress, ExerciseResult } from './firestore';

// Generate mock exercise data for demo purposes
export const generateMockModuleProgress = (moduleId: string): ModuleProgress => {
  const progressPercentage = Math.floor(Math.random() * 80) + 20; // 20-100%
  const accuracy = Math.floor(Math.random() * 30) + 70; // 70-100%
  
  return {
    status: progressPercentage > 80 ? 'completed' : progressPercentage > 20 ? 'in_progress' : 'not_started',
    lastActivity: Timestamp.fromDate(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)), // Within last week
    overallAccuracy: accuracy,
    progress: progressPercentage,
    difficultSounds: moduleId === 'literacy' ? ['r', 'l', 'ş'] : undefined
  };
};

// Generate mock exercise results
export const generateMockExerciseResults = (count: number = 10): ExerciseResult[] => {
  const exerciseTypes = ['word_matching', 'memory_game', 'letter_tracing', 'concept_learning'];
  
  return Array.from({ length: count }, (_, index) => ({
    exerciseType: exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)],
    score: Math.floor(Math.random() * 40) + 60, // 60-100
    completedAt: Timestamp.fromDate(new Date(Date.now() - index * 2 * 60 * 60 * 1000)), // Every 2 hours back
    timeSpent: Math.floor(Math.random() * 300) + 120, // 2-7 minutes in seconds
    details: {
      correctAnswers: Math.floor(Math.random() * 5) + 5,
      totalQuestions: 10,
      hintsUsed: Math.floor(Math.random() * 3)
    }
  }));
};

// Create comprehensive mock user data
export const createMockUserData = async (userId: string): Promise<boolean> => {
  try {
    // Create main user document
    const mockUserData: UserData = {
      profile: {
        name: `Demo Çocuk ${Math.floor(Math.random() * 100)}`,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // 1 week ago
      },
      sensory_settings: {
        visualTheme: Math.random() > 0.5 ? 'calm' : 'focus',
        soundVolume: Math.floor(Math.random() * 50) + 50,
        reduceMotion: Math.random() > 0.7,
        hapticFeedback: Math.random() > 0.3,
        rewardStyle: ['simple', 'animated', 'celebration'][Math.floor(Math.random() * 3)] as any
      },
      avatar: {
        character: 'kivilcim',
        color: ['blue', 'green', 'purple'][Math.floor(Math.random() * 3)],
        accessories: []
      }
    };

    // Create user document
    await setDoc(doc(db, 'users', userId), mockUserData);

    // Create module progress documents
    const modules = ['vocabulary', 'social_communication', 'writing_expression', 'basic_concepts', 'literacy'];
    
    for (const moduleId of modules) {
      // Skip some modules randomly to simulate realistic usage
      if (Math.random() > 0.7) continue;
      
      const moduleProgress = generateMockModuleProgress(moduleId);
      await setDoc(doc(db, 'users', userId, 'modules', moduleId), moduleProgress);
      
      // Add some exercise results
      const exerciseResults = generateMockExerciseResults(Math.floor(Math.random() * 8) + 3);
      for (let i = 0; i < exerciseResults.length; i++) {
        await setDoc(
          doc(db, 'users', userId, 'modules', moduleId, 'exercises', `exercise_${i}`),
          exerciseResults[i]
        );
      }
    }

    console.log('Mock user data created successfully');
    return true;
  } catch (error) {
    console.error('Error creating mock user data:', error);
    return false;
  }
};

// Helper function to create demo data for current user
export const createDemoData = async (): Promise<boolean> => {
  try {
    // This will create demo data for anonymous user
    const timestamp = Date.now();
    const demoUserId = `demo_user_${timestamp}`;
    
    return await createMockUserData(demoUserId);
  } catch (error) {
    console.error('Error creating demo data:', error);
    return false;
  }
};

// Generate realistic weekly activity data
export const generateWeeklyActivityData = (modules: Record<string, ModuleProgress>) => {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const baseActivity = Object.keys(modules).length * 10;
  
  return days.map((day, index) => {
    // Generate activity with some variance
    const variance = (Math.random() - 0.5) * 20;
    const activity = Math.max(0, Math.min(100, baseActivity + variance + (index * 5)));
    
    return {
      day,
      activity: Math.round(activity)
    };
  });
}; 