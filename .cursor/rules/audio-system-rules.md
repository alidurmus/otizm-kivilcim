# Ses Sistemi Kuralları - Kıvılcım Platform

## 🎵 Ses Sistemi Ana Kuralları

### 🎭 Gender-Balanced Voice System
- **Zorunlu:** 3 erkek + 2 kadın ses dengesi korunacak
- **Erkek Sesler:** Adam (letters), Antoni (sentences), Josh (celebrations)
- **Kadın Sesler:** Rachel (words), Bella (mixed content)
- **Default Karakter:** Gülsu (9BWtsMINqrJLrRacOk9x) tutarlılık için

### 🔊 Ses Türü Atamaları

#### **Content-Type Specific Voice Assignment**
```typescript
// ZORUNLU ses atama kuralları
const VOICE_ASSIGNMENTS = {
  'letter': 'Adam',           // Erkek, sakin ve açık
  'word': 'Rachel',           // Kadın, profesyonel
  'sentence': 'Antoni',       // Erkek, hikaye anlatıcısı
  'celebration': 'Josh'       // Erkek, enerjik ve eğlenceli
};
```

#### **Voice Configuration Standards**
```typescript
// Her ses için zorunlu ayarlar
voice_settings: {
  stability: 0.75,          // Sakin ve tutarlı
  similarity_boost: 0.85,   // Yüksek kalite
  style: 0.3,              // Doğal konuşma
  use_speaker_boost: true   // Net konuşma
}
```

### 🇹🇷 Türkçe Karakter Desteği

#### **Tam Alfabe Desteği**
- **29 Harf:** A-Z + Ç, Ğ, I, İ, Ö, Ş, Ü
- **URL-Safe Mapping:** Turkish characters → ASCII equivalents
- **File Naming:** ç→ch, ğ→gh, ı→ii, ö→oh, ş→sh, ü→uh

#### **Türkçe Phoneme Rules**
```typescript
// SSML + IPA phonetic transcription kullan
const turkishPhonemes = {
  'ç': '<phoneme alphabet="ipa" ph="tʃ">ç</phoneme>',
  'ğ': '<phoneme alphabet="ipa" ph="ɰ">ğ</phoneme>',
  'ı': '<phoneme alphabet="ipa" ph="ɯ">ı</phoneme>',
  'ö': '<phoneme alphabet="ipa" ph="œ">ö</phoneme>',
  'ş': '<phoneme alphabet="ipa" ph="ʃ">ş</phoneme>',
  'ü': '<phoneme alphabet="ipa" ph="y">ü</phoneme>'
};
```

### 📁 Statik Ses Dosyası Kuralları

#### **Dosya Yapısı (ZORUNLU)**
```
/public/audio/
├── letters/        # 29 Türk alfabesi harfi
├── words/          # Türkçe kelimeler ve sayılar
├── sentences/      # Hoş geldin ve yönlendirme cümleleri
└── celebrations/   # Kutlama ve övgü mesajları
```

#### **Dosya Adlandırma Kuralları**
- **Format:** MP3, 128kbps, 44.1kHz
- **Süre Limitleri:** 
  - Letters: ~1-2 saniye
  - Words: ~2-4 saniye
  - Sentences: ~5-10 saniye
  - Celebrations: ~3-5 saniye
- **Boyut Limitleri:**
  - Letters: minimum 3KB
  - Words: minimum 8KB
  - Sentences: minimum 15KB
  - Celebrations: minimum 12KB

### 🔄 Hibrit Fallback Sistemi

#### **4-Tier Fallback Chain (ZORUNLU)**
1. **Static MP3 Files** (öncelik) - performans + maliyet optimizasyonu
2. **ElevenLabs SDK** - Gülsu voice default
3. **API Route** - server-side proxy
4. **Web Speech API** - tarayıcı fallback

#### **Fallback Implementation**
```typescript
// ZORUNLU fallback pattern
async function playAudio(text: string, type: string) {
  try {
    // 1. Static file'ı dene
    return await playStaticAudio(getStaticPath(text, type));
  } catch {
    // 2. ElevenLabs SDK'yı dene
    return await elevenLabsSpeak(text, getVoiceForType(type));
  } catch {
    // 3. API Route'u dene
    return await apiRouteFallback(text, type);
  } catch {
    // 4. Web Speech API'yi dene
    return await webSpeechFallback(text);
  }
}
```

### 🔐 API Güvenlik Kuralları

#### **Server-Side Security**
- **API Keys:** Server-side ONLY (NEXT_PUBLIC_ prefix YOK)
- **Rate Limiting:** IP başına 60 request/minute
- **Proxy Pattern:** `/api/speech` endpoint üzerinden
- **Error Recovery:** Graceful degradation required

