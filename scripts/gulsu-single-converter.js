// Gülsu Voice - Single Sentence to MP3 Converter
// eleven_turbo_v2_5 modeli ile Türkçe optimizasyonu

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const readline = require('readline');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY environment variable is required');
  process.exit(1);
}

// Gülsu Voice Configuration
const GULSU_VOICE = {
  id: 'jbJMQWv1eS4YjQ6PCcn6',
  name: 'Gülsu',
  gender: 'female',
  language: 'Turkish'
};

// Voice Settings for different content types
const VOICE_SETTINGS = {
  sentence: {
    stability: 0.7,
    similarity_boost: 0.8,
    style: 0.4,
    use_speaker_boost: true
  },
  word: {
    stability: 0.8,
    similarity_boost: 0.9,
    style: 0.3,
    use_speaker_boost: true
  },
  celebration: {
    stability: 0.6,
    similarity_boost: 0.7,
    style: 0.6,
    use_speaker_boost: true
  }
};

// Generate audio using ElevenLabs API
async function generateAudio(text, contentType = 'sentence') {
  const url = `${ELEVENLABS_BASE_URL}/text-to-speech/${GULSU_VOICE.id}`;
  
  const settings = VOICE_SETTINGS[contentType] || VOICE_SETTINGS.sentence;
  
  const requestBody = {
    text: text,
    model_id: "eleven_turbo_v2_5",
    language_code: "tr",
    voice_settings: settings
  };

  try {
    console.log(`🎙️ Gülsu ile seslendiriliyor: "${text}"`);
    console.log(`📊 Settings: stability=${settings.stability}, similarity=${settings.similarity_boost}`);
    
    const response = await axios.post(url, requestBody, {
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      responseType: 'arraybuffer',
      timeout: 30000
    });

    if (response.status === 200) {
      console.log(`✅ Audio generated successfully (${response.data.byteLength} bytes)`);
      return response.data;
    } else {
      throw new Error(`API returned status: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Error generating audio: ${error.message}`);
    throw error;
  }
}

// Create safe filename from text
function createSafeFilename(text) {
  return text
    .toLowerCase()
    .replace(/[çğıöşü]/g, (match) => {
      const map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' };
      return map[match] || match;
    })
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

// Save audio to file
async function saveAudio(audioData, filename, outputDir = 'output') {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, audioData);
    
    console.log(`💾 Audio saved: ${filePath}`);
    console.log(`📁 File size: ${(audioData.length / 1024).toFixed(2)} KB`);
    
    return filePath;
  } catch (error) {
    console.error(`❌ Error saving file: ${error.message}`);
    throw error;
  }
}

// Interactive CLI interface
async function startInteractiveCLI() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n🎙️ GÜLSU VOICE - SINGLE MP3 CONVERTER');
  console.log('=====================================');
  console.log('Model: eleven_turbo_v2_5 (Turkish optimized)');
  console.log('Voice: Gülsu (female, energetic, sincere)');
  console.log('Language: Turkish (tr)\n');

  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  };

  try {
    while (true) {
      console.log('\n📝 Yeni Seslendirme:');
      
      // Get text input
      const text = await askQuestion('Metni girin (veya "quit" ile çıkış): ');
      
      if (text.toLowerCase() === 'quit' || text.toLowerCase() === 'çıkış') {
        console.log('👋 Güle güle!');
        break;
      }

      if (!text.trim()) {
        console.log('⚠️ Lütfen bir metin girin.');
        continue;
      }

      // Get content type
      console.log('\n📊 İçerik türünü seçin:');
      console.log('1. sentence (cümle/genel) - stability: 0.7');
      console.log('2. word (kelime) - stability: 0.8');
      console.log('3. celebration (kutlama) - stability: 0.6');
      
      const typeChoice = await askQuestion('Seçim (1-3, varsayılan 1): ') || '1';
      
      const contentTypes = {
        '1': 'sentence',
        '2': 'word', 
        '3': 'celebration'
      };
      
      const contentType = contentTypes[typeChoice] || 'sentence';

      // Get custom filename
      const suggestedFilename = createSafeFilename(text) + '.mp3';
      const customFilename = await askQuestion(`Dosya adı (varsayılan: ${suggestedFilename}): `) || suggestedFilename;
      
      const finalFilename = customFilename.endsWith('.mp3') ? customFilename : customFilename + '.mp3';

      try {
        console.log('\n🔄 İşlem başlatılıyor...');
        
        // Generate audio
        const startTime = Date.now();
        const audioData = await generateAudio(text, contentType);
        const generateTime = Date.now() - startTime;
        
        // Save to file
        const filePath = await saveAudio(audioData, finalFilename);
        
        console.log(`\n✅ BAŞARILI!`);
        console.log(`⏱️ Üretim süresi: ${generateTime}ms`);
        console.log(`📁 Dosya konumu: ${path.resolve(filePath)}`);
        console.log(`🎭 Voice: ${GULSU_VOICE.name} (${GULSU_VOICE.gender})`);
        console.log(`📊 İçerik türü: ${contentType}`);
        
      } catch (error) {
        console.error(`\n❌ HATA: ${error.message}`);
        console.log('🔄 Lütfen tekrar deneyin.');
      }
    }
  } finally {
    rl.close();
  }
}

// Main function
async function main() {
  console.log('🎙️ Gülsu Voice Converter başlatılıyor...');
  console.log(`🔑 API Key: ${ELEVENLABS_API_KEY ? 'Bulundu ✅' : 'Bulunamadı ❌'}`);
  
  if (!ELEVENLABS_API_KEY) {
    console.log('💡 .env.local dosyasında ELEVENLABS_API_KEY ayarlayın');
    process.exit(1);
  }

  await startInteractiveCLI();
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('\n👋 İşlem sonlandırıldı.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 İşlem sonlandırıldı.');
  process.exit(0);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the application
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateAudio, saveAudio, createSafeFilename }; 