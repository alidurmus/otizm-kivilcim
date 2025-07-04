# Ürün Gereksinimleri Dokümanı (PRD): Kıvılcım (Next.js)

## 1. Giriş ve Vizyon

Kıvılcım, otizmli çocukların bilişsel, sosyal ve iletişimsel gelişimini destekleyen, web tabanlı, modüler bir eğitim platformudur. Next.js ile modern web standartlarına uygun, erişilebilir ve ölçeklenebilir bir yapı hedeflenmektedir.

## 2. Hedef Kitle
- Otizmli çocuklar (birincil kullanıcı)
- Ebeveynler
- Özel eğitim uzmanları

## 3. Temel Özellikler
- Modüler gelişim alanları (okuryazarlık, sosyal iletişim, kelime dağarcığı, yazma)
- Ebeveyn paneli (gelişim takibi, duyusal ayarlar)
- Admin paneli (sistem yönetimi, kullanıcı analitikleri)
- Duyusal kontrol paneli (tema, ses, animasyon)
- Oyunlaştırma ve anlık pekiştirme
- Yapay zeka destekli telaffuz değerlendirme
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
- **Authentication:** Firebase Authentication
- **Database:** Firebase Firestore
- **Audio Services:** ElevenLabs API + Web Speech API (fallback)
- **Deployment:** Vercel (önerilen)
- **Analytics:** Built-in dashboard + Firebase Analytics

### 4.3 Güvenlik Gereksinimleri
- **API Key Management:** Server-side proxy pattern
- **Content Security Policy (CSP)** implementasyonu
- **Input Validation:** Zod schema validation
- **KVKK Uyumluluğu:** Veri minimizasyonu ve açık rıza
- **Firestore Security Rules:** User-level data isolation

### 4.4 Performans Hedefleri
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
- **Bundle Size:** < 500KB (gzipped)
- **Time to Interactive:** < 3s
- **Accessibility Score:** 95+ (Lighthouse)

## 5. Sayfa ve Akışlar

### 5.1 Kullanıcı Akışları
- **Ana Sayfa:** Karşılama + platform tanıtımı
- **Modül Seçimi:** Aktif/pasif modüllerin listesi
- **Egzersiz Akışı:** Modül bazlı interaktif öğrenme
- **Ebeveyn Paneli:** İlerleme takibi + duyusal ayarlar
- **Admin Paneli:** Sistem yönetimi + analytics
- **Duyusal Kontrol:** Kişiselleştirme ayarları

### 5.2 Responsive Tasarım
- **Mobile First:** 375px+ (iPhone SE)
- **Tablet:** 768px+ (iPad)
- **Desktop:** 1024px+ (Laptop)
- **Touch Targets:** Minimum 44px (WCAG AA)

## 6. Kalite Standartları

### 6.1 Test Coverage Hedefleri
- **E2E Tests:** 90%+ critical user journeys
- **Unit Tests:** 80%+ component coverage
- **Integration Tests:** 70%+ API endpoints
- **Accessibility Tests:** 100% WCAG AA compliance

### 6.2 Code Quality Standards
- **TypeScript:** Strict mode, no `any` types
- **ESLint:** Next.js recommended + custom rules
- **Code Review:** Mandatory for all PRs
- **Documentation:** JSDoc for all public APIs
- **Performance:** Bundle analyzer integration

## 7. Güvenlik ve Gizlilik

### 7.1 Veri Koruma (KVKK)
- **Veri Minimizasyonu:** Sadece gerekli veriler toplanır
- **Açık Rıza:** Ebeveyn onayı ile veri işleme
- **Veri Taşınabilirliği:** Export/import functionality
- **Silme Hakkı:** Tam veri silme seçeneği
- **Şeffaflık:** Açık gizlilik politikası

### 7.2 Teknik Güvenlik
- **Authentication:** Firebase secure tokens
- **Authorization:** Role-based access control
- **Data Encryption:** Transit ve rest encryption
- **API Security:** Rate limiting + input validation
- **Monitoring:** Security incident logging

## 8. Başarı Kriterleri

### 8.1 Teknik Metrikler
- **Uptime:** 99.9% availability
- **Performance:** Core Web Vitals compliance
- **Security:** Zero critical vulnerabilities
- **Accessibility:** WCAG AA compliance
- **Test Coverage:** 80%+ overall coverage

### 8.2 Kullanıcı Metrikleri
- **Engagement:** Haftada 3+ aktif kullanım
- **Learning Outcomes:** 80%+ doğruluk oranı
- **User Satisfaction:** NPS > 40
- **Retention:** 70%+ monthly active users
- **Error Rate:** < 1% user-facing errors

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

## 10. Gelecek Roadmap

### 10.1 Faz 2: Genişletme (3-6 ay)
- **Yeni Modüller:** Sosyal iletişim, yazma becerileri
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

## 11. Referanslar
- [Next.js Resmi Dokümantasyonu](https://nextjs.org/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/security)
- [Vercel Performance Best Practices](https://vercel.com/docs/concepts/analytics)
- docs/reference/referanslar-ve-kaynaklar.md

---

> Bu doküman, projenin güncel gereksinimlerini ve kalite standartlarını yansıtır. Code review sonuçları ve teknik borç analizi temel alınarak düzenlenmiştir. 