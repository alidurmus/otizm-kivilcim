# Veritabanı Mimarisi ve Veri Modeli

Bu doküman, Kıvılcım platformunun Firebase Firestore tabanlı veritabanı yapısını, 10 aktif modül için veri modellerini, gender-balanced voice system tracking'ini ve enhanced analytics'i detaylandırır.

## 🏗️ Genel Mimari

### Teknoloji Stack
- **Database:** Firebase Firestore (NoSQL, Document-based)
- **Real-time Updates:** Firestore real-time listeners
- **Security:** Firestore Security Rules
- **Backup:** Automatic daily Firebase backups
- **Analytics:** Firebase Analytics + Custom event tracking
- **Voice Tracking:** Gender-balanced usage analytics

### Veritabanı Yapısı
```
kivilcim-db/
├── users/                     # Kullanıcı profilleri
├── modules/                   # 10 aktif modül metadata'sı
├── progress/                  # İlerleme takibi (10 modül)
├── sessions/                  # Oturum verileri
├── voice_usage/               # Gender-balanced voice tracking (YENİ)
├── audio_files/               # Static audio file metadata (YENİ)
├── analytics/                 # Gelişmiş analitik veriler
├── admin/                     # Admin panel verileri
└── settings/                  # Platform ayarları
```

## 👤 Users Collection

### Kullanıcı Profili
```typescript
interface User {
  id: string;                           // Auto-generated UID
  email: string;                        // Authentication email
  displayName: string;                  // Çocuğun adı
  dateOfBirth: Timestamp;               // Doğum tarihi
  diagnosis: {
    type: 'autism' | 'asperger' | 'pdd' | 'other';
    severity: 'mild' | 'moderate' | 'severe';
    diagnosisDate: Timestamp;
    clinicianNotes?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'high-contrast';
    language: 'tr' | 'en';              // Türkçe öncelik
    voicePreference: {                   // YENİ: Gender-balanced voice preferences
      preferredGender: 'male' | 'female' | 'mixed';
      preferredVoices: {
        letter: 'Adam' | 'Bella';       // Male/Female seçeneği
        word: 'Rachel';                 // Fixed female voice
        sentence: 'Antoni';             // Fixed male voice
        celebration: 'Josh';            // Fixed male voice
      };
      volume: number;                   // 0-1 arası
      speechRate: number;               // 0.5-2 arası
    };
    accessibility: {
      reduceMotion: boolean;
      highContrast: boolean;
      fontSize: 'small' | 'medium' | 'large';
      touchSensitivity: 'low' | 'medium' | 'high';
    };
  };
  parentInfo: {
    name: string;
    email: string;
    phone?: string;
    relationship: 'mother' | 'father' | 'guardian' | 'caregiver';
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt: Timestamp;
  isActive: boolean;
  subscription: {
    type: 'free' | 'premium' | 'educator' | 'institution';
    startDate: Timestamp;
    endDate?: Timestamp;
    features: string[];                 // Erişilebilir özellikler
  };
}
```

## 📚 Modules Collection (10 Aktif Modül)

### Modül Metadata'sı
```typescript
interface Module {
  id: string;                           // module-{slug}
  name: string;                         // Türkçe modül adı
  slug: string;                         // URL slug
  description: string;                  // Modül açıklaması
  icon: string;                         // Modül ikonu
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;            // Dakika cinsinden
  learningObjectives: string[];         // Öğrenme hedefleri
  prerequisites: string[];              // Önkoşul modüller
  voiceConfiguration: {                 // YENİ: Voice assignments per module
    primaryVoice: VoiceConfig;
    fallbackVoices: VoiceConfig[];
    contentTypes: {
      letter?: 'Adam' | 'Bella';
      word?: 'Rachel';
      sentence?: 'Antoni';
      celebration?: 'Josh';
    };
  };
  isActive: boolean;                    // 10 modül = true
  order: number;                        // Modül sıralaması
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 10 Aktif Modül Listesi
const ACTIVE_MODULES = [
  'alphabet-reading',      // YENİ MODÜL
  'vocabulary',
  'social-communication',
  'writing',
  'basic-concepts',
  'mathematics',           // YENİ MODÜL - Matematik Dünyası
  'music-room',
  'video-room',
  'literacy',
  'puzzle'
];

interface VoiceConfig {
  voiceId: string;                      // ElevenLabs voice ID
  voiceName: string;                    // Display name
  gender: 'male' | 'female';           // Gender tracking
  language: 'tr';                       // Turkish only
  settings: {
    stability: number;                  // 0-1
    similarityBoost: number;            // 0-1
    style: number;                      // 0-1
    useSpeakerBoost: boolean;
  };
}
```

