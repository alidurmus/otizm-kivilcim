import { PrismaClient } from '../src/generated/prisma'

// Singleton pattern for Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database utility functions
export const db = prisma

// Export types from Prisma
export type {
  User,
  UserPreferences,
  Module,
  Progress,
  ModuleProgress,
  VoiceUsage,
  StaticAudioFile,
  Session,
  Analytics,
  SystemSettings,
  DiagnosisType,
  Severity,
  VoiceGender,
  VoiceName,
  ContentType,
  AudioSource,
  ModuleStatus,
} from '../src/generated/prisma'

// Helper types for common operations
export type UserWithPreferences = User & {
  preferences: UserPreferences | null
}

export type ProgressWithModules = Progress & {
  moduleProgress: (ModuleProgress & {
    module: Module
  })[]
}

export type ModuleWithProgress = Module & {
  moduleProgress: ModuleProgress[]
}

// Database connection test
export async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ SQLite database connection successful')
    return true
  } catch (error) {
    console.error('❌ SQLite database connection failed:', error)
    return false
  }
}

// Initialize default data
export async function seedDatabase() {
  try {
    // Seed modules - 10 aktif modül
    const modules = [
      {
        id: 'alphabet-reading',
        name: 'Alfabe Okuma',
        slug: 'alphabet-reading',
        description: '29 harflik Türk alfabesini öğrenin',
        icon: '🔤',
        difficulty: 'BEGINNER' as const,
        estimatedDuration: 20,
        learningObjectives: JSON.stringify([
          '29 Türk harfini tanıma',
          'Sesli ve sessiz harf ayrımı',
          'Harf-ses ilişkisi kurma',
          'Quiz ile öğrenme pekiştirme'
        ]),
        prerequisites: JSON.stringify([]),
        isActive: true,
        order: 1,
        primaryVoiceName: 'Adam',
        primaryVoiceId: 'pNInz6obpgDQGcFmaJgB',
        voiceSettings: JSON.stringify({
          stability: 0.8,
          similarityBoost: 0.9,
          style: 0.3,
          useSpeakerBoost: true
        })
      },
      {
        id: 'vocabulary',
        name: 'Kelime Dağarcığı',
        slug: 'vocabulary',
        description: 'Kelime eşleştirme ve hafıza oyunları',
        icon: '📝',
        difficulty: 'BEGINNER' as const,
        estimatedDuration: 25,
        learningObjectives: JSON.stringify([
          'Kelime tanıma',
          'Görsel-kelime eşleştirme',
          'Hafıza güçlendirme'
        ]),
        prerequisites: JSON.stringify(['alphabet-reading']),
        isActive: true,
        order: 2,
        primaryVoiceName: 'Rachel',
        primaryVoiceId: 'EXAVITQu4vr4xnSDxMaL',
        voiceSettings: JSON.stringify({
          stability: 0.75,
          similarityBoost: 0.85,
          style: 0.4,
          useSpeakerBoost: true
        })
      },
      {
        id: 'mathematics',
        name: 'Matematik Dünyası',
        slug: 'mathematics',
        description: 'Sayıları öğrenin ve temel matematik becerilerini geliştirin',
        icon: '🔢',
        difficulty: 'BEGINNER' as const,
        estimatedDuration: 25,
        learningObjectives: JSON.stringify([
          '1-10 arası sayı tanıma',
          'Toplama işlemleri',
          'Sayma becerileri',
          'Şekil-sayı eşleştirme'
        ]),
        prerequisites: JSON.stringify([]),
        isActive: true,
        order: 6,
        primaryVoiceName: 'Gülsu',
        primaryVoiceId: '9BWtsMINqrJLrRacOk9x',
        voiceSettings: JSON.stringify({
          stability: 0.8,
          similarityBoost: 0.9,
          style: 0.35,
          useSpeakerBoost: true
        })
      },
      // Add other 7 modules...
    ]

    for (const moduleData of modules) {
      await prisma.module.upsert({
        where: { id: moduleData.id },
        update: moduleData,
        create: moduleData,
      })
    }

    console.log('✅ Database seeded successfully')
    return true
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    return false
  }
} 