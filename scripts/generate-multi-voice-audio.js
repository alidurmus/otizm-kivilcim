// Multi-Voice Turkish Audio Generator
// Her bir Türkçe ses için ayrı klasörler oluşturur ve tüm içerikleri generate eder

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY environment variable is required');
  process.exit(1);
}

// 7 Selected Turkish Voices (5 female + 2 male)
const SELECTED_TURKISH_VOICES = {
  gulsu: {
    id: 'jbJMQWv1eS4YjQ6PCcn6',
    name: 'Gülsu',
    slug: 'gulsu',
    gender: 'female',
    traits: ['energetic', 'sincere', 'clear']
  },
  edaAtlas: {
    id: 'mBUB5zYuPwfVE6DTcEjf',
    name: 'Eda Atlas',
    slug: 'eda-atlas',
    gender: 'female',
    traits: ['bright', 'professional', 'corporate']
  },
  ayca: {
    id: 'eUUtjbi66JcWz3T4Gvvo',
    name: 'Ayça',
    slug: 'ayca',
    gender: 'female',
    traits: ['dynamic', 'motivational', 'narrator']
  },
  yusufSuratli: {
    id: 'V6TFTAE0gaN8LtBwl70x',
    name: 'Yusuf Suratlı',
    slug: 'yusuf-suratli',
    gender: 'male',
    traits: ['bright', 'narrator', 'speaker']
  },
  sermin: {
    id: '9GYMX9eMWSq1yjiwXb7B',
    name: 'Sermin',
    slug: 'sermin',
    gender: 'female',
    traits: ['original', 'fluent', 'accented']
  },
  cavit: {
    id: 'Y2T2O1csKPgWgyuKcU0a',
    name: 'Cavit',
    slug: 'cavit',
    gender: 'male',
    traits: ['strong', 'clear', 'professional']
  },
  mehmet: {
    id: 'fg8pljYEn5ahwjyOQaro',
    name: 'Mehmet',
    slug: 'mehmet',
    gender: 'male',
    traits: ['friendly', 'warm', 'child_friendly']
  }
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
    // Temel kavramlar diyaloglarından tek kelimeler
    'Bu', 'rengi.', 'der',
    // Okuryazarlık egzersizlerinden
    'Bu hece el... el!'
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
    
    // Okuryazarlık egzersizi kutlamaları
    "Harikasın! Çok güzel yaptın!",
    "Bravo! Mükemmel bir çalışma!",
    "Süpersin! Devam et böyle!",
    "Çok başarılısın! Harika iş!",
    
    // Sosyal iletişim kutlamaları
    "Doğru!",
    "Tebrikler! Aktiviteyi tamamladın!",
    
    // Yazma-anlatım kutlamaları
    "Tebrikler!",
    "Tüm kelimeleri tamamladın! Harikasın!",
    "Tüm cümleleri tamamladın! Muhteşemsin!",
    
    // Kelime oyunları kutlamaları
    "Harika! Eşleştirme buldu!",
    "Tebrikler! Tüm eşleştirmeleri buldun!"
  ]
};

// Voice settings optimized for each content type and Turkish pronunciation
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

// Generate audio using ElevenLabs API
async function generateAudio(text, voiceId, settings) {
  const url = `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`;
  
  const requestBody = {
    text: text,
    model_id: "eleven_multilingual_v2",
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
      error.response ? error.response.status : error.message);
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

// Main generation function
async function generateAllAudio() {
  const startTime = Date.now();
  let totalFiles = 0;
  let successCount = 0;
  let failureCount = 0;

  console.log('🎙️ Tüm sayfalardaki diyaloglar için multi-voice MP3 üretimi başlıyor...\n');

  // Voice ve content type bazında istatistikler
  const voiceList = Object.values(SELECTED_TURKISH_VOICES);
  const contentTypes = Object.keys(AUDIO_CONTENT);
  
  console.log(`📊 Üretim kapsamı:`);
  console.log(`   🎤 Sesler: ${voiceList.length} (${voiceList.filter(v => v.gender === 'female').length} kadın, ${voiceList.filter(v => v.gender === 'male').length} erkek)`);
  console.log(`   📝 İçerik türleri: ${contentTypes.length}`);
  
  contentTypes.forEach(type => {
    console.log(`   📋 ${type}: ${AUDIO_CONTENT[type].length} öğe`);
  });
  
  const totalExpectedFiles = voiceList.length * 
    contentTypes.reduce((sum, type) => sum + AUDIO_CONTENT[type].length, 0);
  console.log(`   🎯 Toplam hedef dosya sayısı: ${totalExpectedFiles}\n`);

  // Her voice için ayrı klasör oluştur ve ses dosyalarını üret
  for (const voice of voiceList) {
    console.log(`\n🎭 ${voice.name} (${voice.gender}) için ses dosyaları üretiliyor...`);
    
    const voiceDir = path.join('public', 'audio', 'voices', voice.slug);
    ensureDirectoryExists(voiceDir);

    for (const [contentType, contentArray] of Object.entries(AUDIO_CONTENT)) {
      const typeDir = path.join(voiceDir, contentType);
      ensureDirectoryExists(typeDir);
      
      console.log(`  📂 ${contentType} klasörü: ${contentArray.length} dosya`);

      for (const text of contentArray) {
        const filename = `${turkishToFilename(text)}.mp3`;
        const outputPath = path.join(typeDir, filename);
        
        // Dosya zaten varsa atla
        if (fs.existsSync(outputPath)) {
          console.log(`  ⏩ Var olan dosya atlandı: ${filename}`);
          totalFiles++;
          successCount++;
          continue;
        }

        try {
          const audioBuffer = await generateAudio(
            text, 
            voice.id, 
            VOICE_SETTINGS[contentType]
          );
          
          fs.writeFileSync(outputPath, audioBuffer);
          console.log(`  ✅ Oluşturuldu: ${filename} (${Math.round(audioBuffer.length / 1024)}KB)`);
          
          successCount++;
          totalFiles++;
          
          // Rate limiting - 1 saniye bekle
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`  ❌ Hata (${filename}): ${error.message}`);
          failureCount++;
          totalFiles++;
        }
      }
    }
  }

  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);

  console.log('\n🎉 Multi-voice ses dosyası üretimi tamamlandı!');
  console.log(`\n📊 İstatistikler:`);
  console.log(`   ⏱️ Süre: ${duration} saniye`);
  console.log(`   📁 Toplam dosya: ${totalFiles}`);
  console.log(`   ✅ Başarılı: ${successCount}`);
  console.log(`   ❌ Başarısız: ${failureCount}`);
  console.log(`   🎯 Başarı oranı: ${Math.round((successCount / totalFiles) * 100)}%`);
  
  console.log(`\n🗂️ Oluşturulan klasör yapısı:`);
  console.log(`   public/audio/voices/`);
  Object.values(SELECTED_TURKISH_VOICES).forEach(voice => {
    console.log(`   ├── ${voice.slug}/ (${voice.name})`);
    Object.keys(AUDIO_CONTENT).forEach(type => {
      console.log(`   │   ├── ${type}/`);
    });
  });
  
  console.log(`\n🎵 Tüm sayfalardaki diyaloglar artık 7 farklı sesle MP3 formatında hazır!`);
}

// Script'i çalıştır
if (require.main === module) {
  generateAllAudio().catch(console.error);
}

module.exports = { generateAllAudio }; 