## 📊 Progress Collection (10 Modül Tracking)

### Genel İlerleme Takibi
```typescript
interface Progress {
  id: string;                           // user-{userId}
  userId: string;                       // User reference
  overallStats: {
    totalModulesActive: 10;             // 10 aktif modül
    completedModules: number;           // Tamamlanan modül sayısı
    totalActivitiesCompleted: number;   // Toplam aktivite
    totalTimeSpent: number;             // Toplam süre (dakika)
    averageScorePercentage: number;     // Ortalama başarı %
    currentStreak: number;              // Günlük seri
    longestStreak: number;              // En uzun seri
  };
  moduleProgress: {
    [moduleId: string]: ModuleProgress; // 10 modül için detay
  };
  voiceUsageStats: {                    // YENİ: Gender-balanced voice tracking
    totalVoiceInteractions: number;
    genderDistribution: {
      male: number;                     // Adam, Antoni, Josh kullanımı
      female: number;                   // Bella, Rachel kullanımı
    };
    voiceSpecificUsage: {
      [voiceName: string]: {
        totalUsage: number;
        averageSessionLength: number;
        preferenceScore: number;        // 1-5 arası
      };
    };
    contentTypeDistribution: {
      letter: number;                   // Harf seslendirme sayısı
      word: number;                     // Kelime seslendirme sayısı
      sentence: number;                 // Cümle seslendirme sayısı
      celebration: number;              // Kutlama mesajı sayısı
    };
  };
  lastUpdated: Timestamp;
}

interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completionPercentage: number;         // 0-100
  activitiesCompleted: number;
  totalActivities: number;
  averageScore: number;                 // 0-100
  timeSpent: number;                    // Dakika cinsinden
  bestScore: number;                    // En yüksek skor
  attemptsCount: number;                // Deneme sayısı
  lastActivityAt: Timestamp;
  firstStartedAt: Timestamp;
  completedAt?: Timestamp;
  
  // Modül spesifik metrikler
  specificStats: {
    // Alfabe Okuma için
    alphabetLearning?: {
      lettersLearned: string[];         // Öğrenilen harfler
      vowelsCompleted: number;          // 8 sesli harf
      consonantsCompleted: number;      // 21 sessiz harf
      quizAccuracy: number;             // Quiz başarı oranı
      difficultyLevels: {
        uppercase: number;              // Büyük harf %
        lowercase: number;              // Küçük harf %
        mixed: number;                  // Karışık mod %
      };
    };
    
    // Kelime Dağarcığı için
    vocabulary?: {
      wordsLearned: number;
      categoriesCompleted: string[];
      memoryGameScore: number;
      matchingAccuracy: number;
    };
    
    // Sosyal İletişim için
    socialCommunication?: {
      emotionsRecognized: string[];     // Tanınan duygular
      socialStoriesCompleted: number;
      communicationPatternsLearned: number;
      scenarioSuccessRate: number;
    };
    
    // Yazma ve İfade için
    writing?: {
      lettersWritten: string[];
      wordsFormed: number;
      sentencesCreated: number;
      storiesWritten: number;
      handwritingAccuracy: number;
    };
    
    // Temel Kavramlar için
    basicConcepts?: {
      colorsLearned: string[];          // 8 temel renk
      shapesLearned: string[];          // 6 geometrik şekil
      numbersLearned: number[];         // 1-10 arası sayılar
      animalsLearned: string[];
      categorizationAccuracy: number;
    };
    
    // Müzik Odası için
    musicRoom?: {
      songsListened: number;
      rhythmGamesCompleted: number;
      favoriteGenres: string[];
      sessionDuration: number;
      calmingEffectiveness: number;     // 1-5 skala
    };
    
    // Video Odası için
    videoRoom?: {
      videosWatched: number;
      categoriesExplored: string[];
      watchTimeTotal: number;
      interactionLevel: number;         // 1-5 skala
    };
    
    // Okuryazarlık için
    literacy?: {
      lettersRecognized: string[];
      syllablesCombined: number;
      wordsRead: number;
      sentencesUnderstood: number;
      readingLevel: 'beginner' | 'intermediate' | 'advanced';
    };
    
    // Puzzle Oyunu için
    puzzle?: {
      puzzlesCompleted: number;
      difficultyLevels: {
        easy: number;                   // 4 parça
        medium: number;                 // 9 parça
        hard: number;                   // 16 parça
      };
      themes: {
        animals: number;
        fruits: number;
        vehicles: number;
        shapes: number;
      };
      averageCompletionTime: number;
      bestCompletionTime: number;
    };
    
    // Matematik Dünyası için
    mathematics?: {
      numbersLearned: number[];         // 1-10 arası sayılar
      additionProblemsCompleted: number; // Toplama sorularını
      subtractionProblemsCompleted: number; // Çıkarma soruları
      shapesNumbersMatched: number;     // Şekil-sayı eşleştirme
      countingAccuracy: number;         // Sayma doğruluğu %
      mathConceptsUnderstood: string[]; // Anlaşılan matematik kavramları
      difficultyLevels: {
        basic: number;                  // 1-5 arası sayılar %
        intermediate: number;           // 6-10 arası sayılar %
        advanced: number;               // Toplama/çıkarma %
      };
      problemSolvingTime: number;       // Ortalama çözüm süresi (saniye)
      visualMathAccuracy: number;       // Görsel matematik doğruluk %
    };
  };
}
```

