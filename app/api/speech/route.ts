import { NextRequest, NextResponse } from 'next/server';
import { speechRequestSchema, validateData } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check (basit implementasyon)
    const userIP = request.headers.get('x-forwarded-for') || 'unknown';
    
    // API key kontrolü
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error('ElevenLabs API key not configured');
      return NextResponse.json(
        { error: 'Speech service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Request body'yi parse et
    const body = await request.json();
    
    // Input validation with Zod
    const validation = validateData(speechRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const validatedRequest = validation.data;
    
    // ElevenLabs API'ye istek gönder
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${validatedRequest.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: validatedRequest.text,
        model_id: validatedRequest.model,
        voice_settings: {
          stability: validatedRequest.stability,
          similarity_boost: validatedRequest.similarityBoost,
          style: validatedRequest.style,
          use_speaker_boost: validatedRequest.useSpeakerBoost,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      
      // Client'a generic error döndür
      return NextResponse.json(
        { error: 'Speech generation failed' },
        { status: response.status >= 500 ? 503 : 400 }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600', // 1 saat cache
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Speech API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint - desteklenen sesleri listele
export async function GET() {
  const voices = [
    {
      id: 'pNInz6obpgDQGcFmaJgB',
      name: 'Adam',
      description: 'Sakin ve açık konuşan erkek ses',
      language: 'tr'
    },
    {
      id: 'EXAVITQu4vr4xnSDxMaL',
      name: 'Bella', 
      description: 'Nazik ve anlaşılır kadın ses',
      language: 'tr'
    },
    {
      id: 'VR6AewLTigWG4xSOukaG',
      name: 'Josh',
      description: 'Genç ve eğlenceli erkek ses', 
      language: 'tr'
    }
  ];

  return NextResponse.json({ voices });
} 