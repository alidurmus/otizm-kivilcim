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

Projenin kök dizininde `.env.local` adında bir dosya oluşturun. Bu dosyaya, ses hizmetleri için gerekli olan API anahtarınızı ekleyin.

```env
# .env.local

# ElevenLabs API anahtarınız
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Firebase projenizin yapılandırma bilgileri (gerekirse)
# NEXT_PUBLIC_FIREBASE_...
```

> **🔒 Güvenlik Notu:** `NEXT_PUBLIC_` öneki, API anahtarını istemci tarafında (tarayıcıda) görünür kılar. Bu, geliştirme için uygundur ancak üretim ortamı için güvenli değildir. Üretim ortamında anahtarların bir sunucu tarafı proxy üzerinden yönetilmesi hedeflenmektedir.

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

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
