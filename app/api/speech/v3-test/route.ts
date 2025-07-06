import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsApi, ElevenLabs } from 'elevenlabs';

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
  'eleven_turbo_v3_alpha' // Varsayımsal v3 alpha
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

    // ElevenLabs client oluştur
    const client = new ElevenLabs({
      apiKey: ELEVENLABS_API_KEY,
    });

    const startTime = Date.now();

    try {
      // ElevenLabs v3 API çağrısı
      const audioResponse = await client.textToSpeech.convert(voice_id, {
        text: text,
        model_id: model_id,
        language_code: language, // v3'te language_code kullanılıyor
        voice_settings: {
          stability: voice_settings.stability,
          similarity_boost: voice_settings.similarity_boost,
          style: voice_settings.style,
          use_speaker_boost: voice_settings.use_speaker_boost
        },
        // v3 Alpha özellikler (varsayımsal)
        pronunciation_dictionary_locators: [], // Türkçe telaffuz sözlüğü
        seed: Math.floor(Math.random() * 1000), // Reproducible results
        output_format: 'mp3_44100_128' // Yüksek kalite
      });

      const responseTime = Date.now() - startTime;
      
      console.log(`✅ ElevenLabs v3 Success - Model: ${model_id}, Response time: ${responseTime}ms`);

      // Audio stream'i buffer'a çevir
      const chunks: Uint8Array[] = [];
      const reader = audioResponse.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      // Buffer'ları birleştir
      const audioBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        audioBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      // Response headers
      const headers = new Headers({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'X-Response-Time': responseTime.toString(),
        'X-Model-Used': model_id,
        'X-Voice-Used': voice_id,
        'X-Language': language,
        'X-Test-Mode': 'v3-alpha',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });

      return new NextResponse(audioBuffer, {
        status: 200,
        headers
      });

    } catch (elevenLabsError: any) {
      const responseTime = Date.now() - startTime;
      
      console.error(`❌ ElevenLabs v3 API Error:`, {
        model: model_id,
        voice: voice_id,
        error: elevenLabsError.message,
        responseTime
      });

      // Specific error handling for v3 alpha
      if (elevenLabsError.message?.includes('model not found') || 
          elevenLabsError.message?.includes('v3_alpha')) {
        return NextResponse.json(
          { 
            error: 'v3 Alpha model not yet available',
            details: elevenLabsError.message,
            fallback: 'Using v2.5 models instead',
            responseTime
          },
          { status: 422 }
        );
      }

      if (elevenLabsError.message?.includes('voice not found')) {
        return NextResponse.json(
          { 
            error: 'Voice ID not found',
            voice_id: voice_id,
            details: elevenLabsError.message,
            responseTime
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Speech generation failed',
          details: elevenLabsError.message,
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

// GET endpoint - Test bilgileri
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
          'v3 Alpha testing',
          'Enhanced pronunciation',
          'Real-time streaming (planned)',
          'Custom voice training (planned)'
        ]
      });
    }

    return NextResponse.json({
      status: 'ElevenLabs v3 Test API Ready',
      voice_id: GULSU_NEW_VOICE.id,
      supported_models: V3_MODELS,
      api_version: 'v3-alpha-test',
      language: 'Turkish (tr)',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to get API info', details: error.message },
      { status: 500 }
    );
  }
} 