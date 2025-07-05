// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { ElevenLabsApi } = require('@elevenlabs/elevenlabs-js');
const fs = require('fs');
const path = require('path');

// Gülsu voice configuration (Aria voice from ElevenLabs)
const GULSU_VOICE = {
  id: '9BWtsMINqrJLrRacOk9x',
  name: 'Gülsu',
  settings: {
    stability: 0.75,
    similarity_boost: 0.85,
    style: 0.3,
    use_speaker_boost: true
  }
};

// Hafıza oyununda eksik olan kelimeler
const vocabularyWords = [
  { word: 'tavşan', filename: 'tavshan.mp3' },
  { word: 'köpek', filename: 'kohpek.mp3' },
  { word: 'aslan', filename: 'aslan.mp3' },
  { word: 'kurbağa', filename: 'kurbaga.mp3' },
  { word: 'koala', filename: 'koala.mp3' }
];

async function createVocabularyAudioFiles() {
  console.log('🎙️ Gülsu ile Hafıza Oyunu Kelimeleri Oluşturuluyor...\n');
  
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY bulunamadı!');
    console.log('📝 .env.local dosyasında API key\'inizi kontrol edin.');
    return;
  }

  const client = new ElevenLabsApi({
    apiKey: process.env.ELEVENLABS_API_KEY
  });

  // Output directory
  const outputDir = path.join(__dirname, '..', 'public', 'audio', 'words');
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📁 Hedef klasör: ${outputDir}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const { word, filename } of vocabularyWords) {
    const filePath = path.join(outputDir, filename);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  ${filename} zaten mevcut, atlanıyor...`);
      continue;
    }

    try {
      console.log(`🎵 Oluşturuluyor: "${word}" → ${filename}`);
      
      // Generate audio with Gülsu voice
      const audioStream = await client.textToSpeech({
        voice_id: GULSU_VOICE.id,
        text: word,
        model_id: 'eleven_multilingual_v2',
        voice_settings: GULSU_VOICE.settings
      });

      // Convert stream to buffer
      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);

      // Save to file
      fs.writeFileSync(filePath, audioBuffer);
      
      console.log(`✅ Başarılı: ${filename} (${audioBuffer.length} bytes)`);
      successCount++;
      
      // Rate limiting - wait 3 seconds between requests
      if (vocabularyWords.indexOf({ word, filename }) < vocabularyWords.length - 1) {
        console.log('⏳ 3 saniye bekleniyor...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error) {
      console.error(`❌ Hata (${filename}):`, error.message);
      errorCount++;
    }
  }

  console.log('\n🎉 Gülsu Kelime Seslendirme Tamamlandı!');
  console.log(`✅ Başarılı: ${successCount} dosya`);
  console.log(`❌ Hatalı: ${errorCount} dosya`);
  
  if (successCount > 0) {
    console.log('\n🎯 Kullanım:');
    console.log('Hafıza oyununa git: http://localhost:3001/exercise/vocabulary');
    console.log('Kartlara tıkladığında Gülsu\'nun hayvan isimlerini söylemesini dinle!');
  }
}

// Run the script
if (require.main === module) {
  createVocabularyAudioFiles().catch(console.error);
}

module.exports = { createVocabularyAudioFiles }; 