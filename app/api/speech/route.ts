import { NextRequest, NextResponse } from 'next/server';
import { speechRequestSchema, validateData } from '@/lib/validation';
import { getTurkishFemaleVoices, getTurkishMaleVoices, getAllTurkishVoices } from '@/lib/elevenlabs';
import { z } from 'zod';

// Rate limiting - Simple in-memory store for MVP
// Production'da Redis veya database kullanılmalı
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = parseInt(process.env.API_RATE_LIMIT_MAX || '60'); // 60 requests
const RATE_LIMIT_WINDOW = parseInt(process.env.API_RATE_LIMIT_WINDOW || '60000'); // 1 minute

function getRateLimitKey(request: NextRequest): string {
  // IP-based rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `speech:${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  const current = rateLimitMap.get(key);
  
  if (!current || current.lastReset < windowStart) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  
  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  
  current.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - current.count };
}

// Zod validation schemas for input validation
const SpeechRequestSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(500, 'Text too long (max 500 characters)')
    .regex(/^[a-zA-ZçğıöşüÇĞIİÖŞÜ0-9\s.,!?:-]+$/, 'Text contains invalid characters'),
  voiceId: z.string()
    .regex(/^[a-zA-Z0-9]+$/, 'Invalid voice ID format')
    .optional(),
  type: z.enum(['letter', 'word', 'sentence', 'celebration'])
    .default('sentence'),
  settings: z.object({
    stability: z.number().min(0).max(1).optional(),
    similarity_boost: z.number().min(0).max(1).optional(),
    style: z.number().min(0).max(1).optional(),
    use_speaker_boost: z.boolean().optional()
  }).optional(),
  language: z.literal('tr').default('tr')
});

// Type definitions
interface SpeechRequest {
  text: string;
  type: 'letter' | 'word' | 'sentence' | 'celebration';
  voiceId?: string;
}

// Voice configurations optimized for children with autism - Cinsiyet dengeleyici
const VOICE_CONFIGS = {
  letter: {
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - sakin ve açık erkek ses (harf öğrenme için ideal)
    stability: 0.8,
    similarityBoost: 0.9,
    style: 0.3,
    useSpeakerBoost: true
  },
  word: {
    voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel - profesyonel bayan ses (kelimeler için)
    stability: 0.7,
    similarityBoost: 0.8,
    style: 0.4,
    useSpeakerBoost: true
  },
  sentence: {
    voiceId: 'ErXwobaYiN019PkySvjV', // Antoni - derin ve hikayeci erkek ses (cümleler için)
    stability: 0.6,
    similarityBoost: 0.7,
    style: 0.5,
    useSpeakerBoost: true
  },
  celebration: {
    voiceId: 'VR6AewLTigWG4xSOukaG', // Josh - eğlenceli erkek ses (kutlamalar için)
    stability: 0.4,
    similarityBoost: 0.5,
    style: 0.8,
    useSpeakerBoost: true
  }
};

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (Date.now() + RATE_LIMIT_WINDOW).toString()
          }
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Input validation with Zod
    const validation = validateData(SpeechRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: `Validation error: ${validation.error}` },
        { 
          status: 400,
          headers: {
            'X-RateLimit-Remaining': rateLimit.remaining.toString()
          }
        }
      );
    }
    
    const { text, type, voiceId } = validation.data as SpeechRequest;

    // Get API key from environment - SECURE server-side only
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error('ElevenLabs API key not configured');
      return NextResponse.json(
        { error: 'Speech service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Get voice configuration
    const config = VOICE_CONFIGS[type];
    const selectedVoiceId = voiceId || config.voiceId;

    // Call ElevenLabs API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const elevenLabsResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
            'User-Agent': 'Kivilcim/1.0',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2_5',
            voice_settings: {
              stability: config.stability,
              similarity_boost: config.similarityBoost,
              style: config.style,
              use_speaker_boost: config.useSpeakerBoost
            },
            language: 'tr'
          })
        }
      );

      clearTimeout(timeoutId);

      if (!elevenLabsResponse.ok) {
        const errorText = await elevenLabsResponse.text().catch(() => 'Unknown error');
        console.error('ElevenLabs API error:', {
          status: elevenLabsResponse.status,
          statusText: elevenLabsResponse.statusText,
          error: errorText,
          text: text.substring(0, 100), // Log first 100 chars for debugging
          type,
          voiceId: selectedVoiceId
        });
        
        // Don't expose internal errors to client
        const clientError = elevenLabsResponse.status === 401 
          ? 'Authentication failed'
          : elevenLabsResponse.status === 429
          ? 'Service temporarily busy'
          : 'Speech generation failed';
          
        return NextResponse.json(
          { error: clientError },
          { 
            status: elevenLabsResponse.status >= 500 ? 503 : 400,
            headers: {
              'X-RateLimit-Remaining': rateLimit.remaining.toString()
            }
          }
        );
      }

      // Get audio data
      const audioBuffer = await elevenLabsResponse.arrayBuffer();

      // Return audio with proper headers
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=3600, s-maxage=7200', // Cache for 1 hour, CDN for 2 hours
          'Content-Length': audioBuffer.byteLength.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          // Security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
        },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout' },
          { status: 408 }
        );
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Speech API error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint with all Turkish voices info (male + female)
export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const turkishVoices = getAllTurkishVoices(); // Hem erkek hem bayan sesler
  
  return NextResponse.json({
    status: 'ok',
    service: 'speech-api',
    configured: !!apiKey,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    rateLimits: {
      maxRequests: RATE_LIMIT_MAX,
      windowMs: RATE_LIMIT_WINDOW
    },
    voices: turkishVoices.map(voice => ({
      id: voice.id,
      name: voice.name,
      description: voice.description,
      language: voice.language,
      gender: voice.gender,
      age: voice.age,
      traits: voice.traits,
      bestFor: voice.bestFor
    })),
    voiceStats: {
      total: turkishVoices.length,
      female: getTurkishFemaleVoices().length,
      male: getTurkishMaleVoices().length
    },
    voiceConfig: {
      letter: VOICE_CONFIGS.letter.voiceId,
      word: VOICE_CONFIGS.word.voiceId, 
      sentence: VOICE_CONFIGS.sentence.voiceId,
      celebration: VOICE_CONFIGS.celebration.voiceId
    }
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Content-Type-Options': 'nosniff'
    }
  });
} 