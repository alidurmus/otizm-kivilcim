import { http, HttpResponse } from 'msw'

// Mock ElevenLabs API responses
const elevenLabsVoices = [
  {
    voice_id: 'mock-voice-1',
    name: 'Türkçe Erkek',
    category: 'premade',
    settings: {
      stability: 0.8,
      similarity_boost: 0.7,
      style: 0.0,
      use_speaker_boost: true
    }
  },
  {
    voice_id: 'mock-voice-2',
    name: 'Türkçe Kadın',
    category: 'premade',
    settings: {
      stability: 0.9,
      similarity_boost: 0.8,
      style: 0.1,
      use_speaker_boost: true
    }
  }
]

const mockAudioBuffer = new ArrayBuffer(1024)

export const handlers = [
  // Internal speech API endpoint
  http.post('/api/speech', async ({ request }) => {
    const body = await request.json() as { text: string; voice?: string; speed?: number }
    
    if (!body.text) {
      return new HttpResponse(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return new HttpResponse(mockAudioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }),

  // Get voices endpoint
  http.get('/api/speech', () => {
    return HttpResponse.json({
      voices: elevenLabsVoices
    })
  }),

  // Mock ElevenLabs direct API (for fallback testing)
  http.get('https://api.elevenlabs.io/v1/voices', () => {
    return HttpResponse.json({
      voices: elevenLabsVoices
    })
  }),

  http.post('https://api.elevenlabs.io/v1/text-to-speech/:voiceId', async ({ params, request }) => {
    const { voiceId } = params
    const body = await request.json() as { text: string; model_id?: string; voice_settings?: any }

    if (!body.text) {
      return new HttpResponse(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!voiceId || !elevenLabsVoices.find(v => v.voice_id === voiceId)) {
      return new HttpResponse(
        JSON.stringify({ error: 'Voice not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200))

    return new HttpResponse(mockAudioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    })
  }),

  // Mock error scenarios for testing
  http.post('/api/speech/error', () => {
    return new HttpResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }),

  // Mock rate limiting
  http.post('/api/speech/rate-limit', () => {
    return new HttpResponse(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }),

  // Mock network error
  http.post('/api/speech/network-error', () => {
    return HttpResponse.error()
  }),
] 