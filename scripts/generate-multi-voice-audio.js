// Multi-Voice Turkish Audio Generator
// Her bir Türkçe ses için ayrı klasörler oluşturur ve tüm içerikleri generate eder

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// 7 Seçilmiş Türkçe Ses Konfigürasyonu (2 yeni ses eklendi)
const TURKISH_VOICES = [
  {
    id: 'jbJMQWv1eS4YjQ6PCcn6',
    name: 'Gülsu',
    slug: 'gulsu',
    gender: 'female',
    description: 'Genç Türk kadını, enerjik ve samimi ses. Hikayeler ve kitaplar için mükemmel.'
  },
  {
    id: 'mBUB5zYuPwfVE6DTcEjf', 
    name: 'Eda Atlas',
    slug: 'eda-atlas',
    gender: 'female',
    description: 'Genç, parlak Türk kadını sesi. Kurumsal, radyo ve TV reklamları için mükemmel seçim.'
  },
  {
    id: 'eUUtjbi66JcWz3T4Gvvo',
    name: 'Ayça',
    slug: 'ayca',
    gender: 'female',
    description: 'Dinamik genç kadın sesi. Anlatıcılar ve motivasyonel konuşmalar için uygun.'
  },
  {
    id: 'V6TFTAE0gaN8LtBwl70x',
    name: 'Yusuf Suratlı',
    slug: 'yusuf-suratli',
    gender: 'male',
    description: 'Parlak, genç yetişkin erkek sesi. Anlatıcı, konuşmacı, kitap seslendirme için mükemmel.'
  },
  {
    id: '9GYMX9eMWSq1yjiwXb7B',
    name: 'Sermin',
    slug: 'sermin',
    gender: 'female',
    description: 'Orijinal, akıcı ve vurgulu Türkçe kadın sesi.'
  },
  {
    id: 'Y2T2O1csKPgWgyuKcU0a',
    name: 'Cavit',
    slug: 'cavit',
    gender: 'male',
    description: 'Güçlü ve net erkek sesi. Profesyonel anlatım ve eğitici içerikler için ideal.'
  },
  {
    id: 'fg8pljYEn5ahwjyOQaro',
    name: 'Mehmet',
    slug: 'mehmet',
    gender: 'male',
    description: 'Samimi ve sıcak erkek sesi. Günlük konuşmalar ve çocuk eğitimi için uygun.'
  }
];

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY not found in .env.local');
  console.log('   Please add your ElevenLabs API key to .env.local file');
  console.log('   Get your API key from: https://elevenlabs.io/');
  process.exit(1);
}

// Complete Turkish content (29 letters + words + sentences + celebrations)
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
    'ev', 'su', 'ekmek', 'süt', 'çay', 'şeker', 'kitap', 'kalem', 'çanta'
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
    'Bu kelimeyi okuyabilir misin?',
    'Hangi harf eksik?',
    'Kelimeyi tamamla.',
    'Mükemmel bir başlangıç!'
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
    'Harika ilerleme!',
    'Sen bir yıldızsın!',
    'Mükemmel bir öğrencisin!'
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

// Generate filename from Turkish text
function generateFilename(text) {
  return turkishToFilename(text) + '.mp3';
}

// Generate audio file using ElevenLabs API
async function generateAudio(text, voiceId, type) {
  const settings = VOICE_SETTINGS[type];
  
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2', // Turkish support
        voice_settings: settings
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return audioBuffer;
  } catch (error) {
    console.error(`    ❌ Error generating audio for "${text}":`, error.message);
    throw error;
  }
}

