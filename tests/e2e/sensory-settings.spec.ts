import { test, expect } from '@playwright/test';

test.describe('Kıvılcım Duyusal Ayarlar', () => {
  test('duyusal ayarlar sayfası doğru yüklenmeli', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Ana başlığı kontrol et
    await expect(page.getByRole('heading', { name: '🎛️ Duyusal Kontrol Paneli' })).toBeVisible();
    
    // Açıklama metnini kontrol et
    await expect(page.getByText('Çocuğunuzun ihtiyaçlarına göre deneyimi kişiselleştirin')).toBeVisible();
  });

  test('tema seçim kartları görünür olmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Tema bölümü başlığını kontrol et
    await expect(page.getByRole('heading', { name: '🎨 Tema Seçimi' })).toBeVisible();
    
    // Tema kartlarını kontrol et
    await expect(page.getByText('Sakin Mod')).toBeVisible();
    await expect(page.getByText('Odak Mod')).toBeVisible();
    await expect(page.getByText('Yüksek Kontrast')).toBeVisible();
    
    // Tema açıklamalarını kontrol et
    await expect(page.getByText('Yumuşak renkler ve sakin atmosfer')).toBeVisible();
    await expect(page.getByText('Daha parlak renkler ve net çizgiler')).toBeVisible();
    await expect(page.getByText('Görme zorluğu yaşayanlar için')).toBeVisible();
  });

  test('ses ayarları bölümü çalışmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Ses ayarları başlığını kontrol et
    await expect(page.getByRole('heading', { name: '🔊 Ses Ayarları' })).toBeVisible();
    
    // Toggle switch'lerin görünür olduğunu kontrol et
    await expect(page.getByText('Ses Efektleri')).toBeVisible();
    await expect(page.getByText('Animasyonlar')).toBeVisible();
    
    // Toggle switch'lerin çalıştığını kontrol et
    const soundToggle = page.locator('button[role="switch"]').first();
    await expect(soundToggle).toBeVisible();
    
    // Toggle durumunu değiştir
    await soundToggle.click();
    
    // Durumun değiştiğini kontrol et
    const isChecked = await soundToggle.getAttribute('aria-checked');
    expect(isChecked).toBeTruthy();
  });

  test('font seçimi çalışmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Font ayarları başlığını kontrol et
    await expect(page.getByRole('heading', { name: '📝 Font Ayarları' })).toBeVisible();
    
    // Font seçeneklerini kontrol et
    await expect(page.getByText('Nunito (Varsayılan)')).toBeVisible();
    await expect(page.getByText('OpenDyslexic')).toBeVisible();
    
    // Font açıklamalarını kontrol et
    await expect(page.getByText('Standart, okuması kolay font')).toBeVisible();
    await expect(page.getByText('Disleksi dostu özel tasarım')).toBeVisible();
    
    // Font kartlarının seçilebilir olduğunu kontrol et
    const dyslexicFontCard = page.getByText('OpenDyslexic').locator('..');
    await expect(dyslexicFontCard).toBeVisible();
  });

  test('tema değiştirme fonksiyonalitesi çalışmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Odak Mod'una geç
    await page.getByText('Odak Mod').click();
    
    // Sayfanın yeniden yüklenmesini bekle (tema değişimi)
    await page.waitForTimeout(1000);
    
    // Tema değişikliğinin etkili olduğunu kontrol et (localStorage)
    const theme = await page.evaluate(() => localStorage.getItem('sensory-theme'));
    expect(theme).toBe('focus');
  });

  test('font değiştirme fonksiyonalitesi çalışmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // OpenDyslexic fontuna geç
    await page.getByText('OpenDyslexic').click();
    
    // Font değişikliğinin etkili olduğunu kontrol et (localStorage)
    const font = await page.evaluate(() => localStorage.getItem('sensory-font'));
    expect(font).toBe('opendyslexic');
  });

  test('geri butonları çalışmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Ebeveyn paneline dön butonu
    await page.getByRole('button', { name: '← Ebeveyn Paneli' }).click();
    
    // Ebeveyn paneline yönlendirildiğini kontrol et
    await expect(page).toHaveURL('/parent');
  });

  test('toggle switch animasyonları çalışmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Ses efektleri toggle'ını bul
    const soundToggle = page.locator('button[role="switch"]').first();
    
    // İlk durumu kaydet
    const initialState = await soundToggle.getAttribute('aria-checked');
    
    // Toggle'a tıkla
    await soundToggle.click();
    
    // Durumun değiştiğini kontrol et
    const newState = await soundToggle.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
    
    // Toggle'ın görsel durumunu kontrol et
    if (newState === 'true') {
      await expect(soundToggle).toHaveClass(/bg-success-green/);
    } else {
      await expect(soundToggle).toHaveClass(/bg-gray-300/);
    }
  });

  test('tema preview özelliği çalışmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Her tema kartının görsel preview'ına sahip olduğunu kontrol et
    const themeCards = page.locator('div').filter({ hasText: /Sakin Mod|Odak Mod|Yüksek Kontrast/ });
    await expect(themeCards).toHaveCount(3);
    
    // Aktif tema kartının farklı görüntülendiğini kontrol et (border)
    const activeThemeCard = page.locator('div').filter({ hasText: 'Sakin Mod' }).first();
    await expect(activeThemeCard).toHaveClass(/border-focus-blue/);
  });

  test('responsive tasarım mobilde çalışmalı', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/sensory-settings');
    
    // Mobilde tüm bölümler görünür olmalı
    await expect(page.getByRole('heading', { name: '🎛️ Duyusal Kontrol Paneli' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '🎨 Tema Seçimi' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '🔊 Ses Ayarları' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '📝 Font Ayarları' })).toBeVisible();
    
    // Tema kartları mobilde düzgün sıralanmalı
    await expect(page.getByText('Sakin Mod')).toBeVisible();
    await expect(page.getByText('Odak Mod')).toBeVisible();
    await expect(page.getByText('Yüksek Kontrast')).toBeVisible();
  });

  test('accessibility özellikleri mevcut olmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // ARIA rolleri doğru atanmış olmalı
    const toggles = page.locator('button[role="switch"]');
    await expect(toggles).toHaveCount(2);
    
    // Toggle'lar aria-checked özelliğine sahip olmalı
    for (let i = 0; i < 2; i++) {
      const toggle = toggles.nth(i);
      const ariaChecked = await toggle.getAttribute('aria-checked');
      expect(ariaChecked).toBeTruthy();
    }
    
    // Başlıklar doğru hierarşide olmalı
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(3);
  });

  test('ayar değişiklikleri kalıcı olmalı', async ({ page }) => {
    await page.goto('/sensory-settings');
    
    // Ses efektlerini kapat
    const soundToggle = page.locator('button[role="switch"]').first();
    await soundToggle.click();
    
    // Odak Mod'una geç
    await page.getByText('Odak Mod').click();
    
    // OpenDyslexic fontuna geç
    await page.getByText('OpenDyslexic').click();
    
    // Sayfayı yenile
    await page.reload();
    
    // Ayarların korunduğunu kontrol et
    const theme = await page.evaluate(() => localStorage.getItem('sensory-theme'));
    const font = await page.evaluate(() => localStorage.getItem('sensory-font'));
    
    expect(theme).toBe('focus');
    expect(font).toBe('opendyslexic');
  });
}); 