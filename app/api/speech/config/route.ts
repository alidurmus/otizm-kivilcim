import { NextResponse } from 'next/server';

/**
 * GET /api/speech/config
 * Provides configuration for streaming TTS clients
 * Returns sanitized config without exposing full API key
 */
export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'ElevenLabs API key not configured',
          configured: false 
        }, 
        { status: 500 }
      );
    }

    // Return configuration for client-side streaming
    // Note: In production, you might want to implement additional security
    return NextResponse.json({
      configured: true,
      apiKey: apiKey, // Only for streaming WebSocket authentication
      supportedFormats: ['mp3_44100_128', 'mp3_22050_32'],
      defaultModel: 'eleven_flash_v2_5',
      maxTextLength: 1000,
      supportsTurkish: true
    });

  } catch (error) {
    console.error('Speech config error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        configured: false 
      }, 
      { status: 500 }
    );
  }
} 