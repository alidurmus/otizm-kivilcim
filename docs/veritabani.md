# Veritabanı Tasarımı ve Veri Modeli

Bu doküman, Kıvılcım platformunun Firestore veritabanı yapısını ve veri modellerini detaylandırır. Mock fallback sistemi ile Firebase olmadan da çalışabilir.

## 🔥 Firebase Firestore Yapısı

### Koleksiyon Hiyerarşisi
```
kivilcim-firestore/
├── users/{userId}                    # Kullanıcı profilleri
├── progress/{userId}                 # İlerleme verileri
├── settings/{userId}                 # Kullanıcı ayarları
├── sessions/{sessionId}              # Oturum kayıtları
├── analytics/{analyticsId}           # Analitik veriler
├── admin/{adminId}                   # Admin panel verileri
└── elevenlabs/{userId}               # ElevenLabs özel ayarları
```

## 👤 Users Koleksiyonu

### Veri Modeli
```typescript
interface User {
  uid: string;                        // Firebase Auth UID
  email?: string;                     // E-posta adresi
  displayName?: string;               // Görüntülenecek isim
  role: 'child' | 'parent' | 'admin'; // Kullanıcı rolü
  createdAt: Timestamp;               // Hesap oluşturma tarihi
  lastLoginAt: Timestamp;             // Son giriş tarihi
  profile: UserProfile;               // Profil bilgileri
  preferences: UserPreferences;       // Kullanıcı tercihleri
  isActive: boolean;                  // Hesap aktif mi?
}

interface UserProfile {
  firstName: string;                  // İsim
  lastName?: string;                  // Soyisim
  dateOfBirth?: string;               // Doğum tarihi (YYYY-MM-DD)
  gender?: 'male' | 'female' | 'other'; // Cinsiyet
  autismSpectrum?: {
    diagnosed: boolean;               // Tanı konmuş mu?
    diagnosisDate?: string;           // Tanı tarihi
    severity?: 'mild' | 'moderate' | 'severe'; // Şiddet
    specialNeeds?: string[];          // Özel gereksinimler
  };
  parentContact?: {
    name: string;                     // Ebeveyn adı
    email: string;                    // İletişim e-posta
    phone?: string;                   // Telefon numarası
  };
}

interface UserPreferences {
  language: 'tr' | 'en';              // Dil tercihi
  theme: 'light' | 'dark' | 'auto';   // Tema tercihi
  accessibility: AccessibilitySettings;
  audio: AudioSettings;               // Ses ayarları
  notifications: NotificationSettings;
}
```

### Firestore Security Rules
```javascript
// users/{userId}
allow read, write: if request.auth != null && request.auth.uid == resource.id;
allow create: if request.auth != null && request.auth.uid == request.resource.id;
```

## 📊 Progress Koleksiyonu

### Veri Modeli
```typescript
interface Progress {
  userId: string;                     // Kullanıcı ID'si
  moduleId: string;                   // Modül ID'si (7 aktif modül)
  totalActivities: number;            // Toplam aktivite sayısı
  completedActivities: number;        // Tamamlanan aktivite sayısı
  successRate: number;                // Başarı oranı (0-100)
  timeSpent: number;                  // Geçirilen süre (dakika)
  streakDays: number;                 // Ardışık gün sayısı
  lastActivity: Timestamp;            // Son aktivite tarihi
  activities: ActivityProgress[];     // Aktivite detayları
  milestones: Milestone[];            // Başarılan dönüm noktaları
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ActivityProgress {
  activityId: string;                 // Aktivite ID'si
  activityType: ActivityType;         // Aktivite türü
  attempts: number;                   // Deneme sayısı
  successes: number;                  // Başarı sayısı
  bestScore: number;                  // En yüksek puan
  averageTime: number;                // Ortalama süre
  lastAttempt: Timestamp;             // Son deneme
  difficulty: 'easy' | 'medium' | 'hard'; // Zorluk seviyesi
}

type ActivityType = 
  | 'word-matching'                   // Kelime eşleştirme
  | 'memory-game'                     // Hafıza oyunu
  | 'emotion-recognition'             // Duygu tanıma
  | 'social-stories'                  // Sosyal hikayeler
  | 'letter-writing'                  // Harf yazma
  | 'word-building'                   // Kelime oluşturma
  | 'color-recognition'               // Renk tanıma
  | 'shape-matching'                  // Şekil eşleştirme
  | 'number-counting'                 // Sayı sayma
  | 'animal-identification'           // Hayvan tanıma
  | 'music-listening'                 // Müzik dinleme
  | 'rhythm-game'                     // Ritim oyunu
  | 'video-watching'                  // Video izleme
  | 'reading-comprehension'           // Okuma anlama
  | 'phonics-practice';               // Ses bilgisi

interface Milestone {
  id: string;                         // Milestone ID'si
  title: string;                      // Başlık
  description: string;                // Açıklama
  achievedAt: Timestamp;              // Başarıldığı tarih
  badgeIcon: string;                  // Rozet ikonu
  category: 'vocabulary' | 'social' | 'writing' | 'concepts' | 'music' | 'video' | 'literacy';
}
```

