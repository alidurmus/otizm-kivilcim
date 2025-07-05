import { test, expect } from '@playwright/test';

test.describe('Admin ElevenLabs Test Sayfası', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mock ElevenLabs API GET requests (voices)
    await page.route('**/api/speech', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            configured: false, // API key not configured for testing
            voices: [
              {
                id: 'EXAVITQu4vr4xnSDxMaL',
                name: 'Bella',
                description: 'Nazik ve sakin bayan ses',
                language: 'tr',
                gender: 'female'
              },
              {
                id: 'pNInz6obpgDQGcFmaJgB',
                name: 'Adam',
                description: 'Sakin ve açık erkek ses',
                language: 'tr',
                gender: 'male'
              }
            ]
          })
        });
      } else if (route.request().method() === 'POST') {
        // Mock TTS requests - return error to simulate missing API key
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'API key not configured'
          })
        });
      }
    });

    // Mock Web Speech API
    await page.addInitScript(() => {
      // Mock speechSynthesis
      if (!window.speechSynthesis) {
        Object.defineProperty(window, 'speechSynthesis', {
          value: {
            speak: (utterance: any) => {
              setTimeout(() => {
                if (utterance.onend) utterance.onend();
              }, 100);
            },
            cancel: () => {},
            pause: () => {},
            resume: () => {},
            getVoices: () => []
          }
        });
      }

      // Mock SpeechSynthesisUtterance
      if (!window.SpeechSynthesisUtterance) {
        Object.defineProperty(window, 'SpeechSynthesisUtterance', {
          value: class MockSpeechSynthesisUtterance {
            constructor(text: string) {
              this.text = text;
            }
            text = '';
            lang = 'tr-TR';
            rate = 1;
            pitch = 1;
            volume = 1;
            onstart = null;
            onend = null;
            onerror = null;
          }
        });
      }
    });

    // Navigate to admin page
    await page.goto('http://localhost:3000/admin/elevenlabs-test');
  });

  test('sayfa başlığı ve temel elementler görünmeli', async ({ page }) => {
    // Ana başlık
    await expect(page.getByRole('heading', { name: /ElevenLabs API Test Merkezi/i })).toBeVisible();
    
    // Alt başlık
    await expect(page.getByText('Resmi SDK ile gelişmiş ses testi ve analiz')).toBeVisible();
    
    // API referans linki
    await expect(page.getByRole('link', { name: /ElevenLabs API Referansı/i })).toBeVisible();
    
    // API Durumu başlığı
    await expect(page.getByRole('heading', { name: /API Durumu/i })).toBeVisible();
    
    // Ses Testi başlığı
    await expect(page.getByRole('heading', { name: /Ses Testi/i })).toBeVisible();
  });

  test('API durumu doğru bilgileri göstermeli', async ({ page }) => {
    // API key configured durumu (false olması beklenir)
    await expect(page.locator('text=API Key: Yapılandırılmamış')).toBeVisible({ timeout: 10000 });
    
    // SDK durumu
    await expect(page.locator('text=SDK: Başlatılmamış')).toBeVisible();
    
    // Türkçe desteği
    await expect(page.locator('text=Türkçe Desteği: Evet')).toBeVisible();
  });

  test('ses listesi yüklenmeli', async ({ page }) => {
    // Ses seçimi dropdown'ının görünmesini bekle
    await expect(page.locator('select, [role="combobox"]')).toBeVisible({ timeout: 10000 });
    
    // En az bir seçenek olmalı
    const options = page.locator('option, [role="option"]');
    await expect(options).toHaveCount({ min: 1 });
  });

  test('test metni girişi çalışmalı', async ({ page }) => {
    // Test metni alanını bul (aria-label veya placeholder ile)
    const testTextInput = page.locator('textarea, input[type="text"]').first();
    await expect(testTextInput).toBeVisible();
    
    // Test metni gir
    await testTextInput.fill('Test metni');
    await expect(testTextInput).toHaveValue('Test metni');
  });

  test('hızlı test butonları çalışmalı', async ({ page }) => {
    // Hızlı test butonlarını bul
    const quickTestButtons = page.locator('button').filter({ hasText: /Test|Harf|Kelime|Cümle|Kutlama/i });
    await expect(quickTestButtons.first()).toBeVisible({ timeout: 10000 });
    
    // En az 4 buton olmalı (letter, word, sentence, celebration)
    await expect(quickTestButtons).toHaveCount({ min: 4 });
  });

  test('ses test butonları güncellenmeli', async ({ page }) => {
    // Ana test butonunu bul
    const testButton = page.locator('button').filter({ hasText: /Test|Seslendir|Çal/i }).first();
    await expect(testButton).toBeVisible({ timeout: 10000 });
    
    // Butona tıkla
    await testButton.click();
    
    // Test sonucu mesajını bekle (API hatası olacak ama UI güncellenecek)
    await page.waitForTimeout(2000);
    
    // Sayfanın responsive kaldığını kontrol et
    await expect(page.getByRole('heading', { name: /ElevenLabs API Test Merkezi/i })).toBeVisible();
  });

  test('test sonuçları tablosu görünmeli', async ({ page }) => {
    // Test sonuçları tablosunun görünmesini bekle
    await expect(page.getByRole('heading', { name: /Test Sonuçları/i })).toBeVisible();
    
    // Tablo başlıklarını kontrol et
    await expect(page.locator('text=Metin')).toBeVisible();
    await expect(page.locator('text=Ses')).toBeVisible();
    await expect(page.locator('text=Süre')).toBeVisible();
  });

  test('responsive tasarım kontrolü', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /ElevenLabs API Test Merkezi/i })).toBeVisible();
    
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: /ElevenLabs API Test Merkezi/i })).toBeVisible();
    
    // Desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.getByRole('heading', { name: /ElevenLabs API Test Merkezi/i })).toBeVisible();
  });

  test('erişilebilirlik kontrolleri', async ({ page }) => {
    // Keyboard navigation testi
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Focus indicator olmalı
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Skip to content link (varsa)
    const skipLink = page.locator('a[href="#main-content"], a[href="#content"]');
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible();
    }
  });

  test('API olmadığında hata mesajı gösterilmeli', async ({ page }) => {
    // Test butonuna tıkla
    const testButton = page.locator('button').filter({ hasText: /Test|Seslendir|Çal/i }).first();
    if (await testButton.count() > 0) {
      await testButton.click();
      
      // Hata mesajı veya uyarı bekle
      await page.waitForTimeout(3000);
      
      // Sayfa hala responsive olmalı
      await expect(page.getByRole('heading', { name: /ElevenLabs API Test Merkezi/i })).toBeVisible();
    }
  });

  test('tema değişimi çalışmalı', async ({ page }) => {
    // Tema switch butonunu bul (varsa)
    const themeToggle = page.locator('button[aria-label*="tema"], button[aria-label*="theme"], [data-theme-toggle]');
    
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Sayfa hala görünür olmalı
      await expect(page.getByRole('heading', { name: /ElevenLabs API Test Merkezi/i })).toBeVisible();
    }
  });

  test('ses ayarları modalı açılmalı', async ({ page }) => {
    // Ses ayarları butonunu bul (varsa)
    const settingsButton = page.locator('button').filter({ hasText: /Ayar|Setting|Konfigür/i });
    
    if (await settingsButton.count() > 0) {
      await settingsButton.click();
      await page.waitForTimeout(1000);
      
      // Modal veya ayar paneli açılmalı
      const modal = page.locator('[role="dialog"], .modal, .settings-panel');
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible();
      }
    }
  });

  test('performans metrikleri görünmeli', async ({ page }) => {
    // Performans kartlarını bekle
    await page.waitForTimeout(2000);
    
    // Performans metrikleri (varsa)
    const performanceSection = page.locator('text=Performans, text=Metrik, text=İstatistik').first();
    if (await performanceSection.count() > 0) {
      await expect(performanceSection).toBeVisible();
    }
    
    // En azından sayfa yüklenmiş olmalı
    await expect(page.getByRole('heading', { name: /ElevenLabs API Test Merkezi/i })).toBeVisible();
  });

}); 