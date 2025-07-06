import { test, expect } from '@playwright/test';

test.describe('Literacy Module - Simple Test', () => {
  test('should load and allow basic interaction', async ({ page }) => {
    // Navigate to literacy module
    await page.goto('http://localhost:3000/exercise/literacy');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded correctly
    await expect(page.locator('h2')).toContainText('Harfleri Birleştirerek Hece Oluştur');
    
    // Check that letters are visible
    await expect(page.locator('text=e').first()).toBeVisible();
    await expect(page.locator('text=l').first()).toBeVisible();
    
    // Test drag and drop with Playwright's native method
    const letterE = page.locator('text=e').first();
    const letterL = page.locator('text=l').first();
    const dropZone1 = page.locator('[data-testid="drop-zone-1"]');
    const dropZone2 = page.locator('[data-testid="drop-zone-2"]');
    
    // Use dragTo method which should work better
    await letterE.dragTo(dropZone1);
    await letterL.dragTo(dropZone2);
    
    // Wait a moment for any state updates
    await page.waitForTimeout(1000);
    
    // Check if syllable was formed correctly
    console.log('Drop zone 1 after drag:', await dropZone1.innerText());
    console.log('Drop zone 2 after drag:', await dropZone2.innerText());
    
    // Wait for feedback (success or error)
    await page.waitForTimeout(2000);
    
    // Take a screenshot for manual verification
    await page.screenshot({ path: 'literacy-simple-test.png' });
  });

  test('should handle audio button clicks', async ({ page }) => {
    await page.goto('http://localhost:3000/exercise/literacy');
    await page.waitForLoadState('networkidle');
    
    // Click audio button
    const audioButton = page.locator('text=🔊 Dinle');
    await audioButton.click();
    
    // The button text should change temporarily
    // We can't test actual audio but we can test UI response
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ path: 'literacy-audio-test.png' });
  });

  test('should allow letter clicking for sounds', async ({ page }) => {
    await page.goto('http://localhost:3000/exercise/literacy');
    await page.waitForLoadState('networkidle');
    
    // Click letters
    await page.locator('text=e').first().click();
    await page.waitForTimeout(500);
    
    await page.locator('text=l').first().click();
    await page.waitForTimeout(500);
    
    // Take screenshot
    await page.screenshot({ path: 'literacy-letter-click-test.png' });
  });

  test('should toggle auto-progress setting', async ({ page }) => {
    await page.goto('http://localhost:3000/exercise/literacy');
    await page.waitForLoadState('networkidle');
    
    // Find and click auto-progress checkbox
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    
    // Should be checked by default
    await expect(checkbox).toBeChecked();
    
    // Click to uncheck
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
    
    // Click again to check
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test('should navigate back to modules', async ({ page }) => {
    await page.goto('http://localhost:3000/exercise/literacy');
    await page.waitForLoadState('networkidle');
    
    // Click back button
    await page.locator('text=← Modüllere Dön').click();
    
    // Should navigate away from literacy page
    await expect(page).not.toHaveURL(/literacy/);
  });
}); 