import { test, expect } from '@playwright/test';

test.describe('Kıvılcım Modül Seçimi', () => {
  test('modül sayfası doğru yüklenmeli', async ({ page }) => {
    await page.goto('/modules');
    
        // Sayfa başlığını kontrol et - Mobile Safari için timeout artırıldı
    await expect(page.getByRole('heading', { name: 'Gelişim Modülleri' })).toBeVisible({ timeout: 10000 });

    // Açıklama metnini kontrol et
    await expect(page.getByText('Hangi alanda gelişmek istiyorsun?')).toBeVisible({ timeout: 10000 });
  });

  test('modül kartları etkileşimli olmalı', async ({ page }) => {
    await page.goto('/modules');
    
    // Okuryazarlık modülünün görünür olduğunu kontrol et - gerçek sayfada heading olarak
    await expect(page.getByRole('heading', { name: 'Okuryazarlık Becerileri' })).toBeVisible();
    
    // Modül açıklamasının görünür olduğunu kontrol et
    await expect(page.getByText('Harf tanıma, hece oluşturma ve okuma becerilerini geliştirin')).toBeVisible();
    
    // BAŞLA butonlarının görünür olduğunu kontrol et
    const baslaButtons = page.getByRole('button', { name: 'BAŞLA' });
    await expect(baslaButtons.first()).toBeVisible();
    await expect(baslaButtons.first()).toBeEnabled();
  });

  test('tüm modüller aktif olmalı', async ({ page }) => {
    await page.goto('/modules');
    
    // Tüm modüllerin aktif olduğunu kontrol et - gerçek sayfada tüm modüller BAŞLA butonu ile aktif (heading olarak)
    await expect(page.getByRole('heading', { name: 'Anlam ve Kelime Dağarcığı' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sosyal İletişim' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Yazma ve İfade Etme' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Temel Kavramlar' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Müzik Dinleme Odası' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Video İzleme Odası' })).toBeVisible();
    
    // Tüm modüllerde BAŞLA butonlarının olduğunu kontrol et
    const baslaButtons = page.getByRole('button', { name: 'BAŞLA' });
    await expect(baslaButtons).toHaveCount(7); // 7 aktif modül
  });

  test('modül BAŞLA butonuna tıklayınca egzersiz sayfasına gitmeli', async ({ page }) => {
    await page.goto('/modules');
    
    // İlk BAŞLA butonuna tıkla (Okuryazarlık Becerileri modülü)
    const baslaButtons = page.getByRole('button', { name: 'BAŞLA' });
    await baslaButtons.first().click();
    
    // Egzersiz sayfasına yönlendirildiğini kontrol et - timeout artırıldı
    await expect(page).toHaveURL('/exercise/literacy', { timeout: 10000 });
  });

  test('gelişim durumu göstergesi doğru olmalı', async ({ page }) => {
    await page.goto('/modules');
    
    // Gelişim durumu kartını kontrol et
    await expect(page.getByRole('heading', { name: '🎯 Gelişim Durumun' })).toBeVisible();
    
    // İstatistikleri kontrol et - gerçek sayfadaki değerler (daha spesifik locator)
    await expect(page.locator('div.text-2xl.font-bold').filter({ hasText: '7' })).toBeVisible(); // Aktif modül sayısı
    await expect(page.locator('div.text-sm.text-adaptive-secondary').filter({ hasText: 'Aktif Modül' })).toBeVisible();
    await expect(page.locator('div.text-2xl.font-bold').filter({ hasText: '0' })).toBeVisible(); // Yakında gelecek sayısı
    await expect(page.locator('div.text-sm.text-adaptive-secondary').filter({ hasText: 'Yakında Gelecek' })).toBeVisible();
    
    // Motivasyon mesajını kontrol et - gerçek sayfadaki mesaj
    await expect(page.getByText('7 modül aktif! Herhangi birini seçerek öğrenmeye başlayabilirsin! 🌟')).toBeVisible();
  });

  test('navigasyon butonları çalışmalı', async ({ page }) => {
    await page.goto('/modules');
    
        // Ana sayfaya dön butonu - timeout artırıldı
    await page.getByRole('button', { name: '← Ana Sayfa' }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // Tekrar modül sayfasına git
    await page.goto('/modules');

    // Ebeveyn paneli butonu - gerçek sayfadaki text
    await page.getByRole('button', { name: 'Ebeveyn Paneli' }).click();
    await expect(page).toHaveURL('/parent', { timeout: 10000 });
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
    await expect(page.getByRole('button', { name: 'Ebeveyn Paneli' })).toBeVisible();
    
    // Modül kartları mobilde de düzgün görünmeli
    await expect(page.getByText('Okuryazarlık Becerileri')).toBeVisible();
  });
}); 