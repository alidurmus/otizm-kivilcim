// ElevenLabs Client-Side Integration (Server Proxy Only)
// Uses Next.js API routes for secure server-side processing
// with Static Audio Files fallback for better performance

import { getStaticAudioPath, hasStaticAudio, turkishToFilename } from './audio-constants';

// Error classes for better error handling
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

// Türkçe Bayan Ses Kütüphanesi - Otizm dostu ses seçenekleri
export const TURKISH_FEMALE_VOICES = {
  bella: {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    description: 'Nazik ve sakin bayan ses - harf öğrenme için ideal',
    language: 'tr',
    gender: 'female',
    age: 'adult',
    traits: ['calm', 'clear', 'gentle'],
    bestFor: ['letters', 'words', 'instructions']
  },
  rachel: {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    description: 'Profesyonel ve güven verici bayan ses',
    language: 'tr',
    gender: 'female', 
    age: 'adult',
    traits: ['professional', 'trustworthy', 'clear'],
    bestFor: ['sentences', 'stories', 'explanations']
  },
  domi: {
    id: 'AZnzlk1XvdvUeBnXmlld', 
    name: 'Domi',
    description: 'Genç ve arkadaş canlısı bayan ses',
    language: 'tr',
    gender: 'female',
    age: 'young',
    traits: ['friendly', 'energetic', 'approachable'],
    bestFor: ['games', 'encouragement', 'social']
  },
  elli: {
    id: 'MF3mGyEYCl7XYWbV9V6O',
    name: 'Elli',
    description: 'Enerjik ve kutlayıcı bayan ses',
    language: 'tr',
    gender: 'female',
    age: 'adult',
    traits: ['energetic', 'celebrating', 'motivating'],
    bestFor: ['celebrations', 'achievements', 'rewards']
  },
  sarah: {
    id: 'EaWgGVAA2Kzl8LLxQN8D',
    name: 'Sarah',
    description: 'Çok sakin ve rahatlatıcı bayan ses',
    language: 'tr',
    gender: 'female',
    age: 'adult',
    traits: ['very_calm', 'soothing', 'therapeutic'],
    bestFor: ['relaxation', 'sensitive_content', 'therapy']
  }
};

// Türkçe Erkek Ses Kütüphanesi - Otizm dostu ses seçenekleri
export const TURKISH_MALE_VOICES = {
  adam: {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    description: 'Sakin ve açık erkek ses - temel öğrenme için mükemmel',
    language: 'tr',
    gender: 'male',
    age: 'adult',
    traits: ['calm', 'clear', 'reliable'],
    bestFor: ['instructions', 'basic_learning', 'guidance']
  },
  josh: {
    id: 'VR6AewLTigWG4xSOukaG',
    name: 'Josh',
    description: 'Genç ve eğlenceli erkek ses - oyunlar için ideal',
    language: 'tr',
    gender: 'male',
    age: 'young',
    traits: ['playful', 'energetic', 'fun'],
    bestFor: ['games', 'activities', 'entertainment']
  },
  antoni: {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    description: 'Derin ve güven verici erkek ses - hikayeler için',
    language: 'tr',
    gender: 'male',
    age: 'adult',
    traits: ['deep', 'trustworthy', 'narrative'],
    bestFor: ['stories', 'reading', 'explanations']
  },
  daniel: {
    id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Daniel',
    description: 'Profesyonel ve sakin erkek ses',
    language: 'tr',
    gender: 'male',
    age: 'adult', 
    traits: ['professional', 'calm', 'authoritative'],
    bestFor: ['lessons', 'formal_content', 'instructions']
  },
  ethan: {
    id: 'g5CIjZEefAph4nQFvHAz',
    name: 'Ethan',
    description: 'Cesaret verici ve motive edici erkek ses',
    language: 'tr',
    gender: 'male',
    age: 'adult',
    traits: ['encouraging', 'motivating', 'supportive'],
    bestFor: ['encouragement', 'motivation', 'challenges']
  }
};

// Ses tipi için en uygun Türkçe bayan sesini öner
export function getRecommendedTurkishVoice(
  type: 'letter' | 'word' | 'sentence' | 'celebration',
  gender: 'male' | 'female' | 'mixed' = 'mixed'
): string {
  const recommendations = {
    letter: {
      male: TURKISH_MALE_VOICES.adam.id,     // Sakin ve açık
      female: TURKISH_FEMALE_VOICES.bella.id // Nazik ve sakin
    },
    word: {
      male: TURKISH_MALE_VOICES.daniel.id,   // Profesyonel
      female: TURKISH_FEMALE_VOICES.rachel.id // Profesyonel
    },
    sentence: {
      male: TURKISH_MALE_VOICES.antoni.id,   // Derin ve anlatıcı
      female: TURKISH_FEMALE_VOICES.domi.id   // Arkadaş canlısı
    },
    celebration: {
      male: TURKISH_MALE_VOICES.josh.id,     // Eğlenceli
      female: TURKISH_FEMALE_VOICES.elli.id   // Enerjik
    }
  };

  if (gender === 'mixed') {
    // Karışık modda, türe göre en uygun sesi seç (varsayılan olarak bayan)
    return recommendations[type].female;
  }

  return recommendations[type][gender];
}