## 🔊 Voice Usage Collection (YENİ)

### Gender-Balanced Voice Tracking
```typescript
interface VoiceUsage {
  id: string;                           // usage-{timestamp}
  userId: string;
  sessionId: string;
  voiceData: {
    voiceId: string;                    // ElevenLabs voice ID
    voiceName: 'Adam' | 'Antoni' | 'Josh' | 'Bella' | 'Rachel';
    gender: 'male' | 'female';
    contentType: 'letter' | 'word' | 'sentence' | 'celebration';
    text: string;                       // Seslendirilen metin
    textLength: number;                 // Karakter sayısı
    language: 'tr';                     // Turkish only
    turkishCharacters: string[];        // Kullanılan Türkçe karakterler
  };
  audioSource: {
    type: 'static_file' | 'elevenlabs_sdk' | 'api_route' | 'web_speech';
    loadTime: number;                   // Milisaniye
    fileSize?: number;                  // Static file için byte
    apiResponseTime?: number;           // ElevenLabs API için ms
    fallbackReason?: string;            // Fallback nedeni
  };
  userInteraction: {
    moduleId: string;                   // Hangi modülde kullanıldı
    activityType: string;               // Aktivite türü
    userSatisfaction?: number;          // 1-5 arası (opsiyonel feedback)
    playbackCompleted: boolean;         // Ses tamamlandı mı
    playbackDuration: number;           // Gerçek oynatma süresi
    userInitiated: boolean;             // Kullanıcı tetikledi mi
  };
  performance: {
    audioQuality: 'high' | 'medium' | 'low';
    pronunciationAccuracy: number;      // Turkish phoneme accuracy (1-5)
    speedAppropriate: boolean;          // Çocuk için uygun hız
    clarityRating: number;              // Netlik puanı (1-5)
  };
  timestamp: Timestamp;
  deviceInfo: {
    userAgent: string;
    platform: string;
    audioSupport: string[];             // Desteklenen audio formatları
  };
}
```

