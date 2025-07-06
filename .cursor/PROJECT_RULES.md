# 🤖 AI Coder İşbirliği ve Görev Yönetim Protokolü

**Kıvılcım Otizm Eğitim Platformu**  
**Versiyon:** 1.2  
**Son Güncelleme:** 2025-01-06

Bu protokol, "Kıvılcım" projesinde görevlerin birden çok AI Coder arasında verimli, hatasız ve senkronize bir şekilde yönetilmesi için oluşturulmuştur. **Tüm AI Coder'lar aşağıdaki kurallara uymakla yükümlüdür.**

---

## 🏛️ 0. Genel Kurallar ve Prensipler

### **Platform Kimliği**
- **Kıvılcım:** Turkey's most advanced autism education platform
- **Misyon:** Otizmli çocukların bireysel gelişim yolculuklarında onlara ve ailelerine eşlik eden, kanıta dayalı, kişiselleştirilebilir ve en etkili dijital yoldaş
- **Hedef Kitle:** 3-12 yaş otizm spektrum bozukluğu olan çocuklar ve aileleri
- **Tasarım Felsefesi:** Autism-friendly, accessible, calm, consistent

### **Temel Geliştirme Prensipleri**
1. **🎯 Accessibility First:** WCAG 2.1 AA compliance zorunlu
2. **🧠 Autism-Friendly Design:** Sakin renkler, öngörülebilir etkileşimler, minimal animasyonlar
3. **🇹🇷 Turkish Language Priority:** Türkçe öncelik, 29 harflik alfabe desteği
4. **🔊 Voice System Excellence:** Gender-balanced Turkish voices (3 male + 2 female)
5. **🎮 Educational Psychology:** ABA principles, positive reinforcement, gradual learning
6. **📱 Mobile-First:** Touch-friendly, responsive, cross-platform
7. **🧪 Quality Assurance:** %95+ test coverage, zero console errors
8. **⚡ Performance:** Core Web Vitals compliance, fast loading times

### **Teknoloji Standardı**
- **Framework:** Next.js 15 (App Router only)
- **Language:** TypeScript 5 (strict mode, NO `any` types)
- **Styling:** Tailwind CSS 4
- **Voice:** ElevenLabs Official SDK (@elevenlabs/elevenlabs-js)
- **Testing:** Playwright (E2E) + Jest (Unit) + React Testing Library
- **Database:** Firebase Firestore with security rules
- **Audio:** Static files → ElevenLabs SDK → Web Speech API fallback

---

## 📋 1. Görev Durum Tanımları

Her görevin başında, o görevin mevcut durumunu belirten bir ikon bulunur:

### `⏳ BEKLEMEDE (Backlog)`
- Görev, üzerinde çalışılmaya hazır ve bir AI Coder tarafından alınmayı bekliyor
- **Bir AI Coder, yalnızca bu durumdaki görevleri seçip çalışmaya başlayabilir**
- **Öncelik:** Yukarıdan aşağıya doğru sıralı alınmalıdır

### `🔄 ÜZERİNDE ÇALIŞILIYOR (In Progress)`
- Bir AI Coder, bu görevi aktif olarak işliyor
- Bu durum, görevin "kilitli" olduğu anlamına gelir
- **KRITIK KURAL:** Diğer AI Coder'lar bu durumdaki bir görevi KESİNLİKLE almamalıdır
- Aynı işin tekrar yapılmasını önlemek için mutlak gereklidir

### `✅ TAMAMLANDI (Done)`
- Görev başarıyla tamamlandı, test edildi ve herhangi bir hata içermiyor
- Bu görevle ilgili başka bir işlem yapılmasına gerek yoktur
- Achievement olarak projeye değer katmıştır

### `⚠️ HATA / GÖZDEN GEÇİR (Error / Review)`
- Üzerinde çalışılan bir görevde beklenmedik bir hata oluştu
- Görevin tamamlanması için ek bilgiye/düzeltmeye ihtiyaç var
- Daha önce tamamlanmış (`✅`) bir görevde sonradan bir hata tespit edildi
- Bu durumdaki görevler, sorunun tanımıyla birlikte tekrar `⏳ BEKLEMEDE` durumuna alınır