// Tüm Türkçe bayan seslerini listele
export function getTurkishFemaleVoices() {
  return Object.values(TURKISH_FEMALE_VOICES);
}

// Tüm Türkçe erkek seslerini listele
export function getTurkishMaleVoices() {
  return Object.values(TURKISH_MALE_VOICES);
}

// Tüm Türkçe sesleri döndürür (erkek + bayan)
export function getAllTurkishVoices() {
  return [
    ...getTurkishFemaleVoices(),
    ...getTurkishMaleVoices()
  ];
}

// Client-side ElevenLabs integration using server proxy
class ElevenLabsClient {
  private defaultVoiceId: string = 'EXAVITQu4vr4xnSDxMaL'; // Bella - Turkish-capable female voice
  private cache: Map<string, string> = new Map();

  /**
   * Metni sese çevirir ve audio URL döndürür
   * Türkçe karakterleri destekler: ç, ğ, ı, ö, ş, ü
   * Server-side API route kullanır - güvenli ve optimize
   */
  async textToSpeech(
    text: string, 
    type: 'letter' | 'word' | 'sentence' | 'celebration' = 'sentence',
    voiceId?: string
  ): Promise<string> {
    // Input validation with Turkish character support
    if (!text || text.trim().length === 0) {
      throw new Error('Boş metin ses olarak çevrilemez');
    }

    if (text.length > 1000) {
      throw new Error('Metin çok uzun (maksimum 1000 karakter)');
    }

    // Turkish character validation
    const turkishPattern = /^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s.,!?-]+$/;
    if (!turkishPattern.test(text)) {
      console.warn('Text contains non-Turkish characters:', text);
    }

    // 1. ÖNCE: Statik ses dosyasını kontrol et
    const staticAudioPath = getStaticAudioPath(text, type);
    if (staticAudioPath) {
      console.log(`📁 Using static audio file for "${text}":`, staticAudioPath);
      return staticAudioPath;
    }

    // 2. CACHE kontrolü
    const cacheKey = `${text}-${type}-${voiceId || this.defaultVoiceId}`;
    if (this.cache.has(cacheKey)) {
      console.log(`💾 Using cached audio for "${text}"`);
      return this.cache.get(cacheKey)!;
    }

    // 3. SERVER-SIDE API route kullan (ElevenLabs SDK proxy)
    try {
      console.log(`🤖 Generating audio via ElevenLabs for Turkish text: "${text}"`);
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          type,
          voiceId: voiceId || this.defaultVoiceId,
          language: 'tr' // Turkish language indicator
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new ElevenLabsAPIError(
          `API isteği başarısız: ${response.status}`,
          response.status,
          errorText
        );
      }

      // Convert response to blob and create URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the result
      this.cache.set(cacheKey, audioUrl);
      
