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
- **EN GÜNCEL MODEL:** eleven_turbo_v2_5 - %50 daha ucuz, düşük latency, yüksek Türkçe kalite

#### **Modüler Ses Sistemi Kuralı (YENİ)**
```typescript
// KURAL: Her modül kendi karşılama mesajı ile karşılasın
// Modül-specific welcome messages prevent cross-module audio confusion

// ✅ DOĞRU: Her modül için özel hoş geldin mesajı
useEffect(() => {
  if (!hasPlayedWelcome && currentGame === 'menu') {
    speak('Matematik Dünyası modülüne hoş geldin! Sayıları öğren ve temel matematik becerilerini geliştir.', 'sentence');
    setHasPlayedWelcome(true);
  }
}, [speak, hasPlayedWelcome, currentGame]);

// ❌ YANLIŞ: Generic hoş geldin mesajı
speak('Hoş geldin!', 'sentence'); // Hangi modül olduğu belirsiz

// ❌ YANLIŞ: Başka modülün mesajını kullanma  
speak('Alfabe okuma modülüne hoş geldin!', 'sentence'); // Matematik modülünde alfabe mesajı
```

**Modül Bazlı Ses Sistemi Gereksinimleri:**
- Her modül (`/exercise/*`) kendi özel hoş geldin mesajına sahip olmalı
- Audio constants'ta modül adı ile eşleşen welcome message tanımlanmalı
- `hasPlayedWelcome` state ile sadece bir kez çalınması sağlanmalı
- Modül ismi açık bir şekilde seslendirilmeli (örn: "Matematik Dünyası modülüne hoş geldin!")
- Cross-module audio contamination önlenmeli

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

### 9.3 TODO Yönetim Sistemi
- **Protokol:** Yapılandırılmış görev yönetimi sistemi
- **Durum Takibi:** ⏳ BEKLEMEDE → 🔄 ÜZERİNDE ÇALIŞILIYOR → ✅ TAMAMLANDI
- **Öncelik Sistemi:** (H) High, (M) Medium, (L) Low priority classification
- **AI Coder Koordinasyonu:** Çakışma önleme ve görev kilitleme sistemi
- **İlerleme Tracking:** Alt adımlar ve checkbox-based progress monitoring
- **Dokümantasyon:** [.cursor/rules/todo-management.mdc](./.cursor/rules/todo-management.mdc)
- **Aktif Liste:** [docs/todo.md](./todo.md) - Güncel görevler ve durumları

**TODO Sistem Avantajları:**
- **Parallel Development:** Multiple AI Coder'ların conflict-free çalışması
- **Quality Assurance:** Checkpoint-based task completion validation
- **Priority Management:** Critical issue'ların hızlı resolution'u
- **Progress Transparency:** Real-time task status visibility
- **Knowledge Transfer:** Structured task handoff between team members

### 9.4 Modül Bazlı Kural Sistemi (YENİ)
- **Amaç:** Her modül için özel kurallar ile tutarlı geliştirme süreci
- **Konum:** `docs/modules/` - 10 aktif modül için ayrı kural dosyaları
- **Kullanım:** Modül işlemi öncesinde ilgili kural dosyasını oku ve uygula
- **Kapsam:** Voice assignments, UI/UX rules, content standards, test requirements

#### **Modül Kuralları Yapısı**
```typescript
// Her modül için özel kural dosyası
docs/modules/
├── README.md                    // Ana index ve kullanım rehberi
├── alphabet-reading.md          // Alfabe okuma modülü kuralları  
├── mathematics.md               // Matematik dünyası modülü kuralları
├── social-communication.md      // Sosyal iletişim modülü kuralları
├── vocabulary.md                // Kelime dağarcığı modülü kuralları
├── basic-concepts.md            // Temel kavramlar modülü kuralları
├── literacy.md                  // Okuryazarlık modülü kuralları
├── writing-expression.md        // Yazma ve ifade modülü kuralları
├── music-room.md                // Müzik odası modülü kuralları
├── video-room.md                // Video odası modülü kuralları
└── puzzle.md                    // Puzzle oyunu modülü kuralları
```

#### **Kural Kategorileri**
- **🔊 Ses Sistemi Kuralları:** Voice character assignments, audio file management
- **🎨 UI/UX Kuralları:** Autism-friendly design, accessibility requirements
- **📚 İçerik Kuralları:** Turkish language, age-appropriate content standards
- **🔧 Teknik Kuralları:** Performance, error handling, state management
- **🧪 Test Kuralları:** Module-specific testing requirements
- **⚠️ Critical Rules:** Do not / Always requirements per module

