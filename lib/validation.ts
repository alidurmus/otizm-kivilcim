import { z } from 'zod';

/**
 * Input validation schemas for API endpoints
 * Uses Zod for runtime type checking and validation
 */

// Speech API request validation
export const speechRequestSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text cannot exceed 5000 characters')
    .regex(/^[\p{L}\p{N}\p{P}\p{S}\p{Z}]+$/u, 'Text contains invalid characters'),
  
  type: z.enum(['letter', 'word', 'sentence', 'celebration'], {
    errorMap: () => ({ message: 'Type must be letter, word, sentence, or celebration' })
  }),
  
  voiceId: z.string()
    .min(1, 'Voice ID cannot be empty')
    .max(100, 'Voice ID too long')
    .optional()
});

// User feedback validation
export const feedbackRequestSchema = z.object({
  rating: z.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  
  category: z.enum(['bug', 'feature', 'usability', 'content', 'other'], {
    errorMap: () => ({ message: 'Invalid feedback category' })
  }),
  
  message: z.string()
    .min(10, 'Feedback message must be at least 10 characters')
    .max(2000, 'Feedback message cannot exceed 2000 characters'),
  
  userType: z.enum(['parent', 'teacher', 'therapist', 'other']).optional(),
  
  childAge: z.number()
    .min(3, 'Child age must be at least 3')
    .max(18, 'Child age cannot exceed 18')
    .optional(),
  
  moduleUsed: z.string().optional(),
  
  email: z.string()
    .email('Invalid email format')
    .optional()
});

// Progress tracking validation
export const progressUpdateSchema = z.object({
  moduleId: z.string()
    .min(1, 'Module ID is required'),
  
  exerciseId: z.string()
    .min(1, 'Exercise ID is required'),
  
  score: z.number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100'),
  
  timeSpent: z.number()
    .min(0, 'Time spent cannot be negative')
    .max(3600, 'Time spent cannot exceed 1 hour'), // in seconds
  
  attemptsCount: z.number()
    .min(1, 'Attempts count must be at least 1')
    .max(100, 'Too many attempts'),
  
  correctAnswers: z.number()
    .min(0, 'Correct answers cannot be negative'),
  
  totalQuestions: z.number()
    .min(1, 'Total questions must be at least 1'),
  
  completedAt: z.string()
    .datetime('Invalid date format'),
  
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  
  hints_used: z.number()
    .min(0, 'Hints used cannot be negative')
    .optional()
});

// Sensory settings validation
export const sensorySettingsSchema = z.object({
  visualTheme: z.enum(['light', 'dark', 'auto'], {
    errorMap: () => ({ message: 'Invalid visual theme' })
  }).optional(),
  
  soundVolume: z.number()
    .min(0, 'Sound volume cannot be negative')
    .max(1, 'Sound volume cannot exceed 1')
    .optional(),
  
  reduceMotion: z.boolean().optional(),
  
  hapticFeedback: z.boolean().optional(),
  
  rewardStyle: z.enum(['minimal', 'standard', 'enhanced'], {
    errorMap: () => ({ message: 'Invalid reward style' })
  }).optional(),
  
  fontSize: z.enum(['small', 'medium', 'large'], {
    errorMap: () => ({ message: 'Invalid font size' })
  }).optional(),
  
  colorContrast: z.enum(['normal', 'high'], {
    errorMap: () => ({ message: 'Invalid color contrast' })
  }).optional()
});

// Generic validation function with detailed error handling
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
  details?: z.ZodIssue[];
} {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data
      };
    } else {
      // Create user-friendly error message
      const firstError = result.error.issues[0];
      const errorMessage = firstError?.message || 'Validation failed';
      
      return {
        success: false,
        error: errorMessage,
        details: result.error.issues
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
}

// Utility function for API route error responses
export function createValidationErrorResponse(
  error: string, 
  details?: z.ZodIssue[]
): { error: string; details?: z.ZodIssue[] } {
  return {
    error: `Validation error: ${error}`,
    ...(details && { details })
  };
}

// Type exports for TypeScript
export type SpeechRequest = z.infer<typeof speechRequestSchema>;
export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;
export type ProgressUpdate = z.infer<typeof progressUpdateSchema>;
export type SensorySettings = z.infer<typeof sensorySettingsSchema>; 