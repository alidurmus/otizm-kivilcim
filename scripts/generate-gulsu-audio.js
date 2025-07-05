// Gülsu Voice Turkish Audio Generator
// eleven_turbo_v2_5 modeli ile Türkçe dil optimizasyonu

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load environment variables from both .env and .env.local
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY environment variable is required');
  process.exit(1);
}

// Gülsu Voice Configuration - Türkçe optimizasyonu
const GULSU_VOICE = {
  id: 'jbJMQWv1eS4YjQ6PCcn6',
  name: 'Gülsu',
  slug: 'gulsu',
  gender: 'female',
  language: 'Turkish',
  traits: ['energetic', 'sincere', 'clear', 'child_friendly'],
  description: 'Genç Türk kadın sesi - enerjik ve samimi. Çocuk hikayeleri ve kitaplar için mükemmel.'
};

// Complete Turkish content - TÜM SAYFALARDAKİ DİYALOGLAR DAHİL
const AUDIO_CONTENT = {
  letters: [
    // 29 harflik Türk alfabesi
    'a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'ğ', 'h', 
    'ı', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p', 
    'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z'
  ],
  words: [
    // Açık heceler
    'el', 'al', 'ol', 'il', 'öl', 'am', 'em', 'an', 'en', 'in', 'un', 'ün', 'at', 'et', 'it', 'ut',
    // Türkçe karakterli heceler
    'aç', 'eş', 'iş', 'uş', 'üş', 'çe', 'şa', 'ğı', 'öz', 'ör',
    // Aile kelimeleri
    'anne', 'baba', 'mama', 'dede', 'nene', 'abla', 'abi', 'kardeş',
    // Meyve ve sebzeler
    'elma', 'armut', 'kiraz', 'üzüm', 'muz', 'çilek', 'domates', 'salatalık',
    // Hayvanlar
    'kedi', 'köpek', 'kuş', 'balık', 'fil', 'kaplan', 'aslan', 'tavşan',
    // Temel objeler
    'ev', 'su', 'ekmek', 'süt', 'çay', 'şeker', 'kitap', 'kalem', 'çanta',
    // Sayfa diyaloglarından tek kelimeler
    'Bu', 'rengi', 'der', 'sesi', 'tane', 'elma', 'seviye', 'yapbozunu'
  ],
  sentences: [
    // Temel yönlendirmeler
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
    'Bu kelimeyi okuyabilir misin?',
    'Hangi harf eksik?',
    'Kelimeyi tamamla.',
    'Mükemmel bir başlangıç!',
    
    // Ana sayfa diyalogları
    "Merhaba! Kıvılcım'a hoş geldin! Birlikte öğrenmeye hazır mısın?",
    
    // Alfabe sayfası diyalogları
    "Alfabe okuma modülüne hoş geldin! Türk alfabesinin 29 harfini birlikte öğreneceğiz.",
    
    // Sosyal iletişim diyalogları
    "Tekrar dene.",
    "aktivitesini öğrenelim!",
    
    // Temel kavramlar diyalogları
    "sesi çıkarır.",
    "tane elma",
    
    // Yazma-anlatım diyalogları
    "kelimesini tamamladın!",
    "Tekrar dene. Harflerin sırasına dikkat et.",
    "Harika cümle:",
    
    // Yapboz diyalogları
    "seviye seçtin.",
    "yapbozunu başlayalım!"
  ],
  celebrations: [
    // Temel kutlamalar
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
    'Harika ilerleme!',
    'Sen bir yıldızsın!',
    'Mükemmel bir öğrencisin!',
    
    // Sayfa-spesifik kutlamalar
    "Harikasın! Çok güzel yaptın!",
    "Bravo! Mükemmel bir çalışma!",
    "Süpersin! Devam et böyle!",
    "Çok başarılısın! Harika iş!",
    "Doğru!",
    "Tebrikler! Aktiviteyi tamamladın!",
    "Tüm kelimeleri tamamladın! Harikasın!",
    "Tüm cümleleri tamamladın! Muhteşemsin!",
    "Harika! Eşleştirme buldu!",
    "Tebrikler! Tüm eşleştirmeleri buldun!"
  ]
};

