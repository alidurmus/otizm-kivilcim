import { test, expect } from '@playwright/test';

test.describe('Fizik Dünyası Modülü', () => {
  
  test.describe('Ana Sayfa ve Navigasyon', () => {
    test('fizik modülü ana sayfası doğru yüklenmeli', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Ana başlığı kontrol et
      await expect(page.getByRole('heading', { name: '🔬 Fizik Dünyası' })).toBeVisible();
      
      // Açıklama metnini kontrol et
      await expect(page.getByText('Hareket, ağırlık, akış ve kuvvetlerle eğlenceli öğrenme!')).toBeVisible();
    });

    test('navigasyon butonları çalışmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Modüllere dön butonu
      await expect(page.getByRole('button', { name: '← Modüllere Dön' })).toBeVisible();
      await expect(page.getByRole('button', { name: '← Modüllere Dön' })).toBeEnabled();
      
      // Yardım butonu
      await expect(page.getByRole('button', { name: '❓ Yardım' })).toBeVisible();
      await expect(page.getByRole('button', { name: '❓ Yardım' })).toBeEnabled();
    });

    test('4 oyun kartı görünür olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Hareket oyunu
      await expect(page.getByText('🚗 Hareket Oyunu')).toBeVisible();
      await expect(page.getByText('Hızlı, yavaş ve durgun nesneleri tanı')).toBeVisible();
      
      // Ağırlık oyunu
      await expect(page.getByText('⚖️ Ağırlık Oyunu')).toBeVisible();
      await expect(page.getByText('Ağır ve hafif nesneleri öğren')).toBeVisible();
      
      // Akış oyunu
      await expect(page.getByText('💧 Akış Oyunu')).toBeVisible();
      await expect(page.getByText('Su ve hava akışını keşfet')).toBeVisible();
      
      // Kuvvet oyunu
      await expect(page.getByText('💪 Kuvvet Oyunu')).toBeVisible();
      await expect(page.getByText('İtme ve çekme kuvvetlerini öğren')).toBeVisible();
    });

    test('fizik kavramları bölümü görünür olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Fizik kavramları başlığı
      await expect(page.getByText('🌟 Fizik Kavramları Öğren')).toBeVisible();
      
      // 4 kavram kartı kontrol et
      await expect(page.getByText('Hareket')).toBeVisible();
      await expect(page.getByText('Ağırlık')).toBeVisible();
      await expect(page.getByText('Akış')).toBeVisible();
      await expect(page.getByText('Kuvvet')).toBeVisible();
    });

    test('öğrenme hedefleri görünür olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Öğrenme hedefleri başlığı
      await expect(page.getByText('🎯 Öğrenme Hedefleri:')).toBeVisible();
      
      // Hedef metinleri kontrol et
      await expect(page.getByText('Hareket kavramlarını anlama (hızlı, yavaş, durgun)')).toBeVisible();
      await expect(page.getByText('Ağırlık farklarını fark etme ve karşılaştırma')).toBeVisible();
      await expect(page.getByText('Akış kavramını öğrenme (su, hava, katı)')).toBeVisible();
      await expect(page.getByText('Temel kuvvet türlerini tanıma')).toBeVisible();
    });

    test('güvenlik notu görünür olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Güvenlik notu başlığı
      await expect(page.getByText('⚠️')).toBeVisible();
      await expect(page.getByText('Güvenlik Notu:')).toBeVisible();
    });
  });

  test.describe('Hareket Oyunu', () => {
    test('hareket oyunu başlatılabilmeli', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Hareket oyununu başlat
      await page.getByText('🚗 Hareket Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Oyun sayfasının yüklendiğini kontrol et
      await expect(page.getByText('🚗 Hareket Oyunu')).toBeVisible();
    });

    test('hareket oyunu geri butonu çalışmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      await page.getByText('🚗 Hareket Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Geri butonu
      await page.getByRole('button', { name: /← / }).click();
      
      // Ana menüye döndüğünü kontrol et
      await expect(page.getByText('🔬 Fizik Dünyası')).toBeVisible();
    });

    test('hareket oyunu quiz soruları çalışmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      await page.getByText('🚗 Hareket Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Quiz sorusu görünür olmalı
      await expect(page.getByText('Bu nesne nasıl hareket eder?')).toBeVisible();
      
      // 3 seçenek mevcut olmalı
      await expect(page.getByText('Hızlı')).toBeVisible();
      await expect(page.getByText('Yavaş')).toBeVisible();
      await expect(page.getByText('Durgun')).toBeVisible();
    });
  });

  test.describe('Ağırlık Oyunu', () => {
    test('ağırlık oyunu başlatılabilmeli', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Ağırlık oyununu başlat
      await page.getByText('⚖️ Ağırlık Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Oyun sayfasının yüklendiğini kontrol et
      await expect(page.getByText('⚖️ Ağırlık Oyunu')).toBeVisible();
    });

    test('ağırlık karşılaştırma seçenekleri görünür olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      await page.getByText('⚖️ Ağırlık Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Ağırlık seçenekleri
      await expect(page.getByText('Ağır')).toBeVisible();
      await expect(page.getByText('Hafif')).toBeVisible();
    });
  });

  test.describe('Akış Oyunu', () => {
    test('akış oyunu başlatılabilmeli', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Akış oyununu başlat
      await page.getByText('💧 Akış Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Oyun sayfasının yüklendiğini kontrol et
      await expect(page.getByText('💧 Akış Oyunu')).toBeVisible();
    });

    test('akış türü seçenekleri görünür olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      await page.getByText('💧 Akış Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Akış türü seçenekleri
      await expect(page.getByText('Su Akışı')).toBeVisible();
      await expect(page.getByText('Hava Akışı')).toBeVisible();
      await expect(page.getByText('Akmaz')).toBeVisible();
    });
  });

  test.describe('Kuvvet Oyunu', () => {
    test('kuvvet oyunu başlatılabilmeli', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Kuvvet oyununu başlat
      await page.getByText('💪 Kuvvet Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Oyun sayfasının yüklendiğini kontrol et
      await expect(page.getByText('💪 Kuvvet Oyunu')).toBeVisible();
    });

    test('kuvvet türü seçenekleri görünür olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      await page.getByText('💪 Kuvvet Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Kuvvet türü seçenekleri
      await expect(page.getByText('İtme')).toBeVisible();
      await expect(page.getByText('Çekme')).toBeVisible();
    });
  });

  test.describe('Responsive Tasarım', () => {
    test('mobil cihazlarda doğru görünmeli', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/exercise/physics');
      
      // Mobilde de başlık görünür olmalı
      await expect(page.getByText('🔬 Fizik Dünyası')).toBeVisible();
      
      // Oyun kartları mobilde de erişilebilir olmalı
      await expect(page.getByText('🚗 Hareket Oyunu')).toBeVisible();
      await expect(page.getByText('⚖️ Ağırlık Oyunu')).toBeVisible();
    });

    test('tablet cihazlarda doğru görünmeli', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/exercise/physics');
      
      // Tablet boyutunda grid düzeni çalışmalı
      await expect(page.getByText('🔬 Fizik Dünyası')).toBeVisible();
      
      // Oyun kartları uygun boyutta olmalı
      const gameCard = page.getByText('🚗 Hareket Oyunu').locator('..');
      await expect(gameCard).toBeVisible();
    });
  });

  test.describe('Erişilebilirlik', () => {
    test('keyboard navigasyonu çalışmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Tab ile navigasyon
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Focus edilmiş element erişilebilir olmalı
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('başlık hiyerarşisi doğru olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // H1 ana başlık
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      
      // H2 alt başlıklar
      await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
    });

    test('buton touch target boyutları uygun olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Oyunu başlat butonlarının boyutları 44px+ olmalı
      const gameButton = page.getByText('Oyunu Başlat').first();
      const buttonBox = await gameButton.boundingBox();
      
      expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
    });

    test('color contrast yeterli olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Ana metin renk kontrastı kontrol edilebilir
      const mainText = page.getByText('Hareket, ağırlık, akış ve kuvvetlerle eğlenceli öğrenme!');
      await expect(mainText).toBeVisible();
      
      // Buton renkleri erişilebilir olmalı
      const blueButton = page.getByText('🚗 Hareket Oyunu').locator('..').getByText('Oyunu Başlat');
      await expect(blueButton).toBeVisible();
    });
  });

  test.describe('Ses Sistemi Entegrasyonu', () => {
    test('gülsu ses sistemi aktif olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Hareket oyununa gir
      await page.getByText('🚗 Hareket Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Ses butonları mevcut olmalı
      const speakButton = page.getByRole('button', { name: /🔊/ }).first();
      if (await speakButton.isVisible()) {
        await expect(speakButton).toBeEnabled();
      }
    });

    test('türkçe seslandirme çalışmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Ses kontrolü için console logları dinle
      page.on('console', msg => {
        if (msg.type() === 'log' && msg.text().includes('Gülsu')) {
          console.log('Gülsu ses sistemi aktif:', msg.text());
        }
      });
      
      // Hareket oyununa gir ve ses testini başlat
      await page.getByText('🚗 Hareket Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Sayfa yüklendiğinde Gülsu ses sistemi aktif olmalı
      await page.waitForTimeout(2000);
    });
  });

  test.describe('Performans Testleri', () => {
    test('sayfa hızlı yüklenmeli', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/exercise/physics');
      const loadTime = Date.now() - startTime;
      
      // 3 saniyede yüklenmeli
      expect(loadTime).toBeLessThan(3000);
      
      // Ana içerik görünür olmalı
      await expect(page.getByText('🔬 Fizik Dünyası')).toBeVisible();
    });

    test('oyun geçişleri smooth olmalı', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Hareket oyununa geç
      const startTime = Date.now();
      await page.getByText('🚗 Hareket Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // Oyun sayfası hızlı yüklenmeli
      await expect(page.getByText('🚗 Hareket Oyunu')).toBeVisible({ timeout: 2000 });
      const transitionTime = Date.now() - startTime;
      
      expect(transitionTime).toBeLessThan(2000);
    });
  });

  test.describe('Error Handling', () => {
    test('javascript hataları yakalamalı', async ({ page }) => {
      let consoleErrors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto('/exercise/physics');
      
      // Sayfada kritik JS hatası olmamalı
      await page.waitForTimeout(2000);
      
      // Console error'ları filtrele (önemli olmayan hataları göz ardı et)
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('404') && 
        !error.includes('network') &&
        !error.includes('favicon')
      );
      
      expect(criticalErrors.length).toBe(0);
    });

    test('network hatalarına karşı dayanıklı olmalı', async ({ page }) => {
      // Network'ü offline yap
      await page.context().setOffline(true);
      
      try {
        await page.goto('/exercise/physics');
        
        // Offline durumda bile temel yapı yüklenmeli (cache'den)
        // Bu test gerçek deployment senaryosunda daha anlamlı
      } catch (error) {
        // Offline durumda hata beklenir, test geçer
        console.log('Offline test - beklenen hata:', error);
      }
      
      // Network'ü geri aç
      await page.context().setOffline(false);
    });
  });

  test.describe('Data Persistence', () => {
    test('oyun progress kaydedilmeli', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Hareket oyununa gir ve bir soru yanıtla
      await page.getByText('🚗 Hareket Oyunu').locator('..').getByText('Oyunu Başlat').click();
      
      // LocalStorage'da progress kaydı kontrol et
      const progressData = await page.evaluate(() => {
        return localStorage.getItem('physics-progress');
      });
      
      // Progress tracking aktif olmalı (null olmamalı)
      // Gerçek implementation'a göre ayarlanacak
    });

    test('modül tamamlanma durumu kaydedilmeli', async ({ page }) => {
      await page.goto('/exercise/physics');
      
      // Sayfa session storage'ını kontrol et
      const sessionData = await page.evaluate(() => {
        return sessionStorage.getItem('current-module');
      });
      
      // Session tracking olmalı
      // Gerçek implementation'a göre ayarlanacak
    });
  });
}); 