## 🎵 Audio Files Collection (YENİ)

### Static Audio Files Metadata
```typescript
interface AudioFile {
  id: string;                           // audio-{type}-{content}
  fileName: string;                     // 'a.mp3', 'ch.mp3' etc.
  filePath: string;                     // '/public/audio/letters/a.mp3'
  contentType: 'letter' | 'word' | 'sentence' | 'celebration';
  content: string;                      // 'A', 'elma', 'Merhaba' etc.
  voiceGenerated: {
    voiceName: 'Adam' | 'Antoni' | 'Josh' | 'Rachel' | 'Bella';
    voiceId: string;                    // ElevenLabs voice ID
    gender: 'male' | 'female';
    generationDate: Timestamp;
    settings: {
      stability: number;
      similarityBoost: number;
      style: number;
      useSpeakerBoost: boolean;
    };
  };
  fileMetadata: {
    format: 'mp3' | 'wav' | 'ogg';
    duration: number;                   // Saniye cinsinden
    fileSize: number;                   // Byte cinsinden
    bitrate: number;                    // kbps
    sampleRate: number;                 // Hz
    quality: 'high' | 'medium' | 'low';
  };
  turkishCharacterInfo?: {
    isSpecialTurkishChar: boolean;      // Ç, Ğ, I, İ, Ö, Ş, Ü
    urlSafeMapping: string;             // 'ch', 'gh', 'ii', etc.
    phoneticTranscription: string;      // IPA notation
  };
  usageStats: {
    totalPlays: number;
    uniqueUsers: number;
    averageLoadTime: number;            // ms
    cacheHitRate: number;               // %
    lastUsed: Timestamp;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 📈 Analytics Collection (Enhanced)

### Gelişmiş Analitik Veriler
```typescript
interface Analytics {
  id: string;                           // analytics-{date}
  date: string;                         // YYYY-MM-DD format
  period: 'daily' | 'weekly' | 'monthly';
  
  platformStats: {
    totalActiveUsers: number;
    newRegistrations: number;
    totalSessions: number;
    averageSessionDuration: number;     // Dakika
    retentionRate: {
      day1: number;                     // %
      day7: number;                     // %
      day30: number;                    // %
    };
  };
  
  moduleUsage: {
    [moduleId: string]: {
      activeUsers: number;
      sessionsStarted: number;
      sessionsCompleted: number;
      averageTimeSpent: number;
      completionRate: number;           // %
      userSatisfactionScore: number;    // 1-5
    };
  };
  
  voiceSystemAnalytics: {               // YENİ: Gender-balanced voice analytics
    totalVoiceInteractions: number;
    genderUsageDistribution: {
      male: {
        percentage: number;             // Target: ~60%
        totalUsage: number;
        voices: {
          Adam: number;
          Antoni: number;
          Josh: number;
        };
      };
      female: {
        percentage: number;             // Target: ~40%
        totalUsage: number;
        voices: {
          Bella: number;
          Rachel: number;
        };
      };
    };
    contentTypeBreakdown: {
      letter: {
        totalUsage: number;
        primaryVoice: 'Adam';           // 90%+ Adam usage expected
        fallbackUsage: number;          // Bella usage %
      };
      word: {
        totalUsage: number;
        primaryVoice: 'Rachel';         // 100% Rachel expected
      };
      sentence: {
        totalUsage: number;
        primaryVoice: 'Antoni';         // 100% Antoni expected
      };
      celebration: {
        totalUsage: number;
        primaryVoice: 'Josh';           // 100% Josh expected
      };
    };
    audioSourceDistribution: {
      staticFiles: {
        usage: number;
        percentage: number;             // Target: 70%+
        averageLoadTime: number;        // Target: <100ms
      };
      elevenLabsSDK: {
        usage: number;
        percentage: number;             // Target: 20-25%
        averageResponseTime: number;    // Target: <300ms
      };
      apiRoute: {
        usage: number;
        percentage: number;             // Target: 5-10%
        averageResponseTime: number;
      };
      webSpeechAPI: {
        usage: number;
        percentage: number;             // Target: <5%
        fallbackReason: string[];
      };
    };
    qualityMetrics: {
      userSatisfactionScore: number;    // 1-5, target: >4.0
      pronunciationAccuracy: number;    // 1-5, target: >4.2
      audioClarity: number;             // 1-5, target: >4.0
      speedAppropriate: number;         // 1-5, target: >4.0
      turkishCharacterAccuracy: number; // Specific to Turkish phonemes
    };
    costEfficiency: {
      totalCost: number;                // USD
      costPerInteraction: number;       // USD
      staticFileSavings: number;        // USD saved vs full API
      monthlyCostTrend: number[];       // Monthly progression
    };
  };
  
