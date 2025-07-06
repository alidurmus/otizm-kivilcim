// Recreate ALL Audio Files with Gülsu Default Voice
// Bu script platformdaki TÜM ses dosyalarını tutarlı Gülsu sesi ile yeniden oluşturur
// Otizm dostu tutarlı ses deneyimi için gerekli

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Gülsu Default Voice Configuration (Aria - Otizm dostu)
const GULSU_VOICE = {
  id: '9BWtsMINqrJLrRacOk9x', // Aria voice - Turkish optimized
  name: 'Gülsu',
  description: 'Türkiye için özel optimize edilmiş nazik ve sakin kadın sesi',
  settings: {
    stability: 0.75,         // Sakin ve tutarlı
    similarity_boost: 0.85,  // Net telaffuz
    style: 0.3,              // Doğal ama sakin
    use_speaker_boost: true  // Netlik için
  }
};

// Türk alfabesi harfleri (29 harf)
const TURKISH_LETTERS = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
];

// Temel kelimeler
const BASIC_WORDS = [
  // Aile
  'anne', 'baba', 'mama', 'dede', 'nene', 'abla', 'abi', 'kardeş',
  
  // Hayvanlar 
  'kedi', 'köpek', 'kuş', 'balık', 'tavşan', 'aslan', 'koala', 'kurbağa',
  
  // Yiyecekler
  'elma', 'armut', 'muz', 'ekmek', 'su', 'süt', 'çikolata',
  
  // Heceler 
  'el', 'al', 'ol', 'ul', 'il', 'at', 'et', 'it', 'ot', 'ut',
  
  // Temel objeler
  'ev', 'araba', 'top', 'kitap', 'masa', 'sandalye', 'yatak',
  
  // Renkler
  'kırmızı', 'mavi', 'sarı', 'yeşil', 'turuncu', 'mor', 'pembe', 'siyah', 'beyaz',
  
  // Sayılar
  'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on',
  
  // Özel hafıza oyunu kelimeleri
  'bu hece', 'ok'
];

// Yönlendirme cümleleri
const INSTRUCTION_SENTENCES = [
  'Alfabe okuma modülüne hoş geldin! Türk alfabesinin 29 harfini birlikte öğreneceğiz.',
  'Bu duygu!',
  'Bu hayvan!', 
  'Bu hece!',
  'Bu renk!',
  'Bu sayı!',
  'Bu şekil!',
  'Çok iyi!',
  'Harika!',
  'Harika bir eşleştirme!',
  'Hayvan sesi!',
  'İletişim becerisi!',
  'Sonraki adım!',
  'Tekrar dene!',
  'Yanlış!',
  'Başlayalım!',
  'Hangi harfi duyduğunu söyle!',
  'Doğru! Harika iş çıkardın!',
  'Tebrikler! Alfabeyi öğrendin!',
  'Şimdi bir sonraki harf!',
  'Çok güzel! Devam et!',
  'Bu harfi biliyorsun!',
  'Mükemmel telaffuz!',
  'Alfabe ustası oldun!',
  'Bu harf ile başlayan kelimeleri düşün!',
  'Hadi birlikte söyleyelim!'
];

// Kutlama mesajları  
const CELEBRATION_MESSAGES = [
  'Aferin sana!',
  'Bravo!',
  'Çok başarılısın! Harika iş!',
  'Harikasın! Çok güzel yaptın!',
  'Mükemmel! Devam et!',
  'Süper! İş çıkardın!',
  'Tebrikler!',
  'Çok güzel yaptın!',
  'Harika bir çalışma!',
  'Başarıyla tamamladın!',
  'Bravo! Mükemmel bir çalışma!',
  'Süpersin! Devam et böyle!',
  'Çok başarılısın! Harika iş!',
  'Harika! Eşleştirmeyi buldun!',
  'Tebrikler! Tüm kelimeleri buldun!',
  'Tebrikler! Tüm eşleştirmeleri buldun!',
  'Doğru! Harika iş çıkardın!',
  'Harika! Doğru yere koydun!',
  'Tebrikler! Yapbozu tamamladın! Çok başarılısın!',
  'Bravo! Heceler çok güzel!',
  'Süper! Bir sonraki hece!',
  'Mükemmel! Devam et!',
  'Harikasın! Çok güzel!',
  'Çok iyi! Başarılısın!',
  'Tebrikler! Tüm kelimeler!'
];

// Türkçe karakter URL-safe dönüşümü
function turkishToFilename(text) {
  return text.toLowerCase()
    .replace(/ç/g, 'ch')
    .replace(/ğ/g, 'gh')
    .replace(/ı/g, 'ii')
    .replace(/ö/g, 'oo')
    .replace(/ş/g, 'sh')
    .replace(/ü/g, 'uu')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
}