## ⚙️ Settings Koleksiyonu

### Veri Modeli
```typescript
interface Settings {
  userId: string;                     // Kullanıcı ID'si
  accessibility: AccessibilitySettings;
  audio: AudioSettings;               // ElevenLabs entegreli ses ayarları
  visual: VisualSettings;
  interaction: InteractionSettings;
  content: ContentSettings;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface AccessibilitySettings {
  highContrast: boolean;              // Yüksek kontrast
  largeText: boolean;                 // Büyük metin
  reducedMotion: boolean;             // Azaltılmış hareket
  screenReader: boolean;              // Ekran okuyucu desteği
  colorBlindness?: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  focusIndicator: boolean;            // Odak göstergesi
}

interface AudioSettings {
  enabled: boolean;                   // Ses etkin mi?
  volume: number;                     // Ses seviyesi (0-100)
  voiceProvider: 'elevenlabs' | 'webspeech' | 'disabled'; // Ses sağlayıcısı
  elevenlabs: ElevenLabsSettings;     // ElevenLabs özel ayarları
  autoPlay: boolean;                  // Otomatik oynatma
  speechRate: number;                 // Konuşma hızı (0.5-2.0)
  backgroundMusic: boolean;           // Arka plan müziği
  soundEffects: boolean;              // Ses efektleri
}

interface ElevenLabsSettings {
  enabled: boolean;                   // ElevenLabs etkin mi?
  voiceId?: string;                   // Seçili ses ID'si
  voiceSettings: {
    letter: VoiceConfig;              // Harf seslendirme
    word: VoiceConfig;                // Kelime seslendirme
    sentence: VoiceConfig;            // Cümle seslendirme
    celebration: VoiceConfig;         // Kutlama sesleri
  };
  fallbackEnabled: boolean;           // Web Speech API fallback
  caching: boolean;                   // Ses cache'leme
  maxRetries: number;                 // Maksimum yeniden deneme
}

interface VoiceConfig {
  stability: number;                  // Kararlılık (0-1)
  similarity_boost: number;           // Benzerlik artırma (0-1)
  style: number;                      // Stil (0-1)
  use_speaker_boost: boolean;         // Hoparlör güçlendirme
}

interface VisualSettings {
  theme: 'light' | 'dark' | 'auto';   // Tema
  colorPalette: string;               // Renk paleti
  animations: boolean;                // Animasyonlar
  particles: boolean;                 // Parçacık efektleri
  fontSize: 'small' | 'medium' | 'large'; // Font boyutu
  cardLayout: 'grid' | 'list';        // Kart düzeni
}

interface InteractionSettings {
  touchSensitivity: number;           // Dokunma hassasiyeti (1-10)
  dragThreshold: number;              // Sürükleme eşiği (px)
  clickDelay: number;                 // Tıklama gecikmesi (ms)
  hapticFeedback: boolean;            // Haptic geri bildirim
  gestureEnabled: boolean;            // Jestler etkin mi?
}

interface ContentSettings {
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  ageGroup: '3-5' | '6-8' | '9-12' | '13+';
  contentFilter: string[];            // İçerik filtreleri
  parentalControls: boolean;          // Ebeveyn kontrolü
  sessionDuration: number;            // Oturum süresi (dakika)
}
```

## 🎮 Sessions Koleksiyonu

### Veri Modeli
```typescript
interface Session {
  sessionId: string;                  // Oturum ID'si
  userId: string;                     // Kullanıcı ID'si
  startTime: Timestamp;               // Başlangıç saati
  endTime?: Timestamp;                // Bitiş saati
  duration?: number;                  // Süre (dakika)
  moduleId: string;                   // Modül ID'si
  activities: SessionActivity[];      // Aktivite kayıtları
  performance: SessionPerformance;    // Performans özeti
  device: DeviceInfo;                 // Cihaz bilgisi
  location?: GeoLocation;             // Konum (ebeveyn izni varsa)
}

interface SessionActivity {
  activityId: string;                 // Aktivite ID'si
  startTime: Timestamp;               // Başlangıç
  endTime: Timestamp;                 // Bitiş
  result: ActivityResult;             // Sonuç
  interactions: Interaction[];        // Etkileşimler
  audioEvents: AudioEvent[];          // Ses olayları (ElevenLabs)
}

interface ActivityResult {
  score: number;                      // Puan (0-100)
  success: boolean;                   // Başarılı mı?
  attempts: number;                   // Deneme sayısı
  hintsUsed: number;                  // Kullanılan ipucu sayısı
  timeToComplete: number;             // Tamamlama süresi (saniye)
  errors: ActivityError[];            // Hatalar
}

interface AudioEvent {
  timestamp: Timestamp;               // Zaman damgası
  type: 'elevenlabs' | 'webspeech' | 'fallback'; // Ses türü
  text: string;                       // Seslendirilme metin
  voiceType: 'letter' | 'word' | 'sentence' | 'celebration'; // Ses türü
  duration?: number;                  // Ses süresi (ms)
  success: boolean;                   // Başarılı mı?
  error?: string;                     // Hata mesajı
}
```

