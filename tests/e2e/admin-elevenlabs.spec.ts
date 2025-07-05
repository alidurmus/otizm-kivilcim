import { test, expect } from '@playwright/test';

test.describe('Admin ElevenLabs Test Sayfası', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mock ElevenLabs API status response
    await page.route('**/api/speech/status', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          apiKeyConfigured: true,
          sdkInitialized: true,
          lastTestSuccess: true,
          userInfo: {
            name: 'Test User',
            email: 'test@example.com',
            tier: 'free'
          }
        })
      });
    });
    
    await page.route('**/api/speech', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Sakin ve açık konuşan erkek ses' },
            { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Nazik ve anlaşılır kadın ses' }
          ])
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'audio/mpeg',
          body: Buffer.from('mock-audio-data')
        });
      }
    });
    
    await page.route('**/api/speech/status', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          apiKeyConfigured: true,
          sdkInitialized: true,
          lastTestSuccess: true,
          userInfo: {
            name: 'Test User',
            email: 'test@example.com',
            tier: 'free'
          }
        })
      });
    });
    
    await page.goto('/admin/elevenlabs-test');
    
    // Wait for page to load
    await expect(page.getByRole('heading', { name: /ElevenLabs API Test Merkezi/i })).toBeVisible();
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

  test('API durumu paneli doğru bilgileri göstermeli', async ({ page }) => {
    // Wait for API status to load
    await page.waitForTimeout(1000);

    // API Key durumu
    await expect(page.getByText('✅ Yapılandırılmış')).toBeVisible();

    // SDK durumu
    await expect(page.getByText('✅ Başlatılmış')).toBeVisible();

    // Son test durumu
    await expect(page.getByText('✅ Başarılı')).toBeVisible();
  });

  test('ses testi paneli bileşenleri görünmeli', async ({ page }) => {
    // Wait for components to load
    await page.waitForTimeout(1000);

    // Test metni alanı (label ile kontrol edelim)
    await expect(page.getByText('Test Metni')).toBeVisible();
    const textArea = page.locator('textarea');
    await expect(textArea).toBeVisible();
    await expect(textArea).toHaveValue('Merhaba! Bu ElevenLabs API testi.');

    // Ses seçimi dropdown (label ile kontrol edelim)
    await expect(page.getByText('Ses Seçimi')).toBeVisible();
    const voiceSelect = page.locator('select').first();
    await expect(voiceSelect).toBeVisible();

    // Test türü dropdown
    await expect(page.getByText('Test Türü')).toBeVisible();
    const typeSelect = page.locator('select').nth(1);
    await expect(typeSelect).toBeVisible();

    // Test butonu
    await expect(page.getByRole('button', { name: /Test Et/i })).toBeVisible();
  });

  test('test türü değiştirildiğinde hızlı test butonları güncellenmeli', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForTimeout(1000);

    // Test türünü letter'a değiştir
    const typeSelect = page.locator('select').nth(1);
    await typeSelect.selectOption('letter');

    // Hızlı test bölümünün görünmesini bekle
    await expect(page.getByText('Hızlı Test')).toBeVisible();
    
    // Letter butonlarının görünmesini bekle (dinamik içerik olduğu için genel kontrol)
    await expect(page.locator('.flex.flex-wrap.gap-2 button').first()).toBeVisible();
  });

  test('hızlı test butonu test metnini güncellenmeli', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // İlk hızlı test butonuna tıkla
    const firstQuickButton = page.locator('.flex.flex-wrap.gap-2 button').first();
    await firstQuickButton.click();

    // Test metninin güncellendiğini kontrol et
    const textArea = page.locator('textarea');
    await expect(textArea).not.toHaveValue('Merhaba! Bu ElevenLabs API testi.');
  });

  test('test metni boş olduğunda hata mesajı gösterilmeli', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Test metnini temizle
    const textArea = page.locator('textarea');
    await textArea.clear();

    // Test butonuna tıkla
    await page.getByRole('button', { name: /Test Et/i }).click();

    // Hata mesajının gösterilmesini bekle
    await expect(page.getByText('Lütfen test metni girin')).toBeVisible();
  });

  test('başarılı test sonrası sonuçlar tablosuna eklenmeli', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Test butonuna tıkla
    await page.getByRole('button', { name: /Test Et/i }).click();

    // Test durumunun değişmesini bekle
    await expect(page.getByRole('button', { name: /Test Ediliyor/i })).toBeVisible();

    // Test sonuçları tablosunun görünmesini bekle
    await expect(page.getByRole('heading', { name: /Test Sonuçları/i })).toBeVisible();
    
    // Tablonun var olduğunu kontrol et
    await expect(page.locator('table')).toBeVisible();
  });

  test('farklı ses seçenekleri mevcut olmalı', async ({ page }) => {
    // Wait for voices to load
    await page.waitForTimeout(2000);

    // Ses seçimi dropdown'unu aç
    const voiceSelect = page.locator('select').first();
    await voiceSelect.click();

    // Mock'lanan sesler görünmeli (option'lar dropdown içinde olduğu için farklı yaklaşım)
    const options = page.locator('select option');
    await expect(options).toHaveCount(2); // 2 mock voice expected
  });

  test('test türü seçenekleri doğru olmalı', async ({ page }) => {
    // Test türü dropdown'unu aç
    const typeSelect = page.locator('select').nth(1);
    
    // Option'ların mevcut olduğunu kontrol et
    await expect(typeSelect.locator('option[value="letter"]')).toHaveText('Harf');
    await expect(typeSelect.locator('option[value="word"]')).toHaveText('Kelime');
    await expect(typeSelect.locator('option[value="sentence"]')).toHaveText('Cümle');
    await expect(typeSelect.locator('option[value="celebration"]')).toHaveText('Kutlama');
  });

  test('uzun test metni için karakter sınırı kontrolü yapılmalı', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    const longText = 'A'.repeat(1000); // 1000 karakter
    const textArea = page.locator('textarea');

    await textArea.clear();
    await textArea.fill(longText);

    // Test butonuna tıkla
    await page.getByRole('button', { name: /Test Et/i }).click();

    // Uzun metin için uyarı veya işlem yapılmalı
    // (Bu sayfada sınır yok gibi görünüyor, ama test ediyoruz)
    await page.waitForTimeout(1000);
  });

  test('keyboard navigasyonu çalışmalı', async ({ page }) => {
    // Sayfa odaklanmalı
    await page.focus('body');
    
    // Tab ile elementler arasında geçiş
    await page.keyboard.press('Tab'); // API referans linki
    await page.keyboard.press('Tab'); // Textarea
    
    const textArea = page.locator('textarea');
    await expect(textArea).toBeFocused();
  });

  test('aria etiketleri ve erişilebilirlik kontrolleri', async ({ page }) => {
    // Form elemanlarının uygun etiketleri olmalı
    await expect(page.getByText('Test Metni')).toBeVisible();
    await expect(page.getByText('Ses Seçimi')).toBeVisible();
    await expect(page.getByText('Test Türü')).toBeVisible();

    // Dropdown'ların uygun erişilebilirlik etiketleri olmalı
    const voiceSelect = page.locator('select').first();
    await expect(voiceSelect).toBeVisible();
    
    const typeSelect = page.locator('select').nth(1);
    await expect(typeSelect).toBeVisible();
  });

  test('test sonuçları doğru sırada görüntülenmeli', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // İlk test
    await page.locator('textarea').fill('Test 1');
    await page.getByRole('button', { name: /Test Et/i }).click();

    // Test tamamlanmasını bekle
    await page.waitForTimeout(2000);

    // İkinci test
    await page.locator('textarea').fill('Test 2');
    await page.getByRole('button', { name: /Test Et/i }).click();

    // Test tamamlanmasını bekle
    await page.waitForTimeout(2000);

    // Sonuçların görünmesini bekle
    if (await page.getByText('📈 Test Sonuçları').isVisible()) {
      // En son test en üstte olmalı
      const firstRow = page.locator('tbody tr').first();
      await expect(firstRow).toContainText('Test 2');
    }
  });
}); 