// Script to pre-generate static audio files using ElevenLabs API
// Run this script to create audio files for common Turkish words/letters/phrases

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Turkish Voice Configuration - Kullanıcının seçtiği tek bayan ses (tüm konuşmalar için)
const TURKISH_VOICE_CONFIGS = {
  letters: {
    voiceId: 'xyqF3vGMQlPk3e7yA4DI',     // Kullanıcının seçtiği varsayılan bayan ses
    gender: 'female',
    name: 'Varsayılan Bayan Ses'
  },
  words: {
    voiceId: 'xyqF3vGMQlPk3e7yA4DI',     // Aynı bayan ses (tutarlılık için)
    gender: 'female',
    name: 'Varsayılan Bayan Ses'
  },
  sentences: {
    voiceId: 'xyqF3vGMQlPk3e7yA4DI',     // Aynı bayan ses (tutarlılık için)
    gender: 'female', 
    name: 'Varsayılan Bayan Ses'
  },
  celebrations: {
    voiceId: 'xyqF3vGMQlPk3e7yA4DI',     // Aynı bayan ses (tutarlılık için)
    gender: 'female',
    name: 'Varsayılan Bayan Ses'
  }
};

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY not found in .env.local');
  console.log('   Please add your ElevenLabs API key to .env.local file');
  console.log('   Get your API key from: https://elevenlabs.io/');
  process.exit(1);
}

// Complete Turkish alphabet and words (matching audio-constants.ts)
const AUDIO_FILES = {
  letters: [
    // Sesli harfler (8 adet)
    'a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü',
    // Sessiz harfler - Türk alfabesi sırasıyla (21 adet)
    'b', 'c', 'ç', 'd', 'f', 'g', 'ğ', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 'ş', 't', 'v', 'y', 'z'
  ],
  words: [
    // Açık heceler
    'el', 'al', 'ol', 'il', 'öl', 'am', 'em', 'an', 'en', 'in', 'un', 'ün', 'at', 'et', 'it', 'ut',
    // Türkçe özel karakterli heceler
    'aç', 'eş', 'iş', 'uş', 'üş',
    // Aile kelimeleri
    'anne', 'baba', 'mama', 'dede', 'nene', 'abla', 'abi',
    // Meyve ve hayvanlar
    'elma', 'armut', 'kiraz', 'üzüm', 'kedi', 'köpek', 'kuş', 'balık',
    // Temel nesneler
    'ev', 'su', 'ekmek', 'süt', 'çay', 'şeker'
  ],
  sentences: [
    'Başlayalım!',
    'Harfleri birleştir.',
    'Bu harfi söyle.',
    'Doğru yere sürükle.',
    'Tekrar dene.',
    'Çok iyi!',
    'Devam et.',
    'Sorun değil, tekrar deneyelim.',
    'Müthiş! Devam ediyoruz.',
    'Şimdi bir sonraki harfe geçelim.',
    // Matematik modülü gelişmiş aktiviteler
    'Şekil Sayma. Kaç tane daire var?',
    'Kare Sayma. Kaç tane kare var?',
    'Tekrar bakalım. Görseli dikkatlice incele.',
    'Çubuk Grafik Karşılaştırma. En düşük ve en yüksek çubuk toplamı kaç?',
    'Sayı Doğrusu. İşaretli sayı kaç?',
    // Matematik modülü diyalogları - Yeni eklenen sentences
    'Matematik Dünyası modülüne hoş geldin! Sayıları öğren ve temel matematik becerilerini geliştir.'
  ],
  celebrations: [
    'Harikasın!',
    'Bravo!',
    'Mükemmel!',
    'Çok başarılısın!',
    'Süpersin!',
    'Aferin sana!',
    'Harika iş çıkardın!',
    'Çok güzel yaptın!',
    'Tebrikler!',
    'Devam et böyle!',
    'Muhteşemsin!',
    'Çok güzeldi!',
    // Matematik modülü özel kutlama
    'Mükemmel! Grafiği doğru okudun!'
  ]
};

// Voice settings optimized for Turkish children with autism
const VOICE_SETTINGS = {
  letters: {
    stability: 0.9,           // Çok kararlı - harfler net olmalı
    similarity_boost: 0.9,    // Yüksek benzerlik
    style: 0.2,               // Minimal stil - sadece harf sesi
    use_speaker_boost: true
  },
  words: {
    stability: 0.8,           // Kararlı - kelimeler açık
    similarity_boost: 0.8,    // İyi benzerlik
    style: 0.3,               // Az stil - doğal kelime sesi
    use_speaker_boost: true
  },
  sentences: {
    stability: 0.7,           // Orta kararlılık - doğal akış
    similarity_boost: 0.7,    // Dengeli benzerlik
    style: 0.4,               // Orta stil - yönlendirici ton
    use_speaker_boost: true
  },
  celebrations: {
    stability: 0.6,           // Daha esnek - coşkulu
    similarity_boost: 0.6,    // Dengeli
    style: 0.7,               // Yüksek stil - kutlama tonu
    use_speaker_boost: true
  }
};