// Save audio file in voice-specific directory
async function saveAudioFile(audioBuffer, filename, voiceSlug, type) {
  const dir = path.join(__dirname, '..', 'public', 'audio', 'voices', voiceSlug, type);
  const filepath = path.join(dir, filename);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  📁 Created directory: ${dir}`);
  }
  
  try {
    fs.writeFileSync(filepath, Buffer.from(audioBuffer));
    console.log(`    💾 Saved: voices/${voiceSlug}/${type}/${filename}`);
  } catch (error) {
    console.error(`    ❌ Error saving ${filepath}:`, error.message);
    throw error;
  }
}

// Generate audio files for a specific voice
async function generateVoiceAudioFiles(voice) {
  console.log(`\n🎙️  Generating audio files for: ${voice.name} (${voice.gender})`);
  console.log(`    Description: ${voice.description}`);
  console.log(`    Voice ID: ${voice.id}`);
  
  let totalFiles = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (const [type, items] of Object.entries(AUDIO_CONTENT)) {
    console.log(`\n  📝 Processing ${type}... (${items.length} items)`);
    
    for (const text of items) {
      try {
        const filename = generateFilename(text);
        console.log(`    🎵 "${text}" -> ${filename}`);
        
        const audioBuffer = await generateAudio(text, voice.id, type);
        await saveAudioFile(audioBuffer, filename, voice.slug, type);
        
        successCount++;
        totalFiles++;
        
        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`    ❌ Failed to generate "${text}": ${error.message}`);
        errorCount++;
        totalFiles++;
      }
    }
  }
  
  console.log(`\n  ✅ ${voice.name} completed: ${successCount}/${totalFiles} files generated`);
  if (errorCount > 0) {
    console.log(`  ⚠️  ${errorCount} errors occurred`);
  }
  
  return { totalFiles, successCount, errorCount };
}

// Main execution function
async function generateAllVoicesAudioFiles() {
  console.log('🎵 Multi-Voice Turkish Audio Generation Started!\n');
  console.log('🇹🇷 Generating audio files for 7 Turkish voices\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const startTime = Date.now();
  let grandTotalFiles = 0;
  let grandSuccessCount = 0;
  let grandErrorCount = 0;
  
  // Calculate total content count
  const totalContent = Object.values(AUDIO_CONTENT).reduce((sum, items) => sum + items.length, 0);
  console.log(`📊 Content summary:`);
  console.log(`   - Letters: ${AUDIO_CONTENT.letters.length} (Turkish alphabet)`);
  console.log(`   - Words: ${AUDIO_CONTENT.words.length} (heceler, kelimeler)`);
  console.log(`   - Sentences: ${AUDIO_CONTENT.sentences.length} (yönlendirmeler)`);
  console.log(`   - Celebrations: ${AUDIO_CONTENT.celebrations.length} (kutlamalar)`);
  console.log(`   - Total per voice: ${totalContent} files`);
  console.log(`   - Total for 7 voices: ${totalContent * TURKISH_VOICES.length} files\n`);
  
  // Generate for each voice
  for (let i = 0; i < TURKISH_VOICES.length; i++) {
    const voice = TURKISH_VOICES[i];
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🎯 Voice ${i + 1}/${TURKISH_VOICES.length}: ${voice.name}`);
    console.log(`${'='.repeat(70)}`);
    
    try {
      const stats = await generateVoiceAudioFiles(voice);
      grandTotalFiles += stats.totalFiles;
      grandSuccessCount += stats.successCount;
      grandErrorCount += stats.errorCount;
      
    } catch (error) {
      console.error(`❌ Fatal error processing ${voice.name}:`, error.message);
      grandErrorCount += totalContent;
      grandTotalFiles += totalContent;
    }
  }
  
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  // Final summary
  console.log('\n' + '═'.repeat(70));
  console.log('🎉 MULTI-VOICE TURKISH AUDIO GENERATION COMPLETED!');
  console.log('═'.repeat(70));
  console.log(`📊 Final Statistics:`);
  console.log(`   🏁 Total files: ${grandTotalFiles}`);
  console.log(`   ✅ Success: ${grandSuccessCount}`);
  console.log(`   ❌ Errors: ${grandErrorCount}`);
  console.log(`   ⏱️  Duration: ${duration} seconds`);
  console.log(`   📁 Files organized in: public/audio/voices/`);
  console.log(`   🎭 Voices available:`);
  
  TURKISH_VOICES.forEach(voice => {
    console.log(`      - ${voice.name} (${voice.gender}) -> /voices/${voice.slug}/`);
  });
  
  console.log(`   🎯 Content types per voice:`);
  console.log(`      - letters/ (${AUDIO_CONTENT.letters.length} files)`);
  console.log(`      - words/ (${AUDIO_CONTENT.words.length} files)`);
  console.log(`      - sentences/ (${AUDIO_CONTENT.sentences.length} files)`);
  console.log(`      - celebrations/ (${AUDIO_CONTENT.celebrations.length} files)`);
  
  console.log(`\n🔧 Usage in code:`);
  console.log(`   // Voice selection example`);
  console.log(`   const audioPath = '/audio/voices/gulsu/letters/a.mp3';`);
  console.log(`   const audioPath = '/audio/voices/eda-atlas/words/elma.mp3';`);
  console.log(`   const audioPath = '/audio/voices/yusuf-suratli/sentences/baslayal-m.mp3';`);
  
  if (grandErrorCount === 0) {
    console.log(`\n🎉 Perfect! All ${grandSuccessCount} files generated successfully!`);
  } else {
    console.log(`\n⚠️  Generated ${grandSuccessCount}/${grandTotalFiles} files with ${grandErrorCount} errors.`);
  }
  
  console.log('\n🎵 Multi-voice Turkish audio system ready for Kıvılcım platform!');
}

// Error handling and execution
if (require.main === module) {
  generateAllVoicesAudioFiles()
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = {
  generateAllVoicesAudioFiles,
  TURKISH_VOICES,
  AUDIO_CONTENT
}; 