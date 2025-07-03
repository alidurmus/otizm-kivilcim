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
        throw new Error('ElevenLabs API key not found');
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
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
      
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      throw new Error('Ses oluşturulamadı');
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

// Hook for React components
export function useElevenLabs() {
  const speak = async (
    text: string, 
    type: 'letter' | 'word' | 'sentence' | 'celebration' = 'sentence',
    voiceId?: string
  ) => {
    try {
      const settings = elevenlabsClient.getExerciseVoiceSettings();
      const audioUrl = await elevenlabsClient.textToSpeech(text, {
        voiceId,
        ...settings[type]
      });
      
      const audio = new Audio(audioUrl);
      await audio.play();
      
      // Cleanup
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
      });
      
      return audio;
    } catch (error) {
      console.error('Ses çalma hatası:', error);
      throw error;
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