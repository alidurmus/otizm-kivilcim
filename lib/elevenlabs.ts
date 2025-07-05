// ElevenLabs Client-Side Integration (Server Proxy Only)
// Uses Next.js API routes for secure server-side processing
// with Static Audio Files fallback for better performance

import { getStaticAudioPath, turkishToFilename } from './audio-constants';

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
  },
  // Yeni eklenen sesler - detaylar API'den alınacak
  newVoice1: {
    id: 'tMlsw9ihFf5L7S43dohH',
    name: 'NewVoice1',
    description: 'Yeni eklenen ses - detaylar güncellenecek',
    language: 'tr',
    gender: 'female', // API'den güncellenecek
    age: 'adult',
    traits: ['unknown'],
    bestFor: ['general']
  },
  newVoice2: {
    id: 'xyqF3vGMQlPk3e7yA4DI',
    name: 'Varsayılan Ses', // Kullanıcının tercih ettiği ses
    description: 'Kullanıcı tarafından seçilen varsayılan Türkçe ses - tüm konuşmalar için',
    language: 'tr',
    gender: 'female', // API'den güncellenecek
    age: 'adult',
    traits: ['preferred', 'default', 'clear'],
    bestFor: ['letters', 'words', 'sentences', 'celebrations', 'all_content']
  },
  newVoice3: {
    id: '9GYMX9eMWSq1yjiwXb7B',
    name: 'NewVoice3',
    description: 'Yeni eklenen ses - detaylar güncellenecek',
    language: 'tr',
    gender: 'female', // API'den güncellenecek
    age: 'adult',
    traits: ['unknown'],
    bestFor: ['general']
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
  },
  // Yeni eklenen sesler - detaylar API'den alınacak
  newVoice4: {
    id: 'V6TFTAE0gaN8LtBwl70x',
    name: 'NewVoice4',
    description: 'Yeni eklenen ses - detaylar güncellenecek',
    language: 'tr',
    gender: 'male', // API'den güncellenecek
    age: 'adult',
    traits: ['unknown'],
    bestFor: ['general']
  },
  newVoice5: {
    id: 'eUUtjbi66JcWz3T4Gvvo',
    name: 'NewVoice5',
    description: 'Yeni eklenen ses - detaylar güncellenecek',
    language: 'tr',
    gender: 'male', // API'den güncellenecek
    age: 'adult',
    traits: ['unknown'],
    bestFor: ['general']
  },
  newVoice6: {
    id: 'mBUB5zYuPwfVE6DTcEjf',
    name: 'NewVoice6',
    description: 'Yeni eklenen ses - detaylar güncellenecek',
    language: 'tr',
    gender: 'male', // API'den güncellenecek
    age: 'adult',
    traits: ['unknown'],
    bestFor: ['general']
  },
  newVoice7: {
    id: 'jbJMQWv1eS4YjQ6PCcn6',
    name: 'NewVoice7',
    description: 'Yeni eklenen ses - detaylar güncellenecek',
    language: 'tr',
    gender: 'male', // API'den güncellenecek
    age: 'adult',
    traits: ['unknown'],
    bestFor: ['general']
  }
};

