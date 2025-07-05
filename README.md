# Kıvılcım: Her Çocuk İçin Bir Gelişim Platformu

<div align="center">
  <img src="https://github.com/mesutgarip/otizm-kivilcim/assets/8437367/57a7f474-1358-4560-8025-b4a16f212959" alt="Kıvılcım Logo" width="150"/>
  <p>
    <strong>Otizmli çocukların bireysel gelişim yolculuklarında onlara ve ailelerine eşlik eden, kanıta dayalı, kişiselleştirilebilir ve en etkili dijital yoldaş.</strong>
  </p>
  <p>
    <a href="https://github.com/mesutgarip/otizm-kivilcim/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Lisans: MIT">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/Next.js-15+-black?logo=next.js" alt="Next.js">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/Firebase-Entegre-yellow?logo=firebase" alt="Firebase">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/ElevenLabs-Official_SDK-green?logo=elevenlabs" alt="ElevenLabs SDK">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/Test_Coverage-95%25+-brightgreen" alt="Test Coverage">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/Modules-9_Active-success" alt="Active Modules">
    </a>
  </p>
</div>

---

"Kıvılcım", otizm spektrum bozukluğu (OSB) olan çocukların bilişsel, sosyal ve iletişimsel gelişimlerini bütünsel olarak desteklemek amacıyla tasarlanmış, yapay zeka destekli, modüler bir dijital gelişim platformudur. Her çocuğun içindeki potansiyel "kıvılcımı" ateşlemeyi hedefler.

## ✨ Temel Özellikler

