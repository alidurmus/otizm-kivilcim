// Missing Audio Files Creator with Gülsu Voice
// Eksik ses dosyalarını toplu olarak oluşturur

const fs = require('fs');
const path = require('path');
const axios = require('axios');
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

// Missing files and their content
const MISSING_FILES = [
  {
    filename: 'hosgeldin-mesaji.mp3',
    text: 'Merhaba! Kıvılcım\'a hoş geldin! Birlikte öğrenmeye hazır mısın?',
    type: 'sentence',
    outputPath: 'public/audio/sentences/'
  },
  {
    filename: 'alfabe-hosgeldin.mp3', 
    text: 'Alfabe okuma modülüne hoş geldin! Türk alfabesinin 29 harfini birlikte öğreneceğiz.',
    type: 'sentence',
    outputPath: 'public/audio/sentences/'
  },
  {
    filename: 'cok-basarilisin-harika-is.mp3',
    text: 'Çok başarılısın! Harika iş çıkarıyorsun!',
    type: 'celebration',
    outputPath: 'public/audio/celebrations/'
  }
];

// Voice Settings for different content types
const VOICE_SETTINGS = {
  sentence: {
    stability: 0.7,
    similarity_boost: 0.8,
    style: 0.4,
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
    console.error(`❌ Error generating audio for "${text}": ${error.message}`);
    throw error;
  }
}

// Save audio to file
async function saveAudioFile(audioData, filename, outputPath) {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const filePath = path.join(outputPath, filename);
    fs.writeFileSync(filePath, audioData);
    
    console.log(`💾 Audio saved: ${filePath}`);
    console.log(`📁 File size: ${(audioData.length / 1024).toFixed(2)} KB`);
    
    return filePath;
  } catch (error) {
    console.error(`❌ Error saving file: ${error.message}`);
    throw error;
  }
}

// Main function to create all missing files
async function createMissingAudioFiles() {
  console.log('\n🎙️ GÜLSU VOICE - MISSING AUDIO FILES CREATOR');
  console.log('=============================================');
  console.log(`Voice: ${GULSU_VOICE.name} (${GULSU_VOICE.gender})`);
  console.log(`Model: eleven_turbo_v2_5 (Turkish optimized)`);
  console.log(`Files to create: ${MISSING_FILES.length}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (const fileInfo of MISSING_FILES) {
    try {
      console.log(`\n📝 Processing: ${fileInfo.filename}`);
      console.log(`📄 Text: "${fileInfo.text}"`);
      console.log(`🎯 Type: ${fileInfo.type}`);
      
      // Check if file already exists
      const fullPath = path.join(fileInfo.outputPath, fileInfo.filename);
      if (fs.existsSync(fullPath)) {
        console.log(`⚠️ File already exists, skipping: ${fullPath}`);
        successCount++;
        continue;
      }
      
      // Generate audio
      const audioData = await generateAudio(fileInfo.text, fileInfo.type);
      
      // Save to file
      await saveAudioFile(audioData, fileInfo.filename, fileInfo.outputPath);
      
      successCount++;
      console.log(`✅ ${fileInfo.filename} created successfully!`);
      
      // Small delay between requests to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed to create ${fileInfo.filename}: ${error.message}`);
      failCount++;
    }
  }

  const duration = Date.now() - startTime;
  
  console.log('\n🎉 BATCH CREATION COMPLETED!');
  console.log('============================');
  console.log(`✅ Successful: ${successCount}/${MISSING_FILES.length}`);
  console.log(`❌ Failed: ${failCount}/${MISSING_FILES.length}`);
  console.log(`⏱️ Total duration: ${(duration / 1000).toFixed(1)}s`);
  console.log(`🎭 Voice used: ${GULSU_VOICE.name} (${GULSU_VOICE.gender})`);
  
  if (successCount > 0) {
    console.log('\n📁 Files created in:');
    const uniquePaths = [...new Set(MISSING_FILES.map(f => f.outputPath))];
    uniquePaths.forEach(pathStr => {
      console.log(`   - ${pathStr}`);
    });
  }
  
  if (failCount === 0) {
    console.log('\n🎊 All missing audio files created successfully!');
    console.log('   Platform should now work without 404 errors.');
  }
}

// Handle process signals
process.on('SIGINT', () => {
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
  createMissingAudioFiles().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { createMissingAudioFiles, generateAudio, saveAudioFile }; 