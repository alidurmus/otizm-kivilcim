# Sayfa Yapısı ve Navigasyon

Bu doküman, Kıvılcım platformunun sayfa yapısını ve navigasyon akışını tanımlar. Tüm sayfalar Next.js App Router kullanılarak geliştirilmiştir.

## 🏠 Ana Sayfa (/)

### Özellikleri
- **Hoş Geldin Mesajı:** Kullanıcıya özel karşılama
- **Modül Genel Bakış:** 9 aktif modülün kısa tanıtımı
- **Hızlı Erişim:** En popüler modüllere doğrudan bağlantılar
- **Ebeveyn Paneli Giriş:** Gelişim takibi erişimi
- **Duyusal Ayarlar:** Tema ve ses kontrolü

### Navigasyon
- **Modül Seçimi:** `/modules` sayfasına yönlendirme
- **Ebeveyn Paneli:** `/parent-panel` erişimi
- **Ayarlar:** `/settings` sayfası
- **Admin Panel:** `/admin` (yetkili kullanıcılar)

## 📚 Modül Seçimi (/modules)

### Görünüm
- **9 Aktif Modül Kartı:** Her modül için detaylı kart
- **İlerleme Gösterimi:** Her modülde kaç aktivite tamamlandığı
- **Zorluk Seviyeleri:** Başlangıç, orta, ileri seviyeleri
- **Önerilen Modüller:** Yaş ve ilgi alanına göre
- **Yakında Gelecek:** 0 adet (tüm modüller aktif)

### Aktif Modüller
1. **Alfabe Okuma** (`/exercise/alphabet-reading`) - **YENİ!**
2. **Kelime Dağarcığı** (`/exercise/vocabulary`)
3. **Sosyal İletişim** (`/exercise/social-communication`)
4. **Yazma ve İfade** (`/exercise/writing`)
5. **Temel Kavramlar** (`/exercise/basic-concepts`)
6. **Müzik Odası** (`/exercise/music-room`)
7. **Video Odası** (`/exercise/video-room`)
8. **Okuryazarlık** (`/exercise/literacy`)
9. **Puzzle Oyunu** (`/exercise/puzzle`)

## 🎯 Egzersiz Sayfaları (/exercise/*)

### Ortak Özellikler
- **Gender-Balanced Turkish Voice System:** 3 erkek + 2 kadın profesyonel Türkçe ses
- **ElevenLabs SDK Entegrasyonu:** Profesyonel kalite Turkish TTS
- **Hibrit Fallback Sistemi:** Static files → SDK → API Route → Web Speech API
- **4 Optimize Edilmiş Ses Türü:** letter, word, sentence, celebration
- **Content-Type Specific Voice Assignment:** Her içerik türü için optimize edilmiş ses seçimi
- **Otomatik İlerleme Takibi:** Tamamlanan aktivitelerin kaydı
- **Çoklu Duyusal Geri Bildirim:** Ses, görsel, haptic feedback
- **Adaptif Zorluk:** Başarı oranına göre zorluk ayarı

### 🔤 Alfabe Okuma (/exercise/alphabet-reading) - **YENİ MODÜL**
**Aktiviteler:**
- **📚 Harf Öğrenme:** 29 harflik Türk alfabesini tek tek öğrenme
- **🎧 Sesli Harf Tanıma:** Gender-balanced Turkish voices ile harf sesletme
- **🧠 Harf Tanıma Quiz:** 4 seçenekten doğru harfi bulma oyunu
- **📊 Sesli/Sessiz Ayrımı:** 8 sesli ve 21 sessiz harfi ayırt etme

**Zorluk Seviyeleri:**
- **Büyük Harf:** Klasik büyük harflerle öğrenme
- **Küçük Harf:** Küçük harflerle tanışma  
- **Karışık Mod:** Büyük ve küçük harfleri birlikte görme

**Teknoloji:**
- Adam (male) voice for letter pronunciation
- İnteraktif alfabe haritası
- Sesli-sessiz harf renk kodlaması
- Real-time progress tracking

### 1. Kelime Dağarcığı (/exercise/vocabulary)
**Aktiviteler:**
- **Kelime Eşleştirme:** Sesli kelimelerle görselleri eşleştirme
- **Hafıza Oyunu:** Kelime-resim çiftlerini bulma
- **Kelime Kategorizasyonu:** Hayvanlar, meyveler, eşyalar gruplandırma
- **Sesleri Tanıma:** Kelime seslerini doğru resimle eşleştirme