// 5 Seçilmiş Türkçe Ses Sistemi (Multi-Voice Support)
const SELECTED_TURKISH_VOICES = {
  gulsu: {
    id: 'jbJMQWv1eS4YjQ6PCcn6',
    name: 'Gülsu',
    description: 'Genç Türk kadını, enerjik ve samimi ses. Hikayeler ve kitaplar için mükemmel.',
    language: 'tr',
    gender: 'female',
    age: 'young_adult',
    traits: ['energetic', 'sincere', 'clear'],
    bestFor: ['stories', 'books', 'children_content', 'alphabet_learning']
  },
  edaAtlas: {
    id: 'mBUB5zYuPwfVE6DTcEjf',
    name: 'Eda Atlas',
    description: 'Genç, parlak Türk kadını sesi. Kurumsal, radyo ve TV reklamları için mükemmel seçim.',
    language: 'tr',
    gender: 'female',
    age: 'young_adult',
    traits: ['bright', 'professional', 'corporate'],
    bestFor: ['corporate', 'radio', 'tv_commercials', 'word_learning']
  },
  ayca: {
    id: 'eUUtjbi66JcWz3T4Gvvo',
    name: 'Ayça',
    description: 'Dinamik genç kadın sesi. Anlatıcılar ve motivasyonel konuşmalar için uygun.',
    language: 'tr',
    gender: 'female',
    age: 'young_adult',
    traits: ['dynamic', 'motivational', 'narrator'],
    bestFor: ['narrator', 'motivational_speech', 'sentence_reading']
  },
  yusufSuratli: {
    id: 'V6TFTAE0gaN8LtBwl70x',
    name: 'Yusuf Suratlı',
    description: 'Parlak, genç yetişkin erkek sesi. Anlatıcı, konuşmacı, kitap seslendirme için mükemmel.',
    language: 'tr',
    gender: 'male',
    age: 'young_adult',
    traits: ['bright', 'narrator', 'speaker'],
    bestFor: ['narrator', 'speaker', 'book_voiceover', 'celebrations']
  },
  sermin: {
    id: '9GYMX9eMWSq1yjiwXb7B',
    name: 'Sermin',
    description: 'Orijinal, akıcı ve vurgulu Türkçe kadın sesi.',
    language: 'tr',
    gender: 'female',
    age: 'adult',
    traits: ['original', 'fluent', 'accented'],
    bestFor: ['fluent_expressions', 'accented_content', 'natural_speech']
  },
  cavit: {
    id: 'Y2T2O1csKPgWgyuKcU0a',
    name: 'Cavit',
    description: 'Güçlü ve net erkek sesi. Profesyonel anlatım ve eğitici içerikler için ideal.',
    language: 'tr',
    gender: 'male',
    age: 'adult',
    traits: ['strong', 'clear', 'professional'],
    bestFor: ['educational_content', 'professional_narration', 'announcements', 'instructions']
  },
  mehmet: {
    id: 'fg8pljYEn5ahwjyOQaro',
    name: 'Mehmet',
    description: 'Samimi ve sıcak erkek sesi. Günlük konuşmalar ve çocuk eğitimi için uygun.',
    language: 'tr',
    gender: 'male',
    age: 'adult',
    traits: ['friendly', 'warm', 'child_friendly'],
    bestFor: ['daily_conversations', 'child_education', 'friendly_narration', 'encouragement']
  }
};

