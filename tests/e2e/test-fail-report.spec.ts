import { test, expect } from '@playwright/test';

test.describe('Fail Report Sistemi Test', () => {
  
  test('başarılı test - fail report sistemi çalışmalı', async ({ page }) => {
    // Basit bir başarılı test
    expect(true).toBe(true);
  });
  
  test('başarısız test - fail report sistemi hata kaydetmeli', async ({ page }) => {
    // Bu test kasıtlı olarak başarısız olacak
    expect(true).toBe(false);
  });
  
  test('atlanan test', async ({ page }) => {
    test.skip(true, 'Bu test kasıtlı olarak atlanıyor');
    expect(true).toBe(true);
  });
  
}); 