// Dizin oluştur
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Dizin oluşturuldu: ${dirPath}`);
  }
}

// Fetch API ile ElevenLabs TTS
async function generateAudioWithFetch(text) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${GULSU_VOICE.id}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: GULSU_VOICE.settings
    })
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
  }

  return await response.arrayBuffer();
}

// Tek ses dosyası oluştur
async function generateAudioFile(text, outputPath, contentType) {
  // Dosya zaten varsa atla (force mode değilse)
  if (fs.existsSync(outputPath) && !process.argv.includes('--force')) {
    console.log(`⏩ Atlandı: ${path.basename(outputPath)} (zaten var)`);
    return { success: true, skipped: true };
  }

  try {
    console.log(`🎵 Oluşturuluyor: "${text}" → ${path.basename(outputPath)}`);
    
    // Fetch API ile Gülsu voice kullanarak ses oluştur
    const audioArrayBuffer = await generateAudioWithFetch(text);
    const audioBuffer = Buffer.from(audioArrayBuffer);
    
    // MP3 dosyasını kaydet
    fs.writeFileSync(outputPath, audioBuffer);
    
    console.log(`✅ Başarılı: ${path.basename(outputPath)} (${Math.round(audioBuffer.length / 1024)}KB)`);
    return { success: true, skipped: false, size: audioBuffer.length };
    
  } catch (error) {
    console.error(`❌ Hata: ${path.basename(outputPath)} - ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Harf dosyalarını oluştur