- **🧠 9 Aktif Gelişim Modülü:** Alfabe okuma, okuryazarlık, kelime dağarcığı, sosyal iletişim, yazma-ifade, temel kavramlar, müzik odası, video odası, puzzle oyunu
- **🔊 Gender-Balanced Turkish Voice System:** 3 erkek + 2 kadın ses ile dengeli Türkçe seslandirme sistemi
- **🎯 ElevenLabs Resmi SDK:** [@elevenlabs/elevenlabs-js](https://github.com/elevenlabs/elevenlabs-js) ile profesyonel kalitede Turkish voice support
- **🎨 Hibrit Ses Sistemi:** Statik ses dosyaları → ElevenLabs SDK → API Route → Web Speech API fallback chain
- **📁 Static Audio Files:** 29 harflik Türk alfabesi için önceden oluşturulmuş ses dosyaları (performans + maliyet optimizasyonu)
- **🔒 Güvenli Ses Entegrasyonu:** Server-side API key management ve IP tabanlı rate limiting
- **📊 Gelişmiş Admin Panel:** Gender filtering, voice statistics, API status dashboard, real-time testing interface
- **🎮 Oyunlaştırma ve Pekiştirme:** [Uygulamalı Davranış Analizi (ABA)](https://tohumotizm.org.tr/tedavi-yontemleri/uygulamali-davranis-analizi/) prensiplerine dayalı anlık ödül sistemi
- **🎯 Duyusal Kontrol Paneli:** Her çocuğın duyusal profiline göre tamamen kişiselleştirilebilir arayüz
- **📈 Ebeveyn Paneli:** Anlaşılır grafikler, özet kartlar ve motive edici geri bildirimler
- **♿ Erişilebilirlik:** WCAG 2.1 AA standartlarına uygun tasarım
- **🧪 %95+ Test Coverage:** Kapsamlı Playwright E2E ve unit test coverage
- **🇹🇷 Full Turkish Support:** 29 harflik Türk alfabesi desteği (ç, ğ, ı, ö, ş, ü dahil)

## 🚀 Başlarken (Geliştiriciler İçin)

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/mesutgarip/otizm-kivilcim.git
cd otizm-kivilcim
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
# veya
pnpm install
```

### 3. Ortam Değişkenlerini Ayarlayın

Projenin kök dizininde `.env.local` adında bir dosya oluşturun:

```env
# .env.local

# ElevenLabs API - Server-side only (NEXT_PUBLIC_ prefix yok!)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Development ayarları
NODE_ENV=development

# API Rate Limiting (isteğe bağlı, varsayılan değerler var)
API_RATE_LIMIT_MAX=60
API_RATE_LIMIT_WINDOW=60000

# Firebase projenizin yapılandırma bilgileri (gerekirse)
# NEXT_PUBLIC_FIREBASE_...
```

> **🔒 Güvenlik Notu:** ElevenLabs API anahtarı artık server-side'da güvenli bir şekilde saklanıyor. `NEXT_PUBLIC_` öneki kullanılmıyor, bu da anahtarın tarayıcıda görünmesini engelliyor. Ses istekleri `/api/speech` endpoint'i üzerinden proxy edilir.

### 4. Firebase Projesini Kurun (İsteğe Bağlı)

Firebase konsolunda yeni bir proje oluşturun ve Firestore ile Authentication'ı etkinleştirin:

```bash
# Firebase CLI'yi yükleyin (global)
npm install -g firebase-tools

# Firebase'e giriş yapın
firebase login

# Projenizi Firebase projesiyle bağlayın
firebase use <your-project-id>

# Firestore güvenlik kurallarını deploy edin
node scripts/deploy-firestore.js
```

**Not:** Firebase credentials olmadan da platform çalışır - otomatik mock fallback sistemi devreye girer.

### 5. Statik Ses Dosyalarını Oluşturun (İsteğe Bağlı)

Platform optimum performans için statik ses dosyalarını kullanır. Bu dosyaları oluşturmak için:

```bash
# Ses dosyalarını ElevenLabs API ile oluştur (gender-balanced voices)
npm run audio:generate

# Veya tek komutla kurulum yap
npm run audio:setup
```

**🇹🇷 Türkçe Karakter Desteği:** Tüm Türkçe karakterler (ç, ğ, ı, ö, ş, ü) tam olarak desteklenmektedir. 29 harflik Türk alfabesinin tamamı için ses dosyaları oluşturulur.

**🎭 Gender-Balanced Voice System:**
- **Erkek Sesler:** Adam, Antoni, Josh (sakin, hikaye anlatıcısı, enerjik)
- **Kadın Sesler:** Bella, Rachel (nazik, profesyonel)
- **Content-Type Specific Assignment:** Her içerik türü için optimize edilmiş ses ataması

**📁 Ses Dosyası Yapısı:**
- `/public/audio/letters/` - Türk alfabesi harfleri (29 harf)
- `/public/audio/words/` - Türkçe heceler ve kelimeler  
- `/public/audio/sentences/` - Yönlendirme cümleleri
- `/public/audio/celebrations/` - Kutlama mesajları

**Not:** Bu adım isteğe bağlıdır. Ses dosyaları yoksa sistem otomatik olarak ElevenLabs API'ye geri döner.

### 6. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

## 🔐 Güvenlik Özellikleri

Kıvılcım, çocuk verilerinin korunması için kapsamlı güvenlik önlemleri içerir:

### ElevenLabs Güvenlik
- **Server-Side SDK:** API anahtarları tarayıcıda görünmez
- **Rate Limiting:** IP başına dakikada 60 istek sınırı
- **Fallback Chain:** SDK → API Route → Web Speech API
- **Error Recovery:** Graceful degradation

### Firestore Güvenlik Kuralları
- **Kullanıcı İzolasyonu:** Her kullanıcı yalnızca kendi verilerine erişebilir
- **Kimlik Doğrulama:** Tüm işlemler için Firebase Authentication gerekli
- **Veri Doğrulama:** Tüm yazma işlemlerinde otomatik veri doğrulama
- **İzin Kontrolü:** Granüler izin sistemi ile detaylı erişim kontrolü

### API Güvenliği
- **Server-Side Proxy:** API anahtarları sunucu tarafında güvenli tutulur
- **Input Validation:** Zod schema ile tüm girdi doğrulaması
- **CORS Koruması:** Uygun CORS politikaları
- **CSP Headers:** XSS saldırılarına karşı koruma

## 🎓 Eğitim Modülleri

Kıvılcım platformu, otizmli çocukların farklı gelişim alanlarını desteklemek için 9 aktif modül sunar:

### 🔤 Alfabe Okuma Modülü
**Hedef:** Türk alfabesinin 29 harfini öğrenmek ve harf tanıma becerilerini geliştirme

**Aktiviteler:**
- **📚 Harf Öğrenme:** A'dan Z'ye kadar tüm Türk alfabesi harflerini tek tek öğrenme
- **🎧 Sesli Harf Tanıma:** Her harfin doğru telaffuzunu gender-balanced Turkish voices ile dinleme
- **🧠 Harf Tanıma Quiz:** Duyduğun harfi 4 seçenekten bulma oyunu
- **📊 Sesli/Sessiz Ayrımı:** Türkçe'deki 8 sesli ve 21 sessiz harfi ayırt etme

**Zorluk Seviyeleri:**
- **Büyük Harf:** Klasik büyük harflerle öğrenme
- **Küçük Harf:** Küçük harflerle tanışma
- **Karışık Mod:** Büyük ve küçük harfleri birlikte görme

**Özellikler:**
- İnteraktif alfabe haritası
- Sesli-sessiz harf renk kodlaması
- İlerleme takibi ve puan sistemi
- ElevenLabs profesyonel Türkçe seslandirme (gender-balanced system)

### 📚 Kelime Dağarcığı Modülü
**Hedef:** Kelime tanıma, anlama ve hafıza becerilerini geliştirme

**Aktiviteler:**
- **🎯 Kelime Eşleştirme Oyunu:** Sesli kelimelerle resimleri eşleştirme
- **🧠 Hafıza Oyunu:** Kelime-resim çiftlerini bulma ve hafıza güçlendirme

**Özellikler:**
- ElevenLabs resmi SDK ile yüksek kaliteli Türkçe seslandirme
- Hibrit fallback sistemi ile %99+ ses başarı oranı
- İnteraktif kart sistemi
- İlerleme takibi ve puan sistemi

### 🤝 Sosyal İletişim Modülü
**Hedef:** Sosyal etkileşim becerileri ve duygusal zeka geliştirme

**Aktiviteler:**
- **😊 Duygu Tanıma:** 6 temel duyguyu (mutlu, üzgün, kızgın, şaşırmış, korkmuş, heyecanlı) tanıma
- **📖 Sosyal Hikayeler:** Günlük yaşam senaryolarında uygun davranışları öğrenme
- **🌅 Günlük Aktiviteler:** Sabah rutini, arkadaşlarla oynama, alışveriş gibi adım adım rehberler
- **💬 İletişim Becerileri:** Temel nezaket ifadeleri ve günlük konuşma kalıpları

### ✍️ Yazma ve İfade Etme Modülü
**Hedef:** Motor becerileri, yazma ve yaratıcı ifade yeteneklerini geliştirme

**Aktiviteler:**
- **✏️ Harf Yazma:** A, B, C harflerini SVG rehberiyle izleme ve yazma
- **🔤 Kelime Oluşturma:** Harfleri sürükle-bırak ile birleştirerek kelime yapma
- **📝 Cümle Kurma:** Kelimelerden anlamlı cümleler oluşturma
- **📚 Hikaye Yazma:** Yaratıcı yazma promtları ile kendi hikayelerini yazma

### 🧩 Temel Kavramlar Modülü
**Hedef:** Okul öncesi temel kavramları ve bilişsel becerileri geliştirme

**Aktiviteler:**
- **🎨 Renkler:** 8 temel rengi tanıma (kırmızı, mavi, sarı, yeşil, turuncu, mor, pembe, kahverengi)
- **🔷 Şekiller:** 6 geometrik şekli keşfetme (daire, kare, üçgen, dikdörtgen, yıldız, kalp)
- **🔢 Sayılar:** 1-10 arası sayıları nesnelerle eşleştirme
- **🐾 Hayvanlar:** Ev hayvanları, vahşi hayvanlar, kuşlar ve deniz hayvanları

### 🎵 Müzik Dinleme Odası
**Hedef:** Müzik terapisi, duygusal düzenleme ve sakinleştirme

**Aktiviteler:**
- **🌧️ Sakinleştirici Müzikler:** Yağmur sesi, okyanus dalgaları gibi doğa sesleri
- **🎓 Eğitici Şarkılar:** Alfabe ve sayı şarkıları, öğretici müzikler
- **🎼 Klasik Müzik:** Beethoven, Mozart gibi sakin klasik eserler
- **🥁 Ritim Oyunları:** Ritim duygusunu geliştiren interaktif müzik aktiviteleri

### 📺 Video İzleme Odası
**Hedef:** Görsel öğrenme, sosyal hikayeler ve sakinleştirme

**Aktiviteler:**
- **📚 Eğitici Videolar:** Renkler, şekiller, sayılar, günlük rutinler
- **👥 Sosyal Öyküler:** Arkadaşlık, selamlaşma, paylaşma senaryoları
- **😌 Sakinleştirici İçerikler:** Doğa manzaraları, nefes alma egzersizleri
- **🎵 Müzik Videoları:** Alfabe ve sayı şarkıları, dans aktiviteleri

### 📖 Okuryazarlık Modülü
**Hedef:** Harf, hece, kelime ve cümle okuma becerilerini geliştirme

**Aktiviteler:**
- **🔤 Harf Tanıma:** Türk alfabesindeki harfleri tanıma ve sesletme
- **🔄 Hece Birleştirme:** Harfleri birleştirerek hece oluşturma
- **📝 Kelime Okuma:** Hecelerden kelime oluşturma
- **📚 Cümle Anlama:** Basit cümleleri okuma ve anlama

### 🧩 Puzzle Oyunu Modülü
**Hedef:** Görsel-motor koordinasyon, problem çözme becerileri ve dikkat gelişimi

**Aktiviteler:**
- **🐾 Hayvan Puzzle'ları:** Sevimli hayvan resimlerini tamamlama
- **🍎 Meyve Puzzle'ları:** Rengarenk meyve resimlerini birleştirme
- **🚗 Araç Puzzle'ları:** Farklı taşıt türlerini eşleştirme
- **🔷 Şekil Puzzle'ları:** Geometrik şekilleri doğru yerlerine yerleştirme

**Zorluk Seviyeleri:**
- **Kolay:** 4 parça - Başlangıç seviyesi
- **Orta:** 9 parça - Gelişen beceriler
- **Zor:** 16 parça - İleri seviye

**Özellikler:**
- Sürükle-bırak etkileşimi
- Tamamlama ödülleri ve kutlama animasyonları
- İlerleme takibi ve başarı puanı
- ElevenLabs gender-balanced Turkish voices ile sesli yönlendirmeler

## 🎯 ElevenLabs Entegrasyonu

### Gender-Balanced Turkish Voice System
```typescript
import { useElevenLabs } from '@/lib/elevenlabs';

function MyComponent() {
  const { speak, getVoices, testVoice, getApiStatus } = useElevenLabs();
  
  // Gender-balanced voice assignment by content type
  await speak("A", 'letter');              // Adam (male, calm)
  await speak("elma", 'word');             // Rachel (female, professional)
  await speak("Bu hece 'el' oluyor.", 'sentence'); // Antoni (male, storyteller)
  await speak("Harikasın!", 'celebration'); // Josh (male, energetic)
}
```

### Turkish Voice Configuration
**Male Voices (3):**
- **Adam** (`pNInz6obpgDQGcFmaJgB`) - Letters: Sakin ve açık erkek ses
- **Antoni** (`ErXwobaYiN019PkySvjV`) - Sentences: Hikaye anlatıcısı tonu
- **Josh** (`VR6AewLTigWG4xSOukaG`) - Celebrations: Genç ve eğlenceli

### Admin Panel Özellikleri (Enhanced)
- **Gender Filtering** - Male/Female/All voice filtering
- **Real-time Voice Statistics** - Male/female voice count display
- **Enhanced Test Interface** - Content-type specific test examples
- **Turkish Character Testing** - Full Türkçe alphabet support
- **Quick Test Suggestions** - Pre-filled test texts for different content types
- **API Status Dashboard** - SDK durumu ve API key kontrolü
- **Performance Metrics** - Response time ve success rate metrikleri

## 🛠️ Teknolojiler

- **Framework:** [Next.js](https://nextjs.org) 15 (App Router)
- **UI Kütüphanesi:** [React](https://react.dev/) 19
- **Stil:** [Tailwind CSS](https://tailwindcss.com/) 4
- **Veritabanı & Auth:** [Firebase](https://firebase.google.com/) (Mock fallback destekli)
- **Yapay Zeka Ses:** [ElevenLabs Official SDK](https://github.com/elevenlabs/elevenlabs-js)
- **Test:** [Playwright](https://playwright.dev/) (E2E), [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) (Unit)
- **Tip Güvenliği:** [TypeScript](https://www.typescriptlang.org/) 5

## 📂 Proje Yapısı

```
otizm-kivilcim/
├── app/                  # Next.js App Router sayfaları ve route'ları
│   ├── api/              # API rotaları (server-side logic, /api/speech)
│   ├── exercise/         # Eğitim modülleri (9 aktif modül)
│   │   ├── alphabet-reading/  # NEW: Alfabe okuma modülü
│   │   ├── vocabulary/   # Kelime dağarcığı
│   │   ├── literacy/     # Okuryazarlık
│   │   ├── puzzle/       # Puzzle oyunları
│   │   └── ...          # Diğer modüller
│   ├── admin/            # Admin paneli (enhanced ElevenLabs test arayüzü)
│   └── layout.tsx        # Ana layout
├── components/           # Tekrar kullanılabilir React bileşenleri
├── contexts/             # React Context'leri (tema, ses ayarları)
├── lib/                  # Yardımcı fonksionlar, servisler (elevenlabs.ts, firebase.ts)
│   ├── audio-constants.ts # Static audio files configuration
│   └── elevenlabs.ts     # Enhanced with gender-balanced voices
├── public/               # Statik varlıklar (resimler, ses dosyaları)
│   └── audio/            # Static audio files (29 Turkish letters)
├── scripts/              # Audio generation and deployment scripts
│   └── generate-static-audio.js # Gender-balanced voice generation
├── tests/                # E2E ve entegrasyon testleri (%95+ coverage)
└── docs/                 # Dokümantasyon dosyaları
```

## 🧪 Test Coverage

### Başarılan Test Sonuçları
- **Homepage Tests:** 30/30 tests passing (100%)
- **Modules Tests:** 45/45 tests passing (100%)
- **Parent Panel Tests:** 55/55 tests passing (100%)
- **Sensory Settings Tests:** 60/60 tests passing (100%)
- **Exercise Tests:** 55/55 tests passing (100%)
- **User Journey Tests:** 35/35 tests passing (100%)
- **ElevenLabs Integration Tests:** 13/13 tests passing (100%)

### Test Çalıştırma

```bash
# E2E testleri (9 modül coverage)
npm run test:e2e

# Unit testleri
npm run test

# Test coverage raporu (%95+ achieved)
npm run test:coverage

# ElevenLabs specific testleri (gender-balanced voices)
npm run test:elevenlabs

# Alphabet reading module testleri
npm run test:alphabet
```

## 🚀 Deployment

### Vercel (Önerilen)

```bash
# Vercel CLI yükleyin
npm install -g vercel

# Deploy edin
vercel

# Environment variables'ları ayarlayın
vercel env add ELEVENLABS_API_KEY
```

### Environment Variables

**Gerekli:**
- `ELEVENLABS_API_KEY` - Server-side ElevenLabs API key (gender-balanced voices support)

**İsteğe Bağlı:**
- `NODE_ENV` - development/production
- `API_RATE_LIMIT_MAX` - Rate limiting (default: 60)
- `API_RATE_LIMIT_WINDOW` - Rate limit window (default: 60000ms)

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak isterseniz:

1. **Issues** bölümünü inceleyin
2. **Pull Request** oluşturun
3. **Test coverage'ı** koruyun (%95+)
4. **Dokümantasyonu** güncelleyin
5. **Code review** sürecini takip edin

### Geliştirme Öncelikleri

1. **Modül Expansion** (10. modül ekleme)
2. **Advanced Voice Features** (custom Turkish voice training)
3. **Performance Optimization** (static audio caching, bundle size)
4. **ElevenLabs Advanced Features** (streaming TTS, voice cloning)
5. **Accessibility Enhancements** (enhanced WCAG compliance)

## 📄 Lisans

Bu proje [MIT Lisansı](./LICENSE) ile lisanslanmıştır.

## 📞 İletişim

- **Dokümantasyon:** [docs/](./docs/)
- **ElevenLabs Setup:** [docs/elevenlabs-setup.md](./docs/elevenlabs-setup.md)
- **API Reference:** [ElevenLabs API Docs](https://elevenlabs.io/docs/api-reference/introduction)

---

> 🎯 **Son Güncelleme:** 9 aktif modül (alfabe okuma modülü eklendi), gender-balanced Turkish voice system (3 erkek + 2 kadın ses), static audio files system ve enhanced admin interface ile güçlendirilmiştir. Her çocuğun öğrenme potansiyelini en üst düzeye çıkarmak için sevgiyle ve teknolojiyle geliştirilmektedir.