  userBehaviorPatterns: {
    preferredModules: string[];         // En popüler 5 modül
    sessionTimeDistribution: {
      morningUsers: number;             // 6-12
      afternoonUsers: number;           // 12-18
      eveningUsers: number;             // 18-24
      weekendUsers: number;
    };
    deviceUsage: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    genderPreferences: {
      prefersMaleVoices: number;        // Kullanıcı sayısı
      prefersFemaleVoices: number;
      prefersMixedVoices: number;
      noPreference: number;
    };
  };
  
  technicalPerformance: {
    averagePageLoadTime: number;        // ms
    audioLoadingPerformance: {
      staticFiles: number;              // ms
      elevenLabsAPI: number;            // ms
      fallbackAPI: number;              // ms
    };
    errorRates: {
      voiceGenerationErrors: number;    // %
      audioPlaybackErrors: number;      // %
      networkErrors: number;            // %
    };
    uptime: number;                     // % 
  };
  
  createdAt: Timestamp;
}
```

## 🎮 Sessions Collection

### Oturum Takibi
```typescript
interface Session {
  id: string;                           // session-{timestamp}
  userId: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration?: number;                    // Dakika cinsinden
  
  activities: {
    moduleId: string;
    activityType: string;
    startTime: Timestamp;
    endTime?: Timestamp;
    score?: number;                     // 0-100
    completed: boolean;
    attemptsCount: number;
    voiceInteractions: {
      count: number;
      voicesUsed: string[];             // Kullanılan ses isimleri
      genderBalance: {
        male: number;
        female: number;
      };
      contentTypes: {
        letter: number;
        word: number;
        sentence: number;
        celebration: number;
      };
    };
    userActions: UserAction[];          // Detayında aşağıda
  }[];
  
  deviceInfo: {
    userAgent: string;
    screenResolution: string;
    platform: 'mobile' | 'tablet' | 'desktop';
    browserName: string;
    browserVersion: string;
    audioCapabilities: string[];
  };
  
  performanceMetrics: {
    averageResponseTime: number;        // ms
    totalInteractions: number;
    errorCount: number;
    audioLoadTimes: {
      average: number;                  // ms
      median: number;                   // ms
      p95: number;                      // ms
    };
  };
}

interface UserAction {
  timestamp: Timestamp;
  actionType: 'click' | 'drag' | 'drop' | 'voice_request' | 'quiz_answer' | 'navigation';
  moduleId: string;
  activityId?: string;
  elementId?: string;                   // DOM element reference
  voiceData?: {
    text: string;
    voiceName: string;
    contentType: string;
    loadTime: number;
    source: 'static' | 'api' | 'fallback';
  };
  quizData?: {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    responseTime: number;               // ms
  };
  errorData?: {
    errorType: string;
    errorMessage: string;
    stackTrace?: string;
  };
}
```

## 🔧 Admin Collection

### Admin Panel Verileri
```typescript
interface AdminData {
  id: string;
  
