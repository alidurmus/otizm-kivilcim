// Database Schema for Content Management System
// Firebase Firestore Collections Structure

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  role: 'admin' | 'parent' | 'child';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  profile?: {
    age?: number;
    preferences?: {
      theme?: 'light' | 'dark' | 'auto';
      language?: 'tr' | 'en';
      voiceSpeed?: 'slow' | 'normal' | 'fast';
    };
  };
}

export interface Story {
  id: string;
  title: string;
  description: string;
  category: 'dostluk' | 'doğa' | 'oyun' | 'duygu' | 'aile' | 'hayvanlar';
  ageGroup: string;
  duration: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  pages: StoryPage[];
  coverImage?: string;
  isActive: boolean;
  isPublished: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  likeCount: number;
  tags: string[];
  language: 'tr' | 'en';
}

export interface StoryPage {
  id: string;
  pageNumber: number;
  text: string;
  audioText?: string;
  imageUrl?: string;
  imageDescription?: string;
  animations?: {
    type: 'fade' | 'slide' | 'zoom' | 'bounce';
    duration: number;
    delay: number;
  };
  voiceSettings?: {
    speed: number;
    pitch: number;
    volume: number;
  };
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  isActive: boolean;
  category: 'learning' | 'entertainment' | 'therapy' | 'assessment';
  ageRange: {
    min: number;
    max: number;
  };
  skills: string[];
  prerequisites: string[];
  estimatedDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
  order: number;
  config?: {
    maxAttempts?: number;
    timeLimit?: number;
    enableHints?: boolean;
    enableAudio?: boolean;
    colorScheme?: string;
  };
}

export interface Exercise {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: 'matching' | 'memory' | 'tracing' | 'building' | 'recognition';
  content: ExerciseContent;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  metadata?: {
    estimatedTime?: number;
    difficulty?: number;
    tags?: string[];
  };
}

export interface ExerciseContent {
  instructions: string;
  items: ExerciseItem[];
  settings?: {
    shuffleOptions?: boolean;
    enableTimer?: boolean;
    maxRetries?: number;
    showFeedback?: boolean;
  };
}

export interface ExerciseItem {
  id: string;
  type: 'text' | 'image' | 'audio' | 'video';
  content: string;
  metadata?: {
    description?: string;
    alt?: string;
    duration?: number;
  };
  correctAnswer?: string | string[];
  options?: string[];
  feedback?: {
    correct?: string;
    incorrect?: string;
  };
}

export interface UserProgress {
  id: string;
  userId: string;
  moduleId: string;
  exerciseId?: string;
  storyId?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  score?: number;
  maxScore?: number;
  attempts: number;
  timeSpent: number; // seconds
  completedAt?: Date;
  lastAccessedAt: Date;
  createdAt: Date;
  details?: {
    correctAnswers?: number;
    incorrectAnswers?: number;
    hintsUsed?: number;
    mistakes?: Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
      timestamp: Date;
    }>;
  };
}

export interface Content {
  id: string;
  type: 'story' | 'exercise' | 'video' | 'audio' | 'image';
  title: string;
  description?: string;
  url?: string;
  metadata?: {
    size?: number;
    duration?: number;
    format?: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminLog {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  entityType: 'story' | 'module' | 'exercise' | 'user' | 'content';
  entityId: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: string | number | boolean | Record<string, unknown> | unknown[];
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  category: 'general' | 'ui' | 'audio' | 'security' | 'performance';
  isEditable: boolean;
  updatedAt: Date;
  updatedBy: string;
}

// Database Collections
export const Collections = {
  USERS: 'users',
  STORIES: 'stories',
  MODULES: 'modules',
  EXERCISES: 'exercises',
  USER_PROGRESS: 'user_progress',
  CONTENT: 'content',
  CATEGORIES: 'categories',
  ADMIN_LOGS: 'admin_logs',
  SYSTEM_CONFIG: 'system_config'
} as const;

// Default data for initial setup
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Dostluk',
    description: 'Arkadaşlık ve dostluk konulu hikayeler',
    icon: '👫',
    color: '#FF6B6B',
    isActive: true,
    order: 1
  },
  {
    name: 'Doğa',
    description: 'Doğa ve çevre konulu hikayeler',
    icon: '🌱',
    color: '#4ECDC4',
    isActive: true,
    order: 2
  },
  {
    name: 'Oyun',
    description: 'Oyun ve eğlence konulu hikayeler',
    icon: '🎮',
    color: '#45B7D1',
    isActive: true,
    order: 3
  },
  {
    name: 'Duygu',
    description: 'Duygular ve hisler konulu hikayeler',
    icon: '😊',
    color: '#96CEB4',
    isActive: true,
    order: 4
  },
  {
    name: 'Aile',
    description: 'Aile ve evle ilgili hikayeler',
    icon: '👨‍👩‍👧‍👦',
    color: '#FFEAA7',
    isActive: true,
    order: 5
  },
  {
    name: 'Hayvanlar',
    description: 'Hayvanlar ve doğa konulu hikayeler',
    icon: '🦋',
    color: '#DDA0DD',
    isActive: true,
    order: 6
  }
];

// Helper functions for database operations
export const createId = () => {
  return crypto.randomUUID();
};

export const createTimestamp = () => {
  return new Date();
};

export const sanitizeInput = (input: string) => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateStory = (story: Partial<Story>) => {
  const errors: string[] = [];
  
  if (!story.title || story.title.trim().length < 3) {
    errors.push('Hikaye başlığı en az 3 karakter olmalı');
  }
  
  if (!story.description || story.description.trim().length < 10) {
    errors.push('Hikaye açıklaması en az 10 karakter olmalı');
  }
  
  if (!story.category) {
    errors.push('Hikaye kategorisi seçilmeli');
  }
  
  if (!story.pages || story.pages.length < 1) {
    errors.push('Hikaye en az 1 sayfa içermeli');
  }
  
  return errors;
};

export const validateModule = (module: Partial<Module>) => {
  const errors: string[] = [];
  
  if (!module.name || module.name.trim().length < 3) {
    errors.push('Modül adı en az 3 karakter olmalı');
  }
  
  if (!module.description || module.description.trim().length < 10) {
    errors.push('Modül açıklaması en az 10 karakter olmalı');
  }
  
  if (!module.route || !module.route.startsWith('/')) {
    errors.push('Modül yolu geçerli bir URL olmalı');
  }
  
  return errors;
}; 