# Pages – Kıvılcım (Next.js)

Bu doküman, Kıvılcım platformunun Next.js tabanlı web uygulamasında sayfa (pages) yapısı, gereksinimleri ve en iyi uygulamaları özetler.

---

## 1. Next.js'de Sayfa Yapısı
- **/app** veya **/pages** dizini altında her dosya bir route (yol) oluşturur.
- `app` dizini ile App Router kullanılır (önerilir, modern Next.js projelerinde).
- Her sayfa bir React component'i olarak tanımlanır.
- Dinamik route'lar için köşeli parantez: `[id].tsx`

### Örnek Dizin Yapısı
```
/app
  ├── page.tsx              # Ana sayfa (root)
  ├── modules/
  │     └── page.tsx        # Modül seçimi
  ├── exercise/
  │     └── page.tsx        # Egzersiz ekranı
  ├── parent/
  │     └── page.tsx        # Ebeveyn paneli
  ├── sensory-settings/
  │     └── page.tsx        # Duyusal kontrol paneli
  ├── feedback/
  │     └── page.tsx        # Geri bildirim formu
  └── [...not-found]/page.tsx # 404 ve özel hata sayfaları
```

---

## 2. Temel Sayfalar ve Gereksinimler

### 2.1. Ana Sayfa (Landing Page)
- Proje tanıtımı, giriş butonu, yönlendirme
- Responsive ve erişilebilir tasarım

### 2.2. Modül Seçimi
- Kullanıcıya aktif ve pasif modülleri gösterir
- Modül kartları, "Yakında" etiketi, ebeveyn paneli erişimi

### 2.3. Egzersiz Ekranı
- Modül bazlı dinamik içerik
- Görev akışı, sesli asistan, pekiştirme animasyonları
- Kullanıcı girdisi (dokunma, sürükle-bırak, ses)

### 2.4. Ebeveyn Paneli
- Çocuğun gelişim verileri, grafikler, özet kartlar
- Duyusal ayarlar ve yönetim merkezi erişimi
- "Yeni Maceralar" ve "Süper Güçler" kartları ile pozitif ve eyleme dönük geri bildirim
- Haftalık aktivite grafiği ve çalışma tutarlılığı
- Yönetim merkezi: Duyusal kontrol paneli, geri bildirim, hesap ayarları

### 2.5. Duyusal Kontrol Paneli
- Tema, ses, animasyon, haptic feedback ayarları
- Kullanıcıya özel kişiselleştirme

### 2.6. Geri Bildirim Formu
- Ebeveyn/uzman geri bildirimi toplama
- Firestore'a kayıt

### 2.7. Hata ve Yönlendirme Sayfaları
- 404, 500, yetkisiz erişim, özel hata mesajları
- Kullanıcı dostu, açıklayıcı Türkçe metinler

---

## 3. En İyi Uygulamalar
- **İngilizce dosya ve component isimleri**, Türkçe kullanıcı arayüzü metinleri
- Her sayfa için ayrı bir component ve stil dosyası
- Route bazlı layout kullanımı (`layout.tsx`)
- Ortak UI bileşenlerini (header, footer, modal, vs.) `components/` altında tutun
- Sayfa başlıkları ve meta etiketleri için Next.js metadata API'sini kullanın
- Erişilebilirlik (a11y) ve SEO uyumuna dikkat edin
- Dinamik route'larda parametre validasyonu ve hata yönetimi uygulayın

---

## 4. Gelişmiş İhtiyaçlar
- **Authentication**: Giriş/kayıt, oturum yönetimi, korumalı sayfalar
- **Internationalization (i18n)**: Çoklu dil desteği (gelecekte)
- **State Management**: Sayfalar arası veri paylaşımı için context veya state yönetimi
- **Lazy Loading**: Sayfa ve component bazlı yükleme optimizasyonu
- **Testler**: Her sayfa için birim ve e2e testleri (Playwright, Jest)

---

## 5. Kaynaklar
- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js Pages and Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

---

> Bu doküman, Kıvılcım projesinde sayfa mimarisi ve geliştirme süreçlerinde referans olarak kullanılabilir. 