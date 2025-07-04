import { elevenlabsClient, useElevenLabs } from '../../lib/elevenlabs'
import { renderHook, act } from '@testing-library/react'
import { server } from '../../src/mocks/server'
import { http, HttpResponse } from 'msw'

// Mock URL.createObjectURL since it's not available in Jest environment
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url')
global.URL.revokeObjectURL = jest.fn()

// Mock Audio constructor
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
})) as any

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('ElevenLabs Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null) // Default: sound enabled
  })

  describe('ElevenLabsClient', () => {
    describe('textToSpeech', () => {
      it('successfully converts text to speech', async () => {
        const text = 'Merhaba dünya'
        const audioUrl = await elevenlabsClient.textToSpeech(text)
        
        expect(audioUrl).toBe('mock-blob-url')
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(ArrayBuffer))
      })

      it('uses default voice ID when not specified', async () => {
        const text = 'Test mesajı'
        await elevenlabsClient.textToSpeech(text)
        
        // The request should be made with the default voice ID in the body
        expect(fetch).toHaveBeenCalledWith('/api/speech', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('pNInz6obpgDQGcFmaJgB') // default voice ID
        }))
      })

      it('uses custom voice options', async () => {
        const text = 'Test mesajı'
        const options = {
          voiceId: 'custom-voice-id',
          model: 'custom-model',
          stability: 0.8,
          similarityBoost: 0.9,
          style: 0.2,
          useSpeakerBoost: false
        }
        
        await elevenlabsClient.textToSpeech(text, options)
        
        expect(fetch).toHaveBeenCalledWith('/api/speech', expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('custom-voice-id')
        }))
      })

      it('handles API errors correctly', async () => {
        // Override the default handler to return an error
        server.use(
          http.post('/api/speech', () => {
            return new HttpResponse(
              JSON.stringify({ error: 'Voice not found' }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
          })
        )

        await expect(elevenlabsClient.textToSpeech('test')).rejects.toThrow('Server error: Voice not found')
      })

      it('handles network errors', async () => {
        // Override the default handler to return a network error
        server.use(
          http.post('/api/speech', () => {
            return HttpResponse.error()
          })
        )

        await expect(elevenlabsClient.textToSpeech('test')).rejects.toThrow('Ses oluşturulamadı')
      })
    })

    describe('getChildFriendlyVoices', () => {
      it('successfully fetches voices from API', async () => {
        const voices = await elevenlabsClient.getChildFriendlyVoices()
        
        expect(voices).toHaveLength(2)
        expect(voices[0]).toHaveProperty('voice_id', 'mock-voice-1')
        expect(voices[0]).toHaveProperty('name', 'Türkçe Erkek')
      })

      it('falls back to hardcoded voices when API fails', async () => {
        // Override the handler to return an error
        server.use(
          http.get('/api/speech', () => {
            return new HttpResponse(null, { status: 500 })
          })
        )

        const voices = await elevenlabsClient.getChildFriendlyVoices()
        
        expect(voices).toHaveLength(3)
        expect(voices[0]).toHaveProperty('id', 'pNInz6obpgDQGcFmaJgB')
        expect(voices[0]).toHaveProperty('name', 'Adam')
      })
    })

    describe('getExerciseVoiceSettings', () => {
      it('returns correct settings for different exercise types', () => {
        const settings = elevenlabsClient.getExerciseVoiceSettings()
        
        expect(settings).toHaveProperty('letter')
        expect(settings).toHaveProperty('word')
        expect(settings).toHaveProperty('sentence')
        expect(settings).toHaveProperty('celebration')
        
        // Letter settings should have high stability
        expect(settings.letter.stability).toBe(0.7)
        expect(settings.letter.similarityBoost).toBe(0.9)
        
        // Celebration settings should have high style
        expect(settings.celebration.style).toBe(0.8)
      })
    })
  })

  describe('useElevenLabs Hook', () => {
    it('successfully speaks text', async () => {
      const { result } = renderHook(() => useElevenLabs())
      
      await act(async () => {
        await result.current.speak('Merhaba')
      })
      
      expect(global.Audio).toHaveBeenCalledWith('mock-blob-url')
    })

    it('respects sound settings from localStorage', async () => {
      localStorageMock.getItem.mockReturnValue('false') // Sound disabled
      
      const { result } = renderHook(() => useElevenLabs())
      
      await act(async () => {
        await result.current.speak('Test mesajı')
      })
      
      // Audio should not be created when sound is disabled
      expect(global.Audio).not.toHaveBeenCalled()
    })

    it('uses correct voice settings for different text types', async () => {
      const { result } = renderHook(() => useElevenLabs())
      
      await act(async () => {
        await result.current.speak('A', 'letter', 'custom-voice')
      })
      
      // Should use letter-specific settings
      expect(fetch).toHaveBeenCalledWith('/api/speech', expect.objectContaining({
        body: expect.stringContaining('"stability":0.7') // Letter stability
      }))
    })

    it('falls back to Web Speech API on error', async () => {
      // Mock ElevenLabs to fail
      server.use(
        http.post('/api/speech', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const { result } = renderHook(() => useElevenLabs())
      
      await act(async () => {
        await result.current.speak('Test mesajı')
      })
      
      // Should call speechSynthesis.speak
      expect(global.speechSynthesis.speak).toHaveBeenCalled()
    })

    it('fetches voices correctly', async () => {
      const { result } = renderHook(() => useElevenLabs())
      
      let voices: any
      await act(async () => {
        voices = await result.current.getVoices()
      })
      
      expect(voices).toHaveLength(2)
      expect(voices[0]).toHaveProperty('name', 'Türkçe Erkek')
    })

    it('handles audio playback errors gracefully', async () => {
      // Mock Audio.play to reject
      const mockAudio = {
        play: jest.fn().mockRejectedValue(new Error('Playback failed')),
        addEventListener: jest.fn(),
      }
      ;(global.Audio as jest.Mock).mockImplementation(() => mockAudio)

      const { result } = renderHook(() => useElevenLabs())
      
      await act(async () => {
        await result.current.speak('Test mesajı')
      })
      
      // Should fallback to Web Speech API
      expect(global.speechSynthesis.speak).toHaveBeenCalled()
    })

    it('cleans up blob URLs after playback', async () => {
      const mockAudio = {
        play: jest.fn().mockResolvedValue(undefined),
        addEventListener: jest.fn((event, callback) => {
          if (event === 'ended') {
            // Simulate audio ending
            setTimeout(callback, 0)
          }
        }),
      }
      ;(global.Audio as jest.Mock).mockImplementation(() => mockAudio)

      const { result } = renderHook(() => useElevenLabs())
      
      await act(async () => {
        await result.current.speak('Test mesajı')
      })
      
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 10))
      
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-blob-url')
    })
  })

  describe('Error Handling', () => {
    it('handles rate limiting errors', async () => {
      server.use(
        http.post('/api/speech', () => {
          return new HttpResponse(
            JSON.stringify({ error: 'Rate limit exceeded' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          )
        })
      )

      await expect(elevenlabsClient.textToSpeech('test')).rejects.toThrow('Server error: Rate limit exceeded')
    })

    it('handles invalid JSON responses', async () => {
      server.use(
        http.post('/api/speech', () => {
          return new HttpResponse('Invalid JSON', { status: 400 })
        })
      )

      await expect(elevenlabsClient.textToSpeech('test')).rejects.toThrow('Server error: HTTP 400')
    })

    it('handles Web Speech API fallback failure', async () => {
      // Mock both ElevenLabs and Web Speech to fail
      server.use(
        http.post('/api/speech', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )
      
      global.speechSynthesis.speak = jest.fn(() => {
        throw new Error('Web Speech not supported')
      })

      const { result } = renderHook(() => useElevenLabs())
      
      await expect(async () => {
        await act(async () => {
          await result.current.speak('Test mesajı')
        })
      }).rejects.toThrow('Ses çalınamadı, tüm servisler başarısız oldu.')
    })
  })
}) 