**Teknoloji:**
- Rachel (female) voice ile yüksek kaliteli kelime seslandirme
- Drag & drop arayüzü
- Çoklu seçim testleri
- İnteraktif kart sistemi

### 2. Sosyal İletişim (/exercise/social-communication)
**Aktiviteler:**
- **Duygu Tanıma:** 6 temel duyguyu (mutlu, üzgün, kızgın, şaşırmış, korkmuş, heyecanlı) tanıma
- **Sosyal Hikayeler:** Günlük yaşam senaryolarında uygun davranışlar
- **Günlük Aktiviteler:** Sabah rutini, arkadaşlarla oynama, alışveriş
- **İletişim Becerileri:** Nezaket ifadeleri ve konuşma kalıpları

**Teknoloji:**
- Antoni (male) voice ile sosyal hikaye anlatımı
- İnteraktif karakter animasyonları
- Senaryo tabanlı öğrenme
- Çoktan seçmeli sorular

### 3. Yazma ve İfade (/exercise/writing)
**Aktiviteler:**
- **Harf Yazma:** A, B, C harflerini SVG rehberiyle izleme
- **Kelime Oluşturma:** Harfleri sürükle-bırak ile birleştirme
- **Cümle Kurma:** Kelimelerden anlamlı cümleler oluşturma
- **Hikaye Yazma:** Yaratıcı yazma promtları

**Teknoloji:**
- Antoni (male) voice ile yazma yönergeleri
- Canvas tabanlı çizim sistemi
- SVG tabanlı harf rehberleri
- Drag & drop kelime birleştirme

### 4. Temel Kavramlar (/exercise/basic-concepts)
**Aktiviteler:**
- **Renkler:** 8 temel rengi tanıma (kırmızı, mavi, sarı, yeşil, turuncu, mor, pembe, kahverengi)
- **Şekiller:** 6 geometrik şekil (daire, kare, üçgen, dikdörtgen, yıldız, kalp)
- **Sayılar:** 1-10 arası sayıları nesnelerle eşleştirme
- **Hayvanlar:** Ev hayvanları, vahşi hayvanlar, kuşlar, deniz hayvanları

**Teknoloji:**
- Rachel (female) voice ile kavram açıklamaları
- SVG tabanlı şekil gösterimi
- İnteraktif renk paleti
- Kategorik öğrenme sistemi

### 5. Müzik Odası (/exercise/music-room)
**Aktiviteler:**
- **Sakinleştirici Müzikler:** Yağmur sesi, okyanus dalgaları
- **Eğitici Şarkılar:** Alfabe ve sayı şarkıları
- **Klasik Müzik:** Beethoven, Mozart eserleri
- **Ritim Oyunları:** İnteraktif ritim aktiviteleri

**Teknoloji:**
- Josh (male) voice ile müzik yönergeleri
- HTML5 Audio API
- Çoklu oynatma listeleri
- Otomatik shuffle özelliği

### 6. Video Odası (/exercise/video-room)
**Aktiviteler:**
- **Eğitici Videolar:** Renkler, şekiller, sayılar
- **Sosyal Öyküler:** Arkadaşlık, paylaşma senaryoları
- **Sakinleştirici İçerikler:** Doğa manzaraları, nefes egzersizleri
- **Müzik Videoları:** Alfabe ve sayı şarkıları

**Teknoloji:**
- Antoni (male) voice ile video açıklamaları
- YouTube embedded player
- Güvenli içerik filtreleme
- Kategori bazlı organizasyon

### 7. Okuryazarlık (/exercise/literacy)
**Aktiviteler:**
- **Harf Tanıma:** Türk alfabesindeki harfleri tanıma ve sesletme
- **Hece Birleştirme:** Harfleri birleştirerek hece oluşturma
- **Kelime Okuma:** Hecelerden kelime oluşturma
- **Cümle Anlama:** Basit cümleleri okuma ve anlama

**Teknoloji:**
- Adam (male) ve Bella (female) voices ile mixed gender approach
- Drag & drop harf birleştirme
- İnteraktif kelime kartları
- Okuma seviyesi değerlendirme

### 8. Puzzle Oyunu (/exercise/puzzle)
**Aktiviteler:**
- **Hayvan Puzzle'ları:** Sevimli hayvan resimlerini tamamlama
- **Meyve Puzzle'ları:** Rengarenk meyve resimlerini birleştirme
- **Araç Puzzle'ları:** Farklı taşıt türlerini eşleştirme
- **Şekil Puzzle'ları:** Geometrik şekilleri doğru yerlerine yerleştirme

