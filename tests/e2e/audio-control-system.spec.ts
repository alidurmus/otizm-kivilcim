import { test, expect } from '@playwright/test';

test.describe('Ses Kontrol Sistemi - Admin Panel', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to admin panel
    await page.goto('/admin/elevenlabs-test');
  });

  test('Admin panelde ses kontrol sistemi görünmeli', async ({ page }) => {
    // Ses kontrol sistemi başlığı var mı?
    await expect(page.locator('h2').filter({ hasText: '🎵 Ses Dosyası Kontrol Sistemi' })).toBeVisible();
    
    // Açıklama metni görünüyor mu?
    await expect(page.locator('text=Kritik ses dosyalarının varlığını kontrol edin')).toBeVisible();
    
    // Ana kontrol butonu var mı?
    await expect(page.locator('button').filter({ hasText: 'Ses Dosyalarını Kontrol Et' })).toBeVisible();
  });

  test('Ses dosyası istatistikleri doğru gösterilmeli', async ({ page }) => {
    // Kontrol butonuna tıkla
    await page.click('button:has-text("Ses Dosyalarını Kontrol Et")');
    
    // İstatistiklerin yüklenmesini bekle
    await page.waitForTimeout(2000);
    
    // İstatistik kartları görünüyor mu?
    await expect(page.locator('text=Toplam Dosya')).toBeVisible();
    await expect(page.locator('text=Mevcut Dosyalar')).toBeVisible();
    await expect(page.locator('text=Eksik Dosyalar')).toBeVisible();
    await expect(page.locator('text=Başarı Oranı')).toBeVisible();
    
    // Sayısal değerler var mı? (46 kritik dosya bekleniyor)
    const totalFiles = await page.locator('[data-testid="total-files"]').textContent();
    expect(totalFiles).toContain('46');
  });

  test('Eksik dosyalar listesi görüntülenmeli', async ({ page }) => {
    // Kontrol et
    await page.click('button:has-text("Ses Dosyalarını Kontrol Et")');
    await page.waitForTimeout(2000);
    
    // Eksik dosyalar bölümü görünüyor mu?
    const missingFilesSection = page.locator('text=Eksik Dosyalar');
    await expect(missingFilesSection).toBeVisible();
    
    // Türkçe karakter dosyaları eksik olmalı
    await expect(page.locator('text=/audio/letters/ch.mp3')).toBeVisible(); // Ç
    await expect(page.locator('text=/audio/letters/gh.mp3')).toBeVisible(); // Ğ
    await expect(page.locator('text=/audio/letters/ii.mp3')).toBeVisible(); // I
    await expect(page.locator('text=/audio/letters/oo.mp3')).toBeVisible(); // Ö
    await expect(page.locator('text=/audio/letters/sh.mp3')).toBeVisible(); // Ş
    await expect(page.locator('text=/audio/letters/uu.mp3')).toBeVisible(); // Ü
  });

  test('Eksik dosya oluşturma butonu çalışmalı', async ({ page }) => {
    // Mock ElevenLabs API to avoid rate limiting
    await page.route('**/api/speech', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'audio/mpeg',
        body: Buffer.from('fake-audio-data'),
        headers: {
          'X-Voice-Used': 'Gülsu',
          'X-Content-Type': 'letter'
        }
      });
    });

    // Kontrol et
    await page.click('button:has-text("Ses Dosyalarını Kontrol Et")');
    await page.waitForTimeout(1000);
    
    // Eksik dosya oluşturma butonu görünüyor mu?
    const createButton = page.locator('button:has-text("Eksik Dosyaları Oluştur")');
    await expect(createButton).toBeVisible();
    
    // Butona tıkla
    await createButton.click();
    
    // İlerleme göstergesi görünmeli
    await expect(page.locator('text=Dosya oluşturma işlemi başlatıldı')).toBeVisible();
    
    // Console'da ilerleme logları olmalı
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('Creating:')) {
        console.log('✅ Progress log:', msg.text());
      }
    });
  });

  test('Rate limiting koruması çalışmalı', async ({ page }) => {
    // 429 hatası mock'la
    await page.route('**/api/speech', async route => {
      await route.fulfill({
        status: 429,
        body: JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded'
        })
      });
    });

    // Kontrol et ve oluşturmaya çalış
    await page.click('button:has-text("Ses Dosyalarını Kontrol Et")');
    await page.waitForTimeout(1000);
    
    const createButton = page.locator('button:has-text("Eksik Dosyaları Oluştur")');
    await createButton.click();
    
    // Rate limiting mesajı görünmeli
    await expect(page.locator('text=Rate limiting')).toBeVisible();
    await expect(page.locator('text=3 saniye bekleniyor')).toBeVisible();
  });

  test('Türkçe karakter URL mapping çalışmalı', async ({ page }) => {
    // Console loglarını dinle
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        logs.push(msg.text());
      }
    });
    
    await page.click('button:has-text("Ses Dosyalarını Kontrol Et")');
    await page.waitForTimeout(2000);
    
    // Türkçe karakter mapping'leri console'da olmalı
    const mappingLogs = logs.filter(log => 
      log.includes('ch.mp3') || 
      log.includes('gh.mp3') || 
      log.includes('ii.mp3') ||
      log.includes('oo.mp3') ||
      log.includes('sh.mp3') ||
      log.includes('uu.mp3')
    );
    
    expect(mappingLogs.length).toBeGreaterThan(0);
  });

  test('Başarı oranı hesaplaması doğru olmalı', async ({ page }) => {
    await page.click('button:has-text("Ses Dosyalarını Kontrol Et")');
    await page.waitForTimeout(2000);
    
    // 40/46 dosya mevcut = %87 başarı bekleniyor
    const successRate = await page.locator('[data-testid="success-rate"]').textContent();
    
    // %87 civarında olmalı (floating point toleransı ile)
    expect(successRate).toMatch(/8[67]%/);
  });

  test('Son kontrol zamanı gösterilmeli', async ({ page }) => {
    await page.click('button:has-text("Ses Dosyalarını Kontrol Et")');
    await page.waitForTimeout(1000);
    
    // Son kontrol zamanı format kontrolü
    await expect(page.locator('text=Son kontrol:')).toBeVisible();
    
    // Zaman formatı kontrol et (HH:MM:SS)
    const timeText = await page.locator('text=Son kontrol:').textContent();
    expect(timeText).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  test('Audio constants ile entegrasyon çalışmalı', async ({ page }) => {
    // Console'da audio constants referansları olmalı
    const logs: string[] = [];
    page.on('console', msg => logs.push(msg.text()));
    
    await page.click('button:has-text("Ses Dosyalarını Kontrol Et")');
    await page.waitForTimeout(2000);
    
    // Audio constants'dan gelen dosya yolları console'da olmalı
    const pathLogs = logs.filter(log => log.includes('/audio/letters/'));
    expect(pathLogs.length).toBeGreaterThan(0);
  });

  test('Static file önceliği çalışmalı', async ({ page }) => {
    // Mevcut dosyalar için static file check olmalı
    await page.click('button:has-text("Ses Dosyalarını Kontrol Et")');
    await page.waitForTimeout(2000);
    
    // A harfi gibi mevcut dosyalar için ✅ işareti olmalı
    await expect(page.locator('text=✅').first()).toBeVisible();
    
    // Eksik dosyalar için ❌ işareti olmalı
    await expect(page.locator('text=❌').first()).toBeVisible();
  });

});

