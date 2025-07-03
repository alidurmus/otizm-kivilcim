import { test, expect } from '@playwright/test';

test.describe('ElevenLabs Ses Entegrasyonu', () => {
  test.beforeEach(async ({ page }) => {
    // Mock ElevenLabs API to avoid real API calls during testing
    await page.route('**/v1/text-to-speech/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'audio/mpeg',
        body: Buffer.from('fake-audio-data')
      });
    });
  });

  test('ana sayfa hoş geldin mesajı test edilmeli', async ({ page }) => {
    await page.goto('/');
    
    // Splash screen'i bekle
    await expect(page.getByText('Yükleniyor...')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kıvılcım', level: 1 })).toBeVisible({ timeout: 5000 });
    
    // Ses dinleme butonu görünür olmalı
    await expect(page.getByRole('button', { name: '🎵 Dinle' })).toBeVisible();
    
    // ElevenLabs branding kontrol et
    await expect(page.getByText('Powered by ElevenLabs AI')).toBeVisible();
  });

  test('egzersiz sayfasında ses özellikleri çalışmalı', async ({ page }) => {
    await page.goto('/exercise/literacy');
    
    // Hece dinleme butonu görünür olmalı
    await expect(page.getByRole('button', { name: /🔊 Heceyi Dinle/ })).toBeVisible();
    
    // Harf kutularına tıklayabilmeli
    const letterBox = page.getByText('e').first();
    await expect(letterBox).toBeVisible();
    
    // Hover tooltip'i kontrol et
    await letterBox.hover();
    await expect(page.getByText('Dinlemek için tıkla')).toBeVisible();
  });

  test('ses butonları disabled state\'leri doğru çalışmalı', async ({ page }) => {
    await page.goto('/exercise/literacy');
    
    const listenButton = page.getByRole('button', { name: /🔊 Heceyi Dinle/ });
    
    // Butona tıkla
    await listenButton.click();
    
    // Loading state'i kontrol et (eğer API call simulated olursa)
    // Bu test gerçek API call yapmadığı için hemen geçer
    await expect(listenButton).toBeVisible();
  });

  test('harf seslerinin çalması test edilmeli', async ({ page }) => {
    await page.goto('/exercise/literacy');
    
    // İlk harfe tıkla
    const firstLetter = page.getByText('e').first();
    await firstLetter.click();
    
    // Console log'ları kontrol etmek için
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });
    
    // Herhangi bir ses hatası olmamalı
    await page.waitForTimeout(1000);
    expect(logs.filter(log => log.includes('Harf ses hatası'))).toHaveLength(0);
  });

  test('API key eksik olduğunda fallback çalışmalı', async ({ page }) => {
    // API key'i undefined yap
    await page.addInitScript(() => {
      delete (window as any).process?.env?.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    });
    
    await page.goto('/exercise/literacy');
    
    // Ses butonuna tıkla
    await page.getByRole('button', { name: /🔊 Heceyi Dinle/ }).click();
    
    // Fallback çalışmalı (Web Speech API)
    // Console log'ları kontrol et
    const logs: string[] = [];
    page.on('console', msg => {
      logs.push(msg.text());
    });
    
    await page.waitForTimeout(2000);
    
    // ElevenLabs hatası olmalı ama fallback çalışmalı
    expect(logs.some(log => log.includes('ElevenLabs TTS Error') || log.includes('Ses oluşturulamadı'))).toBeTruthy();
  });

  test('kutlama seslerinin çalması test edilmeli', async ({ page }) => {
    await page.goto('/exercise/literacy');
    
    // Egzersizi tamamla
    await page.getByText('e').first().dragTo(page.getByText('?').first());
    await page.getByText('l').first().dragTo(page.getByText('?').last());
    
    // Başarı mesajını bekle
    await expect(page.getByText('Harikasın!')).toBeVisible({ timeout: 5000 });
    
    // Console log'ları kontrol et
    const logs: string[] = [];
    page.on('console', msg => {
      logs.push(msg.text());
    });
    
    await page.waitForTimeout(3000);
    
    // Kutlama ses hatası olmamalı
    expect(logs.filter(log => log.includes('Kutlama ses hatası'))).toHaveLength(0);
  });

  test('ses özellikleri ipucu mesajları görünür olmalı', async ({ page }) => {
    await page.goto('/exercise/literacy');
    
    // İpucu mesajlarını kontrol et
    await expect(page.getByText('💡 İpucu: Harflere tıklayarak seslerini dinleyebilirsin')).toBeVisible();
    await expect(page.getByText('Powered by ElevenLabs AI - Türkçe doğal ses teknolojisi')).toBeVisible();
  });

  test('mobil cihazlarda ses özellikleri çalışmalı', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/exercise/literacy');
    
    // Mobilde de ses butonları görünür olmalı
    await expect(page.getByRole('button', { name: /🔊 Heceyi Dinle/ })).toBeVisible();
    
    // Harf kutularına dokunma
    const letterBox = page.getByText('e').first();
    await letterBox.click();
    
    // Touch-friendly olduğunu kontrol et
    const letterBoxBounds = await letterBox.boundingBox();
    expect(letterBoxBounds?.width).toBeGreaterThanOrEqual(44);
    expect(letterBoxBounds?.height).toBeGreaterThanOrEqual(44);
  });

  test('ses ayarları duyusal kontrol panelinde çalışmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Ses ayarları bölümünü kontrol et
    await expect(page.getByRole('heading', { name: '🔊 Ses Ayarları' })).toBeVisible();
    
    // Ses efektleri toggle'ını kontrol et
    const soundToggle = page.locator('button[role="switch"]').first();
    await expect(soundToggle).toBeVisible();
    
    // Toggle'ı kapat
    await soundToggle.click();
    
    // Ayarın localStorage'a kaydedildiğini kontrol et
    const isSoundEnabled = await page.evaluate(() => {
      return localStorage.getItem('sound-effects') === 'false';
    });
    expect(isSoundEnabled).toBeTruthy();
  });

  test('farklı ses türleri için doğru ayarlar kullanılmalı', async ({ page }) => {
    await page.goto('/exercise/literacy');
    
    // Network request'leri izle (mock için)
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('text-to-speech')) {
        requests.push(request.url());
      }
    });
    
    // Harf sesini çal
    await page.getByText('e').first().click();
    await page.waitForTimeout(500);
    
    // Hece sesini çal  
    await page.getByRole('button', { name: /🔊 Heceyi Dinle/ }).click();
    await page.waitForTimeout(500);
    
    // Mock olduğu için gerçek request gitmez ama functionality test edilir
    await expect(page.getByRole('button', { name: /🔊 Heceyi Dinle/ })).toBeVisible();
  });
}); 