**Zorluk Seviyeleri:**
- **Kolay:** 4 parça - Başlangıç seviyesi
- **Orta:** 9 parça - Gelişen beceriler
- **Zor:** 16 parça - İleri seviye

**Teknoloji:**
- Josh (male) voice ile kutlama mesajları
- Sürükle-bırak etkileşimi
- Tamamlama ödülleri ve animasyonlar

## 👨‍👩‍👧‍👦 Ebeveyn Paneli (/parent-panel)

### Başlıca Bölümler
- **Gelişim Özeti:** Genel ilerleme durumu (9 modül)
- **Modül Bazlı Analiz:** Her modülde detaylı performans
- **Güçlü Alanlar:** Çocuğun başarılı olduğu konular
- **Gelişim Alanları:** Odaklanılması gereken konular
- **Duyusal Ayarlar:** Tema, ses, animasyon kontrolleri
- **Aktivite Raporu:** Günlük/haftalık aktivite özetleri

### Grafik ve Metrikler
- **Donut Chart:** 9 modül bazlı başarı oranları
- **Bar Chart:** Haftalık aktivite dağılımı
- **Progress Bar:** Genel ilerleme gösterimi
- **Trend Lines:** Zaman içindeki gelişim trendi

### Duyusal Kontrol
- **Tema Seçimi:** Açık/koyu tema + renk paleti
- **Ses Ayarları:** Gender-balanced Turkish voices, Web Speech API, sessize alma
- **Voice Preference:** Male/Female voice tercihi
- **Animasyon Kontrolü:** Hareket hassasiyeti ayarı
- **Kontrast Ayarları:** Görsel erişilebilirlik

## 🔧 Admin Paneli (/admin)

### Ana Sayfalar
- **Genel Bakış** (`/admin`) - Sistem durumu ve metrikler
- **ElevenLabs Test** (`/admin/elevenlabs-test`) - Enhanced ses API test arayüzü
- **Kullanıcı Yönetimi** (`/admin/users`) - Kullanıcı listesi ve yönetimi
- **İçerik Yönetimi** (`/admin/content`) - Modül içerikleri düzenleme
- **Analitik** (`/admin/analytics`) - Detaylı kullanım analitikleri

### ElevenLabs Test Arayüzü (/admin/elevenlabs-test) - **ENHANCED**
**Yeni Özellikler:**
- **Gender-Based Filtering:** Male/Female/All voice filtering system
- **Real-time Voice Statistics:** 3 male + 2 female voice count display
- **Enhanced Test Interface:** Content-type specific test examples
- **Turkish Character Testing:** Full 29-letter Turkish alphabet support
- **Quick Test Suggestions:** Pre-filled test texts for different content types
- **Visual Improvements:** Icons, better UX, improved responsiveness

**Mevcut Özellikler:**
- **API Status Dashboard:** SDK durumu ve bağlantı kontrolü
- **User Information Panel:** Hesap bilgileri ve kullanım limitleri
- **Voice Testing Interface:** Tüm sesler için test arayüzü
- **Performance Metrics:** Response time ve success rate metrikleri
- **Test Results:** Anlık test sonuçları ve hata logları

**Teknoloji:**
- Real-time API status monitoring
- ElevenLabs SDK integration with gender-balanced voices
- Voice library management with Turkish support
- Performance analytics with voice-specific metrics

## 📱 Responsive Tasarım

### Breakpoint'ler
- **Mobile:** 320px-768px (Ana hedef)
- **Tablet:** 768px-1024px
- **Desktop:** 1024px+ (Genişletilmiş özellikler)

### Mobile-First Yaklaşım
- **Touch-Friendly:** Minimum 44px dokunma alanları
- **Gesture Support:** Swipe, pinch-to-zoom, long-press
- **Adaptive Layout:** Ekran boyutuna göre component düzeni
- **Performance:** Mobil cihazlarda optimize edilmiş loading

### Tablet Optimize
- **Split Layout:** Dual-pane mode, side-by-side views
- **Enhanced Interaction:** Tablet-specific gestures
- **Keyboard Support:** Harici klavye desteği
- **Landscape Mode:** Yatay ekran için optimize layout

## 🎯 Navigasyon Akışı

