class ElevenLabsAPIError extends Error {
  constructor(message: string, public readonly status: number, public readonly responseText?: string) {
    super(message);
    this.name = 'ElevenLabsAPIError';
  }
}

class ElevenLabsPlaybackError extends Error {
  constructor(message: string, public readonly audioUrl?: string) {
    super(message);
    this.name = 'ElevenLabsPlaybackError';
  }
}

// Browser-only ElevenLabs integration
class ElevenLabsClient {
  private apiKey: string;
  private defaultVoiceId: string = 'pNInz6obpgDQGcFmaJgB'; // Adam voice (Türkçe destekli)

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
  }

  /**
   * Metni sese çevirir ve audio URL döndürür
   */
  async textToSpeech(
    text: string, 
    options?: {
      voiceId?: string;
      model?: string;
      stability?: number;
      similarityBoost?: number;
      style?: number;
      useSpeakerBoost?: boolean;
    }
  ): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new ElevenLabsAPIError('ElevenLabs API key not found', 401);
      }

      const voiceId = options?.voiceId || this.defaultVoiceId;
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: options?.model || 'eleven_multilingual_v2',
          voice_settings: {
            stability: options?.stability || 0.5,
            similarity_boost: options?.similarityBoost || 0.8,
            style: options?.style || 0.5,
            use_speaker_boost: options?.useSpeakerBoost || true,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ElevenLabsAPIError(`ElevenLabs API error: ${response.status}`, response.status, errorText);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
      
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      if (error instanceof ElevenLabsAPIError) {
        throw error; // Re-throw custom API errors
      }
      throw new ElevenLabsAPIError('Ses oluşturulamadı', 500, (error as Error).message); // Generic error
    }
  }

  /**
   * Türkçe çocuk sesi için optimize edilmiş sesler
   */
  getChildFriendlyVoices() {
    return [
      {
        id: 'pNInz6obpgDQGcFmaJgB', // Adam - Sakin, açık konuşan
        name: 'Adam',
        description: 'Sakin ve açık konuşan erkek ses',
        language: 'tr'
      },
      {
        id: 'EXAVITQu4vr4xnSDxMaL', // Bella - Nazik kadın ses
        name: 'Bella', 
        description: 'Nazik ve anlaşılır kadın ses',
        language: 'tr'
      },
      {
        id: 'VR6AewLTigWG4xSOukaG', // Josh - Genç erkek ses
        name: 'Josh',
        description: 'Genç ve eğlenceli erkek ses', 
        language: 'tr'
      }
    ];
  }

  /**
   * Egzersizlere özel ses ayarları
   */
  getExerciseVoiceSettings() {
    return {
      // Harf seslendirme için
      letter: {
        stability: 0.7,
        similarityBoost: 0.9,
        style: 0.3,
        useSpeakerBoost: true
      },
      // Kelime seslendirme için
      word: {
        stability: 0.6,
        similarityBoost: 0.8,
        style: 0.4,
        useSpeakerBoost: true
      },
      // Cümle seslendirme için
      sentence: {
        stability: 0.5,
        similarityBoost: 0.7,
        style: 0.6,
        useSpeakerBoost: true
      },
      // Kutlama mesajları için
      celebration: {
        stability: 0.4,
        similarityBoost: 0.6,
        style: 0.8,
        useSpeakerBoost: true
      }
    };
  }
}

// Singleton instance
export const elevenlabsClient = new ElevenLabsClient();

// Web Speech API Fallback
const webSpeechSpeak = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      return reject(new Error('Web Speech API not supported'));
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR'; // Türkçe dilini ayarla
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Web Speech API error: ${event.error}`));
    speechSynthesis.speak(utterance);
  });
};

// Hook for React components
export function useElevenLabs() {
  const speak = async (
    text: string, 
    type: 'letter' | 'word' | 'sentence' | 'celebration' = 'sentence',
    voiceId?: string
  ) => {
    // Check if sound effects are enabled from localStorage
    if (typeof window !== 'undefined') {
      const soundEnabled = localStorage.getItem('sound-effects');
      if (soundEnabled === 'false') {
        console.log('Ses efektleri kapalı, ses çalma atlandı.');
        return; // Do not play sound if disabled
      }
    }

    let audioUrl: string | undefined;
    try {
      const settings = elevenlabsClient.getExerciseVoiceSettings();
      audioUrl = await elevenlabsClient.textToSpeech(text, {
        voiceId,
        ...settings[type]
      });
      
      const audio = new Audio(audioUrl);
      await audio.play();
      
      // Cleanup
      audio.addEventListener('ended', () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
      });
      
      return audio;
    } catch (error) {
      console.error('ElevenLabs ses çalma hatası, fallback deneniyor:', error);
      // Fallback to Web Speech API
      try {
        await webSpeechSpeak(text);
        console.log('Web Speech API ile ses başarıyla çalındı.');
      } catch (fallbackError) {
        console.error('Web Speech API fallback hatası:', fallbackError);
        throw new ElevenLabsPlaybackError('Ses çalınamadı, tüm servisler başarısız oldu.', audioUrl);
      }
    } finally {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    }
  };

  const getVoices = () => {
    return elevenlabsClient.getChildFriendlyVoices();
  };

  return {
    speak,
    getVoices,
    client: elevenlabsClient
  };
}  