  systemStats: {
    totalUsers: number;
    activeUsers24h: number;
    totalSessions: number;
    averageSessionLength: number;
    systemUptime: number;               // %
    lastUpdated: Timestamp;
  };
  
  voiceSystemAdmin: {                   // YENİ: Enhanced voice administration
    elevenLabsStatus: {
      apiKeyValid: boolean;
      accountInfo: {
        characterLimit: number;
        charactersUsed: number;
        resetDate: Timestamp;
      };
      voiceStatistics: {
        totalVoices: 5;
        maleVoices: 3;                  // Adam, Antoni, Josh
        femaleVoices: 2;                // Bella, Rachel
        turkishCapableVoices: 5;
      };
      monthlyUsage: {
        totalCharacters: number;
        costUSD: number;
        charactersByVoice: {
          [voiceName: string]: number;
        };
        charactersByContentType: {
          letter: number;
          word: number;
          sentence: number;
          celebration: number;
        };
      };
    };
    
    staticAudioFiles: {
      totalFiles: number;
      totalSizeBytes: number;
      filesByType: {
        letters: number;                // 29 Turkish letters
        words: number;
        sentences: number;
        celebrations: number;
      };
      generationStatus: {
        lastGenerated: Timestamp;
        generationInProgress: boolean;
        failedGenerations: number;
        successRate: number;            // %
      };
      performance: {
        averageLoadTime: number;        // ms
        cacheHitRate: number;           // %
        bandwidthUsage: number;         // GB
      };
    };
    
    qualityAssurance: {
      turkishPronunciationTests: {
        lastTestDate: Timestamp;
        testResults: {
          [voiceName: string]: {
            accuracy: number;           // 1-5
            clarity: number;            // 1-5
            naturalness: number;        // 1-5
            turkishCharacterSupport: number; // 1-5
          };
        };
      };
      userFeedback: {
        averageRating: number;          // 1-5
        totalFeedbacks: number;
        voiceSpecificRatings: {
          [voiceName: string]: number;
        };
      };
    };
  };
  
  moduleManagement: {
    [moduleId: string]: {
      isActive: boolean;
      totalUsers: number;
      averageCompletionRate: number;
      lastContentUpdate: Timestamp;
      reportedIssues: number;
      averageUserRating: number;
    };
  };
  
  userManagement: {
    newRegistrationsToday: number;
    activeSubscriptions: {
      free: number;
      premium: number;
      educator: number;
      institution: number;
    };
    supportTickets: {
      open: number;
      resolved: number;
      averageResolutionTime: number;   // Hours
    };
  };
  
  systemHealth: {
    cpuUsage: number;                   // %
    memoryUsage: number;                // %
    databaseConnections: number;
    apiResponseTimes: {
      average: number;                  // ms
      p95: number;                      // ms
    };
    errorRates: {
      clientErrors: number;             // %
      serverErrors: number;             // %
      voiceApiErrors: number;           // %
    };
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🔒 Security Rules

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - Sadece kendi verilerine erişim
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     resource.data.parentInfo.email == request.auth.token.email;
    }
    
    // Modules - Herkese okuma, admin'e yazma
    match /modules/{moduleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // Progress - Kullanıcıya özel, ebeveyn okuyabilir
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
                           progressId.matches('user-' + request.auth.uid);
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.parentInfo.email == request.auth.token.email;
    }
    
