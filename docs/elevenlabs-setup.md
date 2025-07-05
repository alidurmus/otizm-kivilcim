# ElevenLabs Resmi SDK Entegrasyonu

Kıvılcım projesinde [ElevenLabs](https://elevenlabs.io/) resmi SDK'sı kullanılarak yüksek kaliteli Türkçe seslandirme özelliği entegre edilmiştir.

## Kurulum

### 1. ElevenLabs API Key Alma

1. [ElevenLabs](https://elevenlabs.io/) web sitesine gidin
2. Hesap oluşturun veya giriş yapın
3. API Keys bölümünden yeni bir API key oluşturun
4. API key'i kopyalayın

### 2. Environment Variables Ayarlama

Proje root dizininde `.env.local` dosyası oluşturun:

```env
# ElevenLabs API - Server-side only (NEXT_PUBLIC_ prefix yok!)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Development ayarları
NODE_ENV=development

# API Rate Limiting (isteğe bağlı, varsayılan değerler var)
API_RATE_LIMIT_MAX=60
API_RATE_LIMIT_WINDOW=60000
```

**🔒 Güvenlik Notu:** API anahtarı artık server-side'da güvenli bir şekilde saklanıyor. `NEXT_PUBLIC_` öneki kullanılmıyor, bu da anahtarın tarayıcıda görünmesini engelliyor.

### 3. Paket Kurulumu

```bash
npm install @elevenlabs/elevenlabs-js
```

## Yeni Mimari: Hibrit Yaklaşım

### Server-Side SDK + API Route Fallback

```typescript
// 1. Öncelik: Resmi SDK (server-side)
// 2. Fallback: API Route (/api/speech)
// 3. Son Fallback: Web Speech API
```

### Otomatik Fallback Chain

```typescript
const playAudio = async (text: string) => {
  try {
    // 1. ElevenLabs SDK (server-side)
    await speak(text, 'sentence');
  } catch (error) {
    // 2. API Route fallback
    console.warn('ElevenLabs SDK failed, trying API route...');
    // Otomatik olarak API route'a geçer
  }
  // 3. Web Speech API (son fallback)
  // Otomatik olarak hook içinde handle edilir
};
```

## Kullanım

### Hook Kullanımı

```tsx
import { useElevenLabs } from '@/lib/elevenlabs';

function MyComponent() {
  const { speak, getVoices, testVoice, getApiStatus } = useElevenLabs();

  const handleSpeak = async () => {
    await speak("Merhaba dünya!", 'sentence');
  };

  const handleTestVoice = async () => {
    const result = await testVoice(
      "Test metni",
      "pNInz6obpgDQGcFmaJgB",
      "sentence",
      {
        stability: 0.8,
        similarityBoost: 0.9,
        style: 0.6,
        useSpeakerBoost: true
      }
    );
    console.log('Test sonucu:', result);
  };

  return (
    <div>
      <button onClick={handleSpeak}>Konuş</button>
      <button onClick={handleTestVoice}>Ses Testi</button>
    </div>
  );
}
```

### Ses Türleri ve Optimize Edilmiş Ayarlar

ElevenLabs entegrasyonu 4 farklı ses türü destekler ve her biri için optimize edilmiş ayarlar kullanır:

1. **letter** - Harf seslendirme
   - Stability: 0.8, Similarity: 0.9, Style: 0.3
   - Yüksek netlik, kısa ve açık

2. **word** - Kelime seslendirme
   - Stability: 0.7, Similarity: 0.8, Style: 0.4
   - Kelime vurgusu, orta netlik

3. **sentence** - Cümle seslendirme
   - Stability: 0.6, Similarity: 0.7, Style: 0.5
   - Doğal akış, anlam vurgusu

4. **celebration** - Kutlama mesajları
   - Stability: 0.5, Similarity: 0.6, Style: 0.8
   - Coşkulu ton, pozitif enerji

### Ses Örnekleri

```tsx
// Harf sesi
await speak("e", 'letter');

// Kelime sesi
await speak("el", 'word');

// Cümle sesi
await speak("Bu hece 'el' oluyor.", 'sentence');

// Kutlama sesi
await speak("Harikasın! Çok güzel yaptın!", 'celebration');
```

## Gelişmiş Özellikler

### 1. Ses Testi ve Konfigürasyonu

```tsx
const { testVoice, getApiStatus } = useElevenLabs();

// Ses testi
const testResult = await testVoice(
  "Test metni",
  "pNInz6obpgDQGcFmaJgB",
  "sentence",
  {
    stability: 0.8,
    similarityBoost: 0.9,
    style: 0.6,
    useSpeakerBoost: true
  }
);

// API durumu kontrolü
const apiStatus = await getApiStatus();
console.log('API Status:', apiStatus);
```

### 2. Çocuk Dostu Ses Seçenekleri

```tsx
const { getVoices } = useElevenLabs();

const voices = await getVoices();
// Türkçe destekli, çocuk dostu sesler döner
```

**Önerilen Sesler:**

- **Adam** (`pNInz6obpgDQGcFmaJgB`) - Sakin ve açık erkek ses
- **Bella** (`EXAVITQu4vr4xnSDxMaL`) - Nazik ve anlaşılır kadın ses  
- **Josh** (`VR6AewLTigWG4xSOukaG`) - Genç ve eğlenceli erkek ses

### 3. Admin Panel Entegrasyonu

Admin paneli şu özellikleri sunar:

- **API Status Dashboard** - SDK durumu ve API key kontrolü
- **User Information Panel** - Hesap bilgileri ve kullanım limitleri
- **Voice Testing** - Tüm sesler için test arayüzü
- **Performance Metrics** - Ses oluşturma süreleri ve başarı oranları

## API Routes

### POST /api/speech

```typescript
// Request
{
  "text": "Merhaba",
  "type": "sentence", // letter | word | sentence | celebration
  "voiceId": "pNInz6obpgDQGcFmaJgB"
}

// Response
// Audio blob (audio/mpeg)
```

### GET /api/speech

```typescript
// Response
{
  "voices": [
    {
      "id": "pNInz6obpgDQGcFmaJgB",
      "name": "Adam",
      "description": "Sakin ve açık konuşan erkek ses",
      "language": "tr"
    }
  ]
}
```

## Güvenlik

### Server-Side API Key Management

```typescript
// ✅ Güvenli - Server-side only
const elevenlabs = new ElevenLabsApi({
  apiKey: process.env.ELEVENLABS_API_KEY, // NEXT_PUBLIC_ YOK!
});

// ❌ Güvensiz - Client-side exposure
const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
```

### Rate Limiting

```typescript
// API route'unda otomatik rate limiting
const rateLimitResult = await rateLimit.check(ip, 60, '1m');
if (!rateLimitResult.success) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

## Performans

### Benchmark Sonuçları

- **SDK (Server-side):** ~150-300ms (first call)
- **API Route:** ~200-400ms (consistent)
- **Web Speech API:** ~50-100ms (instant, fallback)

### Optimizasyonlar

- **Automatic Caching:** Browser otomatik cache kullanır
- **Blob URL Management:** Memory leak'leri önlemek için URL cleanup
- **Error Recovery:** Graceful fallback chain
- **Connection Pooling:** SDK otomatik connection management

## Test Entegrasyonu

### Playwright Mock

```typescript
test.beforeEach(async ({ page }) => {
  // ElevenLabs API mock
  await page.route('**/v1/text-to-speech/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'audio/mpeg',
      body: Buffer.from('fake-audio-data')
    });
  });

  // API route mock
  await page.route('/api/speech', route => {
    route.fulfill({
      status: 200,
      contentType: 'audio/mpeg',
      body: Buffer.from('fake-audio-data')
    });
  });
});
```

### Jest Unit Tests

```typescript
// Mock ElevenLabs SDK
jest.mock('@elevenlabs/elevenlabs-js', () => ({
  ElevenLabsApi: jest.fn().mockImplementation(() => ({
    textToSpeech: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    voices: {
      getAll: jest.fn().mockResolvedValue({ voices: [] })
    }
  }))
}));
```

## Troubleshooting

### Common Issues

1. **SDK not initialized**
   ```
   Çözüm: ELEVENLABS_API_KEY environment variable'ını kontrol edin
   ```

2. **Network Error**
   ```
   Çözüm: Fallback API route'u otomatik devreye girer
   ```

3. **Rate Limit Exceeded**
   ```
   Çözüm: Built-in rate limiting ile korunmalı
   ```

4. **Invalid Voice ID**
   ```
   Çözüm: getVoices() ile geçerli sesler listesini alın
   ```

### Debug Mode

```typescript
// Debug logging açmak için
console.log('ElevenLabs Debug:', {
  sdkInitialized: elevenlabs.isInitialized,
  apiKeyConfigured: !!process.env.ELEVENLABS_API_KEY,
  environment: process.env.NODE_ENV
});
```

## Sınırlamalar

### Free Plan
- 10,000 karakter/ay
- 3 özel ses
- Standart quality

### Paid Plans
- Daha yüksek limitler
- Professional quality
- Daha fazla ses seçeneği
- Daha hızlı processing

## Katkıda Bulunma

ElevenLabs entegrasyonunu geliştirmek için:

1. **Yeni ses türleri** ekleyin
2. **Ses ayarlarını optimize** edin
3. **Test coverage'ı** artırın
4. **Error handling'i** geliştirin
5. **Performance metrics** ekleyin

## Kaynaklar

- [ElevenLabs Official SDK](https://github.com/elevenlabs/elevenlabs-js)
- [ElevenLabs API Documentation](https://elevenlabs.io/docs/api-reference/introduction)
- [Türkçe Ses Modelleri](https://elevenlabs.io/languages)
- [Pricing](https://elevenlabs.io/pricing)
- [Voice Library](https://elevenlabs.io/voice-library)

---

> **Not:** Bu dokümantasyon, ElevenLabs resmi SDK entegrasyonu ve hibrit fallback yaklaşımı için güncellenmiştir. Güvenlik, performans ve kullanıcı deneyimi açısından önemli iyileştirmeler içermektedir. 