#!/usr/bin/env node

/**
 * 🔊 KIVILCIM AUDIO GENERATION SCRIPT
 * 
 * Tüm sabit konuşmaları Gülsu sesi ile toplu MP3 üretme
 * Türkçe karakterleri destekler: ç, ğ, ı, ö, ş, ü
 * 
 * Kullanım:
 * node scripts/generate-audio-files.js
 * 
 * Ortam değişkenleri:
 * ELEVENLABS_API_KEY=sk-your-key-here
 */

const { ElevenLabsApi } = require('@elevenlabs/sdk');
const fs = require('fs');
const path = require('path');

// Gülsu Voice Configuration (Aria from ElevenLabs)
const GULSU_VOICE = {
  id: '9BWtsMINqrJLrRacOk9x', // Aria - Türkçe destekli
  name: 'Gülsu',
  settings: {
    stability: 0.75,
    similarity_boost: 0.85,
    style: 0.3,
    use_speaker_boost: true
  }
};

// Rate limiting - ElevenLabs API koruması
const RATE_LIMIT_DELAY = 3000; // 3 saniye bekleme

// Türkçe karakterleri dosya adına çevirme
function turkishToFilename(text) {
  return text
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Tüm sabit konuşmalar - audio-constants.ts'den kopyalandı
const ALL_STATIC_CONTENT = [
  // 29 Türkçe harf
  { text: 'a', filename: 'a.mp3', type: 'letter', category: 'letters' },
  { text: 'b', filename: 'b.mp3', type: 'letter', category: 'letters' },
  { text: 'c', filename: 'c.mp3', type: 'letter', category: 'letters' },
  { text: 'ç', filename: 'ç.mp3', type: 'letter', category: 'letters' },
  { text: 'd', filename: 'd.mp3', type: 'letter', category: 'letters' },
  { text: 'e', filename: 'e.mp3', type: 'letter', category: 'letters' },
  { text: 'f', filename: 'f.mp3', type: 'letter', category: 'letters' },
  { text: 'g', filename: 'g.mp3', type: 'letter', category: 'letters' },
  { text: 'ğ', filename: 'ğ.mp3', type: 'letter', category: 'letters' },
  { text: 'h', filename: 'h.mp3', type: 'letter', category: 'letters' },
  { text: 'ı', filename: 'ı.mp3', type: 'letter', category: 'letters' },
  { text: 'i', filename: 'i.mp3', type: 'letter', category: 'letters' },
  { text: 'j', filename: 'j.mp3', type: 'letter', category: 'letters' },
  { text: 'k', filename: 'k.mp3', type: 'letter', category: 'letters' },
  { text: 'l', filename: 'l.mp3', type: 'letter', category: 'letters' },
  { text: 'm', filename: 'm.mp3', type: 'letter', category: 'letters' },
  { text: 'n', filename: 'n.mp3', type: 'letter', category: 'letters' },
  { text: 'o', filename: 'o.mp3', type: 'letter', category: 'letters' },
  { text: 'ö', filename: 'ö.mp3', type: 'letter', category: 'letters' },
  { text: 'p', filename: 'p.mp3', type: 'letter', category: 'letters' },
  { text: 'r', filename: 'r.mp3', type: 'letter', category: 'letters' },
  { text: 's', filename: 's.mp3', type: 'letter', category: 'letters' },
  { text: 'ş', filename: 'ş.mp3', type: 'letter', category: 'letters' },
  { text: 't', filename: 't.mp3', type: 'letter', category: 'letters' },
  { text: 'u', filename: 'u.mp3', type: 'letter', category: 'letters' },
  { text: 'ü', filename: 'ü.mp3', type: 'letter', category: 'letters' },
  { text: 'v', filename: 'v.mp3', type: 'letter', category: 'letters' },
  { text: 'y', filename: 'y.mp3', type: 'letter', category: 'letters' },
  { text: 'z', filename: 'z.mp3', type: 'letter', category: 'letters' },

  // Temel heceler ve kelimeler
  { text: 'el', filename: 'el.mp3', type: 'word', category: 'syllables' },
  { text: 'al', filename: 'al.mp3', type: 'word', category: 'syllables' },
  { text: 'ol', filename: 'ol.mp3', type: 'word', category: 'syllables' },
  { text: 'anne', filename: 'anne.mp3', type: 'word', category: 'family' },
  { text: 'baba', filename: 'baba.mp3', type: 'word', category: 'family' },
  { text: 'elma', filename: 'elma.mp3', type: 'word', category: 'fruits' },
  { text: 'kedi', filename: 'kedi.mp3', type: 'word', category: 'animals' },
  { text: 'ev', filename: 'ev.mp3', type: 'word', category: 'objects' },

  // Kritik kutlama mesajları - eksik olan MP3'ler
  { text: 'Bravo! Mükemmel bir çalışma!', filename: 'bravo-mukemmel-calisma.mp3', type: 'celebration', category: 'literacy' },
  { text: 'Süpersin! Devam et böyle!', filename: 'supersin-devam-et.mp3', type: 'celebration', category: 'literacy' },
  { text: 'Harikasın! Çok güzel yaptın!', filename: 'harikasin-cok-guzel.mp3', type: 'celebration', category: 'literacy' },
  { text: 'Çok başarılısın! Harika iş!', filename: 'cok-basarilisin-harika-is.mp3', type: 'celebration', category: 'literacy' },

  // Ana sayfa diyalogları
  { text: "Merhaba! Kıvılcım'a hoş geldin! Birlikte öğrenmeye hazır mısın?", filename: 'hosgeldin-mesaji.mp3', type: 'sentence', category: 'homepage' },

  // Alfabe diyalogları
  { text: "Alfabe okuma modülüne hoş geldin! Türk alfabesinin 29 harfini birlikte öğreneceğiz.", filename: 'alfabe-hosgeldin.mp3', type: 'sentence', category: 'alphabet' },

  // Yönlendirme cümleleri
  { text: 'Başlayalım!', filename: 'baslayalim.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Harfleri birleştir.', filename: 'harfleri-birlestir.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Bu harfi söyle.', filename: 'bu-harfi-soyle.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Doğru yere sürükle.', filename: 'dogru-yere-surukle.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Tekrar dene.', filename: 'tekrar-dene.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Çok iyi!', filename: 'cok-iyi.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Devam et.', filename: 'devam-et.mp3', type: 'sentence', category: 'instructions' },

  // Sosyal iletişim
  { text: "Doğru!", filename: 'dogru.mp3', type: 'celebration', category: 'social' },
  { text: "Tekrar dene.", filename: 'tekrar-dene-social.mp3', type: 'sentence', category: 'social' },
  { text: "Tebrikler! Aktiviteyi tamamladın!", filename: 'aktivite-tamamlandi.mp3', type: 'celebration', category: 'social' },

  // Yazma-anlatım
  { text: "Tebrikler!", filename: 'tebrikler-yazma.mp3', type: 'celebration', category: 'writing' },
  { text: "kelimesini tamamladın!", filename: 'kelimesini-tamamladin.mp3', type: 'sentence', category: 'writing' },
  { text: "Tüm kelimeleri tamamladın! Harikasın!", filename: 'tum-kelimeleri-tamamladin.mp3', type: 'celebration', category: 'writing' }
];

// ElevenLabs client setup
let elevenLabsClient;

async function initializeClient() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ELEVENLABS_API_KEY environment variable gerekli!');
    console.log('   Örnek: ELEVENLABS_API_KEY=sk-your-key-here node scripts/generate-audio-files.js');
    process.exit(1);
  }

  elevenLabsClient = new ElevenLabsApi({
    apiKey: apiKey
  });

  console.log('✅ ElevenLabs client başlatıldı');
}

