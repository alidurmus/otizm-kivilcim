# Sayfa Yapısı ve Navigasyon

Bu doküman, Kıvılcım platformunun sayfa yapısını ve navigasyon akışını tanımlar. Tüm sayfalar Next.js App Router kullanılarak geliştirilmiştir.

## 🏠 Ana Sayfa (/)

### Özellikleri
- **Hoş Geldin Mesajı:** Kullanıcıya özel karşılama
- **Modül Genel Bakış:** 7 aktif modülün kısa tanıtımı
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
- **7 Aktif Modül Kartı:** Her modül için detaylı kart
- **İlerleme Gösterimi:** Her modülde kaç aktivite tamamlandığı
- **Zorluk Seviyeleri:** Başlangıç, orta, ileri seviyeleri
- **Önerilen Modüller:** Yaş ve ilgi alanına göre
- **Yakında Gelecek:** 0 adet (tüm modüller aktif)

### Aktif Modüller
1. **Kelime Dağarcığı** (`/exercise/vocabulary`)
2. **Sosyal İletişim** (`/exercise/social-communication`)
3. **Yazma ve İfade** (`/exercise/writing`)
4. **Temel Kavramlar** (`/exercise/basic-concepts`)
5. **Müzik Odası** (`/exercise/music-room`)
6. **Video Odası** (`/exercise/video-room`)
7. **Okuryazarlık** (`/exercise/literacy`)

## 🎯 Egzersiz Sayfaları (/exercise/*)

### Ortak Özellikler
- **ElevenLabs SDK Entegrasyonu:** Profesyonel kalite Türkçe ses
- **Hibrit Fallback Sistemi:** SDK → API Route → Web Speech API
- **4 Optimize Edilmiş Ses Türü:** letter, word, sentence, celebration
- **Otomatik İlerleme Takibi:** Tamamlanan aktivitelerin kaydı
- **Çoklu Duyusal Geri Bildirim:** Ses, görsel, haptic feedback
- **Adaptif Zorluk:** Başarı oranına göre zorluk ayarı

### 1. Kelime Dağarcığı (/exercise/vocabulary)
**Aktiviteler:**
- **Kelime Eşleştirme:** Sesli kelimelerle görselleri eşleştirme
- **Hafıza Oyunu:** Kelime-resim çiftlerini bulma
- **Kelime Kategorizasyonu:** Hayvanlar, meyveler, eşyalar gruplandırma
- **Sesleri Tanıma:** Kelime seslerini doğru resimle eşleştirme

**Teknoloji:**
- ElevenLabs SDK ile yüksek kaliteli Türkçe sesler
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
- İnteraktif karakter animasyonları
- Senaryo tabanlı öğrenme
- Çoktan seçmeli sorular
- Ses ile desteklenmiş hikayeler

### 3. Yazma ve İfade (/exercise/writing)
**Aktiviteler:**
- **Harf Yazma:** A, B, C harflerini SVG rehberiyle izleme
- **Kelime Oluşturma:** Harfleri sürükle-bırak ile birleştirme
- **Cümle Kurma:** Kelimelerden anlamlı cümleler oluşturma
- **Hikaye Yazma:** Yaratıcı yazma promtları

**Teknoloji:**
- Canvas tabanlı çizim sistemi
- SVG tabanlı harf rehberleri
- Drag & drop kelime birleştirme
- Metin editörü entegrasyonu

### 4. Temel Kavramlar (/exercise/basic-concepts)
**Aktiviteler:**
- **Renkler:** 8 temel rengi tanıma (kırmızı, mavi, sarı, yeşil, turuncu, mor, pembe, kahverengi)
- **Şekiller:** 6 geometrik şekil (daire, kare, üçgen, dikdörtgen, yıldız, kalp)
- **Sayılar:** 1-10 arası sayıları nesnelerle eşleştirme
- **Hayvanlar:** Ev hayvanları, vahşi hayvanlar, kuşlar, deniz hayvanları

**Teknology:**
- SVG tabanlı şekil gösterimi
- İnteraktif renk paleti
- Sayı-nesne eşleştirme oyunları
- Kategorik öğrenme sistemi

### 5. Müzik Odası (/exercise/music-room)
**Aktiviteler:**
- **Sakinleştirici Müzikler:** Yağmur sesi, okyanus dalgaları
- **Eğitici Şarkılar:** Alfabe ve sayı şarkıları
- **Klasik Müzik:** Beethoven, Mozart eserleri
- **Ritim Oyunları:** İnteraktif ritim aktiviteleri

**Teknoloji:**
- HTML5 Audio API
- Çoklu oynatma listeleri
- Ses seviyesi kontrolü
- Otomatik shuffle özelliği

### 6. Video Odası (/exercise/video-room)
**Aktiviteler:**
- **Eğitici Videolar:** Renkler, şekiller, sayılar
- **Sosyal Öyküler:** Arkadaşlık, paylaşma senaryoları
- **Sakinleştirici İçerikler:** Doğa manzaraları, nefes egzersizleri
- **Müzik Videoları:** Alfabe ve sayı şarkıları

**Teknoloji:**
- YouTube embedded player
- Güvenli içerik filtreleme
- Tam ekran oynatma
- Kategori bazlı organizasyon

### 7. Okuryazarlık (/exercise/literacy)
**Aktiviteler:**
- **Harf Tanıma:** Türk alfabesindeki harfleri tanıma ve sesletme
- **Hece Birleştirme:** Harfleri birleştirerek hece oluşturma
- **Kelime Okuma:** Hecelerden kelime oluşturma
- **Cümle Anlama:** Basit cümleleri okuma ve anlama