### Ana Akış
```
/ (Ana Sayfa)
├── /modules (Modül Seçimi)
│   ├── /exercise/alphabet-reading (Alfabe Okuma) **YENİ**
│   ├── /exercise/vocabulary (Kelime Dağarcığı)
│   ├── /exercise/social-communication (Sosyal İletişim)
│   ├── /exercise/writing (Yazma ve İfade)
│   ├── /exercise/basic-concepts (Temel Kavramlar)
│   ├── /exercise/music-room (Müzik Odası)
│   ├── /exercise/video-room (Video Odası)
│   ├── /exercise/literacy (Okuryazarlık)
│   └── /exercise/puzzle (Puzzle Oyunu)
├── /parent-panel (Ebeveyn Paneli)
├── /settings (Ayarlar)
└── /admin (Admin Paneli)
    ├── /admin/elevenlabs-test (Enhanced ElevenLabs Test)
    ├── /admin/users (Kullanıcı Yönetimi)
    ├── /admin/content (İçerik Yönetimi)
    └── /admin/analytics (Analitik)
```

### Breadcrumb Yapısı
```
Ana Sayfa > Modüller > Alfabe Okuma > Harf Tanıma Quiz
Ana Sayfa > Modüller > Kelime Dağarcığı > Kelime Eşleştirme
Ana Sayfa > Ebeveyn Paneli > Gelişim Raporu
Admin > ElevenLabs Test > Gender-Based Voice Testing
```

## 🔍 SEO ve Metrikler

### Meta Etiketleri
- **Title:** Sayfa özel başlıklar
- **Description:** 150-160 karakter açıklamalar
- **Keywords:** Otizm, eğitim, çocuk gelişimi, alfabe, Turkish TTS, gender-balanced voices
- **Open Graph:** Sosyal medya paylaşımları

### Sitemap
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kivilcim.com/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://kivilcim.com/modules</loc>
    <priority>0.9</priority>
    <changefreq>weekly</changefreq>
  </url>
  <!-- 9 aktif modül URL'leri -->
  <url>
    <loc>https://kivilcim.com/exercise/alphabet-reading</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://kivilcim.com/exercise/vocabulary</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  <!-- ... diğer 7 modül -->
</urlset>
```

## 🚀 Performance İyileştirmeleri

### Lazy Loading
- **Modül Bileşenleri:** İlk yüklemede sadece gerekli modüller
- **Static Audio Files:** Pre-loaded Turkish letters for common usage
- **Resim Optimizasyonu:** Next.js Image component kullanımı
- **Route Splitting:** Sayfa bazlı kod bölümleme
- **API Route Optimization:** Server-side caching

### Caching Stratejileri
- **Static Generation:** Statik içerik için ISR (Incremental Static Regeneration)
- **Dynamic Caching:** Kullanıcı özel veriler için SWR
- **Audio Caching:** Static Turkish audio files + ElevenLabs API cache
- **Voice Caching:** Gender-specific voice response caching
- **CDN Integration:** Vercel Edge Network kullanımı

## 🔒 Güvenlik Considerations

### Route Protection
- **Admin Routes:** Yetkilendirme middleware'i
- **API Routes:** Rate limiting ve authentication
- **User Data:** Firestore security rules
- **ElevenLabs API:** Server-side proxy pattern with gender-balanced voices

### Input Validation
- **Form Validation:** Zod schema validation
- **File Upload:** Dosya tipi ve boyut kontrolü
- **API Parameters:** Strict type checking
- **Voice Input:** Turkish character validation

## 🎭 Voice Assignment Logic

### Content-Type Based Voice Selection
```typescript
const VOICE_ASSIGNMENTS = {
  'letter': 'Adam',           // Male, calm and clear
  'word': 'Rachel',           // Female, professional 
  'sentence': 'Antoni',       // Male, storyteller tone
  'celebration': 'Josh'       // Male, energetic and fun
};

// Gender balance: 60% male (Adam, Antoni, Josh) + 40% female (Rachel, Bella)
```

### Turkish Character Support
- **Full 29-letter support:** A-Z + Ç, Ğ, I, İ, Ö, Ş, Ü
- **URL-safe filename mapping:** Turkish characters → ASCII equivalents
- **Voice compatibility:** All voices tested with Turkish phonemes

---

> Bu doküman, platform'un güncel sayfa yapısını ve 9 aktif modülün detaylarını yansıtır. Gender-balanced Turkish voice system (3 erkek + 2 kadın), static audio files ve enhanced admin interface ile güçlendirilmiştir. Tüm sayfalar WCAG 2.1 AA erişilebilirlik standartlarına uygun olarak tasarlanmıştır. 