test.describe('Ses Sistemi Genel Fonksiyonellik', () => {
  
  test('ElevenLabs SDK entegrasyonu çalışmalı', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/speech', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'audio/mpeg',
        body: Buffer.from('mock-audio-data'),
        headers: {
          'X-Voice-Used': 'Gülsu',
          'X-Response-Time': '250'
        }
      });
    });

    await page.goto('/exercise/alphabet-reading');
    
    // Bir harf butonuna tıkla
    const letterButton = page.locator('button').filter({ hasText: 'A' }).first();
    await letterButton.click();
    
    // Ses çalma işlemi başlamalı
    await page.waitForTimeout(1000);
    
    // Console'da ses işlemi logları olmalı
    const logs: string[] = [];
    page.on('console', msg => logs.push(msg.text()));
    
    const audioLogs = logs.filter(log => 
      log.includes('🔊 Speaking:') || 
      log.includes('ElevenLabs')
    );
    
    expect(audioLogs.length).toBeGreaterThan(0);
  });

  test('Hibrit fallback sistemi çalışmalı', async ({ page }) => {
    // İlk API call'u başarısız yap
    let callCount = 0;
    await page.route('**/api/speech', async route => {
      callCount++;
      if (callCount === 1) {
        // İlk call başarısız
        await route.fulfill({ status: 500 });
      } else {
        // İkinci call başarılı (fallback)
        await route.fulfill({
          status: 200,
          contentType: 'audio/mpeg',
          body: Buffer.from('fallback-audio-data')
        });
      }
    });

    await page.goto('/exercise/alphabet-reading');
    
    const letterButton = page.locator('button').filter({ hasText: 'A' }).first();
    await letterButton.click();
    
    await page.waitForTimeout(2000);
    
    // Fallback mesajı console'da olmalı
    const logs: string[] = [];
    page.on('console', msg => logs.push(msg.text()));
    
    const fallbackLogs = logs.filter(log => 
      log.includes('fallback') || 
      log.includes('Web Speech API')
    );
    
    expect(fallbackLogs.length).toBeGreaterThan(0);
  });

}); 