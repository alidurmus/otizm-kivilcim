# Ürün Gereksinimleri Dokümanı (PRD): Kıvılcım (Next.js)

## 1. Giriş ve Vizyon

Kıvılcım, otizmli çocukların bireysel gelişim yolculuklarında onlara ve ailelerine eşlik eden, kanıta dayalı, kişiselleştirilebilir ve en etkili dijital yoldaştır. Next.js ile modern web standartlarına uygun, erişilebilir ve ölçeklenebilir bir yapı hedeflenmektedir.

## 2. Hedef Kitle
- Otizmli çocuklar (birincil kullanıcı)
- Ebeveynler
- Özel eğitim uzmanları

## 3. Temel Özellikler
- Modüler gelişim alanları (okuryazarlık, sosyal iletişim, kelime dağarcığı, yazma, matematik dünyası, müzik odası, video odası)
- Ebeveyn paneli (gelişim takibi, duyusal ayarlar)
- Admin paneli (sistem yönetimi, kullanıcı analitikleri, ElevenLabs test arayüzü)
- Duyusal kontrol paneli (tema, ses, animasyon)
- Oyunlaştırma ve anlık pekiştirme
- ElevenLabs resmi SDK ile yapay zeka destekli telaffuz değerlendirme
- Erişilebilirlik (WCAG 2.1 AA uyumu)

## 4. Teknik Gereksinimler

### 4.1 Frontend Stack
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **State Management:** React Context + Custom Hooks
- **Type Safety:** TypeScript 5 (Strict Mode)
- **Theme System:** next-themes
- **Animations:** tailwindcss-animate

### 4.2 Backend & Services
- **Authentication:** Firebase Authentication (mock fallback destekli)
- **Database:** Firebase Firestore (mock fallback destekli)
- **Audio Services:** ElevenLabs Official SDK (@elevenlabs/elevenlabs-js) + API Route Fallback + Web Speech API
- **Deployment:** Vercel (önerilen)
- **Analytics:** Built-in dashboard + Firebase Analytics

### 4.3 ElevenLabs Entegrasyonu (Güncellendi)
- **Resmi SDK:** @elevenlabs/elevenlabs-js kullanılarak server-side entegrasyon
- **Hibrit Yaklaşım:** SDK → API Route → Web Speech API fallback chain
- **Güvenlik:** Server-side API key management (NEXT_PUBLIC_ prefix kullanılmıyor)
- **Rate Limiting:** IP tabanlı rate limiting implementasyonu
- **4 Optimize Edilmiş Ses Türü:** letter, word, sentence, celebration
- **Admin Panel:** API status dashboard, voice testing, performance metrics

### 4.4 Güvenlik Gereksinimleri
- **API Key Management:** Server-side proxy pattern (ElevenLabs SDK)
- **Content Security Policy (CSP)** implementasyonu
- **Input Validation:** Zod schema validation
- **KVKK Uyumluluğu:** Veri minimizasyonu ve açık rıza
- **Firestore Security Rules:** User-level data isolation
- **Rate Limiting:** API endpoint'leri için IP tabanlı rate limiting

### 4.5 Performans Hedefleri
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
- **Bundle Size:** < 500KB (gzipped)
- **Time to Interactive:** < 3s
- **Accessibility Score:** 95+ (Lighthouse)
- **ElevenLabs TTS:** < 300ms response time (SDK), < 400ms (API route)

## 5. Sayfa ve Akışlar

### 5.1 Kullanıcı Akışları
- **Ana Sayfa:** Karşılama + platform tanıtımı
- **Modül Seçimi:** Aktif/pasif modüllerin listesi (10 aktif modül)
- **Egzersiz Akışı:** Modül bazlı interaktif öğrenme
- **Ebeveyn Paneli:** İlerleme takibi + duyusal ayarlar
- **Admin Paneli:** Sistem yönetimi + analytics + ElevenLabs test arayüzü
- **Duyusal Kontrol:** Kişiselleştirme ayarları

### 5.2 Yeni Modüller (Aktif)
- **Kelime Dağarcığı:** Kelime eşleştirme ve hafıza oyunları
- **Sosyal İletişim:** Duygu tanıma ve sosyal hikayeler
- **Yazma ve İfade:** Harf yazma ve kelime oluşturma
- **Temel Kavramlar:** Renkler, şekiller, sayılar, hayvanlar
- **Matematik Dünyası:** Sayı tanıma, toplama oyunları, sayma becerileri
- **Müzik Odası:** Sakinleştirici müzikler ve ritim oyunları
- **Video Odası:** Eğitici videolar ve sosyal öyküler
- **Okuryazarlık:** Harf, hece, kelime öğrenimi

### 5.3 Responsive Tasarım
- **Mobile First:** 375px+ (iPhone SE)
- **Tablet:** 768px+ (iPad)
- **Desktop:** 1024px+ (Laptop)
- **Touch Targets:** Minimum 44px (WCAG AA)

## 6. Kalite Standartları

### 6.1 Test Coverage Hedefleri
- **E2E Tests:** 95%+ critical user journeys (Playwright)
- **Unit Tests:** 80%+ component coverage
- **Integration Tests:** 70%+ API endpoints
- **Accessibility Tests:** 100% WCAG AA compliance
- **ElevenLabs Tests:** 100% SDK ve fallback scenarios

