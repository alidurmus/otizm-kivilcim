# TODO Listesi – Kıvılcım (Next.js)

Bu dosya, projenin geliştirme sürecinde yapılacak ana görevleri ve ilerlemeyi takip etmek için kullanılır.

## 🚨 Kritik Güvenlik Düzeltmeleri (ASAP)

- [ ] **API Key Güvenliği:** ElevenLabs API key'ini server-side proxy'e taşı
- [ ] **Environment Variables:** Tüm hassas verileri NEXT_PUBLIC_ olmadan yönet
- [ ] **Content Security Policy:** CSP header'larını next.config.ts'e ekle
- [ ] **Input Validation:** Zod schema validation ekle (kullanıcı girdileri için)
- [ ] **Firestore Security Rules:** User-level data isolation kuralları deploy et
- [ ] **Error Boundaries:** Uygulama genelinde error boundary'ler implement et

## ⚡ Performans İyileştirmeleri (Yüksek Öncelik)

- [ ] **Bundle Optimization:** Code splitting ve lazy loading ekle
- [ ] **Image Optimization:** Next.js Image component'ine geç
- [ ] **Memoization:** React.memo ve useMemo ekle (expensive components)
- [ ] **Bundle Analyzer:** webpack-bundle-analyzer entegre et
- [ ] **Core Web Vitals:** LCP, FID, CLS metriklerini optimize et
- [ ] **Font Loading:** Preload fonts ve font-display: swap ekle

## 🧪 Test Coverage Artırımı (Yüksek Öncelik)

- [ ] **Unit Tests:** React Testing Library ile component testleri (%80 coverage)
- [ ] **Integration Tests:** Custom hook'lar için test yazımı
- [ ] **API Mocking:** MSW (Mock Service Worker) entegrasyonu
- [ ] **Accessibility Tests:** @testing-library/jest-dom a11y testleri
- [ ] **Visual Regression:** Chromatic veya Percy entegrasyonu
- [ ] **Test CI/CD:** GitHub Actions'a test pipeline'ı ekle

## 🏗️ Kod Kalitesi ve Mimari İyileştirmeleri

- [ ] **Service Layer:** AudioService, UserService abstraction'ları
- [ ] **Repository Pattern:** Firebase operations için repository layer
- [ ] **Custom Hooks:** Business logic'i hook'lara taşı
- [ ] **Error Handling:** Typed error classes ve centralized handling
- [ ] **TypeScript Strict:** `any` type'ları eliminate et
- [ ] **ESLint Rules:** Custom rules ve pre-commit hooks

## 📱 UI/UX İyileştirmeleri

- [ ] **Kontrast İyileştirme:** WCAG AA compliance için renk düzeltmeleri
- [ ] **Focus Management:** Keyboard navigation ve focus trap
- [ ] **Loading States:** Skeleton screens ve progressive loading
- [ ] **Error States:** User-friendly error messages
- [ ] **Empty States:** Meaningful empty state designs
- [ ] **Micro-interactions:** Subtle animations ve feedback

## 🔧 DevOps ve Monitoring

- [ ] **CI/CD Pipeline:** GitHub Actions ile automated deployment
- [ ] **Error Tracking:** Sentry veya built-in error tracking
- [ ] **Performance Monitoring:** Vercel Analytics entegrasyonu
- [ ] **Security Scanning:** Snyk veya GitHub Security alerts
- [ ] **Code Quality:** SonarCloud integration
- [ ] **Dependency Updates:** Renovate bot kurulumu

## 📊 Analytics ve Monitoring

- [ ] **User Analytics:** Privacy-compliant user behavior tracking
- [ ] **Performance Metrics:** Custom dashboard için metrics collection
- [ ] **A/B Testing:** Feature flag sistemi kurulumu
- [ ] **Business Metrics:** Learning outcome tracking
- [ ] **Alert System:** Critical error notifications
- [ ] **Health Checks:** Application health monitoring

## Genel Başlıklar (Tamamlananlar)