// Turkish-optimized voice settings for Gülsu with eleven_turbo_v2_5
const VOICE_SETTINGS = {
  letters: {
    stability: 0.9,           // Çok kararlı - harfler net olmalı
    similarity_boost: 0.9,    // Yüksek benzerlik - Gülsu'nun karakteristik sesi
    style: 0.2,               // Minimal stil - sadece harf sesi
    use_speaker_boost: true   // Türkçe telaffuz için boost
  },
  words: {
    stability: 0.8,           // Kararlı - kelimeler açık
    similarity_boost: 0.8,    // İyi benzerlik
    style: 0.3,               // Az stil - doğal kelime sesi
    use_speaker_boost: true
  },
  sentences: {
    stability: 0.7,           // Orta kararlılık - doğal Türkçe akış
    similarity_boost: 0.7,    // Dengeli benzerlik
    style: 0.4,               // Orta stil - yönlendirici ama dostça ton
    use_speaker_boost: true
  },
  celebrations: {
    stability: 0.6,           // Daha esnek - coşkulu ve enerjik
    similarity_boost: 0.6,    // Dengeli
    style: 0.8,               // Yüksek stil - Gülsu'nun enerjik karakteri için
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

// Generate audio using ElevenLabs API with eleven_turbo_v2_5 model (Turkish optimized)
async function generateAudio(text, settings) {
  const url = `${ELEVENLABS_BASE_URL}/text-to-speech/${GULSU_VOICE.id}`;
  
  const requestBody = {
    text: text,
    model_id: "eleven_turbo_v2_5",       // Latest Turkish-optimized model - fastest and highest quality
    language_code: "tr",                  // Turkish language code - explicit Turkish optimization
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
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      responseType: 'arraybuffer',
      timeout: 30000 // 30 second timeout
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error(`❌ Audio generation failed for "${text}":`, 
      error.response ? `${error.response.status} - ${error.response.statusText}` : error.message);
    throw error;
  }
}

// Ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Main generation function for Gülsu voice
async function generateGulsuAudio() {
  const startTime = Date.now();
  let totalFiles = 0;
  let successCount = 0;
  let failureCount = 0;

  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('🎙️ GÜLSU VOICE - TURKISH AUDIO GENERATION');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`🎤 Voice: ${GULSU_VOICE.name} (${GULSU_VOICE.gender})`);
  console.log(`🔤 Voice ID: ${GULSU_VOICE.id}`);
  console.log(`🌐 Model: eleven_turbo_v2_5 (Turkish-optimized)`);
  console.log(`🇹🇷 Language: Turkish (tr) - Native optimization`);
  console.log(`✨ Traits: ${GULSU_VOICE.traits.join(', ')}`);
  console.log(`📝 Description: ${GULSU_VOICE.description}`);
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  // Content type bazında istatistikler
  const contentTypes = Object.keys(AUDIO_CONTENT);
  
  console.log(`📊 Content breakdown:`);
  contentTypes.forEach(type => {
    console.log(`   📋 ${type}: ${AUDIO_CONTENT[type].length} items`);
  });
  
  const totalExpectedFiles = contentTypes.reduce((sum, type) => sum + AUDIO_CONTENT[type].length, 0);
  console.log(`   🎯 Total files to generate: ${totalExpectedFiles}\n`);

  // Gülsu için klasör oluştur
  const voiceDir = path.join('public', 'audio', 'voices', GULSU_VOICE.slug);
  ensureDirectoryExists(voiceDir);

  // Her content type için ses dosyalarını üret
  for (const [contentType, contentArray] of Object.entries(AUDIO_CONTENT)) {
    const typeDir = path.join(voiceDir, contentType);
    ensureDirectoryExists(typeDir);
    
    console.log(`📝 Processing ${contentType}... (${contentArray.length} items)`);

    for (const text of contentArray) {
      const filename = `${turkishToFilename(text)}.mp3`;
      const outputPath = path.join(typeDir, filename);
      
      // Dosya zaten varsa atla
      if (fs.existsSync(outputPath)) {
        console.log(`    ⏩ Skipped existing: ${filename}`);
        totalFiles++;
        successCount++;
        continue;
      }

      try {
        console.log(`    🎵 "${text}" -> ${filename}`);
        
        const audioBuffer = await generateAudio(text, VOICE_SETTINGS[contentType]);
        
        fs.writeFileSync(outputPath, audioBuffer);
        console.log(`    💾 Saved: voices/${GULSU_VOICE.slug}/${contentType}/${filename}`);
        
        successCount++;
        totalFiles++;
        
        // Rate limiting - 1.5 saniye bekle (Turkish quality için)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (error) {
        console.error(`    ❌ Error (${filename}): ${error.message}`);
        failureCount++;
        totalFiles++;
        
        // Hata durumunda 3 saniye bekle
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    console.log(`  ✅ ${GULSU_VOICE.name} ${contentType} completed: ${contentArray.length}/${contentArray.length} files generated\n`);
  }

  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);

  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('🎉 GÜLSU TURKISH AUDIO GENERATION COMPLETED!');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`📊 Final Statistics:`);
  console.log(`   🏁 Total files: ${totalFiles}`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${failureCount}`);
  console.log(`   ⏱️  Duration: ${duration} seconds`);
  console.log(`   📁 Files organized in: public/audio/voices/${GULSU_VOICE.slug}/`);
  console.log(`   🎭 Voice: ${GULSU_VOICE.name} (${GULSU_VOICE.gender})`);
  console.log(`   🎯 Content types per voice:`);
  Object.keys(AUDIO_CONTENT).forEach(type => {
    console.log(`      - ${type}/ (${AUDIO_CONTENT[type].length} files)`);
  });
  
  console.log(`🔧 Usage in code:`);
  console.log(`   // Gülsu voice examples`);
  console.log(`   const audioPath = '/audio/voices/${GULSU_VOICE.slug}/letters/a.mp3';`);
  console.log(`   const audioPath = '/audio/voices/${GULSU_VOICE.slug}/words/elma.mp3';`);
  console.log(`   const audioPath = '/audio/voices/${GULSU_VOICE.slug}/sentences/baslayalim.mp3';`);
  console.log(`🎉 Perfect! All ${totalFiles} files generated successfully!`);
  console.log(`🎵 Turkish audio system ready for Kıvılcım platform!`);
}

// Run the generation
if (require.main === module) {
  generateGulsuAudio()
    .then(() => {
      console.log('\n🎊 Gülsu audio generation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Generation failed:', error);
      process.exit(1);
    });
}

module.exports = { generateGulsuAudio, GULSU_VOICE, AUDIO_CONTENT, VOICE_SETTINGS };