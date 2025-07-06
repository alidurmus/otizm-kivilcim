import { test, expect } from '@playwright/test';

test.describe('Kıvılcım Ana Sayfa', () => {
  test('sayfa doğru şekilde yüklenmeli', async ({ page }) => {
    await page.goto('/');
    
    // Sayfa başlığını kontrol et
    await expect(page).toHaveTitle('Kıvılcım - Otizm Eğitim Platformu');
    
    // Ana başlığın görünür olmasını bekle (splash screen sonrası)
    await expect(page.getByRole('heading', { name: 'Kıvılcım', level: 1 })).toBeVisible({ timeout: 10000 });
    
    // Alt başlığı kontrol et
    await expect(page.getByText('Otizm Dostu Öğrenme Platformu')).toBeVisible({ timeout: 10000 });
  });

  test('splash screen animasyonu çalışmalı', async ({ page }) => {
    await page.goto('/');
    
    // İlk yükleme mesajını kontrol et
    await expect(page.getByText('Yükleniyor...')).toBeVisible({ timeout: 10000 });
    
    // Animasyon tamamlandıktan sonra ana içeriğin görünmesini bekle
    await expect(page.getByText('büyümeye')).toBeVisible({ timeout: 10000 });
  });

  test('maceraya başla butonu çalışmalı', async ({ page }) => {
    await page.goto('/');
    
    // Sayfa tam yüklenmesini bekle
    await page.waitForLoadState('networkidle');
    
    // Splash screen'in bitmesini bekle - çok uzun timeout
    await expect(page.getByRole('button', { name: '🚀 Maceraya Başla' })).toBeVisible({ timeout: 30000 });
    
    // Butona tıkla
    await page.getByRole('button', { name: '🚀 Maceraya Başla' }).click();
    
    // Modül sayfasına yönlendirildiğini kontrol et
    await expect(page).toHaveURL('/modules', { timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Gelişim Modülleri' })).toBeVisible({ timeout: 15000 });
  });

  test('ebeveyn paneli butonu çalışmalı', async ({ page }) => {
    await page.goto('/');
    
    // Sayfa tam yüklenmesini bekle
    await page.waitForLoadState('networkidle');
    
    // Splash screen'in bitmesini bekle
    await expect(page.getByRole('button', { name: '👨‍👩‍👧‍👦 Ebeveyn Paneli' })).toBeVisible({ timeout: 30000 });
    
    // Butona tıkla
    await page.getByRole('button', { name: '👨‍👩‍👧‍👦 Ebeveyn Paneli' }).click();
    
    // Ebeveyn paneline yönlendirildiğini kontrol et - Firefox için daha uzun timeout
    await expect(page).toHaveURL('/parent', { timeout: 20000 });
    await expect(page.getByRole('heading', { name: '📊 Ebeveyn Paneli' })).toBeVisible({ timeout: 20000 });
  });

  test('özellik kartları görünür olmalı', async ({ page }) => {
    await page.goto('/');
    
    // Ana içeriğin yüklenmesini bekle
    await expect(page.getByText('büyümeye')).toBeVisible({ timeout: 10000 });
    
    // Özellik kartlarını kontrol et
    await expect(page.getByRole('heading', { name: 'Modüler Öğrenme' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Kişisel Gelişim' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Duyusal Kontrol' })).toBeVisible({ timeout: 10000 });
    
    // Özellik açıklamalarını kontrol et
    await expect(page.getByText('Okuryazarlık, sosyal iletişim ve daha fazlası')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Her çocuğun ihtiyacına özel tasarım')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Kişiselleştirilebilir deneyim ayarları')).toBeVisible({ timeout: 10000 });
  });

  test('responsive tasarım mobilde çalışmalı', async ({ page }) => {
    // Mobil boyutuna ayarla
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Ana içeriğin mobile responsive olduğunu kontrol et
    await expect(page.getByRole('heading', { name: 'Kıvılcım', level: 1 })).toBeVisible({ timeout: 15000 });
    
    // Butonların mobilde de çalıştığını kontrol et
    const startButton = page.getByRole('button', { name: '🚀 Maceraya Başla' });
    await expect(startButton).toBeVisible({ timeout: 15000 });
    
    // Touch-friendly boyutlarda olduğunu kontrol et (minimum 44px)
    const buttonBox = await startButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
  });
}); 