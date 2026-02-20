# 🔒 Güvenlik Kuralları - Kıvılcım Platform

**Amaç:** Çocuk verilerinin korunması, güvenli API usage, KVKK compliance  
**Hedef:** %100 güvenli veri işleme, zero critical vulnerabilities  
**Güncelleme:** Weekly (kritik güvenlik güncellemeleri)

---

## 🛡️ Ana Güvenlik Prensipleri

### **1. Çocuk Veri Koruması (KVKK)**
```typescript
// ZORUNLU: Çocuk verisi için ebeveyn onayı
const CHILD_DATA_PROTECTION = {
  parentalConsent: 'REQUIRED', // Zorunlu ebeveyn onayı
  dataMinimization: 'STRICT',  // Minimum veri toplama
  rightToDelete: 'IMMEDIATE',  // Silme hakkı
  dataPortability: 'FULL'      // Veri taşınabilirliği
};
```

### **2. API Key Güvenliği**
- **Server-Side Only:** API keys asla client-side'da bulunmaz
- **Environment Variables:** `.env.local` içinde güvenli saklanır
- **Rate Limiting:** IP başına dakikada 60 istek sınırı
- **Proxy Pattern:** `/api/speech` endpoint üzerinden güvenli erişim

### **3. Firebase Güvenlik**
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kullanıcı sadece kendi verilerine erişebilir
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Çocuk verileri için ebeveyn izni
    match /children/{childId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.parentalConsent == true;
    }
  }
}
```

---

## 🔐 Authentication Kuralları

### **Firebase Authentication**
```typescript
// User authentication patterns
const AUTH_PATTERNS = {
  // Zorunlu authentication
  requireAuth: (component) => {
    if (!user) return <LoginScreen />;
    return component;
  },
  
  // Role-based access
  requireRole: (allowedRoles: string[]) => {
    if (!user?.roles?.some(role => allowedRoles.includes(role))) {
      return <UnauthorizedScreen />;
    }
  }
};
```

### **Session Management**
- **Token Expiry:** 1 saat idle sonrası otomatik logout
- **Refresh Pattern:** Background'da token yenileme
- **Multi-device:** Aynı hesap birden fazla cihazda kullanılabilir
- **Device Tracking:** Güvenlik için device fingerprinting

---

## 🔒 API Güvenlik Kuralları

### **Server-Side API Protection**
```typescript
// API Route Security Pattern
export async function POST(request: Request) {
  // 1. Rate limiting kontrolü
  const rateLimitCheck = await checkRateLimit(request);
  if (!rateLimitCheck.success) {
    return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  
  // 2. Authentication kontrolü
  const authCheck = await verifyAuth(request);
  if (!authCheck.success) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 3. Input validation
  const validationResult = apiSchema.safeParse(await request.json());
  if (!validationResult.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }
  
  // 4. Secure API call
  const result = await secureApiCall(validationResult.data);
  return Response.json(result);
}
```

### **Input Validation (Zod)**
```typescript
// Türkçe karakter desteği ile input validation
const TurkishTextSchema = z.string()
  .min(1, "Metin boş olamaz")
  .max(500, "Metin çok uzun")
  .regex(/^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s.,!?-]+$/, "Geçersiz karakter");

const UserInputSchema = z.object({
  text: TurkishTextSchema,
  voiceId: z.string().uuid(),
  contentType: z.enum(['letter', 'word', 'sentence', 'celebration'])
});
```

---

## 🔐 Data Protection Kuralları

### **Veri Şifreleme**
```typescript
// Transit encryption (HTTPS zorunlu)
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Rest encryption (Firebase)
const FIREBASE_SECURITY = {
  encryption: 'AES-256',
  backupEncryption: 'ENABLED',
  auditLogging: 'ENABLED'
};
```

### **Veri Minimizasyonu**
- **Gerekli Veri:** Sadece eğitim için gerekli veriler toplanır
- **Veri Yaşam Döngüsü:** 3 yıl sonra otomatik silinir
- **Anonymization:** Kişisel tanımlayıcılar hashed
- **Backup Policy:** Şifrelenmiş yedekleme

---

## 🛡️ Content Security Policy (CSP)

### **CSP Headers**
```typescript
const CSP_POLICY = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "https://apis.google.com"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https:"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "connect-src": ["'self'", "https://api.elevenlabs.io", "https://firebaseapp.com"],
  "media-src": ["'self'"],
  "frame-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"]
};
```

### **XSS Protection**
```typescript
// Dangerous patterns'leri engelle
const FORBIDDEN_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /expression\s*\(/gi
];