async function createLetterFiles(stats) {
  console.log('\n🔤 Türk Alfabesi Harflerini Oluşturuluyor (29 harf)...');
  const outputDir = 'public/audio/letters';
  ensureDirectoryExists(outputDir);

  for (let i = 0; i < TURKISH_LETTERS.length; i++) {
    const letter = TURKISH_LETTERS[i];
    const filename = `${turkishToFilename(letter)}.mp3`;
    const outputPath = path.join(outputDir, filename);
    
    const result = await generateAudioFile(letter, outputPath, 'letter');
    if (result.success && !result.skipped) {
      stats.created.letters++;
      stats.totalSize += result.size || 0;
    } else if (result.skipped) {
      stats.skipped.letters++;
    } else {
      stats.failed.letters++;
    }
    
    // Rate limiting - ElevenLabs API koruması
    if (i < TURKISH_LETTERS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
}

// Kelime dosyalarını oluştur
async function createWordFiles(stats) {
  console.log('\n📝 Temel Kelimeleri Oluşturuluyor...');
  const outputDir = 'public/audio/words';
  ensureDirectoryExists(outputDir);

  for (let i = 0; i < BASIC_WORDS.length; i++) {
    const word = BASIC_WORDS[i];
    const filename = `${turkishToFilename(word)}.mp3`;
    const outputPath = path.join(outputDir, filename);
    
    const result = await generateAudioFile(word, outputPath, 'word');
    if (result.success && !result.skipped) {
      stats.created.words++;
      stats.totalSize += result.size || 0;
    } else if (result.skipped) {
      stats.skipped.words++;
    } else {
      stats.failed.words++;
    }
    
    // Rate limiting
    if (i < BASIC_WORDS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
}

// Yönlendirme cümlelerini oluştur
async function createSentenceFiles(stats) {
  console.log('\n💬 Yönlendirme Cümlelerini Oluşturuluyor...');
  const outputDir = 'public/audio/sentences';
  ensureDirectoryExists(outputDir);

  for (let i = 0; i < INSTRUCTION_SENTENCES.length; i++) {
    const sentence = INSTRUCTION_SENTENCES[i];
    const filename = `${turkishToFilename(sentence)}.mp3`;
    const outputPath = path.join(outputDir, filename);
    
    const result = await generateAudioFile(sentence, outputPath, 'sentence');
    if (result.success && !result.skipped) {
      stats.created.sentences++;
      stats.totalSize += result.size || 0;
    } else if (result.skipped) {
      stats.skipped.sentences++;
    } else {
      stats.failed.sentences++;
    }
    
    // Rate limiting
    if (i < INSTRUCTION_SENTENCES.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Kutlama mesajlarını oluştur
async function createCelebrationFiles(stats) {
  console.log('\n🎉 Kutlama Mesajlarını Oluşturuluyor...');
  const outputDir = 'public/audio/celebrations';
  ensureDirectoryExists(outputDir);

  for (let i = 0; i < CELEBRATION_MESSAGES.length; i++) {
    const celebration = CELEBRATION_MESSAGES[i];
    const filename = `${turkishToFilename(celebration)}.mp3`;
    const outputPath = path.join(outputDir, filename);
    
    const result = await generateAudioFile(celebration, outputPath, 'celebration');
    if (result.success && !result.skipped) {
      stats.created.celebrations++;
      stats.totalSize += result.size || 0;
    } else if (result.skipped) {
      stats.skipped.celebrations++;
    } else {
      stats.failed.celebrations++;
    }
    
    // Rate limiting
    if (i < CELEBRATION_MESSAGES.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
}

// Ana fonksiyon
async function recreateAllAudioWithGulsu() {
  const startTime = Date.now();
  
  console.log('🎙️ Gülsu Default Voice ile TÜM Ses Dosyaları Yeniden Oluşturuluyor...\n');
  console.log(`🎭 Ses Karakteri: ${GULSU_VOICE.name} (${GULSU_VOICE.id})`);
  console.log(`🎯 Hedef: Tutarlı otizm dostu ses deneyimi`);
  console.log(`📊 Toplam Hedef: ${TURKISH_LETTERS.length + BASIC_WORDS.length + INSTRUCTION_SENTENCES.length + CELEBRATION_MESSAGES.length} dosya\n`);
  
  if (process.argv.includes('--force')) {
    console.log('🔄 FORCE MODE: Mevcut dosyalar üzerine yazılacak\n');
  }

  const stats = {
    created: { letters: 0, words: 0, sentences: 0, celebrations: 0 },
    skipped: { letters: 0, words: 0, sentences: 0, celebrations: 0 },
    failed: { letters: 0, words: 0, sentences: 0, celebrations: 0 },
    totalSize: 0
  };

  try {
    // API anahtarı kontrolü
    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('❌ ELEVENLABS_API_KEY environment variable bulunamadı!');
      console.log('💡 .env.local dosyasında ELEVENLABS_API_KEY=your_key_here ekleyin');
      return;
    }

    // Sıralı oluşturma
    await createLetterFiles(stats);
    await createWordFiles(stats);
    await createSentenceFiles(stats);
    await createCelebrationFiles(stats);

    // Özet rapor
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    const totalCreated = Object.values(stats.created).reduce((a, b) => a + b, 0);
    const totalSkipped = Object.values(stats.skipped).reduce((a, b) => a + b, 0);
    const totalFailed = Object.values(stats.failed).reduce((a, b) => a + b, 0);

    console.log('\n🎊 Gülsu Voice Ses Dosyası Yeniden Oluşturma Tamamlandı!\n');
    console.log('📊 İstatistikler:');
    console.log(`   ✅ Oluşturulan: ${totalCreated} dosya`);
    console.log(`   ⏩ Atlanan: ${totalSkipped} dosya (zaten var)`);
    console.log(`   ❌ Başarısız: ${totalFailed} dosya`);
    console.log(`   💾 Toplam boyut: ${Math.round(stats.totalSize / 1024 / 1024)}MB`);
    console.log(`   ⏱️ Süre: ${duration} saniye`);
    
    console.log('\n📋 Detay:');
    console.log(`   🔤 Harfler: ${stats.created.letters} oluşturuldu, ${stats.skipped.letters} atlandı`);
    console.log(`   📝 Kelimeler: ${stats.created.words} oluşturuldu, ${stats.skipped.words} atlandı`);
    console.log(`   💬 Cümleler: ${stats.created.sentences} oluşturuldu, ${stats.skipped.sentences} atlandı`);
    console.log(`   🎉 Kutlamalar: ${stats.created.celebrations} oluşturuldu, ${stats.skipped.celebrations} atlandı`);

    if (totalCreated > 0) {
      console.log('\n🎯 Başarı! Artık TÜM sesler Gülsu karakteri ile tutarlı!');
      console.log('🧩 Otizm dostu tek ses deneyimi sağlandı.');
      console.log('🔄 Development server restart önerilir: npm run dev');
    }

  } catch (error) {
    console.error('\n💥 Genel hata:', error);
    console.log('💡 API anahtarınızı ve internet bağlantınızı kontrol edin');
  }
}

// CLI kullanımı
if (require.main === module) {
  console.log('🎙️ Gülsu Default Voice - Tutarlı Ses Sistemi Oluşturucu\n');
  
  if (process.argv.includes('--help')) {
    console.log('Kullanım:');
    console.log('  node scripts/recreate-all-audio-gulsu.js           # Sadece eksik dosyalar');
    console.log('  node scripts/recreate-all-audio-gulsu.js --force   # Tüm dosyalar üzerine yaz');
    console.log('');
    process.exit(0);
  }
  
  recreateAllAudioWithGulsu();
}

module.exports = { recreateAllAudioWithGulsu }; 