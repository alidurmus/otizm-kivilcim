import { z } from 'zod';

// Speech API validation schema
export const speechRequestSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text must be less than 5000 characters')
    .regex(/^[\w\s\u00C0-\u017F\u0100-\u017F.,!?;:'"()-]+$/, 'Text contains invalid characters'),
  
  voiceId: z.string()
    .optional()
    .refine((id) => !id || /^[a-zA-Z0-9]+$/.test(id), 'Invalid voice ID format'),
  
  model: z.string()
    .optional()
    .default('eleven_multilingual_v2'),
  
  stability: z.number()
    .min(0, 'Stability must be between 0 and 1')
    .max(1, 'Stability must be between 0 and 1')
    .optional()
    .default(0.5),
  
  similarityBoost: z.number()
    .min(0, 'Similarity boost must be between 0 and 1')
    .max(1, 'Similarity boost must be between 0 and 1')
    .optional()
    .default(0.8),
  
  style: z.number()
    .min(0, 'Style must be between 0 and 1')
    .max(1, 'Style must be between 0 and 1')
    .optional()
    .default(0.5),
  
  useSpeakerBoost: z.boolean()
    .optional()
    .default(true),
});

// User input validation for exercises
export const exerciseInputSchema = z.object({
  exerciseId: z.string()
    .min(1, 'Exercise ID is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid exercise ID format'),
  
  moduleType: z.enum(['literacy', 'vocabulary', 'social', 'writing', 'concepts'])
    .describe('Type of learning module'),
  
  userAnswer: z.string()
    .min(1, 'Answer cannot be empty')
    .max(100, 'Answer too long')
    .regex(/^[\w\s\u00C0-\u017F\u0100-\u017F.,!?-]+$/, 'Answer contains invalid characters'),
  
  difficulty: z.number()
    .int('Difficulty must be an integer')
    .min(1, 'Difficulty must be at least 1')
    .max(5, 'Difficulty must be at most 5'),
  
  timeSpent: z.number()
    .positive('Time spent must be positive')
    .max(3600, 'Session too long - max 1 hour'), // 1 hour max per exercise
});

// User progress validation
export const progressUpdateSchema = z.object({
  userId: z.string()
    .min(1, 'User ID is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid user ID format'),
  
  moduleId: z.string()
    .min(1, 'Module ID is required'),
  
  exerciseId: z.string()
    .min(1, 'Exercise ID is required'),
  
  score: z.number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100'),
  
  completed: z.boolean(),
  
  attempts: z.number()
    .int('Attempts must be an integer')
    .min(1, 'Must have at least 1 attempt')
    .max(10, 'Too many attempts'),
  
  timestamp: z.date()
    .default(() => new Date()),
});

// Sensory settings validation
export const sensorySettingsSchema = z.object({
  soundEffects: z.boolean().default(true),
  animations: z.boolean().default(true),
  vibration: z.boolean().default(false),
  
  theme: z.enum(['light', 'dark', 'high-contrast'])
    .default('light'),
  
  fontSize: z.enum(['small', 'medium', 'large'])
    .default('medium'),
  
  soundVolume: z.number()
    .min(0, 'Volume cannot be negative')
    .max(1, 'Volume cannot exceed 1')
    .default(0.8),
  
  animationSpeed: z.enum(['slow', 'normal', 'fast'])
    .default('normal'),
  
  reducedMotion: z.boolean().default(false),
});

// Feedback form validation
export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'improvement', 'general'])
    .describe('Type of feedback'),
  
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  email: z.string()
    .email('Invalid email format')
    .optional(),
  
  userAgent: z.string().optional(),
  url: z.string().url().optional(),
  
  priority: z.enum(['low', 'medium', 'high'])
    .default('medium'),
});

// Helper function to safely validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { 
        success: false, 
        error: `${firstError.path.join('.')}: ${firstError.message}` 
      };
    }
    return { 
      success: false, 
      error: 'Validation failed' 
    };
  }
}

// Type exports for TypeScript
export type SpeechRequest = z.infer<typeof speechRequestSchema>;
export type ExerciseInput = z.infer<typeof exerciseInputSchema>;
export type ProgressUpdate = z.infer<typeof progressUpdateSchema>;
export type SensorySettings = z.infer<typeof sensorySettingsSchema>;
export type FeedbackData = z.infer<typeof feedbackSchema>; 