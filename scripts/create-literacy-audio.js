// Literacy Module Audio Generator - Hece Eğitimi
// Okuryazarlık modülünde kullanılan özel hece cümlelerini oluşturur

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

// Gülsu Voice Configuration (Working voice ID)
const GULSU_VOICE = {
  id: 'jbJMQWv1eS4YjQ6PCcn6', // Çalışan Gülsu voice ID
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

// Generate audio using ElevenLabs API
async function generateAudio(text, settings) {
  const url = `${ELEVENLABS_BASE_URL}/text-to-speech/${GULSU_VOICE.id}`;
  
  const requestBody = {
    text: text,
    model_id: "eleven_turbo_v2_5",
    language_code: "tr",
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

// Literacy Module - Hece Training Audio Files
const LITERACY_AUDIO_FILES = [
  // Hece eğitimi cümleleri - okuryazarlık modülünde kullanılan
  { text: "Bu hece el... el!", filePath: 'public/audio/words/bu-hece-el.mp3', type: 'word' },
  { text: "Bu hece al... al!", filePath: 'public/audio/words/bu-hece-al.mp3', type: 'word' },
  { text: "Bu hece ol... ol!", filePath: 'public/audio/words/bu-hece-ol.mp3', type: 'word' },
  { text: "Bu hece ul... ul!", filePath: 'public/audio/words/bu-hece-ul.mp3', type: 'word' },
  { text: "Bu hece il... il!", filePath: 'public/audio/words/bu-hece-il.mp3', type: 'word' },
  
  // Kelime oluşturma cümleleri
  { text: "Bu kelime elma... el-ma!", filePath: 'public/audio/words/bu-kelime-elma.mp3', type: 'word' },
  { text: "Bu kelime anne... an-ne!", filePath: 'public/audio/words/bu-kelime-anne.mp3', type: 'word' },
  { text: "Bu kelime masa... ma-sa!", filePath: 'public/audio/words/bu-kelime-masa.mp3', type: 'word' },
  { text: "Bu kelime okul... o-kul!", filePath: 'public/audio/words/bu-kelime-okul.mp3', type: 'word' },
  { text: "Bu kelime kedi... ke-di!", filePath: 'public/audio/words/bu-kelime-kedi.mp3', type: 'word' },
  
  // Temel heceler
  { text: "A harfi... a!", filePath: 'public/audio/words/a-harfi-a.mp3', type: 'word' },
  { text: "E harfi... e!", filePath: 'public/audio/words/e-harfi-e.mp3', type: 'word' },
  { text: "I harfi... ı!", filePath: 'public/audio/words/i-harfi-i.mp3', type: 'word' },
  { text: "İ harfi... i!", filePath: 'public/audio/words/ii-harfi-ii.mp3', type: 'word' },
  { text: "O harfi... o!", filePath: 'public/audio/words/o-harfi-o.mp3', type: 'word' },
  { text: "Ö harfi... ö!", filePath: 'public/audio/words/oo-harfi-oo.mp3', type: 'word' },
  { text: "U harfi... u!", filePath: 'public/audio/words/u-harfi-u.mp3', type: 'word' },
  { text: "Ü harfi... ü!", filePath: 'public/audio/words/uu-harfi-uu.mp3', type: 'word' },
  
  // Özel yönlendirme cümleleri
  { text: "Hangi hece doğru? Dinleyelim!", filePath: 'public/audio/sentences/hangi-hece-dogru.mp3', type: 'sentence' },
  { text: "Bu harfleri birleştir!", filePath: 'public/audio/sentences/bu-harfleri-birlestir.mp3', type: 'sentence' },
  { text: "Hece oluşturma oyunu başlıyor!", filePath: 'public/audio/sentences/hece-olusturma-oyunu.mp3', type: 'sentence' },
  { text: "Kelime oluşturma zamanı!", filePath: 'public/audio/sentences/kelime-olusturma-zamani.mp3', type: 'sentence' },
  
  // Ek kutlama mesajları
  { text: "Harikasın! Çok güzel yaptın!", filePath: 'public/audio/celebrations/harikasin-cok-guzel.mp3', type: 'celebration' },
  { text: "Mükemmel! Devam et!", filePath: 'public/audio/celebrations/mukemmel-devam-et.mp3', type: 'celebration' },
  { text: "Süper! Bir sonraki hece!", filePath: 'public/audio/celebrations/super-bir-sonraki.mp3', type: 'celebration' },
  { text: "Bravo! Heceler çok güzel!", filePath: 'public/audio/celebrations/bravo-heceler-guzel.mp3', type: 'celebration' }
];

// Voice settings per content type
const VOICE_SETTINGS = {
  word: { stability: 0.8, similarity_boost: 0.9, style: 0.4, use_speaker_boost: true },
  sentence: { stability: 0.6, similarity_boost: 0.7, style: 0.5, use_speaker_boost: true },
  celebration: { stability: 0.5, similarity_boost: 0.6, style: 0.8, use_speaker_boost: true }
};

async function main() {
  console.log('🎓 LITERACY MODULE AUDIO CREATOR - GÜLSU VOICE');
  console.log('===============================================');
  console.log(`🎤 Voice: ${GULSU_VOICE.name} (${GULSU_VOICE.gender})`);
  console.log(`🔧 Model: eleven_turbo_v2_5 (Turkish-optimized)`);
  console.log(`📚 Module: Okuryazarlık - Hece Eğitimi\n`);

  const startTime = Date.now();
  let createdCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  console.log('📋 CREATING LITERACY AUDIO FILES...');
  
  for (const item of LITERACY_AUDIO_FILES) {
    const exists = fileExists(item.filePath);
    
    if (exists) {
      console.log(`✅ SKIP: ${item.filePath} (already exists)`);
      skippedCount++;
      continue;
    }

    console.log(`🔄 CREATING: "${item.text}" -> ${item.filePath}`);
    
    try {
      const settings = VOICE_SETTINGS[item.type];
      const audioBuffer = await generateAudio(item.text, settings);
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

  console.log('\n🎉 LITERACY AUDIO CREATION COMPLETE!');
  console.log('====================================');
  console.log(`📊 Summary:`);
  console.log(`   ✅ Created: ${createdCount} files`);
  console.log(`   ⏭️  Skipped: ${skippedCount} files (already existed)`);
  console.log(`   ❌ Errors: ${errorCount} files`);
  console.log(`   📁 Total checked: ${LITERACY_AUDIO_FILES.length} files`);
  console.log(`   ⏱️  Duration: ${duration} seconds`);
  console.log(`   🎭 Voice: ${GULSU_VOICE.name} (Turkish-optimized)`);
  console.log(`   🔧 Model: eleven_turbo_v2_5`);
  
  if (errorCount === 0) {
    console.log('\n🎯 All literacy audio files successfully created!');
    console.log('📚 Okuryazarlık modülü artık tamamen destekleniyor.');
  } else {
    console.log(`\n⚠️  ${errorCount} files failed to create. Check errors above.`);
  }
}

main().catch(console.error); 