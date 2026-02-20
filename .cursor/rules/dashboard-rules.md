# Dashboard Kuralları - Kıvılcım Platform

## 📊 Dashboard Ana Kuralları

### 🏠 Admin Panel Kuralları

#### **Erişim Kontrolü**
- **Authentication:** Firebase Authentication required
- **Role-Based Access:** Admin/Teacher/Parent role hierarchy
- **Session Management:** Secure session handling
- **Audit Logging:** All admin actions logged

#### **Admin Panel Structure**
```typescript
// ZORUNLU admin panel yapısı
/admin/
├── page.tsx              # Dashboard overview
├── audio-management/     # NEW: Ses dosyaları yönetimi
├── elevenlabs-test/      # Enhanced ElevenLabs test
├── users/               # Kullanıcı yönetimi
├── content/             # İçerik yönetimi
└── analytics/           # Analitik dashboard
```

### 🎵 Ses Dosyaları Yönetim Sistemi

#### **CRUD Operasyonları**
- **Create:** Yeni ses dosyası ekleme (user approval required)
- **Read:** Ses dosyalarını listeleme, filtreleme, dinleme
- **Update:** Ses dosyası metadata güncelleme
- **Delete:** Güvenli silme (confirmation required)

#### **Audio Management Features**
```typescript
// ZORUNLU ses yönetimi özellikleri
interface AudioFile {
  id: string;
  title: string;
  filename: string;
  filePath: string;
  category: 'letter' | 'word' | 'sentence' | 'celebration' | 'custom';
  module: string;
  language: 'tr' | 'en';
  voiceId?: string;
  voiceName?: string;
  duration?: number;
  fileSize?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### **Filtering & Search**
- **Category Filters:** Harf, kelime, cümle, kutlama, özel
- **Module Filters:** 10 aktif modül desteği
- **Search:** Real-time title ve filename search
- **Statistics:** Toplam dosya, boyut, kategori dağılımı

### 🧪 ElevenLabs Test Dashboard

#### **Enhanced Test Interface**
- **Gender Filtering:** Male/Female/All voice filtering
- **Voice Statistics:** Real-time erkek/kadın ses sayısı
- **Turkish Character Testing:** 29 harflik alfabe desteği
- **Quick Test Suggestions:** Content-type specific examples

#### **API Status Monitoring**
```typescript
// ZORUNLU ElevenLabs monitoring
interface ElevenLabsStatus {
  apiConnected: boolean;
  voiceCount: number;
  genderBalance: {
    male: number;
    female: number;
  };
  responseTime: number;
  errorRate: number;
  dailyUsage: number;
}
```

### 📈 Teacher Dashboard Kuralları

#### **10 Modül Tracking**
- **Module Overview:** Tüm modüllerin durumu ve istatistikleri
- **Student Progress:** Bireysel öğrenci gelişim takibi
- **Performance Metrics:** Başarı oranları ve öğrenme hızı
- **Intervention Alerts:** Müdahale gerektiren durumlar

#### **Dashboard Component Structure**
```typescript
// ZORUNLU teacher dashboard yapısı
const TeacherDashboard = {
  overview: 'Genel bakış ve hızlı metrikler',
  modules: '10 aktif modül detaylı analizi',
  students: 'Öğrenci progress tracking',
  reports: 'Detaylı raporlama sistemi',
  settings: 'Sınıf ve grup ayarları'
};
```

### 👨‍👩‍👧‍👦 Ebeveyn Paneli Kuralları

#### **Gelişim Takibi**
- **Progress Overview:** Çocuğun genel gelişim durumu
- **Module Analysis:** Modül bazlı detaylı performans
- **Strength Areas:** Güçlü olduğu konular
- **Improvement Areas:** Geliştirilmesi gereken alanlar
- **Activity Reports:** Günlük/haftalık aktivite özetleri

#### **Duyusal Kontrol Dashboard**
```typescript
// ZORUNLU duyusal ayarlar
interface SensorySettings {
  theme: 'light' | 'dark' | 'autism-friendly';
  voicePreference: 'male' | 'female' | 'balanced';
  animationLevel: 'none' | 'reduced' | 'normal';
  soundLevel: number; // 0-100
  contrast: 'normal' | 'high' | 'max';
  fontSize: 'small' | 'medium' | 'large' | 'xl';
}
```

### 📊 Analytics Dashboard Kuralları

#### **Key Performance Indicators (KPIs)**
- **User Engagement:** Daily/weekly/monthly active users
- **Learning Outcomes:** Module completion rates
- **System Performance:** Response times, error rates
- **Voice System Usage:** Static vs dynamic audio usage
- **Platform Health:** Overall system stability

#### **Real-time Monitoring**
```typescript
// ZORUNLU analytics metrics
interface PlatformMetrics {
  activeUsers: number;
  moduleUsage: Record<string, number>;
  voiceSystemHealth: number;
  errorRate: number;
  performanceScore: number;
  testCoverage: number;
}
```

### 🔧 Sistem Yönetimi Kuralları

#### **System Health Dashboard**
- **Server Status:** Port availability, response times
- **Database Health:** Connection status, query performance
- **API Status:** ElevenLabs, Firebase, external services
- **Test Coverage:** Current test success rates
- **Error Monitoring:** Real-time error tracking

#### **Maintenance Controls**
```bash
# ZORUNLU sistem yönetimi komutları
npm run admin:health-check      # Sistem sağlık kontrolü
npm run admin:clear-cache       # Cache temizleme
npm run admin:backup-data       # Veri yedekleme
npm run admin:system-audit      # Güvenlik denetimi
```

### 🎯 Dashboard Performance Kuralları

#### **Loading Performance**
- **Dashboard Load Time:** <2 saniye
- **Chart Rendering:** <500ms
- **Data Refresh:** Real-time updates without full reload
- **Responsive Design:** Mobile, tablet, desktop optimized

#### **Data Optimization**
- **Lazy Loading:** Below-fold content lazy loaded
- **Pagination:** Large data sets paginated
- **Caching:** Dashboard data cached appropriately
- **Progressive Enhancement:** Core functionality first

### 🔐 Dashboard Security Kuralları

#### **Access Control**
- **Role-Based Views:** Content based on user role
- **Data Isolation:** Users only see their data
- **Audit Trail:** All actions logged and trackable
- **Session Security:** Timeout and secure tokens

#### **Data Protection**
```typescript
// ZORUNLU güvenlik pattern
const SecureDashboard = {
  authentication: 'Firebase Authentication required',
  authorization: 'Role-based access control',
  dataValidation: 'All inputs validated with Zod',
  audit: 'All actions logged with timestamps'
};
```

### 📱 Mobile Dashboard Kuralları

#### **Mobile-First Design**
- **Touch-Friendly:** Minimum 44px touch targets
- **Swipe Gestures:** Natural mobile navigation
- **Offline Capability:** Essential data cached for offline
- **Progressive Web App:** PWA features enabled

#### **Responsive Components**
```typescript
// ZORUNLU mobile optimization
const MobileDashboard = {
  navigation: 'Bottom tab navigation on mobile',
  charts: 'Touch-optimized chart interactions',
  tables: 'Horizontal scroll for large tables',
  forms: 'Mobile-optimized form inputs'
};
```

### 🧪 Dashboard Testing Kuralları

#### **UI Testing Requirements**
- **Cross-Browser:** Chrome, Firefox, Safari, Edge
- **Device Testing:** Mobile, tablet, desktop
- **Accessibility:** Screen reader compatibility
- **Performance:** Core Web Vitals compliance

#### **Dashboard Test Patterns**
```typescript
// ZORUNLU dashboard test pattern
test('admin dashboard should load with all widgets', async () => {
  await page.goto('/admin');
  
  // Check main dashboard widgets
  await expect(page.locator('[data-testid="stats-overview"]')).toBeVisible();
  await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
  await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible();
  
  // Check navigation
  await expect(page.locator('[data-testid="admin-nav"]')).toBeVisible();
});
```

### 📈 Dashboard Analytics

#### **Usage Tracking**
- **Widget Interactions:** Which dashboard widgets used most
- **Navigation Patterns:** How users navigate the dashboard
- **Time Spent:** Average time in different dashboard sections
- **Error Tracking:** Dashboard-specific errors and issues

#### **Performance Monitoring**
- **Load Times:** Dashboard component loading performance
- **User Experience:** Dashboard usability metrics
- **System Impact:** Dashboard resource usage
- **Optimization Opportunities:** Performance improvement areas

---

## 🔗 İlgili Kural Dosyaları

- **Component Rules:** `docs/rules/component-rules.md`
- **Testing Rules:** `docs/rules/testing-rules.md`
- **Audio System Rules:** `docs/rules/audio-system-rules.md`
- **API Rules:** `docs/rules/api-rules.md`

---

> **Kritik Kural:** Dashboard'lar kullanıcı rolüne göre güvenli ve performanslı olmalıdır. Autism-friendly design principles tüm dashboard'larda uygulanmalıdır.

**Son Güncelleme:** 2025-01-07  
**Durum:** Aktif ve zorunlu  
**Owner:** Dashboard Team 