#### **Security Implementation**
```typescript
// API key güvenlik kuralları
// ✅ DOĞRU: Server-side environment
ELEVENLABS_API_KEY=your_key_here

// ❌ YANLIŞ: Client-side exposure
NEXT_PUBLIC_ELEVENLABS_API_KEY=never_do_this
```

### 📊 Ses Performans Kuralları

#### **Performance Targets**
- **ElevenLabs SDK:** <300ms response time
- **API Route:** <400ms response time
- **Static Files:** <100ms loading time
- **Success Rate:** %99+ (fallback chain ile)

#### **Caching Strategy**
- **Static Audio:** Browser cache (1 year)
- **ElevenLabs:** Session cache (30 minutes)
- **API Routes:** Server cache (15 minutes)

### 🎯 Modül Bazlı Ses Kuralları

#### **Matematik Modülü**
- **Welcome Message:** Antoni voice (ErXwobaYiN019PkySvjV)
- **Numbers:** Rachel voice (21m00Tcm4TlvDq8ikWAM)
- **Celebrations:** Josh voice (VR6AewLTigWG4xSOukaG)
- **Audio Coverage:** 18/18 files (433KB total)

#### **Alfabe Modülü**
- **Letter Pronunciation:** Adam voice (pNInz6obpgDQGcFmaJgB)
- **Instructions:** Antoni voice (ErXwobaYiN019PkySvjV)
- **Success Messages:** Josh voice (VR6AewLTigWG4xSOukaG)

### 🧪 Ses Test Kuralları

#### **Audio Testing Requirements**
- **Gender Balance:** Her test'te erkek ve kadın ses test edilecek
- **Turkish Characters:** 29 harf full coverage test
- **Fallback Chain:** Tüm fallback seviyelerini test et
- **404 Errors:** Audio file missing scenarios test

#### **Admin Panel Audio Tests**
```typescript
// ZORUNLU admin test pattern
test('should test gender-balanced voices', async () => {
  await testMaleVoices(['Adam', 'Antoni', 'Josh']);
  await testFemaleVoices(['Rachel', 'Bella']);
  await verifyGenderBalance();
});
```

### 📱 Cross-Platform Ses Kuralları

#### **Browser Compatibility**
- **Chrome/Chromium:** Full ElevenLabs SDK support
- **Firefox:** API Route fallback
- **Safari:** Web Speech API primary
- **Mobile:** Static files preferred

#### **Device Optimization**
- **Mobile:** Compress audio files for bandwidth
- **Tablet:** Enhanced audio quality
- **Desktop:** Full quality audio experience

### 🔄 Ses Dosyası Yönetim Kuralları

#### **Audio File Management**
- **Manual Management:** User manages audio files manually
- **No Auto-Generation:** ASLA otomatik ses oluşturma (user approval gerekli)
- **Validation:** File size ve format validation
- **Backup:** Audio files version control'de

#### **Audio Constants Integration**
```typescript
// lib/audio-constants.ts'te ZORUNLU mapping
export const DIALOG_MAPPINGS = {
  'matematik-hosgeldin': '/audio/sentences/matematik-dunyasi-hosgeldin.mp3',
  'bir-sayisi': '/audio/words/bir.mp3',
  'kutlama-harika': '/audio/celebrations/harika-devam-et.mp3'
};
```

### 🚨 Ses Hata Yönetimi

#### **Error Handling Rules**
- **404 Errors:** Log and fallback immediately
- **Network Errors:** Retry with exponential backoff
- **API Limits:** Switch to fallback chain
- **User Feedback:** Visual indicators for audio status

#### **Debug Audio Issues**
```bash
# Ses sistemi debug komutları
npm run audio:test              # STT validation
npm run audio:validate          # File size check
npm run audio:check-structure   # Directory validation
npm run audio:regenerate        # Corrupted file recovery
```

### 📈 Ses Analytics Kuralları

#### **Audio Usage Tracking**
- **Static vs Dynamic:** %70+ static usage target
- **Voice Usage:** Gender balance analytics
- **Performance Metrics:** Response time monitoring
- **Error Rates:** <1% failure rate target

#### **Reporting Requirements**
- **Daily:** Audio system health check
- **Weekly:** Voice usage analytics
- **Monthly:** Performance optimization review

---

## 🔗 İlgili Kural Dosyaları

- **Testing Rules:** `docs/rules/testing-rules.md`
- **Component Rules:** `docs/rules/component-rules.md`
- **API Rules:** `docs/rules/api-rules.md`

---

> **Kritik Kural:** Ses sistemi autism-friendly experience için kritiktir. Gender-balanced Turkish voices ve hibrit fallback sistemi ASLA ihlal edilemez.

**Son Güncelleme:** 2025-01-07  
**Durum:** Aktif ve zorunlu  
**Owner:** Audio System Team 