    // Voice Usage - Kullanıcı ve admin erişimi
    match /voice_usage/{usageId} {
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || 
                      request.auth.token.admin == true);
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // Audio Files - Herkese okuma, admin'e yazma
    match /audio_files/{audioId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // Sessions - Kullanıcıya özel
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
    
    // Analytics - Sadece admin
    match /analytics/{analyticsId} {
      allow read, write: if request.auth != null && 
                           request.auth.token.admin == true;
    }
    
    // Admin - Sadece admin
    match /admin/{adminId} {
      allow read, write: if request.auth != null && 
                           request.auth.token.admin == true;
    }
    
    // Settings - Herkese okuma, admin'e yazma
    match /settings/{settingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
  }
}
```

## 🔄 Data Migration & Seeding

### İlk Veri Yükleme
```typescript
// Modules seeding - 10 aktif modül
const seedModules = async () => {
  const modules = [
    {
      id: 'alphabet-reading',
      name: 'Alfabe Okuma',
      slug: 'alphabet-reading',
      description: '29 harflik Türk alfabesini öğrenin',
      icon: '🔤',
      difficulty: 'beginner',
      estimatedDuration: 20,
      learningObjectives: [
        '29 Türk harfini tanıma',
        'Sesli ve sessiz harf ayrımı',
        'Harf-ses ilişkisi kurma',
        'Quiz ile öğrenme pekiştirme'
      ],
      prerequisites: [],
      voiceConfiguration: {
        primaryVoice: {
          voiceId: 'pNInz6obpgDQGcFmaJgB',
          voiceName: 'Adam',
          gender: 'male',
          language: 'tr',
          settings: {
            stability: 0.8,
            similarityBoost: 0.9,
            style: 0.3,
            useSpeakerBoost: true
          }
        },
        contentTypes: {
          letter: 'Adam',
          celebration: 'Josh'
        }
      },
      isActive: true,
      order: 1
    },
    {
      id: 'mathematics',
      name: 'Matematik Dünyası',
      slug: 'mathematics',
      description: 'Sayıları öğrenin ve temel matematik becerilerini geliştirin',
      icon: '🔢',
      difficulty: 'beginner',
      estimatedDuration: 25,
      learningObjectives: [
        '1-10 arası sayı tanıma',
        'Toplama işlemleri',
        'Sayma becerileri',
        'Şekil-sayı eşleştirme',
        'Görsel matematik kavramları'
      ],
      prerequisites: [],
      voiceConfiguration: {
        primaryVoice: {
          voiceId: 'ErXwobaYiN019PkySvjV',
          voiceName: 'Antoni',
          gender: 'male',
          language: 'tr',
          settings: {
            stability: 0.75,
            similarityBoost: 0.85,
            style: 0.4,
            useSpeakerBoost: true
          }
        },
        contentTypes: {
          word: 'Rachel',
          sentence: 'Antoni',
          celebration: 'Josh'
        }
      },
      isActive: true,
      order: 6
    },
    // ... diğer 8 modül
  ];
  
  for (const module of modules) {
    await db.collection('modules').doc(module.id).set({
      ...module,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
};

// Audio files seeding - Static Turkish audio files
const seedAudioFiles = async () => {
  const turkishLetters = [
    'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 
    'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 
    'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
  ];
  
  for (const letter of turkishLetters) {
    const audioFile = {
      id: `audio-letter-${letter.toLowerCase()}`,
      fileName: `${turkishToFilename(letter)}.mp3`,
      filePath: `/public/audio/letters/${turkishToFilename(letter)}.mp3`,
      contentType: 'letter',
      content: letter,
      voiceGenerated: {
        voiceName: 'Adam',
        voiceId: 'pNInz6obpgDQGcFmaJgB',
        gender: 'male',
        generationDate: Timestamp.now(),
        settings: {
          stability: 0.8,
          similarityBoost: 0.9,
          style: 0.3,
          useSpeakerBoost: true
        }
      },
      fileMetadata: {
        format: 'mp3',
        duration: 1.5,
        fileSize: 24000,
        bitrate: 128,
        sampleRate: 44100,
        quality: 'high'
      },
      turkishCharacterInfo: {
        isSpecialTurkishChar: ['Ç', 'Ğ', 'I', 'İ', 'Ö', 'Ş', 'Ü'].includes(letter),
        urlSafeMapping: turkishToFilename(letter),
        phoneticTranscription: getIPATranscription(letter)
      },
      usageStats: {
        totalPlays: 0,
        uniqueUsers: 0,
        averageLoadTime: 0,
        cacheHitRate: 0,
        lastUsed: Timestamp.now()
      },
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await db.collection('audio_files').doc(audioFile.id).set(audioFile);
  }
};
```

## 📊 Queries ve İndeksler

### Sık Kullanılan Sorgular
```typescript
// 1. Kullanıcının modül ilerlemesini getir
const getUserModuleProgress = async (userId: string) => {
  return await db.collection('progress')
               .doc(`user-${userId}`)
               .get();
};

// 2. Gender-balanced voice kullanım istatistikleri
const getVoiceUsageStats = async (userId: string, dateRange: DateRange) => {
  return await db.collection('voice_usage')
               .where('userId', '==', userId)
               .where('timestamp', '>=', dateRange.start)
               .where('timestamp', '<=', dateRange.end)
               .orderBy('timestamp', 'desc')
               .get();
};

// 3. En popüler modülleri getir
const getPopularModules = async () => {
  return await db.collection('analytics')
               .orderBy('date', 'desc')
               .limit(30)
               .get();
};

// 4. Static audio file performance tracking
const getAudioFileStats = async (contentType: string) => {
  return await db.collection('audio_files')
               .where('contentType', '==', contentType)
               .where('isActive', '==', true)
               .orderBy('usageStats.totalPlays', 'desc')
               .get();
};

// 5. Real-time voice system status
const getVoiceSystemStatus = async () => {
  const adminData = await db.collection('admin')
                          .doc('voice_system')
                          .get();
  
  return adminData.data()?.voiceSystemAdmin;
};
```

### Gerekli İndeksler
```javascript
// Firebase Console'da oluşturulması gereken indeksler
const requiredIndexes = [
  // Voice usage için
  {
    collection: 'voice_usage',
    fields: [
      { fieldPath: 'userId', mode: 'ASCENDING' },
      { fieldPath: 'timestamp', mode: 'DESCENDING' }
    ]
  },
  
  // Progress tracking için
  {
    collection: 'progress',
    fields: [
      { fieldPath: 'userId', mode: 'ASCENDING' },
      { fieldPath: 'lastUpdated', mode: 'DESCENDING' }
    ]
  },
  
  // Session analysis için
  {
    collection: 'sessions',
    fields: [
      { fieldPath: 'userId', mode: 'ASCENDING' },
      { fieldPath: 'startTime', mode: 'DESCENDING' }
    ]
  },
  
  // Audio file performance için
  {
    collection: 'audio_files',
    fields: [
      { fieldPath: 'contentType', mode: 'ASCENDING' },
      { fieldPath: 'isActive', mode: 'ASCENDING' },
      { fieldPath: 'usageStats.totalPlays', mode: 'DESCENDING' }
    ]
  },
  
  // Analytics queries için
  {
    collection: 'analytics',
    fields: [
      { fieldPath: 'period', mode: 'ASCENDING' },
      { fieldPath: 'date', mode: 'DESCENDING' }
    ]
  }
];
```

## 🚀 Performans Optimizasyonları

### Veritabanı Optimizasyonu
- **Batch Operations:** Toplu yazma işlemleri için
- **Real-time Listeners:** Sadece gerekli veriler için
- **Subcollections:** Büyük datasetler için partition
- **Caching Strategy:** Critical data için local cache
- **Pagination:** Büyük listeler için sayfalama
- **Selective Queries:** Sadece gerekli alanları getirme

### Voice System Optimizations
- **Static File Priority:** 70%+ usage target
- **Smart Caching:** Gender-specific cache strategies
- **Preloading:** Predictive content loading
- **Batch Generation:** Multiple audio files at once
- **CDN Integration:** Global static file distribution

---

> **Version:** 2.1.0  
> **Son Güncelleme:** Gender-balanced Turkish voice system tracking, 10 aktif modül support (matematik modülü eklendi), static audio files metadata ve enhanced analytics ile kapsamlı olarak güncellenmiştir.  
> **İlgili Dokümanlar:** [API Documentation](./api.md), [Security Guide](./security.md), [Performance Guide](./performance.md)