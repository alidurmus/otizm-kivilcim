const { ElevenLabsApi } = require('@elevenlabs/elevenlabs-js');
const fs = require('fs').promises;
const path = require('path');

// Gülsu voice configuration (Aria voice optimized for Turkish)
const GULSU_VOICE = {
  id: '9BWtsMINqrJLrRacOk9x', // Aria voice ID for Turkish
  name: 'Gülsu',
  settings: {
    stability: 0.75,
    similarity_boost: 0.85,
    style: 0.3,
    use_speaker_boost: true
  }
};

const MISSING_CELEBRATIONS = [
  {
    filename: 'supersin-devam-et.mp3',
    text: 'Süpersin! Devam et!'
  },
  {
    filename: 'bravo-mukemmel-calisma.mp3', 
    text: 'Bravo! Mükemmel çalışma!'
  }
];

async function createMissingCelebrationAudio() {
  console.log('🎉 Eksik kutlama ses dosyaları oluşturuluyor...\n');
  
  // ElevenLabs API key kontrolü
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('❌ ELEVENLABS_API_KEY environment variable bulunamadı!');
    console.log('💡 .env.local dosyasında ELEVENLABS_API_KEY=your_key_here şeklinde tanımlayın.');
    process.exit(1);
  }

  const client = new ElevenLabsApi({
    apiKey: apiKey
  });

  const outputDir = path.join(__dirname, '..', 'public', 'audio', 'celebrations');
  
  console.log(`📁 Output directory: ${outputDir}\n`);

  for (let i = 0; i < MISSING_CELEBRATIONS.length; i++) {
    const celebration = MISSING_CELEBRATIONS[i];
    const outputPath = path.join(outputDir, celebration.filename);
    
    // Dosya zaten varsa atla
    try {
      await fs.access(outputPath);
      console.log(`⏭️  ${celebration.filename} zaten mevcut, atlanıyor...`);
      continue;
    } catch (error) {
      // Dosya yok, oluşturacağız
    }

    console.log(`🎵 [${i + 1}/${MISSING_CELEBRATIONS.length}] Oluşturuluyor: ${celebration.filename}`);
    console.log(`📝 Metin: "${celebration.text}"`);
    console.log(`🎭 Ses: ${GULSU_VOICE.name} (${GULSU_VOICE.id})`);

    try {
      // ElevenLabs SDK ile ses oluştur
      const audio = await client.textToSpeech({
        voice_id: GULSU_VOICE.id,
        text: celebration.text,
        model_id: 'eleven_turbo_v2_5', // EN GÜNCEL MODEL - Türkçe optimized
        voice_settings: GULSU_VOICE.settings
      });

      // Ses dosyasını kaydet
      const audioBuffer = Buffer.from(await audio.arrayBuffer());
      await fs.writeFile(outputPath, audioBuffer);
      
      console.log(`✅ Başarılı: ${celebration.filename} (${audioBuffer.length} bytes)`);
      console.log(`📁 Konum: ${outputPath}\n`);

      // Rate limiting - API koruma
      if (i < MISSING_CELEBRATIONS.length - 1) {
        console.log('⏳ 3 saniye bekleniyor... (Rate limiting)\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

    } catch (error) {
      console.error(`❌ Hata: ${celebration.filename}`, error.message);
      console.log(`💡 Devam ediliyor...\n`);
    }
  }

  console.log('🎊 Eksik kutlama ses dosyaları oluşturma tamamlandı!\n');
  console.log('📊 Özet:');
  
  // Son durum kontrolü
  for (const celebration of MISSING_CELEBRATIONS) {
    const outputPath = path.join(outputDir, celebration.filename);
    try {
      const stats = await fs.stat(outputPath);
      console.log(`✅ ${celebration.filename} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.log(`❌ ${celebration.filename} - Oluşturulamadı`);
    }
  }
  
  console.log('\n🚀 Development server restart önerilir.');
}

// Script'i çalıştır
if (require.main === module) {
  createMissingCelebrationAudio()
    .then(() => {
      console.log('✅ Script başarıyla tamamlandı!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script hatası:', error);
      process.exit(1);
    });
}

module.exports = { createMissingCelebrationAudio }; 