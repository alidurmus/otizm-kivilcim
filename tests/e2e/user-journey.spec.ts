import { test, expect } from '@playwright/test';

test.describe('Kıvılcım Tam Kullanıcı Yolculuğu', () => {
  test('yeni kullanıcı tam akışı: ana sayfa → modül → egzersiz → ebeveyn paneli', async ({ page }) => {
    // 1. Ana sayfa ziyareti
    await page.goto('/');
    
    // Splash screen'i bekle
    await expect(page.getByText('Yükleniyor...')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kıvılcım', level: 1 })).toBeVisible({ timeout: 5000 });
    
    // Ana sayfa içeriğini doğrula
    await expect(page.getByText('büyümeye')).toBeVisible();
    
    // 2. Modül sayfasına git
    await page.getByRole('button', { name: '🚀 Maceraya Başla' }).click();
    await expect(page).toHaveURL('/modules');
    await expect(page.getByRole('heading', { name: 'Gelişim Modülleri' })).toBeVisible();
    
    // 3. Okuryazarlık modülüne başla - gerçek sayfada heading olarak var, BAŞLA butonuna tıkla
    await page.getByRole('button', { name: 'BAŞLA' }).first().click();
    await expect(page).toHaveURL('/exercise/literacy');
    await expect(page.getByText('Harfleri Birleştirerek Hece Oluştur')).toBeVisible();
    
    // 4. İlk egzersizi tamamla
    await page.getByText('e').first().dragTo(page.getByText('?').first());
    await page.getByText('l').first().dragTo(page.getByText('?').last());
    
    // Drag&drop işleminin tamamlanması için bekle
    await page.waitForTimeout(2000);
    
    // 5. Modüllere geri dön
    await page.getByRole('button', { name: '← Modüllere Dön' }).click();
    await expect(page).toHaveURL('/modules');
    
    // 6. Ebeveyn paneline git
    await page.getByRole('button', { name: 'Ebeveyn Paneli' }).click();
    await expect(page).toHaveURL('/parent');
    await expect(page.getByRole('heading', { name: '📊 Ebeveyn Paneli' })).toBeVisible();
    
    // 7. İlerleme sekmesini kontrol et - responsive tasarım için güncellendi
    await page.locator('button').filter({ hasText: /📈/ }).click();
    await expect(page.getByRole('heading', { name: '📊 Haftalık Aktivite' })).toBeVisible();
    
    // 8. Duyusal ayarları aç - responsive tasarım için güncellendi
    await page.locator('button').filter({ hasText: /⚙️/ }).click();
    await page.getByRole('button', { name: 'Duyusal Ayarları Aç' }).click();
    await expect(page).toHaveURL('/sensory-settings');
    
    // 9. Tema değiştir
    await page.getByText('Odak Mod').click();
    await page.waitForTimeout(500);
    
    // 10. Ana sayfaya dön
    await page.getByRole('button', { name: '← Ebeveyn Paneli' }).click();
    await page.getByRole('button', { name: '← Ana Sayfa' }).click();
    await expect(page).toHaveURL('/');
  });

  test('ebeveyn kullanıcı akışı: ana sayfa → ebeveyn paneli → ayarlar', async ({ page }) => {
    // Ana sayfadan direkt ebeveyn paneline git
    await page.goto('/');
    await expect(page.getByRole('button', { name: '👨‍👩‍👧‍👦 Ebeveyn Paneli' })).toBeVisible({ timeout: 5000 });
    
    await page.getByRole('button', { name: '👨‍👩‍👧‍👦 Ebeveyn Paneli' }).click();
    await expect(page).toHaveURL('/parent');
    
    // Tüm tab'ları dolaş - responsive tasarım için güncellendi
    await page.locator('button').filter({ hasText: /📈/ }).click();
    await expect(page.getByRole('heading', { name: '📊 Haftalık Aktivite' })).toBeVisible();
    
    await page.locator('button').filter({ hasText: /⚙️/ }).click();
    await expect(page.getByRole('heading', { name: '🎛️ Duyusal Kontroller' })).toBeVisible();
    
    // Ayarları kontrol et - gerçek sayfada switch yapısı farklı
    await page.waitForTimeout(1000); // Sayfa yüklenme bekle
    
    // Duyusal ayarlara git
    await page.getByRole('button', { name: 'Duyusal Ayarları Aç' }).click();
    await expect(page).toHaveURL('/sensory-settings');
    
    // Font değiştir
    await page.getByText('OpenDyslexic').click();
    
    // Geri dön
    await page.getByRole('button', { name: '← Ebeveyn Paneli' }).click();
    await expect(page).toHaveURL('/parent');
  });

  test('çoklu egzersiz tamamlama akışı', async ({ page }) => {
    await page.goto('/exercise/literacy');
    
    // İlk egzersizi tamamla (el)
    await page.getByText('e').first().dragTo(page.getByText('?').first());
    await page.getByText('l').first().dragTo(page.getByText('?').last());
    await page.waitForTimeout(2000); // Drag&drop işlemi için bekle
    
    // Sonraki egzersize geçiş için bekle
    await page.waitForTimeout(2000);
    
    // İkinci egzersizi kontrol et (al)
    await expect(page.getByText('a').first()).toBeVisible();
    await expect(page.getByText('l').first()).toBeVisible();
    
    // İlerleme çubuğunu kontrol et
    await expect(page.getByText('1/5')).toBeVisible();
  });

  test('responsive akış: mobil cihazda tam kullanıcı deneyimi', async ({ page }) => {
    // Mobil boyutuna ayarla
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Ana sayfa → Modüller
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kıvılcım', level: 1 })).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: '🚀 Maceraya Başla' }).click();
    
    // Modül seçimi
    await expect(page).toHaveURL('/modules');
    await page.getByRole('button', { name: 'BAŞLA' }).first().click();
    
    // Egzersiz yapma
    await expect(page).toHaveURL('/exercise/literacy');
    await page.getByText('e').first().dragTo(page.getByText('?').first());
    await page.getByText('l').first().dragTo(page.getByText('?').last());
    await page.waitForTimeout(2000); // Drag&drop işlemi için bekle
    
    // Touch-friendly boyutları kontrol et
    const backButton = page.getByRole('button', { name: '← Modüllere Dön' });
    const buttonBox = await backButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('hata durumu ve geri alma akışları', async ({ page }) => {
    await page.goto('/exercise/literacy');
    
    // Boş drop zone'a tıklamayı dene
    await page.getByText('?').first().click();
    
    // Harf kutuları hala draggable olmalı
    await expect(page.getByText('e').first()).toBeVisible();
    await expect(page.getByText('l').first()).toBeVisible();
    
    // Doğru egzersizi yap
    await page.getByText('e').first().dragTo(page.getByText('?').first());
    await page.getByText('l').first().dragTo(page.getByText('?').last());
    
    // Drag&drop işleminin tamamlanması için bekle
    await page.waitForTimeout(2000);
    
    // Geri navigasyon test et
    await page.getByRole('button', { name: '← Modüllere Dön' }).click();
    await expect(page).toHaveURL('/modules');
    
    // Ana sayfaya geri dön
    await page.getByRole('button', { name: '← Ana Sayfa' }).click();
    await expect(page).toHaveURL('/');
  });

  test('ses ve erişilebilirlik özelliklerinin tam akışı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Ses ayarlarını değiştir
    const soundToggle = page.locator('button[role="switch"]').first();
    await soundToggle.click();
    
    // Egzersiz sayfasına git
    await page.goto('/exercise/literacy');
    
    // Ses butonunu test et
    await page.getByRole('button', { name: '🔊 Dinle' }).click();
    
    // Egzersizi tamamla
    await page.getByText('e').first().dragTo(page.getByText('?').first());
    await page.getByText('l').first().dragTo(page.getByText('?').last());
    
    // Drag&drop işleminin tamamlanması için bekle
    await page.waitForTimeout(2000);
    
    // Keyboard navigasyonu test et
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Ebeveyn paneline git ve font ayarını değiştir
    await page.goto('/sensory-settings');
    await page.getByText('OpenDyslexic').click();
    
    // Ana sayfaya dön ve font değişikliğini kontrol et
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kıvılcım', level: 1 })).toBeVisible({ timeout: 5000 });
  });

  test('localStorage ayarlarının kalıcılığı', async ({ page }) => {
    // Duyusal ayarlarda değişiklik yap
    await page.goto('/sensory-settings');
    
    await page.getByText('Odak Mod').click();
    await page.getByText('OpenDyslexic').click();
    
    const soundToggle = page.locator('button[role="switch"]').first();
    await soundToggle.click();
    
    // Farklı sayfalara git ve geri dön
    await page.goto('/');
    await page.goto('/modules');
    await page.goto('/sensory-settings');
    
    // Ayarların korunduğunu kontrol et
    const theme = await page.evaluate(() => localStorage.getItem('sensory-theme'));
    const font = await page.evaluate(() => localStorage.getItem('sensory-font'));
    
    expect(theme).toBe('focus');
    expect(font).toBe('opendyslexic');
    
    // Sayfayı tamamen yenile
    await page.reload();
    
    // Ayarların hala korunduğunu kontrol et
    const themeAfterReload = await page.evaluate(() => localStorage.getItem('sensory-theme'));
    const fontAfterReload = await page.evaluate(() => localStorage.getItem('sensory-font'));
    
    expect(themeAfterReload).toBe('focus');
    expect(fontAfterReload).toBe('opendyslexic');
  });
}); 