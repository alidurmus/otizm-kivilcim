import { db } from './database'
import type { User, UserPreferences } from './database'

// Mock authentication for development - SQLite based
export interface AuthUser {
  id: string
  email: string
  displayName: string
  isActive: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  displayName: string
  dateOfBirth: Date
  diagnosisType: 'AUTISM' | 'ASPERGER' | 'PDD' | 'OTHER'
  diagnosisSeverity: 'MILD' | 'MODERATE' | 'SEVERE'
  diagnosisDate: Date
  parentName: string
  parentEmail: string
  parentPhone?: string
  parentRelationship: 'MOTHER' | 'FATHER' | 'GUARDIAN' | 'CAREGIVER'
}

class MockAuth {
  private currentUser: AuthUser | null = null

  // Mock login - in production, replace with proper authentication
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const user = await db.user.findUnique({
        where: { email: credentials.email }
      })

      if (!user) {
        throw new Error('Kullanıcı bulunamadı')
      }

      if (!user.isActive) {
        throw new Error('Hesap deaktif durumda')
      }

      // Mock password validation (in production, use proper hashing)
      // For now, accept any password for development

      this.currentUser = {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isActive: user.isActive
      }

      // Update last active time
      await db.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() }
      })

      return this.currentUser
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Mock register
  async register(data: RegisterData): Promise<AuthUser> {
    try {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email: data.email }
      })

      if (existingUser) {
        throw new Error('Bu e-posta adresi zaten kullanımda')
      }

      // Create new user
      const newUser = await db.user.create({
        data: {
          email: data.email,
          displayName: data.displayName,
          dateOfBirth: data.dateOfBirth,
          diagnosisType: data.diagnosisType,
          diagnosisSeverity: data.diagnosisSeverity,
          diagnosisDate: data.diagnosisDate,
          parentName: data.parentName,
          parentEmail: data.parentEmail,
          parentPhone: data.parentPhone,
          parentRelationship: data.parentRelationship,
          isActive: true,
          subscriptionType: 'FREE',
          subscriptionStart: new Date(),
        }
      })

      // Create default user preferences
      await db.user.update({
        where: { id: newUser.id },
        data: {
          preferences: {
            create: {
              theme: 'LIGHT',
              language: 'tr',
              fontSize: 'MEDIUM',
              preferredGender: 'MIXED',
              voiceVolume: 0.8,
              speechRate: 1.0,
              letterVoice: 'Adam',
              wordVoice: 'Rachel',
              sentenceVoice: 'Antoni',
              celebrationVoice: 'Josh'
            }
          }
        }
      })

      // Initialize progress tracking
      await db.progress.create({
        data: {
          userId: newUser.id,
          totalModulesActive: 10,
        }
      })

      this.currentUser = {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        isActive: newUser.isActive
      }

      return this.currentUser
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.currentUser
  }

  // Mock logout
  async logout(): Promise<void> {
    this.currentUser = null
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  // Get user profile with preferences
  async getUserProfile(userId: string): Promise<(User & { preferences: UserPreferences | null }) | null> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          preferences: true
        }
      })

      return user
    } catch (error) {
      console.error('Get user profile error:', error)
      return null
    }
  }

  // Update user preferences
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const updatedPreferences = await prisma.userPreferences.upsert({
        where: { userId },
        update: preferences,
        create: {
          userId,
          ...preferences
        }
      })

      return updatedPreferences
    } catch (error) {
      console.error('Update preferences error:', error)
      throw error
    }
  }

  // Anonymous sign in (mock implementation)
  async signInAnonymous(): Promise<AuthUser> {
    try {
      const anonymousUser: AuthUser = {
        id: `anon_${Date.now()}`,
        email: 'anonymous@kivilcim.com',
        displayName: 'Misafir Kullanıcı',
        isActive: true
      }
      
      this.currentUser = anonymousUser
      return anonymousUser
    } catch (error) {
      console.error('Anonymous sign in error:', error)
      throw error
    }
  }

  // Auth state change listener (mock implementation)
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    // In a real implementation, this would listen to Firebase auth state changes
    // For now, just call immediately with current user
    callback(this.currentUser)
    
    // Return unsubscribe function
    return () => {
      // Cleanup logic would go here
    }
  }

  // Admin check (mock implementation)
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId }
      })

      // Mock admin check - in production, add admin role to user model
      const adminEmails = [
        'admin@kivilcim.com',
        'test@kivilcim.com',
        'demo@kivilcim.com'
      ]

      return user ? adminEmails.includes(user.email) : false
    } catch (error) {
      console.error('Admin check error:', error)
      return false
    }
  }
}

// Export singleton instance
export const auth = new MockAuth()

// Helper functions for Next.js API routes
export async function requireAuth(req: any): Promise<AuthUser> {
  const authHeader = req.headers.authorization
  
  if (!authHeader) {
    throw new Error('Authentication required')
  }

  // Mock token validation - in production, validate JWT tokens
  const token = authHeader.replace('Bearer ', '')
  
  // For development, accept any non-empty token
  if (!token) {
    throw new Error('Invalid token')
  }

  // Return current user (in production, decode token to get user ID)
  const currentUser = auth.getCurrentUser()
  
  if (!currentUser) {
    throw new Error('User not authenticated')
  }

  return currentUser
}

// Create demo users for development
export async function createDemoUsers() {
  try {
    const demoUsers = [
      {
        email: 'demo@kivilcim.com',
        displayName: 'Demo Çocuk',
        dateOfBirth: new Date('2018-05-15'),
        diagnosisType: 'AUTISM' as const,
        diagnosisSeverity: 'MILD' as const,
        diagnosisDate: new Date('2021-03-10'),
        parentName: 'Demo Anne',
        parentEmail: 'anne@demo.com',
        parentRelationship: 'MOTHER' as const,
      },
      {
        email: 'test@kivilcim.com',
        displayName: 'Test Öğrenci',
        dateOfBirth: new Date('2017-08-22'),
        diagnosisType: 'ASPERGER' as const,
        diagnosisSeverity: 'MODERATE' as const,
        diagnosisDate: new Date('2020-11-05'),
        parentName: 'Test Baba',
        parentEmail: 'baba@test.com',
        parentRelationship: 'FATHER' as const,
      }
    ]

    for (const userData of demoUsers) {
      const existingUser = await db.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        await auth.register({
          ...userData,
          password: 'demo123' // Mock password
        })
        console.log(`✅ Demo user created: ${userData.email}`)
      }
    }

    return true
  } catch (error) {
    console.error('❌ Demo user creation failed:', error)
    return false
  }
}

// Export types
export type { User, UserPreferences } from './database'

// Export missing functions that are being imported
export const signInAnonymous = () => auth.signInAnonymous()
export const getCurrentUser = () => auth.getCurrentUser()
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => auth.onAuthStateChange(callback) 