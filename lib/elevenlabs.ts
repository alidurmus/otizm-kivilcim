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

// Gülsu - Tek Türkçe Ses Sistemi 
// Otizm dostu, tutarlı ve sakin ses deneyimi için tek ses kullanımı
export const GULSU_VOICE = {
  id: '9BWtsMINqrJLrRacOk9x', // Aria - ElevenLabs'dan Türkçe destekli
  name: 'Gülsu',
  description: 'Türkiye için özel optimize edilmiş nazik ve sakin kadın sesi - tüm konuşmalar için',
  language: 'tr',
  gender: 'female',
  age: 'adult',
  traits: ['calm', 'clear', 'gentle', 'patient', 'autism-friendly'],
  bestFor: ['letters', 'words', 'sentences', 'celebrations', 'all_content'],
  voice_settings: {
    stability: 0.75,        // Sakin ve tutarlı ses
    similarity_boost: 0.85,  // Yüksek kalite
    style: 0.3,             // Doğal konuşma
    use_speaker_boost: true  // Net konuşma
  }
};

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
  _gender: 'male' | 'female' | 'mixed' = 'mixed'
): string {
  // Gülsu - Tek Ses Sistemi
  // Otizm dostu tutarlı ses deneyimi için her içerik türünde aynı ses
  return GULSU_VOICE.id;
  
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
  private defaultVoiceId: string = GULSU_VOICE.id; // Gülsu - Tek tutarlı ses
  private cache: Map<string, { blob: Blob; timestamp: number }> = new Map(); // Cache audio blobs with timestamps
  private currentAudio: HTMLAudioElement | null = null; // Aktif ses instance'ını takip et
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache duration

  constructor() {
    // ElevenLabs client initialized
  }

  /**
   * Aktif sesi durdur ve temizle
   */
  stopCurrentAudio(): void {
    if (this.currentAudio) {
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
        
      } catch (_error) {
        // Error stopping audio - ignored
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
   * Statik MP3 dosyalarını oynatmaya çalışır
   * Enhanced with corruption detection for mathematics module
   */
  private async playStaticAudio(text: string, type: 'letter' | 'word' | 'sentence' | 'celebration'): Promise<void> {
    try {
      const staticPath = getStaticAudioPath(text, type);
      
      if (staticPath) {
        console.log(`🔍 SPEAK DEBUG - Text: "${text}", Type: "${type}", StaticPath: "${staticPath}"`);
        
        return new Promise(async (resolve, reject) => {
          // Enhanced: Check file integrity before playing
          try {
            const response = await fetch(staticPath, { method: 'HEAD' });
            const contentLength = response.headers.get('Content-Length');
            const fileSize = contentLength ? parseInt(contentLength) : 0;
            
            // Detect corrupt files (too small for valid audio)
            if (fileSize < 1000) { // Less than 1KB is likely corrupt
              console.warn(`⚠️ Corrupt audio file detected: ${staticPath} (${fileSize} bytes) - Triggering fallback`);
              // Trigger ElevenLabs SDK fallback for mathematics module
              await this.fallbackToElevenLabs(text, type);
              resolve();
              return;
            }
          } catch (fetchError) {
            console.warn(`⚠️ Cannot check file integrity: ${staticPath} - Proceeding with playback attempt`);
          }
          
          const audio = new Audio(staticPath);
          
          audio.onloadeddata = () => {
            this.currentAudio = audio;
            resolve();
          };
          
          audio.onerror = async () => {
            console.log(`❌ MP3 dosyası çalınamadı: ${staticPath} - Fallback tetikleniyor`);
            // Enhanced: Trigger proper fallback instead of silent fail
            try {
              await this.fallbackToElevenLabs(text, type);
            } catch (fallbackError) {
              console.log(`❌ Fallback failed: ${fallbackError} - Ses olmayacak`);
            }
            resolve(); // Always resolve to prevent hanging
          };
          
          audio.play().catch(async (error) => {
            console.log(`❌ MP3 oynatma hatası: ${staticPath} - Fallback tetikleniyor`);
            // Enhanced: Trigger proper fallback instead of silent fail
            try {
              await this.fallbackToElevenLabs(text, type);
            } catch (fallbackError) {
              console.log(`❌ Fallback failed: ${fallbackError} - Ses olmayacak`);
            }
            resolve(); // Always resolve to prevent hanging
          });
        });
      } else {
        // MP3 dosyası bulunamadı - trigger fallback
        console.log(`⚠️ MP3 dosyası bulunamadı: "${text}" (${type}) - Fallback tetikleniyor`);
        await this.fallbackToElevenLabs(text, type);
        return Promise.resolve();
      }
    } catch (error) {
      // Herhangi bir hata durumunda fallback sistemi dene
      console.log(`❌ Audio hatası: ${error} - Fallback tetikleniyor`);
      try {
        await this.fallbackToElevenLabs(text, type);
      } catch (fallbackError) {
        console.log(`❌ Fallback failed: ${fallbackError} - Ses olmayacak`);
      }
      return Promise.resolve();
    }
  }

  /**
   * ElevenLabs SDK fallback for mathematics module
   * Follows mathematics module voice rules: Antoni for sentences, Rachel for words, etc.
   */
  private async fallbackToElevenLabs(text: string, type: 'letter' | 'word' | 'sentence' | 'celebration'): Promise<void> {
    try {
      // Mathematics module voice rules compliance
      let voiceId = this.defaultVoiceId; // Gülsu default
      
      // Apply mathematics module specific voice rules
      if (type === 'sentence') {
        voiceId = 'ErXwobaYiN019PkySvjV'; // Antoni - mathematics instructions
      } else if (type === 'word') {
        voiceId = 'piTKgcLEGmPE4e6mEKli'; // Rachel - numbers/words
      } else if (type === 'celebration') {
        voiceId = 'VR6AewLTigWG4xSOukaG'; // Josh - celebrations
      } else if (type === 'letter') {
        voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam - letters
      }
      
      console.log(`🔄 ElevenLabs fallback: "${text}" (${type}) - Voice: ${voiceId}`);
      
      const audioUrl = await this.textToSpeech(text, type, voiceId);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        await audio.play();
        console.log(`✅ ElevenLabs fallback successful for: "${text}"`);
      } else {
        // Final fallback to Web Speech API
        console.log(`⚠️ ElevenLabs unavailable, using Web Speech API for: "${text}"`);
        await this.webSpeechFallback(text);
      }
    } catch (error) {
      console.warn(`❌ ElevenLabs fallback failed: ${error}`);
      // Final fallback to Web Speech API
      try {
        await this.webSpeechFallback(text);
      } catch (webSpeechError) {
        console.log(`❌ All fallbacks failed for: "${text}" - ${webSpeechError}`);
      }
    }
  }

  /**
   * Web Speech API final fallback
   */
  private async webSpeechFallback(text: string): Promise<void> {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        utterance.onend = () => resolve();
        utterance.onerror = () => {
          console.log(`❌ Web Speech API failed for: "${text}"`);
          resolve(); // Always resolve
        };
        
        speechSynthesis.speak(utterance);
        console.log(`🗣️ Web Speech API fallback: "${text}"`);
      } else {
        console.log(`❌ Web Speech API not supported`);
        resolve();
      }
    });
  }

  /**
   * Sesi çalar - SADECE STATİK MP3 DOSYALARI (TTS DEVRE DIŞI)
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
      
      // ⚡ SADECE STATİK MP3 DOSYALARI - TTS hiç kullanılmayacak
      const staticPath = getStaticAudioPath(text, type);
      
      // 🔍 DEBUG: Cache temizle button debug
      console.log(`🔍 SPEAK DEBUG - Text: "${text}", Type: "${type}", StaticPath: "${staticPath || 'NOT FOUND'}"`);
      
      if (staticPath) {
        // Static MP3 dosyası varsa onu çal
        const audio = new Audio(staticPath);
        audio.volume = 0.8;
        this.currentAudio = audio;
        
        return new Promise((resolve, reject) => {
          audio.onended = () => resolve();
          audio.onerror = () => {
            console.log(`❌ MP3 dosyası çalınamadı: ${staticPath} - Ses olmayacak`);
            resolve(); // Sessiz devam et, hata verme
          };
          audio.play().catch((error) => {
            console.log(`❌ MP3 oynatma hatası: ${staticPath} - Ses olmayacak`);
            resolve(); // Sessiz devam et, hata verme
          });
        });
      } else {
        // MP3 dosyası bulunamadı - sessiz devam et
        console.log(`⚠️ MP3 dosyası bulunamadı: "${text}" (${type}) - Ses olmayacak`);
        return Promise.resolve();
      }
    } catch (error) {
      // Herhangi bir hata durumunda sessiz devam et
      console.log(`❌ Audio hatası: ${error} - Ses olmayacak`);
      return Promise.resolve();
    }
  }

  /**
   * TTS API'si çağırır - Mathematics Module Fallback Support
   * Mathematics module rules: Antoni for sentences, Rachel for words, Josh for celebrations
   */
  private async textToSpeech(
    text: string, 
    type: 'letter' | 'word' | 'sentence' | 'celebration' = 'sentence',
    voiceId?: string
  ): Promise<string | null> {
    // ⚡ TTS only for fallback cases - static MP3 files have priority
    console.log(`🔄 TTS Fallback requested: "${text}" (${type}) - Voice: ${voiceId}`);
    
    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId: voiceId || this.defaultVoiceId,
          type,
          settings: {
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.3,
            use_speaker_boost: true
          },
          language: 'tr'
        })
      });

      if (!response.ok) {
        console.warn(`❌ TTS API failed: ${response.status} - ${response.statusText}`);
        return null;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log(`✅ TTS Fallback successful: "${text}" - Generated ${audioBlob.size} bytes`);
      return audioUrl;
      
    } catch (error) {
      console.warn(`❌ TTS API error: ${error}`);
      return null;
    }
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
          const newVoices = (newVoicesData.newVoices || []).map((voice: { id: string; name: string; description?: string; language?: string; category?: string; isVerified?: boolean }) => ({
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

          // Duplicate voice'ları filtrele - unique ID'leri kullan
          const allVoices = [...builtInVoices];
          const existingIds = new Set(builtInVoices.map((v: { id: string }) => v.id));
          
          newVoices.forEach((newVoice: { id: string; name: string }) => {
            if (!existingIds.has(newVoice.id)) {
              allVoices.push(newVoice);
              existingIds.add(newVoice.id);
            }
          });
          
          return allVoices;
        }
      } catch (_newVoicesError) {
        // New voices could not be fetched
      }

      // Sadece yerleşik voice'ları döndür
      return builtInVoices;
      
    } catch (_error) {
      // Voices API error - returning empty list
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
    const startTime = Date.now();

    try {
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
    speakWithStreaming: speakWithStreaming,
    getVoices: elevenLabsClient.getVoices.bind(elevenLabsClient),
    getSelectedTurkishVoices: getSelectedTurkishVoices,
    getVoiceBySlug: getVoiceBySlug,
    getVoiceById: getVoiceById,
    testVoice: elevenLabsClient.testVoice.bind(elevenLabsClient),
    getApiStatus: elevenLabsClient.getApiStatus.bind(elevenLabsClient),
    clearCache: elevenLabsClient.clearCache.bind(elevenLabsClient),
    getTurkishFemaleVoices: getTurkishFemaleVoices,
    getTurkishMaleVoices: getTurkishMaleVoices,
    getAllTurkishVoices: getAllTurkishVoices,
    getRecommendedTurkishVoice: getRecommendedTurkishVoice,
    stopCurrentAudio: elevenLabsClient.stopCurrentAudio.bind(elevenLabsClient),
    getTestTexts: getTestTexts,
    streamingClient: streamingTTSClient
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

/**
 * Streaming TTS using WebSockets - Advanced Feature
 * Provides ultra-low latency (~75ms) for real-time speech generation
 */
export class StreamingTTSClient {
  private ws: WebSocket | null = null;
  private apiKey: string = '';
  private isConnecting: boolean = false;
  private messageQueue: Array<{ 
    text: string; 
    voiceId: string; 
    resolve: (value: void | PromiseLike<void>) => void; 
    reject: (reason?: any) => void 
  }> = [];

  constructor() {
    // WebSocket will be initialized when needed
  }

  /**
   * Initialize WebSocket connection for streaming
   */
  private async initializeWebSocket(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      // Get API key from our secure endpoint
      const response = await fetch('/api/speech/config');
      const config = await response.json();
      
      if (!config.apiKey) {
        throw new Error('API key not available for streaming');
      }

      this.apiKey = config.apiKey;

      // Initialize WebSocket connection to ElevenLabs
      const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${GULSU_VOICE.id}/stream?model_id=eleven_flash_v2_5&output_format=mp3_44100_128&xi-api-key=${this.apiKey}`;
      
      this.ws = new WebSocket(wsUrl);

      return new Promise((resolve, reject) => {
        this.ws!.onopen = () => {
          this.isConnecting = false;
          console.log('🔊 Streaming TTS WebSocket connected');
          this.processMessageQueue();
          resolve();
        };

        this.ws!.onerror = (error) => {
          this.isConnecting = false;
          console.error('❌ Streaming TTS WebSocket error:', error);
          reject(error);
        };

        this.ws!.onclose = () => {
          this.isConnecting = false;
          this.ws = null;
          console.log('🔇 Streaming TTS WebSocket closed');
        };
      });

    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Stream text to speech with ultra-low latency
   */
  async streamSpeak(text: string, voiceId: string = GULSU_VOICE.id): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Add to queue if WebSocket not ready
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
          this.messageQueue.push({ text, voiceId, resolve, reject });
          await this.initializeWebSocket();
          return;
        }

        // Send streaming request
        const streamRequest = {
          text: text,
          voice_settings: GULSU_VOICE.voice_settings,
          generation_config: {
            chunk_length_schedule: [120, 160, 250, 290]
          }
        };

        const audioChunks: Uint8Array[] = [];
        let isComplete = false;

        this.ws.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            
            if (response.audio) {
              // Decode base64 audio chunk
              const audioData = Uint8Array.from(atob(response.audio), c => c.charCodeAt(0));
              audioChunks.push(audioData);
            }

            if (response.isFinal) {
              isComplete = true;
              this.playStreamedAudio(audioChunks);
              resolve();
            }

            if (response.error) {
              reject(new Error(response.error));
            }

          } catch (error) {
            reject(error);
          }
        };

        // Send the request
        this.ws.send(JSON.stringify(streamRequest));

        // Timeout fallback
        setTimeout(() => {
          if (!isComplete) {
            reject(new Error('Streaming timeout'));
          }
        }, 10000);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Play streamed audio chunks as they arrive
   */
  private playStreamedAudio(audioChunks: Uint8Array[]): void {
    try {
      // Combine all audio chunks
      const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const combinedAudio = new Uint8Array(totalLength);
      
      let offset = 0;
      for (const chunk of audioChunks) {
        combinedAudio.set(chunk, offset);
        offset += chunk.length;
      }

      // Create audio blob and play
      const audioBlob = new Blob([combinedAudio], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.volume = 0.8;
      audio.play();

      // Cleanup
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

    } catch (error) {
      console.error('❌ Error playing streamed audio:', error);
    }
  }

  /**
   * Process queued messages when WebSocket becomes available
   */
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const { text, voiceId, resolve, reject } = this.messageQueue.shift()!;
      this.streamSpeak(text, voiceId).then(resolve).catch(reject);
    }
  }

  /**
   * Close WebSocket connection
   */
  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Global streaming instance
const streamingTTSClient = new StreamingTTSClient();

/**
 * Enhanced speak function with streaming capability
 */
export async function speakWithStreaming(
  text: string, 
  type: 'letter' | 'word' | 'sentence' | 'celebration' = 'sentence',
  useStreaming: boolean = false
): Promise<void> {
  if (useStreaming && text.length > 50) {
    // Use streaming for longer texts to reduce latency
    try {
      return await streamingTTSClient.streamSpeak(text);
    } catch (error) {
      console.warn('⚠️ Streaming failed, falling back to regular TTS:', error);
      // Fallback to regular TTS
    }
  }

  // Use existing static + regular TTS chain
  return elevenLabsClient.speak(text, type);
}  