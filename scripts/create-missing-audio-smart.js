// Smart Missing Audio Files Creator with Existence Check
// Sadece eksik dosyaları Gülsu sesi ile oluşturur

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY environment variable is required');
  process.exit(1);
}

// Gülsu Voice Configuration
const GULSU_VOICE = {
  id: 'jbJMQWv1eS4YjQ6PCcn6',
  name: 'Gülsu',
  gender: 'female',
  language: 'Turkish'
};

// Check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Generate audio using ElevenLabs API with eleven_turbo_v2_5 model
async function generateAudio(text, settings) {
  const url = `${ELEVENLABS_BASE_URL}/text-to-speech/${GULSU_VOICE.id}`;
  
  const requestBody = {
    text: text,
    model_id: "eleven_turbo_v2_5",       // Latest Turkish-optimized model
    language_code: "tr",                  // Turkish language code
    voice_settings: {
      stability: settings.stability,
      similarity_boost: settings.similarity_boost,
      style: settings.style,
      use_speaker_boost: settings.use_speaker_boost
    }
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer',
      timeout: 30000
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error(`🚫 Error generating audio for "${text}":`, error.message);
    throw error;
  }
}

// Save audio buffer to file
async function saveAudioFile(audioBuffer, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  await fs.promises.writeFile(outputPath, audioBuffer);
}

// All missing content with file paths
const CONTENT_TO_CHECK = [
  // Turkish Letters - 29 letters
  { text: 'A', filePath: 'public/audio/letters/a.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'B', filePath: 'public/audio/letters/b.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'C', filePath: 'public/audio/letters/c.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'Ç', filePath: 'public/audio/letters/ç.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'D', filePath: 'public/audio/letters/d.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'E', filePath: 'public/audio/letters/e.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'F', filePath: 'public/audio/letters/f.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'G', filePath: 'public/audio/letters/g.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'Ğ', filePath: 'public/audio/letters/ğ.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'H', filePath: 'public/audio/letters/h.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'I', filePath: 'public/audio/letters/ı.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'İ', filePath: 'public/audio/letters/i.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'J', filePath: 'public/audio/letters/j.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'K', filePath: 'public/audio/letters/k.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'L', filePath: 'public/audio/letters/l.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'M', filePath: 'public/audio/letters/m.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'N', filePath: 'public/audio/letters/n.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'O', filePath: 'public/audio/letters/o.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'Ö', filePath: 'public/audio/letters/ö.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'P', filePath: 'public/audio/letters/p.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'R', filePath: 'public/audio/letters/r.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'S', filePath: 'public/audio/letters/s.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'Ş', filePath: 'public/audio/letters/ş.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'T', filePath: 'public/audio/letters/t.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'U', filePath: 'public/audio/letters/u.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'Ü', filePath: 'public/audio/letters/ü.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'V', filePath: 'public/audio/letters/v.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'Y', filePath: 'public/audio/letters/y.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },
  { text: 'Z', filePath: 'public/audio/letters/z.mp3', type: 'letter', settings: { stability: 0.9, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true } },

  // Already created sentence files (check for existence)
  { text: "Merhaba! Kıvılcım'a hoş geldin! Birlikte öğrenmeye hazır mısın?", filePath: 'public/audio/sentences/hosgeldin-mesaji.mp3', type: 'sentence', settings: { stability: 0.6, similarity_boost: 0.7, style: 0.5, use_speaker_boost: true } },
  { text: "Alfabe okuma modülüne hoş geldin! Türk alfabesinin 29 harfini birlikte öğreneceğiz.", filePath: 'public/audio/sentences/alfabe-hosgeldin.mp3', type: 'sentence', settings: { stability: 0.6, similarity_boost: 0.7, style: 0.5, use_speaker_boost: true } },
  { text: "Çok başarılısın! Harika iş!", filePath: 'public/audio/celebrations/cok-basarilisin-harika-is.mp3', type: 'celebration', settings: { stability: 0.5, similarity_boost: 0.6, style: 0.8, use_speaker_boost: true } },
];

async function main() {
  console.log('🔍 SMART AUDIO FILE CREATOR - GÜLSU VOICE');
  console.log('========================================');
  console.log(`🎤 Voice: ${GULSU_VOICE.name} (${GULSU_VOICE.gender})`);
  console.log(`🔧 Model: eleven_turbo_v2_5 (Turkish-optimized)`);
  console.log(`🇹🇷 Language: ${GULSU_VOICE.language}\n`);

  const startTime = Date.now();
  let createdCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  console.log('📋 CHECKING EXISTING FILES...');
  
  for (const item of CONTENT_TO_CHECK) {
    const exists = fileExists(item.filePath);
    
    if (exists) {
      console.log(`✅ SKIP: ${item.filePath} (already exists)`);
      skippedCount++;
      continue;
    }

    console.log(`🔄 CREATING: ${item.text} -> ${item.filePath}`);
    
    try {
      const audioBuffer = await generateAudio(item.text, item.settings);
      await saveAudioFile(audioBuffer, item.filePath);
      
      const fileSizeKB = (audioBuffer.length / 1024).toFixed(2);
      console.log(`✅ CREATED: ${item.filePath} (${fileSizeKB} KB)`);
      createdCount++;
      
      // Rate limiting - 2 saniye bekleme
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ FAILED: ${item.filePath} - ${error.message}`);
      errorCount++;
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);

  console.log('\n🎉 SMART AUDIO CREATION COMPLETE!');
  console.log('=====================================');
  console.log(`📊 Summary:`);
  console.log(`   ✅ Created: ${createdCount} files`);
  console.log(`   ⏭️  Skipped: ${skippedCount} files (already existed)`);
  console.log(`   ❌ Errors: ${errorCount} files`);
  console.log(`   📁 Total checked: ${CONTENT_TO_CHECK.length} files`);
  console.log(`   ⏱️  Duration: ${duration} seconds`);
  console.log(`   🎭 Voice: ${GULSU_VOICE.name} (Turkish-optimized)`);
  console.log(`   🔧 Model: eleven_turbo_v2_5`);
  
  if (errorCount === 0) {
    console.log('\n🎯 All missing files successfully created with Gülsu voice!');
  } else {
    console.log(`\n⚠️  ${errorCount} files failed to create. Check errors above.`);
  }
}

main().catch(console.error); 