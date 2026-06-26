#!/usr/bin/env node
/**
 * Türkçe Ses Testi - ElevenLabs Turbo v2.5 Model
 * Amaç: En güncel model ile Türkçe telaffuz kalitesini test etmek
 * Kullanım: node scripts/test-turkish-voice.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Gülsu Voice Configuration (Memory'den: 2325882)
const GULSU_VOICE = {
  id: '9BWtsMINqrJLrRacOk9x', // Aria - Türkçe optimize
  name: 'Gülsu',
  settings: {
    stability: 0.75,        // Sakin ve tutarlı
    similarity_boost: 0.85, // Yüksek kalite
    style: 0.3,             // Doğal konuşma
    use_speaker_boost: true // Net telaffuz
  }
};

// Test metinleri - Türkçe karakter ve telaffuz kontrolü
const TEST_TEXTS = [
  {
    id: 'turkish_chars',
    text: 'Çünkü ğeçmiş öğretmen şüphe üzerinde',
    description: 'Türkçe karakterler: ç, ğ, ö, ü, ş'
  },
  {
    id: 'numbers',
    text: 'Bir iki üç dört beş altı yedi sekiz dokuz on',
    description: 'Sayılar 1-10'
  },
  {
    id: 'animals',
    text: 'Köpek kedi kuş balık tavşan kurbağa',
    description: 'Hayvan isimleri'
  },
  {
    id: 'colors',
    text: 'Kırmızı sarı yeşil mavi beyaz siyah',
    description: 'Renkler'
  },
  {
    id: 'sentence',
    text: 'Merhaba, benim adım Gülsu. Türkçe konuşuyorum.',
    description: 'Tam cümle'
  },
  {
    id: 'celebration',
    text: 'Harika! Çok güzel yaptın! Tebrikler!',
    description: 'Kutlama mesajı'
  }
];

async function testTurkishVoice() {
  console.log('🎙️ TÜRKÇE SES TESTİ - ElevenLabs Turbo v2.5');
  console.log('=' .repeat(50));
  
  // API key kontrolü
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('❌ HATA: ELEVENLABS_API_KEY bulunamadı!');
    console.error('💡 .env.local dosyasında API key\'i tanımlayın.');
    process.exit(1);
  }

  console.log('✅ API Key bulundu');
  console.log(`🎭 Voice: ${GULSU_VOICE.name} (${GULSU_VOICE.id})`);
  console.log(`🚀 Model: eleven_turbo_v2_5 (En güncel)`);
  console.log('');

  // Test klasörü oluştur
  const testDir = path.join(__dirname, '..', 'test-audio');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  let successCount = 0;
  const totalTests = TEST_TEXTS.length;

  for (const test of TEST_TEXTS) {
    console.log(`🧪 Test: ${test.description}`);
    console.log(`📝 Metin: "${test.text}"`);
    
    try {
      const startTime = Date.now();
      
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${GULSU_VOICE.id}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: test.text,
            model_id: 'eleven_turbo_v2_5', // EN GÜNCEL MODEL
            voice_settings: GULSU_VOICE.settings,
            language: 'tr' // Açık Türkçe belirtimi
          })
        }
      );

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        const audioFileName = `test_${test.id}_${Date.now()}.mp3`;
        const audioPath = path.join(testDir, audioFileName);
        
        fs.writeFileSync(audioPath, Buffer.from(audioBuffer));
        
        console.log(`✅ SUCCESS - ${responseTime}ms`);
        console.log(`📁 Dosya: ${audioFileName} (${(audioBuffer.byteLength / 1024).toFixed(1)} KB)`);
        successCount++;
      } else {
        const errorText = await response.text();
        console.log(`❌ FAIL - ${response.status}: ${response.statusText}`);
        console.log(`🔍 Hata: ${errorText.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    console.log('-'.repeat(40));
    
    // Rate limiting için bekle
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n📊 TEST SONUÇLARI:');
  console.log(`✅ Başarılı: ${successCount}/${totalTests}`);
  console.log(`📂 Test dosyaları: ${testDir}`);
  
  if (successCount > 0) {
    console.log('\n🎵 Test dosyalarını dinleyerek Türkçe telaffuz kalitesini kontrol edin!');
    console.log('🎯 Beklenen: Net Türkçe telaffuz, sessiz değil');
  }
  
  if (successCount === totalTests) {
    console.log('\n🎉 TÜM TESTLER BAŞARILI! Ses sistemi çalışıyor.');
  } else {
    console.log('\n⚠️ BAZI TESTLER BAŞARISIZ! Ses sistemi sorunları var.');
  }
}

// Çalıştır
testTurkishVoice().catch(console.error); 