## 📈 Analytics Koleksiyonu

### Veri Modeli
```typescript
interface Analytics {
  id: string;                         // Analytics ID'si
  userId: string;                     // Kullanıcı ID'si
  date: string;                       // Tarih (YYYY-MM-DD)
  dailyStats: DailyStats;             // Günlük istatistikler
  moduleStats: ModuleStats[];         // Modül istatistikleri
  engagementMetrics: EngagementMetrics; // Etkileşim metrikleri
  audioMetrics: AudioMetrics;         // Ses metrikleri (ElevenLabs)
  createdAt: Timestamp;
}

interface DailyStats {
  totalSessionTime: number;           // Toplam oturum süresi
  sessionsCount: number;              // Oturum sayısı
  activitiesCompleted: number;        // Tamamlanan aktivite
  averageScore: number;               // Ortalama puan
  streakDays: number;                 // Ardışık gün
  newMilestones: number;              // Yeni milestone'lar
}

interface ModuleStats {
  moduleId: string;                   // Modül ID'si (7 aktif modül)
  timeSpent: number;                  // Geçirilen süre
  activitiesCount: number;            // Aktivite sayısı
  successRate: number;                // Başarı oranı
  averageScore: number;               // Ortalama puan
  progress: number;                   // İlerleme yüzdesi
}

interface AudioMetrics {
  elevenLabsUsage: {
    requestCount: number;             // İstek sayısı
    successCount: number;             // Başarılı istek
    errorCount: number;               // Hata sayısı
    averageLatency: number;           // Ortalama gecikme (ms)
    totalCharacters: number;          // Toplam karakter
    cacheHitRate: number;             // Cache isabet oranı
  };
  webSpeechFallback: {
    usageCount: number;               // Kullanım sayısı
    successRate: number;              // Başarı oranı
  };
  voiceTypeDistribution: {
    letter: number;                   // Harf sesi kullanımı
    word: number;                     // Kelime sesi kullanımı
    sentence: number;                 // Cümle sesi kullanımı
    celebration: number;              // Kutlama sesi kullanımı
  };
}
```

## 🔧 Admin Koleksiyonu

### Veri Modeli
```typescript
interface AdminData {
  id: string;                         // Admin ID'si
  type: 'system' | 'user' | 'content' | 'analytics' | 'elevenlabs';
  data: SystemConfig | UserManagement | ContentManagement | AnalyticsDashboard | ElevenLabsAdmin;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ElevenLabsAdmin {
  apiStatus: {
    isConnected: boolean;             // API bağlantı durumu
    lastCheck: Timestamp;             // Son kontrol
    responseTime: number;             // Yanıt süresi (ms)
    errorRate: number;                // Hata oranı
  };
  usageStats: {
    totalRequests: number;            // Toplam istek
    dailyLimit: number;               // Günlük limit
    remainingQuota: number;           // Kalan kota
    costAnalysis: CostAnalysis;       // Maliyet analizi
  };
  voiceLibrary: VoiceInfo[];          // Ses kütüphanesi
  testResults: TestResult[];          // Test sonuçları
}

interface VoiceInfo {
  voiceId: string;                    // Ses ID'si
  name: string;                       // Ses adı
  description: string;                // Açıklama
  language: string;                   // Dil
  gender: 'male' | 'female' | 'neutral'; // Cinsiyet
  age: 'young' | 'middle_aged' | 'old'; // Yaş
  category: string;                   // Kategori
  isActive: boolean;                  // Aktif mi?
  usageCount: number;                 // Kullanım sayısı
}
```

## 🎯 ElevenLabs Koleksiyonu