// Turkish character mapping for safe filenames
function turkishToFilename(text) {
  const turkishMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  
  return text
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Generate filename from Turkish text
function generateFilename(text) {
  return turkishToFilename(text) + '.mp3';
}

// Generate audio file using ElevenLabs API
async function generateAudio(text, type) {
  const settings = VOICE_SETTINGS[type];
  
  console.log(`    🎙️  "${text}" -> ${generateFilename(text)} (${type})`);
  
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${TURKISH_VOICE_CONFIGS[type].voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2_5', // EN GÜNCEL MODEL - Türkçe optimized, düşük latency
        voice_settings: settings,
        language: 'tr' // Açıkça Türkçe belirt
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log(`    ✅ Generated audio for "${text}" (${Math.round(audioBuffer.byteLength / 1024)}KB)`);
    
    return audioBuffer;
  } catch (error) {
    console.error(`    ❌ Error generating audio for "${text}":`, error.message);
    throw error;
  }
}

// Save audio file with Turkish character support
async function saveAudioFile(audioBuffer, filename, type) {
  const dir = path.join(__dirname, '..', 'public', 'audio', type);
  const filepath = path.join(dir, filename);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  📁 Created directory: ${dir}`);
  }
  
  try {
    fs.writeFileSync(filepath, Buffer.from(audioBuffer));
    console.log(`    💾 Saved: ${type}/${filename}`);
  } catch (error) {
    console.error(`    ❌ Error saving ${filepath}:`, error.message);
    throw error;
  }
}

// Generate all audio files with Turkish support
async function generateAllAudioFiles() {
  console.log('🎵 Starting Turkish audio file generation...\n');
  console.log('🇹🇷 Using Turkish voice settings optimized for children with autism\n');
  
  let totalFiles = 0;
  let successCount = 0;
  let errorCount = 0;
  const startTime = Date.now();
  
  for (const [type, texts] of Object.entries(AUDIO_FILES)) {
    console.log(`📁 Processing ${type} (${texts.length} files)...`);
    
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      totalFiles++;
      const filename = generateFilename(text);
      
      try {
        const audioBuffer = await generateAudio(text, type);
        await saveAudioFile(audioBuffer, filename, type);
        
        successCount++;
        
        // Progress indicator
        const progress = Math.round(((i + 1) / texts.length) * 100);
        console.log(`    📊 Progress: ${progress}% (${i + 1}/${texts.length})`);
        
        // Rate limiting - wait 1 second between requests to respect ElevenLabs limits
        if (i < texts.length - 1) {
          console.log(`    ⏳ Waiting 1s for rate limiting...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        errorCount++;
        console.error(`    ❌ Failed: "${text}" - ${error.message}`);
        
        // Don't fail the entire process for one file
        continue;
      }
    }
    
    console.log(`  ✅ Completed ${type} (${texts.length - errorCount} successful)\n`);
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000);
  
  console.log('═══════════════════════════════════════');
  console.log('📊 Turkish Audio Generation Summary:');
  console.log('═══════════════════════════════════════');
  console.log(`   🏁 Total files: ${totalFiles}`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   ⏱️  Duration: ${duration} seconds`);
  console.log(`   📁 Files saved to: public/audio/`);
  console.log(`   🇹🇷 Turkish voice: Single female voice (consistent experience)`);
  console.log(`   👥 Voice assignment:`);
  console.log(`      - Letters: ${TURKISH_VOICE_CONFIGS.letters.name} (${TURKISH_VOICE_CONFIGS.letters.gender})`);
  console.log(`      - Words: ${TURKISH_VOICE_CONFIGS.words.name} (${TURKISH_VOICE_CONFIGS.words.gender})`);
  console.log(`      - Sentences: ${TURKISH_VOICE_CONFIGS.sentences.name} (${TURKISH_VOICE_CONFIGS.sentences.gender})`);
  console.log(`      - Celebrations: ${TURKISH_VOICE_CONFIGS.celebrations.name} (${TURKISH_VOICE_CONFIGS.celebrations.gender})`);
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some files failed to generate. Common causes:');
    console.log('   - API key issues');
    console.log('   - Network connectivity');
    console.log('   - Rate limiting (wait longer between requests)');
    console.log('   - ElevenLabs service issues');
  } else {
    console.log('\n🎉 All Turkish audio files generated successfully!');
    console.log('   Ready for use in Kıvılcım platform with consistent female Turkish voice');
  }
}

// Run the script
if (require.main === module) {
  generateAllAudioFiles().catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

module.exports = { 
  generateAllAudioFiles, 
  generateAudio, 
  saveAudioFile, 
  turkishToFilename,
  generateFilename,
  TURKISH_VOICE_CONFIGS
};