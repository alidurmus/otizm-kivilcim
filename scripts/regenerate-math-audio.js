const https = require('https');
const fs = require('fs');

async function regenerateAudio() {
  const API_KEY = process.env.ELEVENLABS_API_KEY;
  if (!API_KEY) {
    console.log('❌ ElevenLabs API key not found');
    return;
  }

  // Antoni voice for sentences (matematik modülü kuralları)
  const ANTONI_VOICE_ID = 'ErXwobaYiN019PkySvjV';
  
  const text = 'Matematik Dünyası modülüne hoş geldin! Sayıları öğren ve temel matematik becerilerini geliştir.';
  
  console.log('🔄 Generating matematik-dunyasi-hosgeldin.mp3 with Antoni voice...');
  console.log('📝 Text:', text);
  
  const postData = JSON.stringify({
    text: text,
    model_id: 'eleven_turbo_v2_5',
    voice_settings: {
      stability: 0.75,
      similarity_boost: 0.85,
      style: 0.3,
      use_speaker_boost: true
    }
  });

  const options = {
    hostname: 'api.elevenlabs.io',
    port: 443,
    path: `/v1/text-to-speech/${ANTONI_VOICE_ID}`,
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`❌ HTTP ${res.statusCode}: ${res.statusMessage}`);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        try {
          const audioBuffer = Buffer.concat(chunks);
          
          // Backup old file
          try {
            fs.renameSync('public/audio/sentences/matematik-dunyasi-hosgeldin.mp3', 'public/audio/sentences/matematik-dunyasi-hosgeldin-old.mp3');
            console.log('📁 Backed up old corrupted file');
          } catch (e) {
            console.log('⚠️ Could not backup old file (might not exist)');
          }
          
          fs.writeFileSync('public/audio/sentences/matematik-dunyasi-hosgeldin.mp3', audioBuffer);
          
          const stats = fs.statSync('public/audio/sentences/matematik-dunyasi-hosgeldin.mp3');
          console.log(`✅ Generated: matematik-dunyasi-hosgeldin.mp3 (${stats.size} bytes)`);
          console.log(`🎭 Voice: Antoni (sentence type, matematik module rules)`);
          
          resolve();
        } catch (error) {
          console.error('❌ Error writing file:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

regenerateAudio().catch(console.error); 