### `🔥 URGENT (Acil)`
- Critical bug'lar, production issues, security vulnerabilities
- **Öncelik:** Bu görevler listede nerede olursa olsun ÖNCE alınmalıdır
- Platform stability'si için kritik

### `🧪 TEST REQUIRED (Test Gerekli)`
- Görev kod olarak tamamlandı ancak test coverage eksik
- E2E testleri, unit testleri veya manual testing gerekiyor
- Test tamamlandıktan sonra `✅ TAMAMLANDI` olur

---

## 🔄 2. AI Coder Temel İş Akışı

Her AI Coder, aşağıdaki adımları **sırasıyla** takip etmelidir:

### **ADIM 1: Görev Seçimi**
```
1. Önce 🔥 URGENT görevleri kontrol et
2. Urgent yoksa, ⏳ BEKLEMEDE durumundaki ilk görevi bul
3. Görevı yukarıdan aşağıya doğru sırasıyla al
```

### **ADIM 2: Görevi Sahiplenme**
```markdown
# ÖNCE:
- ⏳ Example task description

# SONRA (ANINDA):
- 🔄 Example task description
```

### **ADIM 3: Görevi İşleme**
- Görevin gerektirdiği tüm kodlama, düzenleme veya analiz işlemlerini gerçekleştir
- Code quality standards'lara uy (TypeScript strict, test coverage, documentation)
- Git commit'leri anlamlı mesajlarla yap

### **ADIM 4: Görevi Tamamlama**
```markdown
# İŞLEM TAMAMLANDIKTAN SONRA:
- ✅ Example task description - Completed with solution details
```

### **ADIM 5: Yeni Göreve Geçme**
- ADIM 1'e geri dönerek yeni bir görev ara
- Continuous workflow maintein et

---

## ⚠️ 3. Özel Durumlar ve Kurallar

### **Yeni Görev Ekleme**
```markdown
# Yeni görev format:
- ⏳ **[CATEGORY]** Görev açıklaması - Detaylı requirements ve acceptance criteria
```

### **Hata Yönetimi**
**Scenario 1: İş sırasında hata**
```markdown
# ÖNCE:
- 🔄 Example task

# SONRA:
- ⚠️ Example task - ERROR: Hata açıklaması, neyin yanlış gittiği
- ⏳ Example task - Updated requirements based on error analysis
```

**Scenario 2: Tamamlanmış görevde hata bulunması**
```markdown
# ÖNCE:
- ✅ Example completed task

# SONRA:
- ⚠️ Example task - BUG REPORT: Tespit edilen hata, impact analizi
- ⏳ Example task - Fix requirements ve regression testing needs
```

### **Test Coverage Requirement**
```markdown
# Test gereken durum:
- 🧪 Example task - Needs E2E tests for literacy module
- 🧪 Example task - Unit tests missing for new components
```

---

## 📝 4. Kıvılcım Projesi Özel Kuralları

### **Platform Context**
- **10 Active Modules:** Alfabe okuma, okuryazarlık, kelime dağarcığı, sosyal iletişim, yazma-ifade, temel kavramlar, matematik dünyası, müzik odası, video odası, puzzle
- **Voice System:** Gender-balanced Turkish voices (5 total: Adam, Antoni, Josh, Bella, Rachel)
- **Test Coverage:** %95+ maintained
- **Tech Stack:** Next.js 15, React 19, TypeScript, ElevenLabs SDK
- **Audio Coverage:** 100% (Zero console 404 errors)

### **Quality Gates**
Her görev completion öncesi kontrol edilmeli:
- [ ] TypeScript strict mode compliance (NO `any` types)
- [ ] Test coverage maintained/improved (%95+)
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Turkish language support working (29 letters)
- [ ] Voice system integration tested (gender-balanced)
- [ ] No console errors introduced (zero 404s)
- [ ] Mobile responsive design verified
- [ ] Autism-friendly design principles followed

