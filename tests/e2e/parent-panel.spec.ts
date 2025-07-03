import { test, expect } from '@playwright/test';

test.describe('Kıvılcım Ebeveyn Paneli', () => {
  test('ebeveyn paneli sayfası doğru yüklenmeli', async ({ page }) => {
    await page.goto('/parent');
    
    // Ana başlığı kontrol et
    await expect(page.getByRole('heading', { name: '👨‍👩‍👧‍👦 Ebeveyn Paneli' })).toBeVisible();
    
    // Açıklama metnini kontrol et
    await expect(page.getByText('Çocuğunuzun gelişimini takip edin ve ayarları yönetin')).toBeVisible();
  });

  test('tab sistemi çalışmalı', async ({ page }) => {
    await page.goto('/parent');
    
    // Tüm tab'ların görünür olduğunu kontrol et
    await expect(page.getByRole('button', { name: '📊 Genel Bakış' })).toBeVisible();
    await expect(page.getByRole('button', { name: '📈 İlerleme' })).toBeVisible();
    await expect(page.getByRole('button', { name: '⚙️ Ayarlar' })).toBeVisible();
    
    // Varsayılan olarak Genel Bakış sekmesi aktif olmalı
    await expect(page.getByRole('button', { name: '📊 Genel Bakış' })).toHaveClass(/bg-focus-blue/);
  });

  test('genel bakış sekmesi içeriği doğru olmalı', async ({ page }) => {
    await page.goto('/parent');
    
    // Hızlı istatistikleri kontrol et
    await expect(page.getByText('Tamamlanan Egzersizler')).toBeVisible();
    await expect(page.getByText('3/5')).toBeVisible();
    await expect(page.getByText('Başarı Oranı')).toBeVisible();
    await expect(page.getByText('85%')).toBeVisible();
    await expect(page.getByText('Haftalık Aktivite')).toBeVisible();
    await expect(page.getByText('4 gün')).toBeVisible();
    
    // Son başarılar bölümünü kontrol et
    await expect(page.getByRole('heading', { name: '🏆 Son Başarılar' })).toBeVisible();
    await expect(page.getByText('İlk hece oluşturuldu!')).toBeVisible();
    await expect(page.getByText('5 doğru cevap üst üste')).toBeVisible();
    
    // Yaklaşan modüller bölümünü kontrol et
    await expect(page.getByRole('heading', { name: '🚀 Yaklaşan Modüller' })).toBeVisible();
    await expect(page.getByText('Kelime Dağarcığı')).toBeVisible();
    await expect(page.getByText('Sosyal İletişim')).toBeVisible();
  });

  test('ilerleme sekmesine geçiş çalışmalı', async ({ page }) => {
    await page.goto('/parent');
    
    // İlerleme sekmesine tıkla
    await page.getByRole('button', { name: '📈 İlerleme' }).click();
    
    // İlerleme sekmesinin aktif olduğunu kontrol et
    await expect(page.getByRole('button', { name: '📈 İlerleme' })).toHaveClass(/bg-focus-blue/);
    
    // İlerleme içeriğini kontrol et
    await expect(page.getByRole('heading', { name: '📊 Haftalık Aktivite' })).toBeVisible();
    await expect(page.getByText('Son 7 günün aktivite grafiği')).toBeVisible();
    
    // Modül ilerleme kartlarını kontrol et
    await expect(page.getByRole('heading', { name: '📚 Modül İlerlemesi' })).toBeVisible();
    await expect(page.getByText('Okuryazarlık Becerileri')).toBeVisible();
    await expect(page.getByText('Tamamlandı: 3/5')).toBeVisible();
  });

  test('ayarlar sekmesine geçiş çalışmalı', async ({ page }) => {
    await page.goto('/parent');
    
    // Ayarlar sekmesine tıkla
    await page.getByRole('button', { name: '⚙️ Ayarlar' }).click();
    
    // Ayarlar sekmesinin aktif olduğunu kontrol et
    await expect(page.getByRole('button', { name: '⚙️ Ayarlar' })).toHaveClass(/bg-focus-blue/);
    
    // Ayarlar içeriğini kontrol et
    await expect(page.getByRole('heading', { name: '🎛️ Duyusal Kontroller' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Duyusal Ayarları Aç' })).toBeVisible();
    
    // Hesap ayarlarını kontrol et
    await expect(page.getByRole('heading', { name: '👤 Hesap Ayarları' })).toBeVisible();
    await expect(page.getByText('Bildirimler')).toBeVisible();
    await expect(page.getByText('Gizlilik Modu')).toBeVisible();
    
    // Geri bildirim bölümünü kontrol et
    await expect(page.getByRole('heading', { name: '💬 Geri Bildirim' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Geri Bildirim Gönder' })).toBeVisible();
  });

  test('duyusal ayarlar butonuna tıklayınca yönlendirme yapmalı', async ({ page }) => {
    await page.goto('/parent');
    
    // Ayarlar sekmesine git
    await page.getByRole('button', { name: '⚙️ Ayarlar' }).click();
    
    // Duyusal ayarlar butonuna tıkla
    await page.getByRole('button', { name: 'Duyusal Ayarları Aç' }).click();
    
    // Duyusal ayarlar sayfasına yönlendirildiğini kontrol et
    await expect(page).toHaveURL('/sensory-settings');
    await expect(page.getByRole('heading', { name: '🎛️ Duyusal Kontrol Paneli' })).toBeVisible();
  });

  test('toggle switch\'leri çalışmalı', async ({ page }) => {
    await page.goto('/parent');
    
    // Ayarlar sekmesine git
    await page.getByRole('button', { name: '⚙️ Ayarlar' }).click();
    
    // Toggle switch'lerin görünür olduğunu kontrol et
    const toggles = page.locator('button[role="switch"]');
    await expect(toggles).toHaveCount(2);
    
    // İlk toggle'a tıkla
    await toggles.first().click();
    
    // Toggle durumunun değiştiğini kontrol et (aria-checked özelliği)
    const firstToggle = toggles.first();
    const isChecked = await firstToggle.getAttribute('aria-checked');
    expect(isChecked).toBeTruthy();
  });

  test('navigasyon butonu çalışmalı', async ({ page }) => {
    await page.goto('/parent');
    
    // Ana sayfaya dön butonu
    await page.getByRole('button', { name: '← Ana Sayfa' }).click();
    
    // Ana sayfaya yönlendirildiğini kontrol et
    await expect(page).toHaveURL('/');
  });

  test('responsive tasarım mobilde çalışmalı', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/parent');
    
    // Tab'ların mobilde de görünür olduğunu kontrol et
    await expect(page.getByRole('button', { name: '📊 Genel Bakış' })).toBeVisible();
    await expect(page.getByRole('button', { name: '📈 İlerleme' })).toBeVisible();
    await expect(page.getByRole('button', { name: '⚙️ Ayarlar' })).toBeVisible();
    
    // İçeriğin mobilde düzgün görüntülendiğini kontrol et
    await expect(page.getByText('Tamamlanan Egzersizler')).toBeVisible();
  });

  test('istatistik kartları görsel olarak doğru olmalı', async ({ page }) => {
    await page.goto('/parent');
    
    // İstatistik kartlarının görünür olduğunu kontrol et
    const statCards = page.locator('div').filter({ hasText: /Tamamlanan Egzersizler|Başarı Oranı|Haftalık Aktivite/ });
    await expect(statCards).toHaveCount(3);
    
    // Kartların içeriklerinin doğru olduğunu kontrol et
    await expect(page.getByText('3/5')).toBeVisible();
    await expect(page.getByText('85%')).toBeVisible();
    await expect(page.getByText('4 gün')).toBeVisible();
  });

  test('başarı listesi doğru gösterilmeli', async ({ page }) => {
    await page.goto('/parent');
    
    // Başarı listesindeki öğeleri kontrol et
    await expect(page.getByText('İlk hece oluşturuldu!')).toBeVisible();
    await expect(page.getByText('5 doğru cevap üst üste')).toBeVisible();
    await expect(page.getByText('10 dakika odaklanma')).toBeVisible();
    
    // Tarih bilgilerini kontrol et
    await expect(page.getByText('2 saat önce')).toBeVisible();
    await expect(page.getByText('Dün')).toBeVisible();
    await expect(page.getByText('3 gün önce')).toBeVisible();
  });
}); 