### Veri Modeli
```typescript
interface ElevenLabsUserData {
  userId: string;                     // Kullanıcı ID'si
  preferences: ElevenLabsPreferences; // Kullanıcı tercihleri
  usage: ElevenLabsUsage;             // Kullanım istatistikleri
  cache: AudioCache[];                // Ses cache'i
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ElevenLabsPreferences {
  preferredVoiceId: string;           // Tercih edilen ses
  customSettings: {
    [voiceType: string]: VoiceConfig; // Özel ses ayarları
  };
  autoFallback: boolean;              // Otomatik fallback
  cacheEnabled: boolean;              // Cache etkin mi?
  maxCacheSize: number;               // Maksimum cache boyutu (MB)
}

interface ElevenLabsUsage {
  totalRequests: number;              // Toplam istek
  successfulRequests: number;         // Başarılı istek
  failedRequests: number;             // Başarısız istek
  totalCharacters: number;            // Toplam karakter
  averageLatency: number;             // Ortalama gecikme
  lastUsed: Timestamp;                // Son kullanım
  monthlyUsage: MonthlyUsage[];       // Aylık kullanım
}

interface AudioCache {
  cacheKey: string;                   // Cache anahtarı
  text: string;                       // Metin
  voiceType: string;                  // Ses türü
  audioUrl: string;                   // Ses URL'i
  fileSize: number;                   // Dosya boyutu (bytes)
  createdAt: Timestamp;               // Oluşturulma tarihi
  lastAccessed: Timestamp;            // Son erişim
  accessCount: number;                // Erişim sayısı
}
```

## 🔒 Güvenlik ve İzinler

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users: Sadece kendi verileri
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Progress: Kullanıcıya özel okuma/yazma
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Settings: Kullanıcıya özel
    match /settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions: Kullanıcıya özel
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Analytics: Kullanıcıya özel okuma, sistem yazma
    match /analytics/{analyticsId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow write: if request.auth != null;
    }
    
    // Admin: Sadece admin roller
    match /admin/{adminId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // ElevenLabs: Kullanıcıya özel
    match /elevenlabs/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📊 İndeksler ve Performans

### Gerekli İndeksler
```javascript
// Progress koleksiyonu için
{
  collection: 'progress',
  fields: [
    { fieldPath: 'userId', order: 'ASCENDING' },
    { fieldPath: 'moduleId', order: 'ASCENDING' },
    { fieldPath: 'updatedAt', order: 'DESCENDING' }
  ]
}

// Sessions koleksiyonu için
{
  collection: 'sessions',
  fields: [
    { fieldPath: 'userId', order: 'ASCENDING' },
    { fieldPath: 'startTime', order: 'DESCENDING' }
  ]
}

// Analytics koleksiyonu için
{
  collection: 'analytics',
  fields: [
    { fieldPath: 'userId', order: 'ASCENDING' },
    { fieldPath: 'date', order: 'DESCENDING' }
  ]
}
```

## 🔄 Mock Fallback Sistemi

### Mock Veri Yapısı
```typescript
// Firebase olmadığında kullanılan mock veriler
interface MockUser {
  uid: 'mock-user-id';
  displayName: 'Demo Kullanıcı';
  role: 'child';
  // ... diğer örnek veriler
}

// localStorage'da saklanan mock veriler
const MOCK_STORAGE_KEYS = {
  USER: 'kivilcim-mock-user',
  PROGRESS: 'kivilcim-mock-progress',
  SETTINGS: 'kivilcim-mock-settings',
  SESSIONS: 'kivilcim-mock-sessions'
};
```

## 📋 Veri Migrasyon Notları

### Versiyon 2.0 Değişiklikleri
- **ElevenLabs entegrasyonu:** Yeni `elevenlabs` koleksiyonu eklendi
- **Audio ayarları:** `settings` içinde ElevenLabs özel ayarları
- **7 aktif modül:** Tüm modüller için progress tracking
- **Ses metrikleri:** Analytics'e ses kullanım metrikleri eklendi
- **Cache sistemi:** ElevenLabs ses cache'leme için yeni yapı

### Migrasyon Script'leri
```typescript
// Eski kullanıcıları yeni yapıya uyarlama
async function migrateUserSettings(userId: string) {
  const oldSettings = await getOldSettings(userId);
  const newSettings = {
    ...oldSettings,
    audio: {
      ...oldSettings.audio,
      elevenlabs: {
        enabled: true,
        voiceSettings: DEFAULT_VOICE_SETTINGS,
        fallbackEnabled: true,
        caching: true,
        maxRetries: 3
      }
    }
  };
  await updateSettings(userId, newSettings);
}
```

---

> Bu doküman, ElevenLabs resmi SDK entegrasyonu ve 7 aktif modül desteği ile güncellenmiş veritabanı yapısını yansıtır. Mock fallback sistemi sayesinde Firebase olmadan da tam fonksiyonellik sağlanır.