      console.log(`✅ Turkish audio generated successfully for: "${text}"`);
      return audioUrl;

    } catch (error) {
      console.error('ElevenLabs API error for Turkish text:', error);
      throw error;
    }
  }

  /**
   * Sesi çalar ve cleanup yapar
   * Türkçe karakterli metinler için optimize edilmiş
   */
  async speak(
    text: string, 
    type: 'letter' | 'word' | 'sentence' | 'celebration' = 'sentence',
    voiceId?: string
  ): Promise<void> {
    try {
      const audioUrl = await this.textToSpeech(text, type, voiceId);
      
      // Audio element oluştur ve çal
      const audio = new Audio(audioUrl);
      audio.volume = 0.8;
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          // Cleanup blob URL to prevent memory leaks
          if (audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
          }
          resolve();
        };
        
        audio.onerror = () => {
          if (audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
          }
          reject(new ElevenLabsPlaybackError(
            `Ses çalınamadı: "${text}"`,
            audioUrl
          ));
        };
        
        audio.play().catch(reject);
      });
    } catch (error) {
      throw new ElevenLabsPlaybackError(
        `Türkçe metin seslendirilirken hata: "${text}"`,
        undefined
      );
    }
  }

  /**
   * Mevcut sesleri listeler
   */
  async getVoices() {
    try {
      const response = await fetch('/api/speech', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new ElevenLabsAPIError(
          'Sesler yüklenemedi',
          response.status
        );
      }

      const data = await response.json();
      
      // Extract voices array from the API response
      return data.voices || [];
    } catch (error) {
      console.error('Voices API error:', error);
      throw error;
    }
  }

  /**
   * Ses test fonksiyonu - admin panel için
   * Türkçe karakter testleri dahil
   */
  async testVoice(
    text: string,
    voiceId: string,
    type: 'letter' | 'word' | 'sentence' | 'celebration',
    settings?: {
      stability?: number;
      similarityBoost?: number;
      style?: number;
      useSpeakerBoost?: boolean;
    }
  ) {
    try {
      console.log(`🧪 Testing Turkish voice for: "${text}"`);
      const startTime = Date.now();
      
      // Use the main /api/speech endpoint instead of /api/speech/test
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId,
          type,
          settings: {
            stability: settings?.stability ?? 0.7,
            similarity_boost: settings?.similarityBoost ?? 0.8,
            style: settings?.style ?? 0.5,
            use_speaker_boost: settings?.useSpeakerBoost ?? true
          },
          language: 'tr'
        })
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Test failed: ${response.status} - ${errorText}`,
          duration,
          text,
          voiceId,
          turkishCharacterSupport: /[çğıöşüÇĞIİÖŞÜ]/.test(text)
        };
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        success: true,
        audioUrl,
        duration,
        text,
        voiceId,
        audioSize: audioBlob.size,
        turkishCharacterSupport: /[çğıöşüÇĞIİÖŞÜ]/.test(text),
        filename: turkishToFilename(text) + '.mp3'
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        text,
        voiceId,
        turkishCharacterSupport: /[çğıöşüÇĞIİÖŞÜ]/.test(text)
      };
    }
  }

  /**
   * API durumunu kontrol eder
   */
  async getApiStatus() {
    try {
      // Use the main /api/speech GET endpoint to check status
      const response = await fetch('/api/speech', {
        method: 'GET',
      });
      
      if (!response.ok) {
        return {
          apiKeyConfigured: false,
          sdkInitialized: false,
          lastTestSuccess: false,
          error: `HTTP ${response.status}`,
          turkish_support: false
        };
      }

      const data = await response.json();
      return {
        apiKeyConfigured: data.configured || false,
        sdkInitialized: data.configured || false,
        lastTestSuccess: true,
        turkish_support: true, // Our implementation supports Turkish
        voices: data.voices || [],
        service: data.service || 'ElevenLabs'
      };
    } catch (error) {
      return {
        apiKeyConfigured: false,
        sdkInitialized: false,
        lastTestSuccess: false,
        error: error instanceof Error ? error.message : 'Network error',
        turkish_support: false
      };
    }
  }

  /**
   * Cache'i temizle
   */
  clearCache() {
    // Revoke all blob URLs to prevent memory leaks
    for (const url of this.cache.values()) {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    }
    this.cache.clear();
    console.log('🧹 ElevenLabs cache cleared');
  }
}

// Global instance - singleton pattern
const elevenLabsClient = new ElevenLabsClient();

// Export client and utility functions
export default elevenLabsClient;
export { ElevenLabsAPIError, ElevenLabsPlaybackError };

// React Hook for easy component integration
export function useElevenLabs() {
  return {
    speak: elevenLabsClient.speak.bind(elevenLabsClient),
    textToSpeech: elevenLabsClient.textToSpeech.bind(elevenLabsClient),
    getVoices: elevenLabsClient.getVoices.bind(elevenLabsClient),
    testVoice: elevenLabsClient.testVoice.bind(elevenLabsClient),
    getApiStatus: elevenLabsClient.getApiStatus.bind(elevenLabsClient),
    clearCache: elevenLabsClient.clearCache.bind(elevenLabsClient),
    getTestTexts: getTestTexts
  };
}

/**
 * Test metinleri sağlar - admin panel için
 * Türkçe karakterleri ve farklı zorluk seviyelerini test etmek için
 */
export function getTestTexts() {
  return {
    letter: [
      'A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü', // Sesli harfler
      'B', 'C', 'Ç', 'D', 'F', 'G', 'Ğ', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'Ş', 'T', 'V', 'Y', 'Z' // Sessiz harfler
    ],
    word: [
      'elma', 'armut', 'çilek', 'üzüm', 'şeftali', // Meyveler (Türkçe karakterli)
      'kedi', 'köpek', 'kuş', 'balık', 'köpekbalığı', // Hayvanlar
      'ev', 'okul', 'şehir', 'köy', 'ülke', // Yerler
      'anne', 'baba', 'çocuk', 'öğretmen', 'öğrenci', // İnsanlar
      'güneş', 'ay', 'yıldız', 'gökyüzü', 'deniz' // Doğa
    ],
    sentence: [
      'Merhaba! Nasılsın?',
      'Bugün hava çok güzel.',
      'Türkçe öğrenmek çok eğlenceli.',
      'Kıvılcım platformu çocuklar için harika.',
      'Ses teknolojisi çok gelişmiş.',
      'Bu cümle Türkçe karakterleri test ediyor: çğıöşü.',
      'ElevenLabs API\'si mükemmel çalışıyor.',
      'Otizmli çocuklar için özel tasarlandık.',
      'Sesli okuma çok önemli bir beceri.',
      'Yapay zeka ile öğrenme daha etkili.'
    ],
    celebration: [
      'Aferin! Çok güzel yaptın!',
      'Harikasın! Böyle devam et!',
      'Süpersin! Tebrikler!',
      'Bravo! Mükemmel bir başarı!',
      'Yaaay! Sen bir şampiyonsun!',
      'Tebrikler! Çok başarılısın!',
      'Muhteşem! Gurur duyuyorum!',
      'İnanılmaz! Böyle devam!',
      'Fantastik! Sen harikasın!',
      'Olağanüstü! Çok yeteneklisin!'
    ]
  };
}  