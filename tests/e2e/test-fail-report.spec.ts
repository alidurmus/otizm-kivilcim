import { test, expect } from '@playwright/test';

test.describe('Fail Report Sistemi Test', () => {
  
  test('başarılı test - fail report sistemi çalışmalı', async ({ page }) => {
    // Basit bir başarılı test
    expect(true).toBe(true);
  });
  
  test('ikinci başarılı test - reporter çalışıyor', async ({ page }) => {
    // İkinci başarılı test
    expect(1 + 1).toBe(2);
  });
  
  test('üçüncü başarılı test - sistem stable', async ({ page }) => {
    // Üçüncü başarılı test
    expect('Kıvılcım').toContain('Kıvılcım');
  });
  
}); 