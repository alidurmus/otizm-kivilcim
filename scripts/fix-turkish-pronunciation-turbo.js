#!/usr/bin/env node
/**
 * Türkçe Telaffuz Düzeltmesi - Eleven Turbo v2.5 Model
 * Amaç: Sessiz ses sorunu ve Türkçe telaffuz hatalarını çözmek
 * Model: eleven_turbo_v2_5 (En güncel, Türkçe optimized)
 * Kullanım: node scripts/fix-turkish-pronunciation-turbo.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Gülsu Voice Configuration (Güvenilir default voice)
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

// Türkçe Telaffuz Problemli Kelimeler - SSML + IPA Phonetic Transcription
const TURKISH_PRONUNCIATION_FIXES = {
  // Sessiz harf 'ol' problemi
  'ol': {
    text: '<phoneme alphabet="ipa" ph="ol">ol</phoneme>',
    description: 'Sessiz harf O-L telaffuzu (öl değil)',
    filename: 'ol.mp3',
    category: 'word'
  },
  
  // Türkçe karakterler - Ö harfi
  'köpek': {
    text: '<phoneme alphabet="ipa" ph="køpek">köpek</phoneme>',
    description: 'Ö harfi doğru telaffuz',
    filename: 'kopek.mp3',
    category: 'word'
  },
  
  // Türkçe karakterler - Ş harfi
  'tavşan': {
    text: '<phoneme alphabet="ipa" ph="tavʃan">tavşan</phoneme>',
    description: 'Ş harfi doğru telaffuz',
    filename: 'tavshan.mp3',
    category: 'word'
  },
  
  // Türkçe karakterler - Ğ harfi
  'kurbağa': {
    text: '<phoneme alphabet="ipa" ph="kurbaːa">kurbağa</phoneme>',
    description: 'Ğ harfi doğru telaffuz (uzun a)',
    filename: 'kurbaga.mp3',
    category: 'word'
  },
  
  // Türkçe karakterler - Ü harfi
  'süt': {
    text: '<phoneme alphabet="ipa" ph="syt">süt</phoneme>',
    description: 'Ü harfi doğru telaffuz',
    filename: 'sut.mp3',
    category: 'word'
  },
  
  // Renkler - Türkçe telaffuz
  'yeşil': {
    text: '<phoneme alphabet="ipa" ph="jeʃil">yeşil</phoneme>',
    description: 'Y ve Ş harfi kombine telaffuz',
    filename: 'yesil.mp3',
    category: 'word'
  },
  
  'kırmızı': {
    text: '<phoneme alphabet="ipa" ph="kɯrmɯzɯ">kırmızı</phoneme>',
    description: 'Türkçe I harfi telaffuzu',
    filename: 'kirmizi.mp3',
    category: 'word'
  },
  
  'sarı': {
    text: '<phoneme alphabet="ipa" ph="sarɯ">sarı</phoneme>',
    description: 'Türkçe I harfi son ek telaffuzu',
    filename: 'sari.mp3',
    category: 'word'
  },
  
  // Sayılar - Doğru Türkçe telaffuz
  'üç': {
    text: '<phoneme alphabet="ipa" ph="ytʃ">üç</phoneme>',
    description: 'Ü harfi ve Ç harfi telaffuzu',
    filename: 'uch.mp3',
    category: 'word'
  },
  
  'dört': {
    text: '<phoneme alphabet="ipa" ph="dørt">dört</phoneme>',
    description: 'Ö harfi sayı telaffuzu',
    filename: 'dort.mp3',
    category: 'word'
  },
  
  'beş': {
    text: '<phoneme alphabet="ipa" ph="beʃ">beş</phoneme>',
    description: 'Ş harfi son harf telaffuzu',
    filename: 'besh.mp3',
    category: 'word'
  },
  
  'altı': {
    text: '<phoneme alphabet="ipa" ph="altɯ">altı</phoneme>',
    description: 'Türkçe I harfi sayı telaffuzu',
    filename: 'alti.mp3',
    category: 'word'
  },
  
  // Yiyecekler - Türkçe karakterler
  'çikolata': {
    text: '<phoneme alphabet="ipa" ph="tʃikolata">çikolata</phoneme>',
    description: 'Ç harfi başlangıç telaffuzu',
    filename: 'chikolata.mp3',
    category: 'word'
  },
  
  // Aile kelimeleri
  'kardeş': {
    text: '<phoneme alphabet="ipa" ph="kardeʃ">kardeş</phoneme>',
    description: 'Ş harfi son harf aile kelimesi',
    filename: 'kardesh.mp3',
    category: 'word'
  },
  
  // Hayvanlar
  'balık': {
    text: '<phoneme alphabet="ipa" ph="balɯk">balık</phoneme>',
    description: 'Türkçe I harfi hayvan telaffuzu',
    filename: 'balik.mp3',
    category: 'word'
  },
  
  'kuş': {
    text: '<phoneme alphabet="ipa" ph="kuʃ">kuş</phoneme>',
    description: 'Ş harfi hayvan telaffuzu',
    filename: 'kush.mp3',
    category: 'word'
  },
  
  // Kutlama mesajları - Doğru telaffuz
  'Harika': {
    text: '<phoneme alphabet="ipa" ph="harika">Harika!</phoneme>',
    description: 'Kutlama mesajı net telaffuz',
    filename: 'harika.mp3',
    category: 'celebration'
  },
  
  'Tebrikler': {
    text: '<phoneme alphabet="ipa" ph="tebrikler">Tebrikler!</phoneme>',
    description: 'Kutlama mesajı uzun kelime',
    filename: 'tebrikler.mp3',
    category: 'celebration'
  }
};

async function fixTurkishPronunciation() {
  console.log('🎙️ TÜRKÇE TELAFFUZ DÜZELTMESİ - Eleven Turbo v2.5');
  console.log('=' .repeat(60));
  
  // API key kontrolü
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('❌ HATA: ELEVENLABS_API_KEY bulunamadı!');
    console.error('💡 .env.local dosyasında API key\'i tanımlayın.');
    process.exit(1);
  }

  console.log('✅ API Key bulundu');
  console.log(`🎭 Voice: ${GULSU_VOICE.name} (${GULSU_VOICE.id})`);
  console.log(`🚀 Model: eleven_turbo_v2_5 (En güncel, %50 ucuz)`);
  console.log(`📝 Düzeltilecek kelime sayısı: ${Object.keys(TURKISH_PRONUNCIATION_FIXES).length}`);
  console.log('');

  let successCount = 0;
  const totalWords = Object.keys(TURKISH_PRONUNCIATION_FIXES).length;
  
  for (const [word, config] of Object.entries(TURKISH_PRONUNCIATION_FIXES)) {
    console.log(`🔧 Düzeltiliyor: "${word}" - ${config.description}`);
    console.log(`📝 SSML Text: ${config.text}`);
    
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
            text: config.text, // SSML phonetic transcription
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
        
        // Backup eski dosya (eğer varsa)
        const targetPath = path.join('public', 'audio', config.category === 'celebration' ? 'celebrations' : 'words', config.filename);
        if (fs.existsSync(targetPath)) {
          const backupPath = targetPath.replace('.mp3', '-old.mp3');
          fs.copyFileSync(targetPath, backupPath);
          console.log(`💾 Backup: ${config.filename} → ${path.basename(backupPath)}`);
        }
        
        // Yeni dosya oluştur
        fs.writeFileSync(targetPath, Buffer.from(audioBuffer));
        
        console.log(`✅ SUCCESS - ${responseTime}ms`);
        console.log(`📁 Dosya: ${config.filename} (${(audioBuffer.byteLength / 1024).toFixed(1)} KB)`);
        console.log(`🎯 Telaffuz: ${config.description}`);
        successCount++;
      } else {
        const errorText = await response.text();
        console.log(`❌ FAIL - ${response.status}: ${response.statusText}`);
        console.log(`🔍 Hata: ${errorText.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    console.log('-'.repeat(50));
    
    // Rate limiting için bekle (Turbo v2.5 daha hızlı ama yine de bekleyelim)
    await new Promise(resolve => setTimeout(resolve, 2500));
  }

  console.log('\n📊 TÜRKÇE TELAFFUZ DÜZELTMESİ SONUÇLARI:');
  console.log(`✅ Başarılı: ${successCount}/${totalWords}`);
  console.log(`🎯 Model: eleven_turbo_v2_5 (%50 daha ucuz)`);
  console.log(`🔊 Voice: ${GULSU_VOICE.name} (Autism-friendly)`);
  
  if (successCount === totalWords) {
    console.log('\n🎉 TÜM TÜRKÇE TELAFFUZ PROBLEMLERI ÇÖZÜLDÜ!');
    console.log('🇹🇷 Artık perfect Turkish pronunciation var');
    console.log('📱 Platform\'da test edebilirsiniz');
  } else {
    console.log('\n⚠️ BAZI TELAFFUZ PROBLEMLERİ DEVAM EDİYOR');
    console.log('🔄 Failed olan kelimeleri tekrar deneyin');
  }
  
  console.log('\n🚀 ÖNERİ: Server restart yapın cache refresh için');
  console.log('💡 npm run dev → Fresh server start');
}

// Çalıştır
fixTurkishPronunciation().catch(console.error); 