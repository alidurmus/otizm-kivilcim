# Test Kuralları - Kıvılcım Platform

## 📋 Test Sistemi Ana Kuralları

### 🎯 Test Mimarisi
- **İki Katmanlı Sistem:** Development (hızlı) + Full Coverage (kapsamlı)
- **Development Tests:** Single browser (Chromium) - günlük kullanım
- **Full Coverage Tests:** 7 tarayıcı - CI/CD ve release
- **Zorunlu Coverage:** %95+ test coverage korunacak

### 🚀 Development Test Kuralları

#### **Hızlı Feedback Loop**
```bash
# ZORUNLU: Her geliştirme öncesi çalıştır
npm run test:dev:core           # Auth, Firebase, ElevenLabs (~30s)
npm run test:dev:exercises      # 10 eğitim modülü (~45s)
npm run test:dev:admin          # Admin panel + API tests (~40s)
```

#### **Test Seçim Kuralları**
- **Daily coding:** Development tests kullan
- **Pre-commit:** `npm run test:quick` (Core + Exercises)
- **Feature complete:** `npm run test:critical` (Core + Admin + User Journey)
- **Release prep:** Full coverage tests çalıştır

### 🔄 Full Coverage Test Kuralları

#### **Cross-Browser Requirements**
- **Supported Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Edge, iPad
- **Performance Target:** <15 dakika total execution time
- **Quality Gate:** %98+ cross-browser compatibility

#### **CI/CD Integration**
```bash
# Production deployment öncesi ZORUNLU
npm run test:full:ci           # CI/CD production mode
npm run test:full:admin        # Admin panel 180 tests
npm run test:full:exercises    # All modules cross-browser
```

### 🧪 Test Türü Kuralları

#### **E2E Test Standartları**
- **Playwright Framework:** Zorunlu kullanım
- **Test Structure:** Arrange → Act → Assert pattern
- **Wait Strategy:** `waitFor()` explicit waits, no `timeout()`
- **Selector Strategy:** `data-testid` preferred, CSS fallback allowed

#### **Module Test Requirements**
```typescript
// Her modül için zorunlu test pattern
describe('Module Tests', () => {
  test('should load successfully', async () => {
    await page.goto('/exercise/module-name');
    await expect(page.locator('[data-testid="module-container"]')).toBeVisible();
  });

  test('should play audio', async () => {
    await page.click('[data-testid="audio-button"]');
    // Audio system verification
  });

  test('should track progress', async () => {
    // Progress tracking verification
  });
});
```

#### **Audio System Test Kuralları**
- **Voice Testing:** Gender-balanced Turkish voices test edilecek
- **Fallback Chain:** Static files → ElevenLabs → Web Speech API
- **Error Handling:** 404 audio errors test edilecek
- **Performance:** <300ms response time target

### 📊 Test Coverage Kuralları

#### **Coverage Requirements**
- **Minimum Coverage:** %95+ overall
- **E2E Coverage:** Critical user journeys %100
- **Unit Coverage:** Components %80+
- **Integration Coverage:** API endpoints %70+

#### **Quality Gates**
```typescript
// Jest coverage thresholds
{
  branches: 95,
  functions: 95,
  lines: 95,
  statements: 95
}
```

### 🐛 Test Debugging Kuralları

#### **Debug Commands**
```bash
# Visual debugging ZORUNLU failing tests için
npm run test:dev:debug         # Step-by-step debugging
npm run test:dev:headed        # Tarayıcı ile görsel test
npm run test:dev:ui            # Playwright UI test runner
```

#### **Error Resolution Protocol**
1. **İlk Adım:** Test isolation (tek test çalıştır)
2. **İkinci Adım:** Browser devtools kullan
3. **Üçüncü Adım:** Screenshot/video capture
4. **Dördüncü Adım:** Selector stability check
5. **Son Adım:** Timeout/wait strategy review

### 🔧 Test Environment Kuralları

#### **Setup Requirements**
- **Node.js:** 18+ version required
- **Browsers:** Playwright auto-install active
- **Environment:** `.env.local` with API keys required
- **Dependencies:** All test dependencies locked versions

#### **Configuration Standards**
```typescript
// playwright.config.ts requirements
{
  testTimeout: 30000,        // 30s max per test
  expect: { timeout: 5000 }, // 5s max per assertion
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined
}
```

### 📈 Performance Test Kuralları

#### **Execution Time Limits**
- **Single Test:** <30 saniye maximum
- **Test Suite:** <3 dakika development, <15 dakika full
- **Parallel Execution:** Development tests parallel, CI serial

#### **Resource Usage**
- **Memory:** <2GB peak usage per worker
- **CPU:** <80% sustained usage
- **Network:** Mock external dependencies

### 🚨 Test Failure Kuralları

#### **Failure Classification**
- **Flaky Test:** %90< success rate → immediate fix required
- **Breaking Change:** New failures → block deployment
- **Environment Issue:** Infrastructure failures → retry allowed

#### **Resolution Timeline**
- **Critical Failures:** <1 hour resolution
- **Feature Failures:** <4 hours resolution
- **Integration Failures:** <8 hours resolution

### 📝 Test Documentation Kuralları

#### **Test Case Documentation**
```typescript
// ZORUNLU test documentation pattern
test('descriptive test name explaining what and why', async () => {
  // Given: Setup conditions
  // When: Action performed
  // Then: Expected outcome
});
```

#### **Test Report Requirements**
- **Daily Reports:** Development test results
- **Weekly Reports:** Full coverage cross-browser results
- **Release Reports:** Complete test execution summary

### 🔄 Test Maintenance Kuralları

#### **Regular Maintenance**
- **Weekly:** Test selector stability review
- **Monthly:** Performance optimization review
- **Release:** Complete test suite audit

#### **Test Updates**
- **Feature Changes:** Update related tests immediately
- **API Changes:** Update integration tests
- **UI Changes:** Update selector strategy

### 🎯 Module-Specific Test Rules

#### **Audio Module Tests**
- **Voice Assignment:** Gender-balanced testing required
- **Turkish Characters:** Full 29-letter alphabet coverage
- **Fallback Testing:** All fallback mechanisms tested

#### **Admin Panel Tests**
- **ElevenLabs Integration:** API status, voice filtering
- **Performance Metrics:** Response time monitoring
- **Error Handling:** Graceful degradation testing

#### **Exercise Module Tests**
- **Progress Tracking:** Learning outcome verification
- **Accessibility:** WCAG compliance testing
- **Responsive Design:** Mobile/tablet/desktop testing

---

## 🔗 İlgili Kural Dosyaları

- **Audio System:** `docs/rules/audio-system-rules.md`
- **Dashboard Rules:** `docs/rules/dashboard-rules.md`
- **Component Rules:** `docs/rules/component-rules.md`
- **API Rules:** `docs/rules/api-rules.md`

---

> **Kural Önceliği:** Test kuralları ASLA ihlal edilemez. %95+ coverage ve cross-browser compatibility platform kalitesi için kritiktir.

**Son Güncelleme:** 2025-01-07  
**Durum:** Aktif ve zorunlu  
**Owner:** Platform Quality Team 