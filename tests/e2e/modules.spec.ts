import { test, expect } from '@playwright/test';

test.describe('Kıvılcım Modül Seçimi', () => {
  test('modül sayfası doğru yüklenmeli', async ({ page }) => {
    await page.goto('/modules');
    
    // Sayfa başlığını kontrol et
    await expect(page.getByRole('heading', { name: 'Gelişim Modülleri' })).toBeVisible();
    
    // Açıklama metnini kontrol et
    await expect(page.getByText('Hangi alanda gelişmek istiyorsun?')).toBeVisible();
  });

  test('aktif modül kartı etkileşimli olmalı', async ({ page }) => {
    await page.goto('/modules');
    
    // Okuryazarlık modülünün aktif olduğunu kontrol et
    const literacyCard = page.getByRole('button', { name: /Okuryazarlık Becerileri/ });
    await expect(literacyCard).toBeVisible();
    await expect(literacyCard).toBeEnabled();
    
    // BAŞLA butonunun görünür olduğunu kontrol et
    await expect(page.getByRole('button', { name: 'BAŞLA' })).toBeVisible();
  });

  test('pasif modüller kilitli olmalı', async ({ page }) => {
    await page.goto('/modules');
    
    // Pasif modüllerin kilitli göründüğünü kontrol et
    await expect(page.getByText('Anlam ve Kelime Dağarcığı')).toBeVisible();
    await expect(page.getByText('Sosyal İletişim')).toBeVisible();
    await expect(page.getByText('Yazma ve İfade Etme')).toBeVisible();
    
    // YAKINDA etiketlerinin görünür olduğunu kontrol et
    const yakindaLabels = page.getByText('🔒 YAKINDA');
    await expect(yakindaLabels).toHaveCount(3);
    
    // Kilit ikonlarının görünür olduğunu kontrol et
    const lockIcons = page.getByText('🔒').nth(3); // 4. kilit ikonu (overlay'deki)
    await expect(lockIcons).toBeVisible();
  });

  test('aktif modüle tıklayınca egzersiz sayfasına gitmeli', async ({ page }) => {
    await page.goto('/modules');
    
    // Okuryazarlık modülüne tıkla
    await page.getByRole('button', { name: /Okuryazarlık Becerileri/ }).click();
    
    // Egzersiz sayfasına yönlendirildiğini kontrol et
    await expect(page).toHaveURL('/exercise/literacy');
    await expect(page.getByText('Harfleri Birleştirerek Hece Oluştur')).toBeVisible();
  });

  test('gelişim durumu göstergesi doğru olmalı', async ({ page }) => {
    await page.goto('/modules');
    
    // Gelişim durumu kartını kontrol et
    await expect(page.getByRole('heading', { name: '🎯 Gelişim Durumun' })).toBeVisible();
    
    // İstatistikleri kontrol et
    await expect(page.getByText('1')).toBeVisible(); // Aktif modül sayısı
    await expect(page.getByText('Aktif Modül')).toBeVisible();
    await expect(page.getByText('3')).toBeVisible(); // Yakında gelecek sayısı
    await expect(page.getByText('Yakında Gelecek')).toBeVisible();
    
    // Motivasyon mesajını kontrol et
    await expect(page.getByText('Okuryazarlık modülünü tamamladıktan sonra')).toBeVisible();
  });

  test('navigasyon butonları çalışmalı', async ({ page }) => {
    await page.goto('/modules');
    
    // Ana sayfaya dön butonu
    await page.getByRole('button', { name: '← Ana Sayfa' }).click();
    await expect(page).toHaveURL('/');
    
    // Tekrar modül sayfasına git
    await page.goto('/modules');
    
    // Ebeveyn paneli butonu
    await page.getByRole('button', { name: '⚙️' }).click();
    await expect(page).toHaveURL('/parent');
  });

  test('kıvılcım ipucu mesajı görünür olmalı', async ({ page }) => {
    await page.goto('/modules');
    
    // İpucu mesajını kontrol et
    await expect(page.getByText('İpucu:')).toBeVisible();
    await expect(page.getByText('Kıvılcım sana yol gösterecek')).toBeVisible();
    
    // Mikrofon ikonu görünür olmalı
    await expect(page.getByText('🎙️')).toBeVisible();
  });

  test('modül kartları animasyonlu yüklenmeli', async ({ page }) => {
    await page.goto('/modules');
    
    // Tüm modül kartlarının görünür olmasını bekle
    await expect(page.getByText('Okuryazarlık Becerileri')).toBeVisible();
    await expect(page.getByText('Anlam ve Kelime Dağarcığı')).toBeVisible();
    await expect(page.getByText('Sosyal İletişim')).toBeVisible();
    await expect(page.getByText('Yazma ve İfade Etme')).toBeVisible();
  });

  test('mobil responsive tasarım çalışmalı', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/modules');
    
    // Mobilde de tüm elementler görünür olmalı
    await expect(page.getByRole('heading', { name: 'Gelişim Modülleri' })).toBeVisible();
    await expect(page.getByRole('button', { name: '← Ana Sayfa' })).toBeVisible();
    await expect(page.getByRole('button', { name: '⚙️' })).toBeVisible();
    
    // Modül kartları mobilde de düzgün görünmeli
    await expect(page.getByText('Okuryazarlık Becerileri')).toBeVisible();
  });
}); 