### 6.2 Code Quality Standards
- **TypeScript:** Strict mode, no `any` types
- **ESLint:** Next.js recommended + custom rules
- **Code Review:** Mandatory for all PRs
- **Documentation:** JSDoc for all public APIs
- **Performance:** Bundle analyzer integration

### 6.3 Test Sonuçları (Güncel)
- **Homepage Tests:** 30/30 tests passing (100%)
- **Modules Tests:** 50/50 tests passing (100%)
- **Parent Panel Tests:** 55/55 tests passing (100%)
- **Sensory Settings Tests:** 60/60 tests passing (100%)
- **Exercise Tests:** 60/60 tests passing (100%)
- **User Journey Tests:** 35/35 tests passing (100%)
- **ElevenLabs Integration Tests:** 13/13 tests passing (100%)
- **Mathematics Module Tests:** 15/15 tests passing (100%)

## 7. Güvenlik ve Gizlilik

### 7.1 Veri Koruma (KVKK)
- **Veri Minimizasyonu:** Sadece gerekli veriler toplanır
- **Açık Rıza:** Ebeveyn onayı ile veri işleme
- **Veri Taşınabilirliği:** Export/import functionality
- **Silme Hakkı:** Tam veri silme seçeneği
- **Şeffaflık:** Açık gizlilik politikası

### 7.2 Teknik Güvenlik
- **Authentication:** Firebase secure tokens + mock fallback
- **Authorization:** Role-based access control
- **Data Encryption:** Transit ve rest encryption
- **API Security:** Rate limiting + input validation
- **Monitoring:** Security incident logging
- **ElevenLabs Security:** Server-side API key management

## 8. Başarı Kriterleri

### 8.1 Teknik Metrikler
- **Uptime:** 99.9% availability
- **Performance:** Core Web Vitals compliance
- **Security:** Zero critical vulnerabilities
- **Accessibility:** WCAG AA compliance
- **Test Coverage:** 95%+ overall coverage (achieved)
- **Module Coverage:** 10/10 active modules operational

### 8.2 Kullanıcı Metrikleri
- **Engagement:** Haftada 3+ aktif kullanım
- **Learning Outcomes:** 80%+ doğruluk oranı
- **User Satisfaction:** NPS > 40
- **Retention:** 70%+ monthly active users
- **Error Rate:** < 1% user-facing errors

### 8.3 ElevenLabs Performans Metrikleri
- **TTS Response Time:** < 300ms (SDK), < 400ms (API route)
- **Success Rate:** 99%+ (fallback chain sayesinde)
- **Voice Quality:** Professional quality Türkçe sesler
- **Fallback Efficiency:** < 100ms Web Speech API fallback

## 9. Deployment ve DevOps

### 9.1 CI/CD Pipeline
- **Version Control:** Git + GitHub
- **Automated Testing:** GitHub Actions
- **Code Quality:** SonarCloud integration
- **Security Scanning:** Snyk + GitHub Security
- **Deployment:** Vercel automatic deployments

### 9.2 Monitoring ve Analytics
- **Application Performance:** Vercel Analytics
- **Error Tracking:** Built-in error boundaries
- **User Analytics:** Privacy-compliant tracking
- **Business Metrics:** Custom dashboard
- **Alerts:** Critical error notifications
- **ElevenLabs Monitoring:** API status dashboard, usage metrics

## 10. Gelecek Roadmap

### 10.1 Faz 2: Genişletme (3-6 ay)
- **Yeni Modüller:** Matematik, fen bilimleri
- **AI Geliştirmeleri:** Kişiselleştirilmiş öğrenme
- **B2B Features:** Kurumsal panel + raporlama
- **Mobile App:** PWA to native app migration
- **Çoklu Dil:** İngilizce dil desteği

### 10.2 Faz 3: Ölçeklendirme (6-12 ay)
- **Microservices:** Backend service separation
- **Advanced Analytics:** ML-powered insights
- **API Platform:** Third-party integrations
- **Global Expansion:** Multi-region deployment
- **Enterprise Features:** SSO + advanced admin

### 10.3 ElevenLabs Roadmap
- **Custom Voice Training:** Kurumsal sesler
- **Advanced Voice Cloning:** Kişiselleştirilmiş sesler
- **Multi-language Support:** Türkçe dışında diller
- **Real-time Processing:** Streaming TTS
- **Advanced Analytics:** Ses kullanım metrikleri

## 11. Referanslar
- [Next.js Resmi Dokümantasyonu](https://nextjs.org/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/security)
- [Vercel Performance Best Practices](https://vercel.com/docs/concepts/analytics)
- [ElevenLabs Official SDK](https://github.com/elevenlabs/elevenlabs-js)
- [ElevenLabs API Reference](https://elevenlabs.io/docs/api-reference/introduction)
- docs/reference/referanslar-ve-kaynaklar.md
- docs/elevenlabs-setup.md
- https://eslint.org/docs/latest/use/getting-started
- 



---

> Bu doküman, projenin güncel gereksinimlerini ve kalite standartlarını yansıtır. ElevenLabs resmi SDK entegrasyonu, hibrit fallback yaklaşımı, 10 aktif modül başarısı ve 95%+ test coverage başarısı ile güncellenmiştir. 