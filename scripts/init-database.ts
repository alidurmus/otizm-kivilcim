#!/usr/bin/env tsx

import { seedDatabase, testConnection } from '../lib/database'
import { createDemoUsers } from '../lib/auth'
import { prisma } from '../lib/database'

async function initializeDatabase() {
  console.log('🚀 Kıvılcım SQLite Database Initialization')
  console.log('=========================================')

  // Test database connection
  console.log('\n1. Testing database connection...')
  const connectionTest = await testConnection()
  
  if (!connectionTest) {
    console.error('❌ Database connection failed. Exiting.')
    process.exit(1)
  }

  // Seed basic data
  console.log('\n2. Seeding database with modules and settings...')
  const seedSuccess = await seedDatabase()
  
  if (!seedSuccess) {
    console.error('❌ Database seeding failed. Exiting.')
    process.exit(1)
  }

  // Create demo users
  console.log('\n3. Creating demo users...')
  const demoSuccess = await createDemoUsers()
  
  if (!demoSuccess) {
    console.error('❌ Demo user creation failed. Continuing anyway.')
  }

  // Initialize system settings
  console.log('\n4. Setting up system configuration...')
  await initializeSystemSettings()

  // Initialize static audio file registry
  console.log('\n5. Registering static audio files...')
  await initializeAudioFiles()

  console.log('\n✅ Database initialization completed successfully!')
  console.log('\nDemo credentials:')
  console.log('- Email: demo@kivilcim.com | Password: demo123')
  console.log('- Email: test@kivilcim.com | Password: demo123')
  console.log('\nDatabase location: ./dev.db')
  
  await prisma.$disconnect()
}

async function initializeSystemSettings() {
  const defaultSettings = [
    {
      key: 'platform_version',
      value: '2.0.0',
      description: 'Kıvılcım platform version',
      category: 'system'
    },
    {
      key: 'total_active_modules',
      value: '10',
      description: 'Total number of active learning modules',
      category: 'modules'
    },
    {
      key: 'default_voice_gender_distribution',
      value: '{"male": 60, "female": 40}',
      description: 'Target voice gender distribution percentages',
      category: 'voice'
    },
    {
      key: 'audio_source_priority',
      value: '["static_file", "elevenlabs_sdk", "api_route", "web_speech"]',
      description: 'Audio source priority order',
      category: 'voice'
    },
    {
      key: 'static_audio_target_coverage',
      value: '70',
      description: 'Target percentage for static audio file usage',
      category: 'performance'
    },
    {
      key: 'max_session_duration',
      value: '45',
      description: 'Maximum recommended session duration in minutes',
      category: 'education'
    },
    {
      key: 'maintenance_mode',
      value: 'false',
      description: 'Platform maintenance mode status',
      category: 'system'
    },
    {
      key: 'registration_enabled',
      value: 'true',
      description: 'New user registration enabled',
      category: 'auth'
    }
  ]

  for (const setting of defaultSettings) {
    await prisma.systemSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting
    })
  }

  console.log(`   ✅ ${defaultSettings.length} system settings configured`)
}