- [x] Next.js projesi başlat (create-next-app)
- [x] Temel klasör yapısını oluştur (app, components, styles, docs)
- [x] Tasarım sistemi ve tema entegrasyonu (Tailwind CSS)
- [x] Firebase entegrasyonu (Auth, Firestore)
- [x] Ana sayfa ve modül seçimi ekranı
- [x] Egzersiz ekranı (okuryazarlık modülü)
- [x] Ebeveyn paneli ve gelişim takibi
- [x] Duyusal kontrol paneli
- [x] Oyunlaştırma ve pekiştirme sistemi
- [x] Yapay zeka telaffuz değerlendirme entegrasyonu
- [x] Erişilebilirlik (WCAG 2.1) kontrolleri
- [x] Testler (unit, e2e, Playwright)
- [x] Dokümantasyon güncellemeleri
- [x] Anlam ve Kelime Dağarcığı modülü geliştirme
- [x] Sosyal İletişim modülü geliştirme
- [x] Yazma ve İfade Etme modülü geliştirme
- [x] Temel Kavramlar modülü geliştirme
- [x] Admin paneli implementasyonu
- [x] Theme toggle functionality

## Ses Entegrasyonu Geliştirmeleri (Tamamlananlar)

- [x] ElevenLabs entegrasyonu için yeni ses türleri ekle
- [x] ElevenLabs ses ayarlarını optimize et
- [x] ElevenLabs entegrasyonu için test coverage'ı artır
- [x] ElevenLabs entegrasyonu için hata yönetimini geliştir
- [x] Duyusal kontrol panelinden ses ayarlarını yönetme özelliğini entegre et

## 🔮 Gelecek Özellikler (Faz 2-3)

- [ ] **PWA Features:** Service worker ve offline capability
- [ ] **Multi-language:** i18n entegrasyonu (İngilizce desteği)
- [ ] **Advanced AI:** Kişiselleştirilmiş öğrenme algoritmaları
- [ ] **B2B Dashboard:** Kurumsal kullanıcı yönetimi
- [ ] **API Platform:** Third-party entegrasyonlar için REST API
- [ ] **Mobile App:** React Native veya native app migration
- [ ] **Real-time Features:** WebSocket entegrasyonu
- [ ] **Advanced Analytics:** ML-powered insights

## 📋 Code Review Action Items

### Hemen Yapılacaklar (Bu Hafta)
1. **API Security:** ElevenLabs key'i server-side'a taşı
2. **Error Boundaries:** Critical pages için error boundary ekle
3. **Input Validation:** User input'ları için Zod validation

### Kısa Vadeli (1 Ay)
1. **Test Coverage:** Unit test coverage %80'e çıkar
2. **Performance:** Bundle size 500KB altına düşür
3. **Accessibility:** Lighthouse score 95+ yap

### Uzun Vadeli (3 Ay)
1. **Architecture:** Service layer pattern implement et
2. **Monitoring:** Comprehensive logging ve alerting
3. **Scalability:** Microservice architecture'a hazırlık

## 📈 Kalite Metrikleri

### Mevcut Durum
- **Bundle Size:** ~800KB (hedef: 500KB)
- **Test Coverage:** E2E %90, Unit %30 (hedef: %80)
- **Lighthouse Score:** 85 (hedef: 95+)
- **Security Score:** 6/10 (hedef: 9/10)

### Hedefler
- **Performance:** Core Web Vitals compliance
- **Security:** Zero critical vulnerabilities
- **Accessibility:** WCAG AA compliance
- **Maintainability:** Technical debt < 5%

## Notlar
- Her ana başlık, alt görevler ve detaylar ile genişletilebilir.
- Tamamlanan görevler işaretlenmelidir.
- Kritik güvenlik görevleri en yüksek önceliğe sahiptir.
- Performance ve test coverage hedefleri sürekli monitör edilmelidir.

---

> Bu dosya, code review sonuçları ve teknik borç analizi temel alınarak güncellenmiştir. Ekip içi iletişim ve sprint planlaması için referans olarak kullanılabilir.