// Ses tipi için en uygun Türkçe bayan sesini öner
export function getRecommendedTurkishVoice(
  type: 'letter' | 'word' | 'sentence' | 'celebration',
  gender: 'male' | 'female' | 'mixed' = 'mixed'
): string {
  // 🎯 Kullanıcının tercih ettiği varsayılan ses - tüm konuşmalar için
  const userPreferredVoice = 'xyqF3vGMQlPk3e7yA4DI';
  
  console.log(`🔊 Using user's preferred voice: ${userPreferredVoice} for ${type}`);
  return userPreferredVoice;
  
  // Eski gender-balanced logic - şimdilik devre dışı
  /*
  const voiceAssignments = {
    'letter': gender === 'female' ? TURKISH_FEMALE_VOICES.bella.id : TURKISH_MALE_VOICES.adam.id,
    'word': TURKISH_FEMALE_VOICES.rachel.id,
    'sentence': TURKISH_MALE_VOICES.antoni.id,
    'celebration': TURKISH_MALE_VOICES.josh.id
  };
  
  return voiceAssignments[type];
  */
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
  private defaultVoiceId: string = 'xyqF3vGMQlPk3e7yA4DI'; // Kullanıcının seçtiği varsayılan ses
  private cache: Map<string, { blob: Blob; timestamp: number }> = new Map(); // Cache audio blobs with timestamps
  private currentAudio: HTMLAudioElement | null = null; // Aktif ses instance'ını takip et
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache duration

  constructor() {
    console.log('🎙️ ElevenLabs client initialized');
  }

  /**
   * Aktif sesi durdur ve temizle
   */
  stopCurrentAudio(): void {
    if (this.currentAudio) {
      console.log('🛑 Stopping current audio');
      
      try {
        // Ses çalarken durdurma
        if (!this.currentAudio.paused) {
          this.currentAudio.pause();
        }
        
        // Zamanı sıfırla
        this.currentAudio.currentTime = 0;
        
        // Event listener'ları temizle
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.onabort = null;
        this.currentAudio.oncanplay = null;
        this.currentAudio.onloadstart = null;
        
      } catch (error) {
        console.warn('Error stopping audio (ignored):', error);
      } finally {
        // Reference'ı her durumda temizle
        this.currentAudio = null;
      }
    }
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, { timestamp }] of this.cache.entries()) {
      if (now - timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

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
    // Input validation
    if (!text || text.trim().length === 0) {
      throw new Error('Metin boş olamaz');
    }

    if (text.length > 1000) {
      throw new Error('Metin çok uzun (maksimum 1000 karakter)');
    }

    // Updated Turkish character validation - includes apostrophes, numbers and common punctuation
    const turkishPattern = /^[a-zA-Z0-9çğıöşüÇĞIİÖŞÜ\s.,!?'\"'-]+$/;
    if (!turkishPattern.test(text)) {
      console.warn('Text contains non-Turkish characters:', text);
      // Don't block - just warn and continue
    }

    // 1. ÖNCE: Statik ses dosyasını kontrol et
    const staticAudioPath = getStaticAudioPath(text, type);
    if (staticAudioPath) {
      console.log(`📁 Using static audio file for "${text}":`, staticAudioPath);
      return staticAudioPath;
    }

    // 2. CACHE kontrolü - clean expired entries first
    this.cleanExpiredCache();
    const cacheKey = `${text}-${type}-${voiceId || this.defaultVoiceId}`;
    const cachedData = this.cache.get(cacheKey);
    
    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      console.log(`💾 Using cached audio for "${text}"`);
      // Create a new blob URL each time to avoid revocation issues
      return URL.createObjectURL(cachedData.blob);
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

      // Convert response to blob
      const audioBlob = await response.blob();
      
      // Cache the blob data with timestamp
      this.cache.set(cacheKey, {
        blob: audioBlob,
        timestamp: Date.now()
      });
      
      // Create URL for immediate use
      const audioUrl = URL.createObjectURL(audioBlob);
      
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
      // 🛑 Önceki sesi durdur - ses karışıklığını önle
      this.stopCurrentAudio();
      
      // Browser'ın audio state'ini stabilize etmesi için daha uzun delay
      await new Promise(resolve => setTimeout(resolve, 150));
      
      console.log(`🔊 Speaking: "${text}" (type: ${type})`);
      
      const audioUrl = await this.textToSpeech(text, type, voiceId);
      
      // Check if we got a valid audio URL
      if (!audioUrl || audioUrl === '') {
        console.warn('No audio URL returned, falling back to Web Speech API');
        return this.fallbackToWebSpeech(text);
      }
      
      // Audio element oluştur ve aktif instance olarak kaydet
      const audio = new Audio(audioUrl);
      audio.volume = 0.8;
      this.currentAudio = audio;
      
      return new Promise((resolve, reject) => {
        // Null check - audio durdurulmuşsa promise'i resolve et
        if (!this.currentAudio) {
          console.log('🚫 Audio was stopped before playback');
          if (audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
          }
          resolve();
          return;
        }
        
        audio.onended = () => {
          console.log('✅ Audio playback completed');
          // Cleanup blob URL to prevent memory leaks
          if (audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
          }
          
          // Sadece bu audio hala aktifse temizle
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          resolve();
        };
        
        audio.onerror = (error) => {
          console.warn('🔊 Audio playback failed, falling back to Web Speech API:', error);
          if (audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
          }
          
          // Sadece bu audio hala aktifse temizle
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          
          // Fallback to Web Speech API instead of rejecting
          this.fallbackToWebSpeech(text).then(resolve).catch(reject);
        };
        
        audio.onabort = () => {
          console.warn('🔊 Audio playback aborted');
          if (audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
          }
          
          // Sadece bu audio hala aktifse temizle
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          
          // Graceful resolution instead of rejection
          resolve();
        };
        
        // Audio çalmaya başla - error handling ile
        audio.play().catch((playError) => {
          console.warn('🔄 Audio play was interrupted, retrying with Web Speech API', playError);
          
          // Cleanup
          if (audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
          }
          
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          
          // Fallback instead of failure
          this.fallbackToWebSpeech(text).then(resolve).catch(reject);
        });
      });
      
    } catch (error) {
      console.error('ElevenLabs speak error:', error);
      // Fallback to Web Speech API on any error
      return this.fallbackToWebSpeech(text);
    }
  }

  /**
   * Web Speech API fallback function
   */
  private async fallbackToWebSpeech(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if ('speechSynthesis' in window) {
        // Önceki konuşmaları durdur
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        utterance.onend = () => {
          console.log('✅ Web Speech API playback completed');
          resolve();
        };
        
        utterance.onerror = (error) => {
          // Handle empty or malformed error objects gracefully
          let errorMsg = 'Unknown error';
          
          try {
            // SpeechSynthesisErrorEvent has an 'error' property with the error type
            if (error && typeof error === 'object' && 'error' in error) {
              errorMsg = error.error || 'Speech synthesis failed';
            } else if (typeof error === 'string') {
              errorMsg = error;
            }
          } catch (e) {
            errorMsg = 'Speech synthesis error (malformed error object)';
          }
          
          console.warn(`🔊 Web Speech API fallback failed: ${errorMsg}`);
          
          // Don't reject, just resolve silently to avoid breaking the UI
          resolve();
        };
        
        speechSynthesis.speak(utterance);
      } else {
        console.warn('Speech synthesis not supported, playing silently');
        // Resolve after a short delay to simulate speech duration
        setTimeout(resolve, Math.max(500, text.length * 100));
      }
    });
  }

  /**
   * Mevcut sesleri listeler - hem yerleşik hem de yeni eklenen sesler
   */
  async getVoices() {
    try {
      // Önce yerleşik voice'ları al
      const response = await fetch('/api/speech', {
        method: 'GET',
      });

      let builtInVoices = [];
      if (response.ok) {
        const data = await response.json();
        builtInVoices = data.voices || [];
      }

      // Sonra yeni voice'ları da çekmeye çalış
      try {
        const newVoicesResponse = await fetch('/api/speech/voices');
        if (newVoicesResponse.ok) {
          const newVoicesData = await newVoicesResponse.json();
          const newVoices = (newVoicesData.newVoices || []).map((voice: any) => ({
            id: voice.id,
            name: voice.name,
            description: voice.description,
            language: voice.language || 'tr',
            gender: this.detectGenderFromName(voice.name) || 'unknown',
            category: voice.category || 'unknown',
            isVerified: voice.isVerified || false,
            isNew: true, // Yeni voice'ları işaretle
            traits: ['new_voice'],
            bestFor: ['general']
          }));

          console.log(`🆕 Found ${newVoices.length} new voices`);
          
          // Duplicate voice'ları filtrele - unique ID'leri kullan
          const allVoices = [...builtInVoices];
          const existingIds = new Set(builtInVoices.map((v: any) => v.id));
          
          newVoices.forEach((newVoice: any) => {
            if (!existingIds.has(newVoice.id)) {
              allVoices.push(newVoice);
              existingIds.add(newVoice.id);
              console.log(`➕ Added unique new voice: ${newVoice.name} (${newVoice.id})`);
            } else {
              console.log(`⚠️ Skipping duplicate voice: ${newVoice.name} (${newVoice.id})`);
            }
          });
          
          console.log(`📊 Final voice count: ${allVoices.length} (${builtInVoices.length} built-in + ${allVoices.length - builtInVoices.length} new)`);
          
          return allVoices;
        }
      } catch (newVoicesError) {
        console.warn('New voices could not be fetched:', newVoicesError);
      }

      // Sadece yerleşik voice'ları döndür
      return builtInVoices;
      
    } catch (error) {
      console.error('Voices API error:', error);
      // Fallback: En azından yerleşik voice'ları döndür
      return getAllTurkishVoices();
    }
  }

  /**
   * Voice isminden cinsiyet tahmin et (yardımcı fonksiyon)
   */
  private detectGenderFromName(name: string): 'male' | 'female' | 'unknown' {
    const maleNames = ['adam', 'josh', 'antoni', 'daniel', 'ethan', 'marcus', 'david', 'mike', 'john'];
    const femaleNames = ['bella', 'rachel', 'domi', 'elli', 'sarah', 'alice', 'anna', 'emma', 'sophia'];
    
    const lowerName = name.toLowerCase();
    
    if (maleNames.some(male => lowerName.includes(male))) return 'male';
    if (femaleNames.some(female => lowerName.includes(female))) return 'female';
    
    return 'unknown';
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
    // Clear all cached blob data (no need to revoke URLs since we create them on-demand)
    this.cache.clear();
    console.log('🧹 ElevenLabs cache cleared');
  }
}

