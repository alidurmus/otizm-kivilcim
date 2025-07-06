import { NextRequest, NextResponse } from 'next/server';

// ElevenLabs v3 test konfigürasyonu
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ElevenLabs API key not found in environment variables');
}

// Yeni Gülsu voice configuration
const GULSU_NEW_VOICE = {
  id: 'jbJMQWv1eS4YjQ6PCcn6',
  name: 'Gülsu',
  settings: {
    stability: 0.8,
    similarity_boost: 0.9,
    style: 0.3,
    use_speaker_boost: true
  }
};

// v3 Alpha modelleri
const V3_MODELS = [
  'eleven_turbo_v2_5',
  'eleven_flash_v2_5', 
  'eleven_multilingual_v2',
  'eleven_turbo_v3', // V3 model (potansiyel)
  'eleven_flash_v3'   // V3 Flash model (potansiyel)
];

export async function POST(request: NextRequest) {
  try {
    // API key kontrolü
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Request body parse
    const body = await request.json();
    const { 
      text, 
      voice_id = GULSU_NEW_VOICE.id, 
      model_id = 'eleven_turbo_v2_5',
      language = 'tr',
      voice_settings = GULSU_NEW_VOICE.settings
    } = body;

    // Input validation
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: 'Text too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    console.log(`🧪 ElevenLabs v3 Test - Model: ${model_id}, Voice: ${voice_id}, Text: "${text.substring(0, 50)}..."`);

    const startTime = Date.now();

    try {
      // Timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 saniye timeout

      // ElevenLabs v3 API çağrısı (fetch ile)
      const elevenLabsResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
            'User-Agent': 'Kivilcim-v3-Test/1.0',
          },
          body: JSON.stringify({
            text: text,
            model_id: model_id,
            voice_settings: {
              stability: voice_settings.stability,
              similarity_boost: voice_settings.similarity_boost,
              style: voice_settings.style,
              use_speaker_boost: voice_settings.use_speaker_boost
            },
            language_code: language, // v3'te language_code kullanılabilir
            // v3 Alpha özellikler (varsayımsal/experimental)
            pronunciation_dictionary_locators: [], // Türkçe telaffuz sözlüğü
            seed: Math.floor(Math.random() * 1000), // Reproducible results
            output_format: 'mp3_44100_128' // Yüksek kalite
          })
        }
      );

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (!elevenLabsResponse.ok) {
        const errorText = await elevenLabsResponse.text().catch(() => 'Unknown error');
        
        console.error(`❌ ElevenLabs v3 API Error:`, {
          status: elevenLabsResponse.status,
          statusText: elevenLabsResponse.statusText,
          model: model_id,
          voice: voice_id,
          error: errorText,
          responseTime
        });

        // Specific error handling for v3 alpha
        if (elevenLabsResponse.status === 404 && errorText.includes('model')) {
          return NextResponse.json(
            { 
              error: 'Model not found - v3 model may not be available yet',
              model: model_id,
              fallback: 'Try eleven_turbo_v2_5 instead',
              responseTime
            },
            { status: 422 }
          );
        }

        if (elevenLabsResponse.status === 404 && errorText.includes('voice')) {
          return NextResponse.json(
            { 
              error: 'Voice ID not found',
              voice_id: voice_id,
              details: errorText,
              responseTime
            },
            { status: 404 }
          );
        }

        if (elevenLabsResponse.status === 422) {
          return NextResponse.json(
            { 
              error: 'Unprocessable request - check model/voice compatibility',
              model: model_id,
              voice: voice_id,
              details: errorText,
              responseTime
            },
            { status: 422 }
          );
        }

        return NextResponse.json(
          { 
            error: 'Speech generation failed',
            details: errorText,
            model: model_id,
            responseTime
          },
          { status: elevenLabsResponse.status }
        );
      }

      console.log(`✅ ElevenLabs v3 Success - Model: ${model_id}, Response time: ${responseTime}ms`);

      // Audio data'yı buffer olarak al
      const audioBuffer = await elevenLabsResponse.arrayBuffer();
      const audioUint8 = new Uint8Array(audioBuffer);

      // Response headers
      const headers = new Headers({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioUint8.length.toString(),
        'X-Response-Time': responseTime.toString(),
        'X-Model-Used': model_id,
        'X-Voice-Used': voice_id,
        'X-Language': language,
        'X-Test-Mode': 'v3-experimental',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });

      return new NextResponse(audioUint8, {
        status: 200,
        headers
      });

    } catch (fetchError: any) {
      const responseTime = Date.now() - startTime;
      
      console.error(`❌ ElevenLabs v3 Fetch Error:`, {
        model: model_id,
        voice: voice_id,
        error: fetchError.message,
        responseTime
      });

      return NextResponse.json(
        { 
          error: 'Network error or timeout',
          details: fetchError.message,
          model: model_id,
          responseTime
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('❌ v3 Test API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET endpoint - Test bilgileri ve model status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const info = searchParams.get('info');

    if (info === 'voice') {
      return NextResponse.json({
        voice: GULSU_NEW_VOICE,
        models: V3_MODELS,
        features: [
          'Turkish language optimization',
          'v3 Model testing',
          'Enhanced pronunciation dictionary',
          'Reproducible seed generation',
          'High quality MP3 output (44.1kHz)',
          'Autism-friendly voice settings'
        ]
      });
    }

    if (info === 'models') {
      return NextResponse.json({
        available_models: V3_MODELS,
        recommended: 'eleven_turbo_v2_5',
        experimental: ['eleven_turbo_v3', 'eleven_flash_v3'],
        stable: ['eleven_turbo_v2_5', 'eleven_flash_v2_5'],
        legacy: ['eleven_multilingual_v2']
      });
    }

    return NextResponse.json({
      status: 'ElevenLabs v3 Test API Ready',
      voice_id: GULSU_NEW_VOICE.id,
      voice_name: GULSU_NEW_VOICE.name,
      supported_models: V3_MODELS,
      api_version: 'v3-test',
      language: 'Turkish (tr)',
      timestamp: new Date().toISOString(),
      test_endpoints: {
        voice_info: '/api/speech/v3-test?info=voice',
        model_info: '/api/speech/v3-test?info=models',
        generate_speech: 'POST /api/speech/v3-test'
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to get API info', details: error.message },
      { status: 500 }
    );
  }
} 