# ElevenLabs Ses Entegrasyonu

Kıvılcım projesinde [ElevenLabs](https://elevenlabs.io/) kullanarak yüksek kaliteli Türkçe seslandirme özelliği entegre edilmiştir.

## Kurulum

### 1. ElevenLabs API Key Alma

1. [ElevenLabs](https://elevenlabs.io/) web sitesine gidin
2. Hesap oluşturun veya giriş yapın
3. API Keys bölümünden yeni bir API key oluşturun
4. API key'i kopyalayın

### 2. Environment Variables Ayarlama

Proje root dizininde `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

**Önemli:** `.env.local` dosyasını `.gitignore`'a eklemeyi unutmayın.

### 3. Paket Kurulumu

```bash
npm install elevenlabs
```

## Kullanım

### Hook Kullanımı

```tsx
import { useElevenLabs } from '@/lib/elevenlabs';

function MyComponent() {
  const { speak, getVoices } = useElevenLabs();

  const handleSpeak = async () => {
    await speak("Merhaba dünya!", 'sentence');
  };

  return (
    <button onClick={handleSpeak}>
      Konuş
    </button>
  );
}
```

### Ses Türleri

ElevenLabs entegrasyonu 4 farklı ses türü destekler:

1. **letter** - Harf seslendirme
   - Yüksek netlik
   - Kısa ve açık
   - Stability: 0.7

2. **word** - Kelime seslendirme
   - Orta netlik
   - Kelime vurgusu
   - Stability: 0.6

3. **sentence** - Cümle seslendirme
   - Doğal akış
   - Anlam vurgusu
   - Stability: 0.5

4. **celebration** - Kutlama mesajları
   - Coşkulu ton
   - Pozitif enerji
   - Stability: 0.4

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

## Çocuk Dostu Ses Seçenekleri

Proje otizmli çocuklar için optimize edilmiş 3 ses kullanır:

### Adam (Varsayılan)
- **ID:** `pNInz6obpgDQGcFmaJgB`
- **Açıklama:** Sakin ve açık konuşan erkek ses
- **Kullanım:** Genel seslandirme

### Bella
- **ID:** `EXAVITQu4vr4xnSDxMaL`
- **Açıklama:** Nazik ve anlaşılır kadın ses
- **Kullanım:** Kutlama mesajları

### Josh
- **ID:** `VR6AewLTigWG4xSOukaG`
- **Açıklama:** Genç ve eğlenceli erkek ses
- **Kullanım:** Oyunsu aktiviteler

## Fallback Mekanizması

ElevenLabs API'sine erişim olmadığında sistem otomatik olarak Web Speech API'sine geçer:

```tsx
const playAudioFeedback = async () => {
  try {
    await speak(text, 'word'); // ElevenLabs
  } catch (error) {
    // Fallback to Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      speechSynthesis.speak(utterance);
    }
  }
};
```

## Duyusal Kontrol Entegrasyonu

Ebeveynler ses ayarlarını duyusal kontrol panelinden yönetebilir:

- **Ses Efektleri:** Açma/Kapama
- **Animasyonlar:** Açma/Kapama
- **Ses Seviyesi:** Otomatik ayarlama

## Test Entegrasyonu

Playwright testlerinde ElevenLabs API'si mock'lanır:

```tsx
test.beforeEach(async ({ page }) => {
  await page.route('**/v1/text-to-speech/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'audio/mpeg',
      body: Buffer.from('fake-audio-data')
    });
  });
});
```

## Performans

- **İlk Çağrı:** ~200-500ms (API latency)
- **Cache:** Browser otomatik cache kullanır
- **Cleanup:** Audio URL'leri otomatik temizlenir
- **Error Handling:** Graceful fallback Web Speech API'ye

## Güvenlik

- API key browser'da görünür (NEXT_PUBLIC_)
- Production'da domain restriction kullanın
- Rate limiting ElevenLabs tarafından uygulanır
- CORS policy ElevenLabs tarafından kontrol edilir

## Sınırlamalar

### Free Plan
- 10,000 karakter/ay
- 3 özel ses
- Standart sesler

### Paid Plans
- Daha yüksek limitler
- Daha fazla ses seçeneği
- Daha hızlı processing

## Troubleshooting

### API Key Hatası
```
Error: ElevenLabs TTS Error: Invalid API key
```
**Çözüm:** API key'inizi kontrol edin

### Network Hatası
```
Error: Failed to fetch
```
**Çözüm:** İnternet bağlantısını kontrol edin

### Ses Çalmama
```
Error: Audio play failed
```
**Çözüm:** Browser autoplay policy'sine takılmış olabilir

### Türkçe Karakter Sorunu
```
Error: Unsupported characters
```
**Çözüm:** `eleven_multilingual_v2` modelini kullanın

## İleri Düzey Kullanım

### Özel Ses Oluşturma

```tsx
const customVoice = await elevenlabsClient.textToSpeech(text, {
  voiceId: 'your-custom-voice-id',
  stability: 0.8,
  similarityBoost: 0.9,
  style: 0.6,
  useSpeakerBoost: true
});
```

### Batch Processing

```tsx
const audioPromises = texts.map(text => 
  elevenlabsClient.textToSpeech(text, { voiceId: 'adam' })
);
const audioUrls = await Promise.all(audioPromises);
```

## Katkıda Bulunma

Ses özelliklerini geliştirmek için:

1. Yeni ses türleri ekleyin
2. Ses ayarlarını optimize edin
3. Test coverage'ı artırın
4. Error handling'i geliştirin

## Kaynaklar

- [ElevenLabs API Documentation](https://docs.elevenlabs.io/)
- [Türkçe Ses Modelleri](https://elevenlabs.io/languages)
- [Pricing](https://elevenlabs.io/pricing)
- [Voice Library](https://elevenlabs.io/voice-library) 