### **Priority Categories**
1. **🔥 URGENT:** Production bugs, security issues, platform down
2. **📚 MODULE COMPLETION:** 10 active modules functionality
3. **🎯 USER EXPERIENCE:** Accessibility, performance, autism-friendly design
4. **🧪 TESTING:** Test coverage improvements
5. **🔧 TECHNICAL DEBT:** Code quality, refactoring
6. **✨ NEW FEATURES:** Additional modules, advanced features

### **Kıvılcım Specific Rules**
- **Gülsu Default Voice:** Use Gülsu (9BWtsMINqrJLrRacOk9x) as default character
- **Turkish Character Support:** Full support for ç, ğ, ı, ö, ş, ü characters
- **Static Audio Priority:** Use static files first, then ElevenLabs SDK
- **Autism-Friendly Colors:** Calm palette, high contrast options
- **Touch Target Size:** Minimum 44px for all interactive elements
- **Loading States:** Always provide visual feedback for voice loading
- **Error Recovery:** Graceful degradation for voice system failures

---

## 📊 5. Örnek Uygulama (`docs/todo.md`)

### **Başlangıç Durumu:**
```markdown
# 🎯 Kıvılcım Platform - AI Coder Görev Listesi

## 🔥 URGENT TASKS
- ⏳ **CRITICAL** Mathematics module audio 404 errors fix (sayi-tanima-hosgeldin.mp3, bes.mp3)
- ⏳ **CRITICAL** Physics module JSON parse error resolution

## 🧪 TEST COVERAGE
- ⏳ **TESTING** Literacy click-to-place final 2 failing tests fix
- ⏳ **TESTING** Voice input button cross-browser compatibility

## 📚 MODULE ENHANCEMENT  
- ⏳ **FEATURE** 11th Module development (Science/Fen Bilimleri)
- ⏳ **FEATURE** Advanced voice features implementation
```

### **Coder-A aktif çalışırken:**
```markdown
## 🔥 URGENT TASKS
- 🔄 **CRITICAL** Mathematics module audio 404 errors fix (sayi-tanima-hosgeldin.mp3, bes.mp3)
- ⏳ **CRITICAL** Physics module JSON parse error resolution

## 🧪 TEST COVERAGE
- ⏳ **TESTING** Literacy click-to-place final 2 failing tests fix
- ⏳ **TESTING** Voice input button cross-browser compatibility
```

### **Görev tamamlandıktan sonra:**
```markdown
## 🔥 URGENT TASKS
- ✅ **CRITICAL** Mathematics module audio 404 errors fix - Generated missing audio files successfully
- 🔄 **CRITICAL** Physics module JSON parse error resolution

## 🧪 TEST COVERAGE
- ⏳ **TESTING** Literacy click-to-place final 2 failing tests fix
- ⏳ **TESTING** Voice input button cross-browser compatibility
```

---

## 🧪 10. Test ve Raporlama Protokolü

**Doküman Amacı:** Bu protokol, Kıvılcım platformunun kalitesini, güvenilirliğini ve performansını en üst düzeyde tutmak için uygulanacak olan test hiyerarşisini, yürütme kurallarını ve otomatik raporlama standartlarını tanımlar.

### **10.1. Test Hiyerarşisi ve Bölümleri**

Platformdaki testler, hız ve kapsam dengesini sağlamak amacıyla **İki Katmanlı (Two-Tier)** ve **Altı Bölümlü** bir mimari üzerine kurulmuştur.

#### **İki Katmanlı Mimari**

**🚀 Tier 1: Development Testleri (dev)**
- **Amaç:** Geliştirme sırasında hızlı geri bildirim almak
- **Tarayıcı:** Sadece Chromium üzerinde çalışır
- **Kullanım:** Her geliştiricinin kod göndermeden önce kendi lokalinde çalıştırması gereken testler
- **Süre:** ~3-5 dakika
- **Komut:** `npm run test:dev`