#### **Development Workflow Integration**
```typescript
// Modül bazlı işlem workflow'u
MODUEL_OPERATION_WORKFLOW = {
  step1: 'Identify target module',
  step2: 'Read docs/modules/{module-name}.md',
  step3: 'Apply voice character rules',
  step4: 'Follow audio file management policy',
  step5: 'Implement autism-friendly design',
  step6: 'Execute module-specific tests',
  step7: 'Validate rule compliance'
}
```

#### **Voice Character Rule Enforcement**
- **Adam:** Letter pronunciation (alphabet-reading, literacy)
- **Antoni:** Instructions and storytelling (social-communication, writing, video)
- **Josh:** Celebrations and games (mathematics, music, puzzle)
- **Rachel:** Word pronunciation and concepts (vocabulary, basic-concepts)
- **Gülsu:** Default character continuity (mathematics, social-communication)

#### **User Audio Management Integration**
- **Policy:** User manages module-specific audio files manually
- **System Support:** Fallback chain (static files → ElevenLabs → Web Speech)
- **Developer Guideline:** Never auto-generate audio without user approval
- **Exception Handling:** Graceful degradation when audio unavailable

### 9.5 Bölüm Bazlı Kural Sistemi (CORE RULE - YENİ)
**Ana Proje Kuralı: Herhangi bir bölüm/modül oluşturulduğunda o bölüme ait kurallar da oluşturulacak**

#### **🎯 Temel Prensipler**
- **Kural Oluşturma:** Yeni bölüm/modül → Otomatik kural dosyası oluşturma
- **Kural Okuma:** Bölüm işlemi → İlgili kural dosyasını oku ve uygula
- **Kural Güncelleme:** Gelişme/değişiklik → Kural dosyasını güncelle
- **Tutarlılık Kontrolü:** Kural çelişkisi → Raporlama ve düzeltme

#### **🏗️ Bölüm Kural Sistemi Yapısı**
```typescript
// CORE RULE STRUCTURE
SECTION_RULE_SYSTEM = {
  // 1. Bölüm oluşturma kuralı
  onSectionCreated: {
    action: 'CREATE_RULE_FILE',
    location: 'docs/rules/{section-name}.md',
    template: 'section-rule-template.md',
    mandatory: true
  },
  
  // 2. Bölüm işlemi kuralı
  onSectionOperation: {
    action: 'READ_SECTION_RULES',
    location: 'docs/rules/{section-name}.md',
    applyRules: true,
    validateCompliance: true
  },
  
  // 3. Geliştirme kuralı
  onDevelopmentChanges: {
    action: 'UPDATE_SECTION_RULES',
    location: 'docs/rules/{section-name}.md',
    trackChanges: true,
    versionControl: true
  },
  
  // 4. Tutarlılık kontrolü
  onInconsistencyDetected: {
    action: 'REPORT_INCONSISTENCY',
    location: 'docs/reports/rule-inconsistencies.md',
    severity: 'HIGH_PRIORITY',
    requiresResolution: true
  }
}
```

#### **📁 Bölüm Kural Dosya Yapısı**
```typescript
// Her bölüm için standart kural dosyası formatı
interface SectionRuleFile {
  metadata: {
    sectionName: string;
    sectionType: 'module' | 'component' | 'service' | 'api' | 'ui';
    createdAt: Date;
    lastUpdated: Date;
    version: string;
    maintainer: string;
  };
  
  rules: {
    voice: VoiceRules;          // Ses sistemi kuralları
    ui: UIRules;                // UI/UX kuralları
    content: ContentRules;      // İçerik kuralları
    technical: TechnicalRules;  // Teknik kuralları
    testing: TestingRules;      // Test kuralları
    critical: CriticalRules;    // Kritik kurallar
  };
  
  compliance: {
    mustDo: string[];           // Mutlaka yapılması gerekenler
    mustNotDo: string[];        // Asla yapılmaması gerekenler
    bestPractices: string[];    // En iyi uygulamalar
    warnings: string[];         // Dikkat edilmesi gerekenler
  };
  
  dependencies: {
    relatedSections: string[];  // İlgili bölümler
    sharedRules: string[];      // Ortak kurallar
    conflicts: string[];        // Çelişkili kurallar
  };
  
  changelog: {
    date: Date;
    changes: string[];
    reason: string;
    author: string;
  }[];
}
```

