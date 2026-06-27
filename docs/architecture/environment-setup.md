# Environment Variable Kurulumu

## Kritik Sorun: API Key Eksik!

Test hatalarının ana nedeni `.env.local` dosyasının eksik olmasıdır. Aşağıdaki adımları takip ederek düzeltin:

## 1. .env.local Dosyası Oluşturun

Proje root dizininde `.env.local` dosyası oluşturun ve aşağıdaki içeriği ekleyin:

```env
# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here

# API Rate Limiting Configuration
API_RATE_LIMIT_MAX=60
API_RATE_LIMIT_WINDOW=60000

# Firebase Configuration (Production values needed)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Custom Configuration
CUSTOM_KEY=your-custom-key
```

## 2. ElevenLabs API Key Alın

1. [ElevenLabs Dashboard](https://elevenlabs.io/docs/api-reference/introduction) gidin
2. Account > API Keys kısmından API key oluşturun
3. `ELEVENLABS_API_KEY` değerini gerçek API key ile değiştirin

## 3. Firebase Configuration (Opsiyonel)

1. [Firebase Console](https://console.firebase.google.com/) gidin
2. Proje oluşturun/seçin
3. Project Settings > General > Your apps kısmından config alın
4. Firebase değerlerini gerçek değerlerle değiştirin

## 4. Development için Hızlı Çözüm

Sadece ses sistemi test etmek için minimum kurulum:

```env
ELEVENLABS_API_KEY=your-real-api-key-here
API_RATE_LIMIT_MAX=60
API_RATE_LIMIT_WINDOW=60000
```

Firebase değerleri mock değerlerle çalışabilir.

## 5. Sorun Giderme

### Test Hatası: "API Key ❌ Yapılandırılmamış"
- `.env.local` dosyası mevcut değil
- `ELEVENLABS_API_KEY` eksik veya yanlış

### Test Hatası: "Toplam: 0 ses"
- ElevenLabs API key geçersiz
- API rate limit aşımı
- Network bağlantı sorunu

### Test Hatası: "SDK ⚠️ Fallback Mode" 
- ElevenLabs SDK düzgün çalışmıyor
- Fallback mode aktif (beklenebilir)

## 6. Güvenlik

- `.env.local` dosyası gitignore'dadır
- API keyler asla commit edilmemelidir
- Production ortamda farklı değerler kullanın

## 7. Doğrulama

Kurulum sonrası kontrol:
1. `npm run dev` çalıştırın
2. `http://localhost:3004/admin/elevenlabs-test` gidin
3. "API Durumu" kısmında ✅ işaretleri görün
4. Ses listesi yüklenmeli (0'dan fazla ses)

Bu düzeltme yapıldıktan sonra tüm ses sistemi testleri geçmelidir.

# Environment Variables Kurulum Rehberi

Bu rehber, Kıvılcım projesinde güvenli environment variables yapılandırmasını açıklar.

## 🔐 Güvenlik İlkeleri

### ⚠️ CRITICAL: API Key Güvenliği
- **ElevenLabs API Key** artık server-side'da güvenle saklanır
- **NEXT_PUBLIC_** prefix'i API key'de KULLANILMAZ (güvenlik riski)
- API çağrıları `/api/speech` proxy üzerinden yapılır

### ✅ Güvenli Yapılandırma
```bash
# ❌ YANLIŞ - API key'i browser'da görünür hale getirir
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_key_here

# ✅ DOĞRU - API key'i server-side'da güvenle saklar
ELEVENLABS_API_KEY=your_key_here
```

## 🛠️ Kurulum Adımları

### 1. Environment Dosyası Oluşturma

Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
# Kıvılcım proje dizininde
touch .env.local
```

### 2. API Key'lerini Alma

#### ElevenLabs API Key
1. [ElevenLabs](https://elevenlabs.io/) hesabınıza giriş yapın
2. Dashboard → API Keys bölümüne gidin
3. "Create New Key" butonuna tıklayın
4. Key'i kopyalayın (sadece bir kez gösterilir!)

#### Firebase Yapılandırma
1. [Firebase Console](https://console.firebase.google.com/) açın
2. Projenizi seçin
3. Project Settings → General → Your apps → Web app
4. Config nesnesindeki değerleri kopyalayın

### 3. `.env.local` Dosyasını Doldurma

```env
# =============================================================================
# Kıvılcım - Environment Variables (KEEP SECURE!)
# Bu dosya Git'e commit edilmemeli (.gitignore'da bulunur)
# =============================================================================

# ElevenLabs API - Server-side only (NO NEXT_PUBLIC_ prefix!)
ELEVENLABS_API_KEY=sk_your_actual_elevenlabs_api_key_here

# Development Environment
NODE_ENV=development

# API Rate Limiting (opsiyonel - varsayılan değerler var)
API_RATE_LIMIT_MAX=60
API_RATE_LIMIT_WINDOW=60000

# =============================================================================
# Firebase Configuration (client-side safe with NEXT_PUBLIC_)
# =============================================================================

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:your_app_id

# =============================================================================
# Application Settings
# =============================================================================

NEXT_PUBLIC_APP_URL=http://localhost:3003

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_ERROR_REPORTING=true
ENABLE_PERFORMANCE_MONITORING=true

# Admin Panel (development only)
ADMIN_EMAIL=admin@example.com
```

### 4. Değişkenleri Kontrol Etme

Environment variables'ın doğru yüklendiğini kontrol edin:

```bash
# Development server'ı restart edin
npm run dev

# Console'da hata mesajları kontrol edin:
# ✅ ElevenLabs working: ses çalışıyor
# ❌ "ElevenLabs API key not configured": API key eksik/yanlış
```

## 🧪 Test Etme

### API Endpoint Testi
```bash
# Browser console'da test edin:
fetch('/api/speech', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Test mesajı',
    type: 'sentence'
  })
}).then(r => console.log(r.status)) // 200 beklenir
```

### Tam Entegrasyon Testi
1. `/exercise/vocabulary` sayfasına gidin
2. Bir kelimeye tıklayın
3. Ses çalmalı (ElevenLabs veya Web Speech API)

## 🚀 Production Deployment

### Vercel Deployment
```bash
# Vercel CLI ile environment variables ekleyin
vercel env add ELEVENLABS_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... diğer değişkenler
```

### Environment Validation
Production'da environment variables'ın doğru yüklendiğini kontrol eden script:

```typescript
// scripts/validate-env.ts
function validateEnv() {
  const required = [
    'ELEVENLABS_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    process.exit(1);
  }
  
  console.log('✅ All environment variables configured');
}
```

## 🔍 Troubleshooting

### API Key Sorunu
```
Error: ElevenLabs API key not configured
```
**Çözüm:** 
1. `.env.local` dosyasında `ELEVENLABS_API_KEY` var mı kontrol edin
2. API key'de `NEXT_PUBLIC_` prefix'i OLMASIN
3. Development server'ı restart edin

### 401 Unauthorized
```
POST /api/speech 401 (Unauthorized)
```
**Çözüm:**
1. ElevenLabs hesabınızın aktif olduğunu kontrol edin
2. API key'in geçerli olduğunu kontrol edin
3. Rate limit'e takılmadığınızı kontrol edin

### Firebase Bağlantı Sorunu
```
Firebase: Error (auth/invalid-api-key)
```
**Çözüm:**
1. Firebase config değerlerini tekrar kontrol edin
2. `NEXT_PUBLIC_` prefix'lerinin doğru olduğunu kontrol edin
3. Firebase projesinin aktif olduğunu kontrol edin

## 📁 Dosya Yapısı

```
otizm-kivilcim/
├── .env.local              # Local environment variables
├── .env.example            # Template file (Git'e dahil)
├── .gitignore              # .env.local'ı ignore eder
├── app/api/speech/route.ts # Server-side API proxy
└── lib/elevenlabs.ts       # Client-side speech hook
```

## 🔒 Güvenlik Kontrol Listesi

- [ ] `.env.local` dosyası `.gitignore`'da
- [ ] ElevenLabs API key'de `NEXT_PUBLIC_` prefix'i YOK
- [ ] API key'ler güçlü ve benzersiz
- [ ] Production'da farklı API key'ler kullanılıyor
- [ ] Rate limiting aktif
- [ ] Input validation (Zod) aktif
- [ ] Error messages generic (API key'i expose etmiyor)

---

> **Önemli:** Bu dosyayı tamamladıktan sonra development server'ı restart edin ve ses fonksiyonalitesini test edin. 