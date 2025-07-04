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

// Secure server-side ElevenLabs integration
class ElevenLabsClient {
  private defaultVoiceId: string = 'pNInz6obpgDQGcFmaJgB'; // Adam voice (Türkçe destekli)

  /**
   * Metni sese çevirir ve audio URL döndürür
   * Artık server-side API route kullanır
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
      const voiceId = options?.voiceId || this.defaultVoiceId;
      
      // Server-side API route'unu kullan - type-based approach
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          type: 'sentence', // Default to sentence for backwards compatibility
          voiceId: voiceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}`;
        throw new ElevenLabsAPIError(`Server error: ${errorMessage}`, response.status);
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
  async getChildFriendlyVoices() {
    try {
      const response = await fetch('/api/speech');
      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }
      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      // Fallback to hardcoded voices
      return [
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
    }
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

  /**
   * Admin test sayfası için gelişmiş ses testi
   */
  async testVoice(
    text: string,
    voiceId: string,
    type: 'letter' | 'word' | 'sentence' | 'celebration',
    customSettings?: {
      stability?: number;
      similarityBoost?: number;
      style?: number;
      useSpeakerBoost?: boolean;
    }
  ): Promise<VoiceTestResult> {
    const startTime = Date.now();
    const voices = await this.getChildFriendlyVoices();
    const voice = voices.find(v => v.id === voiceId);
    
    const testResult: VoiceTestResult = {
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      voiceId,
      voiceName: voice?.name || 'Unknown',
      text,
      type,
      success: false,
      settings: {
        stability: customSettings?.stability ?? this.getExerciseVoiceSettings()[type].stability,
        similarityBoost: customSettings?.similarityBoost ?? this.getExerciseVoiceSettings()[type].similarityBoost,
        style: customSettings?.style ?? this.getExerciseVoiceSettings()[type].style,
        useSpeakerBoost: customSettings?.useSpeakerBoost ?? this.getExerciseVoiceSettings()[type].useSpeakerBoost,
      }
    };

    try {
      const audioUrl = await this.textToSpeech(text, {
        voiceId,
        ...testResult.settings
      });
      
      // Test audio playback
      const audio = new Audio(audioUrl);
      await audio.play();
      
      const endTime = Date.now();
      testResult.success = true;
      testResult.duration = endTime - startTime;
      
      // Cleanup
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
      });
      
    } catch (error) {
      testResult.success = false;
      testResult.error = error instanceof Error ? error.message : 'Unknown error';
      testResult.duration = Date.now() - startTime;
    }

    return testResult;
  }

  /**
   * API durumu kontrolü
   */
  async getApiStatus(): Promise<ElevenLabsStatus> {
    const status: ElevenLabsStatus = {
      apiKeyConfigured: false,
    };

    try {
      // Basit bir API çağrısı yaparak durumu kontrol et
      const response = await fetch('/api/speech');
      status.apiKeyConfigured = response.ok;
      status.lastTestTime = new Date();
      status.lastTestSuccess = response.ok;
      
      // Rate limit bilgisi varsa header'dan al
      const rateLimitHeader = response.headers.get('x-ratelimit-remaining');
      if (rateLimitHeader) {
        status.rateLimitRemaining = parseInt(rateLimitHeader);
      }
      
    } catch (error) {
      status.apiKeyConfigured = false;
      status.lastTestTime = new Date();
      status.lastTestSuccess = false;
    }

    return status;
  }

  /**
   * Test için önceden tanımlanmış metinler
   */
  getTestTexts() {
    return {
      letter: ['a', 'e', 'i', 'o', 'u', 'b', 'c', 'd', 'f', 'g'],
      word: ['el', 'at', 'ev', 'ok', 'su', 'bal', 'kar', 'güneş', 'çiçek', 'kitap'],
      sentence: [
        'Bu hece "el" oluyor.',
        'Harfleri birleştirerek kelime oluşturuyoruz.',
        'Çok güzel okuyorsun!',
        'Şimdi bir sonraki harfe geçelim.',
        'Bu egzersizi başarıyla tamamladın.'
      ],
      celebration: [
        'Harikasın! Çok güzel yaptın!',
        'Bravo! Mükemmel bir iş çıkardın!',
        'Süpersin! Devam et böyle!',
        'Tebrikler! Bu çok başarılıydı!',
        'Muhteşem! Sen gerçek bir şampiyon!'
      ]
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

// Admin test sayfası için ek türler
export interface VoiceTestResult {
  id: string;
  timestamp: Date;
  voiceId: string;
  voiceName: string;
  text: string;
  type: 'letter' | 'word' | 'sentence' | 'celebration';
  success: boolean;
  error?: string;
  duration?: number;
  settings: {
    stability: number;
    similarityBoost: number;
    style: number;
    useSpeakerBoost: boolean;
  };
}

export interface VoiceInfo {
  id: string;
  name: string;
  description: string;
  language: string;
}

export interface ElevenLabsStatus {
  apiKeyConfigured: boolean;
  lastTestTime?: Date;
  lastTestSuccess?: boolean;
  rateLimitRemaining?: number;
}

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

  const getVoices = async () => {
    return await elevenlabsClient.getChildFriendlyVoices();
  };

  const testVoice = async (
    text: string,
    voiceId: string,
    type: 'letter' | 'word' | 'sentence' | 'celebration',
    customSettings?: {
      stability?: number;
      similarityBoost?: number;
      style?: number;
      useSpeakerBoost?: boolean;
    }
  ) => {
    return await elevenlabsClient.testVoice(text, voiceId, type, customSettings);
  };

  const getApiStatus = async () => {
    return await elevenlabsClient.getApiStatus();
  };

  const getTestTexts = () => {
    return elevenlabsClient.getTestTexts();
  };

  return {
    speak,
    getVoices,
    testVoice,
    getApiStatus,
    getTestTexts,
    client: elevenlabsClient
  };
}  