#### **🔄 Otomatik Kural Yönetimi**
```typescript
// Otomatik kural yönetim iş akışı
AUTOMATIC_RULE_MANAGEMENT = {
  // Yeni bölüm detect edildiğinde
  onNewSectionDetected: {
    step1: 'Scan for new sections/modules',
    step2: 'Check if rule file exists',
    step3: 'Create rule file from template',
    step4: 'Populate with basic rules',
    step5: 'Add to rule index',
    step6: 'Notify maintainer'
  },
  
  // Bölüm operation sırasında
  onSectionOperation: {
    step1: 'Identify target section',
    step2: 'Load section-specific rules',
    step3: 'Validate against rules',
    step4: 'Apply rule constraints',
    step5: 'Log compliance status',
    step6: 'Report violations'
  },
  
  // Geliştirme sonrası
  onDevelopmentComplete: {
    step1: 'Analyze changes made',
    step2: 'Check rule compliance',
    step3: 'Update rules if needed',
    step4: 'Version control changes',
    step5: 'Update documentation',
    step6: 'Notify stakeholders'
  }
}
```

#### **📊 Tutarlılık Kontrolü ve Raporlama**
```typescript
// Tutarlılık kontrolü sistemi
CONSISTENCY_CHECK_SYSTEM = {
  automated: {
    frequency: 'daily',
    checks: [
      'Rule file existence for all sections',
      'Cross-section rule conflicts',
      'Deprecated rule usage',
      'Missing mandatory rules',
      'Rule format validation'
    ]
  },
  
  manual: {
    frequency: 'weekly',
    checks: [
      'Rule effectiveness assessment',
      'Developer compliance review',
      'Rule clarity and understanding',
      'Update requirements identification'
    ]
  },
  
  reporting: {
    inconsistencyReport: {
      location: 'docs/reports/rule-inconsistencies.md',
      format: 'markdown',
      includes: [
        'Detected inconsistencies',
        'Severity levels',
        'Recommended actions',
        'Timeline for resolution'
      ]
    },
    complianceReport: {
      location: 'docs/reports/rule-compliance.md',
      format: 'markdown',
      includes: [
        'Compliance percentage',
        'Section-wise compliance',
        'Violation patterns',
        'Improvement suggestions'
      ]
    }
  }
}
```

#### **🚨 Kritik Kural Gereksinimleri**
```typescript
// Kritik kurallar - asla ihlal edilmemelidir
CRITICAL_RULE_REQUIREMENTS = {
  mandatory: [
    'Every section MUST have a rule file',
    'Rules MUST be read before section operations',
    'Rule violations MUST be reported',
    'Inconsistencies MUST be resolved within 48 hours',
    'Rule changes MUST be documented and versioned'
  ],
  
  enforcement: {
    preCommitHooks: 'Check rule compliance before commits',
    ciCdIntegration: 'Validate rules in CI/CD pipeline',
    codeReview: 'Rule compliance review in PRs',
    monitoring: 'Real-time rule violation monitoring'
  },
  
  penalties: {
    ruleViolation: 'Block deployment until resolved',
    missingRules: 'Prevent section creation',
    inconsistency: 'Alert maintainers immediately',
    nonCompliance: 'Escalate to project lead'
  }
}
```

#### **🔧 Kural Sistemi Araçları**
```bash
# Kural yönetimi komutları
npm run rules:scan           # Yeni bölümleri tara ve kural dosyası oluştur
npm run rules:validate       # Tüm kuralları doğrula
npm run rules:check          # Tutarlılık kontrolü
npm run rules:report         # Kural uyumluluk raporu
npm run rules:update         # Kuralları güncelle
npm run rules:fix           # Otomatik düzeltmeler
```

#### **📚 Kural Sistemi Dokümantasyonu**
- **`docs/rules/README.md`** - Ana kural sistemi rehberi
- **`docs/rules/templates/`** - Kural dosyası şablonları
- **`docs/rules/compliance/`** - Uyumluluk raporları
- **`docs/rules/violations/`** - İhlal kayıtları
- **`docs/rules/changelog/`** - Kural değişiklik geçmişi

#### **🎯 Bölüm Kural Sistemi Faydaları**
- **Tutarlılık:** Tüm bölümlerde aynı standartlar
- **Kalite:** Otomatik kural kontrolü ile yüksek kalite
- **Takım Koordinasyonu:** Herkesin aynı kuralları takip etmesi
- **Hata Önleme:** Kurallar sayesinde hataların önlenmesi
- **Dokümantasyon:** Otomatik kural dokümantasyonu
- **Ölçeklenebilirlik:** Yeni bölümler için otomatik kural oluşturma

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