// Global instance - singleton pattern
const elevenLabsClient = new ElevenLabsClient();

// Export client and utility functions
export default elevenLabsClient;
export { ElevenLabsAPIError, ElevenLabsPlaybackError };

// Multi-voice selection function
export function getSelectedTurkishVoices() {
  return Object.values(SELECTED_TURKISH_VOICES);
}

export function getVoiceBySlug(slug: string) {
  const voiceKey = Object.keys(SELECTED_TURKISH_VOICES).find(key => 
    SELECTED_TURKISH_VOICES[key as keyof typeof SELECTED_TURKISH_VOICES].name.toLowerCase().replace(/\s/g, '-') === slug
  );
  return voiceKey ? SELECTED_TURKISH_VOICES[voiceKey as keyof typeof SELECTED_TURKISH_VOICES] : null;
}

export function getVoiceById(voiceId: string) {
  return Object.values(SELECTED_TURKISH_VOICES).find(voice => voice.id === voiceId) || null;
}

// Enhanced speak function with voice selection
export async function speakWithVoice(
  text: string, 
  voiceId: string,
  type: 'letter' | 'word' | 'sentence' | 'celebration' = 'sentence'
): Promise<void> {
  return elevenLabsClient.speak(text, type, voiceId);
}

// React Hook for easy component integration with multi-voice support
export function useElevenLabs() {
  return {
    speak: elevenLabsClient.speak.bind(elevenLabsClient),
    speakWithVoice: speakWithVoice,
    textToSpeech: elevenLabsClient.textToSpeech.bind(elevenLabsClient),
    getVoices: elevenLabsClient.getVoices.bind(elevenLabsClient),
    getSelectedTurkishVoices: getSelectedTurkishVoices,
    getVoiceBySlug: getVoiceBySlug,
    getVoiceById: getVoiceById,
    testVoice: elevenLabsClient.testVoice.bind(elevenLabsClient),
    getApiStatus: elevenLabsClient.getApiStatus.bind(elevenLabsClient),
    clearCache: elevenLabsClient.clearCache.bind(elevenLabsClient),
    stopCurrentAudio: elevenLabsClient.stopCurrentAudio.bind(elevenLabsClient),
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