**🔄 Tier 2: Full Coverage Testleri (full)**
- **Amaç:** Ürünün canlı ortama çıkmadan önce tüm platformlarda kapsamlı bir şekilde doğrulanması
- **Tarayıcılar:** 7 platform (Chrome, Firefox, Safari, Edge, Mobile Chrome, Mobile Safari, iPad)
- **Kullanım:** CI/CD pipeline'ı tarafından otomatik olarak çalıştırılır
- **Kalite Kapısı:** Canlı ortama dağıtım için %100 başarı oranı gerekli
- **Komut:** `npm run test:full`

#### **Altı Ana Test Bölümü**

| Bölüm | Açıklama | Development Komutu | Full Coverage Komutu |
|-------|----------|-------------------|---------------------|
| **1. Core System** | Çekirdek altyapı, API entegrasyonları (ElevenLabs, Firebase) ve servisler | `npm run test:dev:core` | `npm run test:full:core` |
| **2. Exercise Modules** | 10 adet aktif öğrenme modülünün fonksiyonelliği ve etkileşimleri | `npm run test:dev:exercises` | `npm run test:full:exercises` |
| **3. Admin Panel** | Yönetim paneli arayüzleri, ses kontrol sistemi ve API endpoint'leri | `npm run test:dev:admin` | `npm run test:full:admin` |
| **4. User Interfaces** | Ana sayfa, modül seçimi, ebeveyn paneli gibi genel kullanıcı arayüzleri | `npm run test:dev:pages` | `npm run test:full:pages` |
| **5. Components** | Tekrar kullanılabilir buton, kart, modal gibi UI bileşenleri | `npm run test:dev:components` | `npm run test:full:components` |
| **6. User Journey** | Uçtan uca kullanıcı akışları ve senaryoları | `npm run test:dev:user-journey` | `npm run test:full:user-journey` |

### **10.2. Raporlama Kuralları ve Standartları**

Her test çalışmasının ardından, sonuçların belgelenmesi ve takip edilmesi için otomatik olarak bir rapor oluşturulur.

#### **Rapor Konumu**
Tüm test raporları projenin `docs/reports/` klasörü altına kaydedilir.

#### **Rapor Dosyası İsimlendirme**
```
✅ Başarılı Rapor: SUCCESS-report-YYYYMMDD-HHMMSS.md
   Örnek: SUCCESS-report-20250706-213000.md

❌ Başarısız Rapor: FAIL-report-YYYYMMDD-HHMMSS.md
   Örnek: FAIL-report-20250706-213510.md
```

#### **Rapor İçeriği**
Oluşturulan her Markdown (.md) raporu aşağıdaki bilgileri içermelidir:

**Genel Özet:**
- **Rapor Durumu:** ✅ BAŞARILI veya ❌ BAŞARISIZ
- **Test Tarihi:** Raporun oluşturulduğu tam tarih ve saat
- **Test Süresi:** Tüm testlerin tamamlanma süresi (örn: 14 dakika 35 saniye)
- **Test Ortamı:** Development veya Full Coverage

**İstatistikler:**
- ✅ **Başarılı:** Test sayısı
- ❌ **Başarısız:** Test sayısı  
- ⏭️ **Atlanan:** Test sayısı
- 📊 **Toplam:** Toplam test sayısı
- 📈 **Başarı Oranı:** % olarak başarı oranı

**Başarısız Testlerin Detayları (Sadece FAIL raporlarında):**
- **Test Dosyası:** `tests/e2e/admin-elevenlabs.spec.ts`
- **Test Başlığı:** Admin ElevenLabs Test Sayfası > API durumu doğru bilgileri göstermeli
- **Hata Mesajı:** Playwright tarafından üretilen hata çıktısı ve ekran görüntüsü yolu

```typescript
Error: expect(received).toBeVisible()
Element is not visible
...
<Call log>
```

**Çalıştırılan Testlerin Özeti:**
Hangi test bölümlerinin (core, admin, exercises vb.) çalıştırıldığını listeleyen bölüm.