const sanitizeInput = (input: string) => {
  return input.replace(FORBIDDEN_PATTERNS, '');
};
```

---

## 🔍 Güvenlik Monitoring

### **Security Logging**
```typescript
// Security event logging
const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'User logged in successfully',
  LOGIN_FAILED: 'Failed login attempt',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  API_KEY_INVALID: 'Invalid API key usage',
  UNAUTHORIZED_ACCESS: 'Unauthorized access attempt',
  DATA_EXPORT: 'User data exported',
  DATA_DELETE: 'User data deleted'
};

const logSecurityEvent = (event: string, userId: string, details: any) => {
  console.log(`[SECURITY] ${event}`, { userId, details, timestamp: new Date().toISOString() });
};
```

### **Vulnerability Scanning**
- **Dependencies:** `npm audit` weekly
- **Security Headers:** Monthly validation
- **Penetration Testing:** Quarterly
- **Code Review:** Her PR için security review

---

## 🚨 Incident Response

### **Security Incident Workflow**
1. **Detection:** Automated monitoring alerts
2. **Assessment:** Severity classification (Critical/High/Medium/Low)
3. **Containment:** Immediate threat isolation
4. **Eradication:** Root cause elimination
5. **Recovery:** Service restoration
6. **Lessons Learned:** Post-incident analysis

### **Critical Security Contacts**
- **Platform Admin:** Immediate notification
- **Firebase Support:** Critical infrastructure issues
- **ElevenLabs Security:** API security concerns
- **Legal Team:** KVKK compliance issues

---

## 📋 Security Checklist

### **Pre-Deployment Security**
- [ ] All API keys server-side only
- [ ] HTTPS enforced everywhere
- [ ] CSP headers configured
- [ ] Firestore security rules deployed
- [ ] Input validation implemented
- [ ] Rate limiting active
- [ ] Security headers set
- [ ] Audit logging enabled

### **Runtime Security**
- [ ] Authentication working
- [ ] Authorization properly enforced
- [ ] Session management secure
- [ ] Data encryption verified
- [ ] Backup encryption enabled
- [ ] Monitoring alerts active
- [ ] Vulnerability scanner running

---

## 🔗 İlgili Kural Dosyaları

### **Cross-References**
- **[API Rules](./api-rules.md)** - API security patterns
- **[Component Rules](./component-rules.md)** - Secure component patterns
- **[Database Rules](./database-rules.md)** - Data security patterns
- **[Error Handling Rules](./error-handling-rules.md)** - Security error handling

### **External Standards**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [KVKK Compliance](https://www.kvkk.gov.tr/)
- [Firebase Security](https://firebase.google.com/docs/rules)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

---

## ⚠️ Kritik Güvenlik Uyarıları

### **❌ ASLA YAPILMAYACAKLAR**
- Client-side'da API key saklama
- Çocuk verisi ebeveyn onayı olmadan işleme
- Authentication bypass
- Input validation atlama
- HTTPS olmadan sensitive data gönderme
- Security headers olmadan deployment

### **✅ MUTLAKA YAPILACAKLAR**
- Her API call için authentication check
- Tüm user input'ları validate etme
- Rate limiting uygulanması
- Security headers set etme
- Audit logging aktif tutma
- Regular security review

---

> **🛡️ Güvenlik Mottosu:** "Çocuk verilerinin korunması bizim en büyük sorumluluğumuz. Her kod satırında güvenliği düşünelim."

**Son Güncelleme:** 2025-01-07  
**Güvenlik Seviyesi:** 🟢 High Security  
**Compliance:** KVKK + GDPR Ready  
**Threat Level:** 🟢 Low Risk 