async function initializeAudioFiles() {
  // Register static audio files that exist in the system
  const audioFiles = [
    // Letters (29 Turkish alphabet)
    { fileName: 'a.mp3', contentType: 'LETTER', content: 'a', voiceName: 'ADAM' },
    { fileName: 'b.mp3', contentType: 'LETTER', content: 'b', voiceName: 'ADAM' },
    { fileName: 'c.mp3', contentType: 'LETTER', content: 'c', voiceName: 'ADAM' },
    { fileName: 'ch.mp3', contentType: 'LETTER', content: 'ç', voiceName: 'ADAM', isSpecialTurkishChar: true },
    { fileName: 'd.mp3', contentType: 'LETTER', content: 'd', voiceName: 'ADAM' },
    { fileName: 'e.mp3', contentType: 'LETTER', content: 'e', voiceName: 'ADAM' },
    { fileName: 'f.mp3', contentType: 'LETTER', content: 'f', voiceName: 'ADAM' },
    { fileName: 'g.mp3', contentType: 'LETTER', content: 'g', voiceName: 'ADAM' },
    { fileName: 'gh.mp3', contentType: 'LETTER', content: 'ğ', voiceName: 'ADAM', isSpecialTurkishChar: true },
    { fileName: 'h.mp3', contentType: 'LETTER', content: 'h', voiceName: 'ADAM' },
    { fileName: 'i.mp3', contentType: 'LETTER', content: 'ı', voiceName: 'ADAM', isSpecialTurkishChar: true },
    { fileName: 'ii.mp3', contentType: 'LETTER', content: 'i', voiceName: 'ADAM', isSpecialTurkishChar: true },
    { fileName: 'j.mp3', contentType: 'LETTER', content: 'j', voiceName: 'ADAM' },
    { fileName: 'k.mp3', contentType: 'LETTER', content: 'k', voiceName: 'ADAM' },
    { fileName: 'l.mp3', contentType: 'LETTER', content: 'l', voiceName: 'ADAM' },
    { fileName: 'm.mp3', contentType: 'LETTER', content: 'm', voiceName: 'ADAM' },
    { fileName: 'n.mp3', contentType: 'LETTER', content: 'n', voiceName: 'ADAM' },
    { fileName: 'o.mp3', contentType: 'LETTER', content: 'o', voiceName: 'ADAM' },
    { fileName: 'oo.mp3', contentType: 'LETTER', content: 'ö', voiceName: 'ADAM', isSpecialTurkishChar: true },
    { fileName: 'p.mp3', contentType: 'LETTER', content: 'p', voiceName: 'ADAM' },
    { fileName: 'r.mp3', contentType: 'LETTER', content: 'r', voiceName: 'ADAM' },
    { fileName: 's.mp3', contentType: 'LETTER', content: 's', voiceName: 'ADAM' },
    { fileName: 'sh.mp3', contentType: 'LETTER', content: 'ş', voiceName: 'ADAM', isSpecialTurkishChar: true },
    { fileName: 't.mp3', contentType: 'LETTER', content: 't', voiceName: 'ADAM' },
    { fileName: 'u.mp3', contentType: 'LETTER', content: 'u', voiceName: 'ADAM' },
    { fileName: 'uu.mp3', contentType: 'LETTER', content: 'ü', voiceName: 'ADAM', isSpecialTurkishChar: true },
    { fileName: 'v.mp3', contentType: 'LETTER', content: 'v', voiceName: 'ADAM' },
    { fileName: 'y.mp3', contentType: 'LETTER', content: 'y', voiceName: 'ADAM' },
    { fileName: 'z.mp3', contentType: 'LETTER', content: 'z', voiceName: 'ADAM' },

    // Numbers (Mathematics module)
    { fileName: 'bir.mp3', contentType: 'WORD', content: 'bir', voiceName: 'GULSU' },
    { fileName: 'iki.mp3', contentType: 'WORD', content: 'iki', voiceName: 'GULSU' },
    { fileName: 'uch.mp3', contentType: 'WORD', content: 'üç', voiceName: 'GULSU', isSpecialTurkishChar: true },
    { fileName: 'dort.mp3', contentType: 'WORD', content: 'dört', voiceName: 'GULSU', isSpecialTurkishChar: true },
    { fileName: 'bes.mp3', contentType: 'WORD', content: 'beş', voiceName: 'GULSU', isSpecialTurkishChar: true },
    { fileName: 'alti.mp3', contentType: 'WORD', content: 'altı', voiceName: 'GULSU', isSpecialTurkishChar: true },
    { fileName: 'yedi.mp3', contentType: 'WORD', content: 'yedi', voiceName: 'GULSU' },
    { fileName: 'sekiz.mp3', contentType: 'WORD', content: 'sekiz', voiceName: 'GULSU' },
    { fileName: 'dokuz.mp3', contentType: 'WORD', content: 'dokuz', voiceName: 'GULSU', isSpecialTurkishChar: true },
    { fileName: 'on.mp3', contentType: 'WORD', content: 'on', voiceName: 'GULSU' },

    // Common celebration phrases
    { fileName: 'aferin.mp3', contentType: 'CELEBRATION', content: 'aferin', voiceName: 'JOSH' },
    { fileName: 'bravo.mp3', contentType: 'CELEBRATION', content: 'bravo', voiceName: 'JOSH' },
    { fileName: 'supersin.mp3', contentType: 'CELEBRATION', content: 'süpersin', voiceName: 'JOSH', isSpecialTurkishChar: true },
    { fileName: 'mukemmel.mp3', contentType: 'CELEBRATION', content: 'mükemmel', voiceName: 'JOSH', isSpecialTurkishChar: true },

    // Common sentence phrases
    { fileName: 'baslayli.mp3', contentType: 'SENTENCE', content: 'başlayalım', voiceName: 'ANTONI', isSpecialTurkishChar: true },
    { fileName: 'tekrar-dene.mp3', contentType: 'SENTENCE', content: 'tekrar dene', voiceName: 'ANTONI' },
    { fileName: 'devam-et.mp3', contentType: 'SENTENCE', content: 'devam et', voiceName: 'ANTONI' },
  ]

  let registeredCount = 0

  for (const audioFile of audioFiles) {
    try {
      await prisma.staticAudioFile.upsert({
        where: { fileName: audioFile.fileName },
        update: {
          contentType: audioFile.contentType as any,
          content: audioFile.content,
          voiceName: audioFile.voiceName as any,
          isSpecialTurkishChar: audioFile.isSpecialTurkishChar || false,
        },
        create: {
          fileName: audioFile.fileName,
          filePath: `/audio/${audioFile.contentType.toLowerCase()}s/${audioFile.fileName}`,
          contentType: audioFile.contentType as any,
          content: audioFile.content,
          voiceName: audioFile.voiceName as any,
          voiceId: 'static-file', // Static files don't have ElevenLabs voice IDs
          gender: audioFile.voiceName === 'RACHEL' ? 'FEMALE' : 'MALE',
          generationDate: new Date(),
          voiceSettings: JSON.stringify({ source: 'static', quality: 'high' }),
          format: 'mp3',
          duration: 1.0, // Default duration
          fileSize: 50000, // Default size
          bitrate: 128,
          sampleRate: 44100,
          quality: 'HIGH',
          isSpecialTurkishChar: audioFile.isSpecialTurkishChar || false,
          isActive: true,
        }
      })
      registeredCount++
    } catch (error) {
      console.warn(`   ⚠️  Failed to register ${audioFile.fileName}:`, error)
    }
  }

  console.log(`   ✅ ${registeredCount} static audio files registered`)
}

// Run initialization if called directly
if (require.main === module) {
  initializeDatabase().catch((error) => {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  })
}

export { initializeDatabase } 