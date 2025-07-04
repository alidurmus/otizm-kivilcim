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
      <img src="https://img.shields.io/badge/Next.js-14+-black?logo=next.js" alt="Next.js">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/Firebase-Entegre-yellow?logo=firebase" alt="Firebase">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/AI-Destekli-green?logo=openai" alt="AI Powered">
    </a>
  </p>
</div>

---

"Kıvılcım", otizm spektrum bozukluğu (OSB) olan çocukların bilişsel, sosyal ve iletişimsel gelişimlerini bütünsel olarak desteklemek amacıyla tasarlanmış, yapay zeka destekli, modüler bir dijital gelişim platformudur. Her çocuğun içindeki potansiyel "kıvılcımı" ateşlemeyi hedefler.

## ✨ Temel Özellikler

- **🧠 Modüler Gelişim Alanları:** Okuryazarlık, kelime dağarcığı, sosyal iletişim gibi farklı gelişim alanlarına odaklanan modüller.
- **🔊 Yapay Zeka Destekli Telaffuz:** [ElevenLabs](https://elevenlabs.io/) API'si ile güçlendirilmiş, yüksek kaliteli ve çocuk dostu seslerle anında telaffuz geri bildirimi.
- **🎨 Duyusal Kontrol Paneli:** Her çocuğun duyusal profiline göre tamamen kişiselleştirilebilir arayüz (tema, ses, animasyon, dokunsal geri bildirim).
- **📊 Ebeveyn Paneli:** Çocuğun gelişimini takip etmek için anlaşılır grafikler, özet kartlar ve motive edici geri bildirimler.
- **🎮 Oyunlaştırma ve Pekiştirme:** Öğrenme sürecini eğlenceli kılan, [Uygulamalı Davranış Analizi (ABA)](https://tohumotizm.org.tr/tedavi-yontemleri/uygulamali-davranis-analizi/) prensiplerine dayalı anlık ödül sistemi.
- **🔒 Güvenlik ve Gizlilik:** Kapsamlı Firestore güvenlik kuralları, server-side API proxy, ve KVKK uyumlu veri koruma.
- **♿ Erişilebilirlik:** WCAG 2.1 AA standartlarına uygun, erişilebilir bir tasarım.

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

> **🔒 Güvenlik Notu:** API anahtarı artık server-side'da güvenli bir şekilde saklanıyor. `NEXT_PUBLIC_` öneki kullanılmıyor, bu da anahtarın tarayıcıda görünmesini engelliyor. Ses istekleri `/api/speech` endpoint'i üzerinden proxy edilir.

### 4. Firebase Projesini Kurun

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

### 5. Geliştirme Sunucusunu Başlatın

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

### Firestore Güvenlik Kuralları
- **Kullanıcı İzolasyonu:** Her kullanıcı yalnızca kendi verilerine erişebilir
- **Kimlik Doğrulama:** Tüm işlemler için Firebase Authentication gerekli
- **Veri Doğrulama:** Tüm yazma işlemlerinde otomatik veri doğrulama
- **İzin Kontrolü:** Granüler izin sistemi ile detaylı erişim kontrolü

### API Güvenliği
- **Server-Side Proxy:** API anahtarları sunucu tarafında güvenli tutulur
- **Rate Limiting:** IP başına dakikada 60 istek sınırı
- **Input Validation:** Zod schema ile tüm girdi doğrulaması
- **CORS Koruması:** Uygun CORS politikaları

### CSP ve Headers
- **Content Security Policy:** XSS saldırılarına karşı koruma
- **Security Headers:** X-Frame-Options, X-Content-Type-Options vb.
- **HTTPS Zorunluluğu:** Tüm iletişim şifreli kanallar üzerinden

## 🎓 Eğitim Modülleri

Kıvılcım platformu, otizmli çocukların farklı gelişim alanlarını desteklemek için kapsamlı modüller sunar:

### 📚 Kelime Dağarcığı Modülü
**Hedef:** Kelime tanıma, anlama ve hafıza becerilerini geliştirme

**Aktiviteler:**
- **🎯 Kelime Eşleştirme Oyunu:** Sesli kelimelerle resimleri eşleştirme
- **🧠 Hafıza Oyunu:** Kelime-resim çiftlerini bulma ve hafıza güçlendirme

**Özellikler:**
- ElevenLabs API ile yüksek kaliteli Türkçe seslandirme
- Web Speech API fallback desteği
- İnteraktif kart sistemi
- İlerleme takibi ve puan sistemi

### 🤝 Sosyal İletişim Modülü
**Hedef:** Sosyal etkileşim becerileri ve duygusal zeka geliştirme

**Aktiviteler:**
- **😊 Duygu Tanıma:** 6 temel duyguyu (mutlu, üzgün, kızgın, şaşırmış, korkmuş, heyecanlı) tanıma
- **📖 Sosyal Hikayeler:** Günlük yaşam senaryolarında uygun davranışları öğrenme
- **🌅 Günlük Aktiviteler:** Sabah rutini, arkadaşlarla oynama, alışveriş gibi adım adım rehberler
- **💬 İletişim Becerileri:** Temel nezaket ifadeleri ve günlük konuşma kalıpları

**Özellikler:**
- İnteraktif duygu kartları
- Çoktan seçmeli sorularla pekiştirme
- Gerçek yaşam senaryoları
- Ses ile desteklenmiş öğrenme

### ✍️ Yazma ve İfade Etme Modülü
**Hedef:** Motor becerileri, yazma ve yaratıcı ifade yeteneklerini geliştirme

**Aktiviteler:**
- **✏️ Harf Yazma:** A, B, C harflerini SVG rehberiyle izleme ve yazma
- **🔤 Kelime Oluşturma:** Harfleri sürükle-bırak ile birleştirip kelime yapma (KEDI, ELMA, GÜNEŞ)
- **📝 Cümle Kurma:** Kelimelerden anlamlı cümleler oluşturma
- **📚 Hikaye Yazma:** Yaratıcı yazma promtları ile kendi hikayelerini yazma
- **💭 İfade Etme:** Duygu ve deneyimleri yazılı olarak paylaşma

**Özellikler:**
- Canvas tabanlı çizim desteği
- Drag & drop arayüzü
- Kreatif yazma araçları
- İpucu ve anahtar kelime desteği

### 🧩 Temel Kavramlar Modülü
**Hedef:** Okul öncesi temel kavramları ve bilişsel becerileri geliştirme

**Aktiviteler:**
- **🎨 Renkler:** 8 temel rengi tanıma ve öğrenme (kırmızı, mavi, sarı, yeşil, turuncu, mor, pembe, kahverengi)
- **🔷 Şekiller:** 6 geometrik şekli keşfetme (daire, kare, üçgen, dikdörtgen, yıldız, kalp)
- **🔢 Sayılar:** 1-10 arası sayıları nesnelerle eşleştirme
- **📏 Boyutlar:** Büyük-küçük, uzun-kısa kavramlarını öğrenme
- **🧭 Yönler:** Yukarı-aşağı, sağ-sol yön kavramları
- **⚡ Zıt Kavramlar:** Karşıt anlamlı kelimeler (sıcak-soğuk, hızlı-yavaş)
- **⏰ Zaman:** Gündüz-gece, mevsimler gibi zaman kavramları
- **🐾 Hayvanlar:** Ev hayvanları, vahşi hayvanlar, kuşlar ve deniz hayvanları kategorilerini tanıma

**Özellikler:**
- Görsel öğrenme araçları
- İnteraktif seçim sistemleri
- SVG tabanlı şekil grafikleri
- Ses ile desteklenmiş açıklamalar

### 🎯 Pedagojik Yaklaşım

Tüm modüller şu eğitim prensiplerini temel alır:

- **🔄 ABA (Uygulamalı Davranış Analizi):** Anlık pekiştirme ve olumlu geri bildirim
- **🏗️ TEACCH:** Yapılandırılmış ve öngörülebilir öğrenme ortamı
- **🎭 DIR/Floortime:** Çocuğun ilgisini takip eden adaptatif içerik
- **🌱 Montessori:** Çoklu duyusal öğrenme deneyimleri
- **📚 MEB Müfredatı:** Türkiye eğitim standartlarına uygunluk

### 🎮 Oyunlaştırma Özellikleri

Her modül için:
- ⭐ Yıldız ve puan sistemi
- 🏆 Başarı rozetleri
- 📊 İlerleme takibi
- 🎉 Kutlama animasyonları
- ❓ Yardım ve oyun kuralları sistemi

## 🛠️ Teknolojiler

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **UI Kütüphanesi:** [React](https://react.dev/)
- **Stil:** [Tailwind CSS](https://tailwindcss.com/)
- **Veritabanı & Kimlik Doğrulama:** [Firebase](https://firebase.google.com/)
- **Yapay Zeka Ses Servisi:** [ElevenLabs](https://elevenlabs.io/)
- **Test:** [Playwright](https://playwright.dev/) (E2E), [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) (Birim)
- **Tip Güvenliği:** [TypeScript](https://www.typescriptlang.org/)

## 📂 Proje Yapısı

```
otizm-kivilcim/
├── app/                  # Next.js App Router sayfaları ve route'ları
│   ├── api/              # API rotaları (server-side logic)
│   ├── (modules)/        # Uygulama modülleri (egzersiz, panel vb.)
│   └── layout.tsx        # Ana layout
├── components/           # Tekrar kullanılabilir React bileşenleri
├── contexts/             # React Context'leri (örn: Tema)
├── lib/                  # Yardımcı fonksiyonlar, servisler, istemciler (örn: elevenlabs.ts)
├── public/               # Statik varlıklar (resimler, ikonlar)
├── tests/                # E2E ve entegrasyon testleri
└── ...                   # Diğer yapılandırma dosyaları
```

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak isterseniz, lütfen "Issues" bölümünü inceleyin veya yeni bir "Pull Request" oluşturun. Tüm katkılar memnuniyetle karşılanmaktadır!

## 📄 Lisans

Bu proje [MIT Lisansı](./LICENSE) ile lisanslanmıştır.

---
> Bu platform, her çocuğun öğrenme potansiyelini en üst düzeye çıkarmak için sevgiyle ve teknolojiyle geliştirilmektedir.