// Ses dosyası üretme fonksiyonu
async function generateAudioFile(item) {
  const outputPath = path.join('public/audio', item.category, item.filename);
  const dir = path.dirname(outputPath);
  
  // Dizin yoksa oluştur
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Dosya zaten varsa atla
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Atlandı: ${item.filename} (zaten var)`);
    return;
  }

  try {
    console.log(`🔊 Üretiliyor: "${item.text}" → ${item.filename}`);
    
    // ElevenLabs API ile ses üret
    const audio = await elevenLabsClient.textToSpeech({
      voiceId: GULSU_VOICE.id,
      text: item.text,
      modelId: 'eleven_turbo_v2_5', // EN GÜNCEL MODEL - Türkçe optimized
      voiceSettings: GULSU_VOICE.settings
    });

    // MP3 dosyasını kaydet
    const audioBuffer = Buffer.from(await audio.arrayBuffer());
    fs.writeFileSync(outputPath, audioBuffer);
    
    console.log(`✅ Başarılı: ${item.filename} (${audioBuffer.length} bytes)`);
    
  } catch (error) {
    console.error(`❌ Hata: ${item.filename} - ${error.message}`);
  }
}

// Ana çalıştırma fonksiyonu
async function main() {
  console.log('🎯 Kıvılcım - Toplu MP3 Üretici');
  console.log(`📊 Toplam ${ALL_STATIC_CONTENT.length} dosya üretilecek`);
  console.log(`🔊 Ses: ${GULSU_VOICE.name} (${GULSU_VOICE.id})`);
  console.log('⏱️  Rate limit: 3 saniye bekleme');
  console.log('');

  await initializeClient();

  // İstatistikler
  let generated = 0;
  const skipped = 0;
  let failed = 0;

  for (const [index, item] of ALL_STATIC_CONTENT.entries()) {
    const progress = Math.round(((index + 1) / ALL_STATIC_CONTENT.length) * 100);
    console.log(`[${index + 1}/${ALL_STATIC_CONTENT.length}] (${progress}%)`);
    
    try {
      await generateAudioFile(item);
      generated++;
    } catch (error) {
      console.error(`❌ Genel hata: ${error.message}`);
      failed++;
    }

    // Rate limiting - API koruması
    if (index < ALL_STATIC_CONTENT.length - 1) {
      console.log(`⏳ ${RATE_LIMIT_DELAY / 1000} saniye bekleniyor...`);
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
  }

  // Sonuç raporu
  console.log('');
  console.log('📊 SONUÇ RAPORU:');
  console.log(`✅ Üretilen: ${generated} dosya`);
  console.log(`⏭️  Atlanan: ${skipped} dosya`);
  console.log(`❌ Başarısız: ${failed} dosya`);
  console.log(`📁 Konum: public/audio/`);
  console.log('');
  
  if (failed === 0) {
    console.log('🎉 Tüm ses dosyaları başarıyla üretildi!');
  } else {
    console.log('⚠️  Bazı dosyalar üretilemedi. Lütfen hataları kontrol edin.');
  }
}

// Script çalıştır
if (require.main === module) {
  main().catch(console.error);
} 