**Teknoloji:**
- ElevenLabs SDK ile harf/kelime sesletme
- Drag & drop harf birleştirme
- İnteraktif kelime kartları
- Okuma seviyesi değerlendirme

## 👨‍👩‍👧‍👦 Ebeveyn Paneli (/parent-panel)

### Başlıca Bölümler
- **Gelişim Özeti:** Genel ilerleme durumu
- **Modül Bazlı Analiz:** Her modülde detaylı performans
- **Güçlü Alanlar:** Çocuğun başarılı olduğu konular
- **Gelişim Alanları:** Odaklanılması gereken konular
- **Duyusal Ayarlar:** Tema, ses, animasyon kontrolleri
- **Aktivite Raporu:** Günlük/haftalık aktivite özetleri

### Grafik ve Metrikler
- **Donut Chart:** Modül bazlı başarı oranları
- **Bar Chart:** Haftalık aktivite dağılımı
- **Progress Bar:** Genel ilerleme gösterimi
- **Trend Lines:** Zaman içindeki gelişim trendi

### Duyusal Kontrol
- **Tema Seçimi:** Açık/koyu tema + renk paleti
- **Ses Ayarları:** ElevenLabs, Web Speech API, sessize alma
- **Animasyon Kontrolü:** Hareket hassasiyeti ayarı
- **Kontrast Ayarları:** Görsel erişilebilirlik

## 🔧 Admin Paneli (/admin)

### Ana Sayfalar
- **Genel Bakış** (`/admin`) - Sistem durumu ve metrikler
- **ElevenLabs Test** (`/admin/elevenlabs-test`) - Ses API test arayüzü
- **Kullanıcı Yönetimi** (`/admin/users`) - Kullanıcı listesi ve yönetimi
- **İçerik Yönetimi** (`/admin/content`) - Modül içerikleri düzenleme
- **Analitik** (`/admin/analytics`) - Detaylı kullanım analitikleri

### ElevenLabs Test Arayüzü (/admin/elevenlabs-test)
**Özellikler:**
- **API Status Dashboard:** SDK durumu ve bağlantı kontrolü
- **User Information Panel:** Hesap bilgileri ve kullanım limitleri
- **Voice Testing Interface:** Tüm sesler için test arayüzü
- **Performance Metrics:** Response time ve success rate metrikleri
- **Test Results:** Anlık test sonuçları ve hata logları

**Teknoloji:**
- Real-time API status monitoring
- ElevenLabs SDK integration
- Voice library management
- Performance analytics

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
│   ├── /exercise/vocabulary (Kelime Dağarcığı)
│   ├── /exercise/social-communication (Sosyal İletişim)
│   ├── /exercise/writing (Yazma ve İfade)
│   ├── /exercise/basic-concepts (Temel Kavramlar)
│   ├── /exercise/music-room (Müzik Odası)
│   ├── /exercise/video-room (Video Odası)
│   └── /exercise/literacy (Okuryazarlık)
├── /parent-panel (Ebeveyn Paneli)
├── /settings (Ayarlar)
└── /admin (Admin Paneli)
    ├── /admin/elevenlabs-test (ElevenLabs Test)
    ├── /admin/users (Kullanıcı Yönetimi)
    ├── /admin/content (İçerik Yönetimi)
    └── /admin/analytics (Analitik)
```

### Breadcrumb Yapısı
```
Ana Sayfa > Modüller > Kelime Dağarcığı > Kelime Eşleştirme
Ana Sayfa > Ebeveyn Paneli > Gelişim Raporu
Admin > ElevenLabs Test > Voice Testing
```

## 🔍 SEO ve Metrikler

### Meta Etiketleri
- **Title:** Sayfa özel başlıklar
- **Description:** 150-160 karakter açıklamalar
- **Keywords:** Otizm, eğitim, çocuk gelişimi, ElevenLabs, TTS
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
  <!-- 7 aktif modül URL'leri -->
  <url>
    <loc>https://kivilcim.com/exercise/vocabulary</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  <!-- ... diğer modüller -->
</urlset>
```

## 🚀 Performance İyileştirmeleri

### Lazy Loading
- **Modül Bileşenleri:** İlk yüklemede sadece gerekli modüller
- **Resim Optimizasyonu:** Next.js Image component kullanımı
- **Route Splitting:** Sayfa bazlı kod bölümleme
- **API Route Optimization:** Server-side caching

### Caching Stratejileri
- **Static Generation:** Statik içerik için ISR (Incremental Static Regeneration)
- **Dynamic Caching:** Kullanıcı özel veriler için SWR
- **ElevenLabs Caching:** Ses dosyalarının local cache'lenmesi
- **CDN Integration:** Vercel Edge Network kullanımı

## 🔒 Güvenlik Considerations

### Route Protection
- **Admin Routes:** Yetkilendirme middleware'i
- **API Routes:** Rate limiting ve authentication
- **User Data:** Firestore security rules
- **ElevenLabs API:** Server-side proxy pattern

### Input Validation
- **Form Validation:** Zod schema validation
- **File Upload:** Dosya tipi ve boyut kontrolü
- **API Parameters:** Strict type checking
- **SQL Injection:** Parametreli sorgular (Firestore kullanımı)

---

> Bu doküman, platform'un güncel sayfa yapısını ve 7 aktif modülün detaylarını yansıtır. ElevenLabs resmi SDK entegrasyonu ve hibrit fallback sistemi ile güçlendirilmiştir. Tüm sayfalar WCAG 2.1 AA erişilebilirlik standartlarına uygun olarak tasarlanmıştır. 