### **10.3. Test Süreçleri ve Sorumlulukları**

#### **CI/CD Pipeline:**
- `main` veya `develop` gibi ana dallara yapılan her kod gönderiminde (push) `npm run test:full` komutunu otomatik olarak çalıştırır
- Testler bittikten sonra, sonuçlara göre yukarıdaki kurallara uygun raporu oluşturur ve `docs/reports/` altına kaydeder
- Eğer Full Coverage testlerinde herhangi bir hata olursa, dağıtımı durdurur ve ilgili ekibe bildirim gönderir

#### **Geliştiriciler / AI Coder'lar:**
- Kod yazarken veya düzenlerken, ilgili oldukları bölümün dev testlerini (`npm run test:dev:admin` gibi) lokalde çalıştırmakla yükümlüdür
- Kodlarını ana dallara göndermeden önce, en azından `npm run test:dev` komutunu çalıştırarak tüm geliştirme testlerinin başarılı olduğundan emin olmalıdır
- CI/CD pipeline'ında bir hataya neden olurlarsa, bu hatayı düzeltmek öncelikli görevleridir

#### **Test Execution Checklist**
```markdown
**Pre-commit Checklist:**
- [ ] `npm run test:dev` başarılı
- [ ] TypeScript compilation errors yok
- [ ] ESLint warnings/errors temizlendi
- [ ] Console errors kontrol edildi
- [ ] Mobile responsive test yapıldı

**Pre-deployment Checklist:**
- [ ] `npm run test:full` %100 başarılı
- [ ] Cross-browser compatibility doğrulandı
- [ ] Performance metrics hedefler içinde
- [ ] Voice system tüm platformlarda çalışıyor
- [ ] Accessibility compliance WCAG 2.1 AA
```

#### **Rapor Takip ve Analiz**
```bash
# En son test raporunu görüntüle
ls -la docs/reports/ | tail -1

# Başarısız testleri analiz et
grep -r "❌ BAŞARISIZ" docs/reports/

# Test trend analizi (son 7 rapor)
find docs/reports/ -name "*.md" -mtime -7 | xargs grep "📈 Başarı Oranı"

# Critical test failures
grep -r "🔥 URGENT" docs/reports/
```

---

## 🚀 11. Platform Health Monitoring

### **Key Health Indicators**
- **Server Status:** 🟢 Stable (multiple port support)
- **Module Coverage:** 🟢 10/10 Active modules
- **Audio System:** 🟢 Zero 404 errors
- **Voice System:** 🟢 Gender-balanced, 5 Turkish voices
- **Test Coverage:** 🟢 95%+ maintained
- **Dependencies:** 🟢 Complete, 0 vulnerabilities
- **Error Rate:** 🟢 Near-zero production errors

### **Performance Targets**
- **LCP:** < 2.5s (Largest Contentful Paint)
- **FID:** < 100ms (First Input Delay)
- **CLS:** < 0.1 (Cumulative Layout Shift)
- **Voice Response:** < 300ms (ElevenLabs SDK)
- **Static Audio Load:** < 100ms
- **Mobile Performance:** 90+ (Lighthouse score)

---

**🎊 MISSION:** Maintain Kıvılcım as Turkey's most advanced autism education platform through systematic, collaborative development that prioritizes quality, accessibility, and positive impact for children with autism spectrum disorders.

**Platform Status:** 🟢 **PRODUCTION READY** - All critical systems operational

**📞 Questions?** Update this protocol based on real-world usage and team feedback.

---

> **Versiyon History:**  
> v1.0 (2025-01-06): Initial protocol based on proven multi-AI collaboration patterns  
> v1.1 (2025-01-06): Added general rules, platform identity, technical standards, and health monitoring  
> v1.2 (2025-01-06): Added comprehensive testing and reporting protocol (Two-Tier architecture, 6 test sections, automated reporting)  
> **Implementation Status:** Active use across all Kıvılcım development workflows 