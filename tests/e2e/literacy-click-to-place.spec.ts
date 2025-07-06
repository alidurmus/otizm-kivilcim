import { test, expect } from '@playwright/test';

test.describe('Literacy Module - Click-to-Place System', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/exercise/literacy');
    await page.waitForLoadState('networkidle');
  });

  test('should load literacy module correctly', async ({ page }) => {
    // Check page title and instructions
    await expect(page.locator('h2')).toContainText('Harfleri Birleştirerek Hece Oluştur');
    await expect(page.locator('text=Aşağıdaki harflere tıklayarak seç')).toBeVisible();
    
    // Check that initial letters are visible (exercise 1: e, l)
    await expect(page.locator('text=e').first()).toBeVisible();
    await expect(page.locator('text=l').first()).toBeVisible();
    
    // Check drop zones are empty
    await expect(page.locator('[data-testid="drop-zone-1"]')).toContainText('?');
    await expect(page.locator('[data-testid="drop-zone-2"]')).toContainText('?');
  });

  test('should select and deselect letters by clicking', async ({ page }) => {
    const letterE = page.locator('text=e').first();
    const letterL = page.locator('text=l').first();
    
    // Click letter 'e' to select
    await letterE.click();
    await page.waitForTimeout(100);
    
    // Letter should show as selected (green background)
    await expect(letterE).toHaveClass(/bg-green-500/);
    
    // Click letter 'e' again to deselect
    await letterE.click();
    await page.waitForTimeout(100);
    
    // Letter should show as deselected (orange background)
    await expect(letterE).toHaveClass(/bg-orange-400/);
    
    // Click letter 'l' to select
    await letterL.click();
    await page.waitForTimeout(100);
    
    // Letter L should be selected
    await expect(letterL).toHaveClass(/bg-green-500/);
  });

  test('should place letters in drop zones', async ({ page }) => {
    const letterE = page.locator('text=e').first();
    const letterL = page.locator('text=l').first();
    const dropZone1 = page.locator('[data-testid="drop-zone-1"]');
    const dropZone2 = page.locator('[data-testid="drop-zone-2"]');
    
    // Select letter 'e' and place in first zone
    await letterE.click();
    await dropZone1.click();
    await page.waitForTimeout(500);
    
    // First zone should now show 'e'
    await expect(dropZone1).toContainText('e');
    
    // Select letter 'l' and place in second zone
    await letterL.click();
    await dropZone2.click();
    await page.waitForTimeout(500);
    
    // Second zone should now show 'l'
    await expect(dropZone2).toContainText('l');
  });

  test('should show success feedback for correct syllable', async ({ page }) => {
    const letterE = page.locator('text=e').first();
    const letterL = page.locator('text=l').first();
    const dropZone1 = page.locator('[data-testid="drop-zone-1"]');
    const dropZone2 = page.locator('[data-testid="drop-zone-2"]');
    
    // Create correct syllable 'el'
    await letterE.click();
    await dropZone1.click();
    await letterL.click();
    await dropZone2.click();
    
    // Wait for feedback to appear
    await page.waitForTimeout(2000);
    
    // Success message should appear
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('text=Harikasın!')).toBeVisible();
    await expect(page.locator('text=Doğru! Bu hece "el" oluyor.')).toBeVisible();
  });

  test('should show error feedback for incorrect syllable', async ({ page }) => {
    const letterE = page.locator('text=e').first();
    const letterL = page.locator('text=l').first();
    const dropZone1 = page.locator('[data-testid="drop-zone-1"]');
    const dropZone2 = page.locator('[data-testid="drop-zone-2"]');
    
    // Create incorrect syllable 'le'
    await letterL.click();
    await dropZone1.click();
    await letterE.click();
    await dropZone2.click();
    
    // Wait for feedback to appear
    await page.waitForTimeout(2000);
    
    // Error message should appear
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('text=Haydi tekrar deneyelim!')).toBeVisible();
    await expect(page.locator('text=Tekrar Dene')).toBeVisible();
  });

  test('should allow retry after incorrect answer', async ({ page }) => {
    const letterE = page.locator('text=e').first();
    const letterL = page.locator('text=l').first();
    const dropZone1 = page.locator('[data-testid="drop-zone-1"]');
    const dropZone2 = page.locator('[data-testid="drop-zone-2"]');
    
    // Create incorrect syllable
    await letterL.click();
    await dropZone1.click();
    await letterE.click();
    await dropZone2.click();
    
    // Wait for error feedback
    await page.waitForTimeout(2000);
    
    // Click "Tekrar Dene" button
    await page.locator('text=Tekrar Dene').click();
    
    // Drop zones should be reset to '?'
    await expect(dropZone1).toContainText('?');
    await expect(dropZone2).toContainText('?');
    
    // No feedback should be visible
    await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
  });

  test('should play audio feedback when clicking letters', async ({ page }) => {
    const letterE = page.locator('text=e').first();
    
    // Click letter to select (this should trigger audio)
    await letterE.click();
    await page.waitForTimeout(1000);
    
    // We can't test actual audio playback in E2E,
    // but we can verify the click interaction works
    await expect(letterE).toHaveClass(/bg-green-500/);
  });

  test('should play syllable audio when clicking audio button', async ({ page }) => {
    const audioButton = page.locator('text=🔊 Dinle');
    
    await audioButton.click();
    
    // Button should temporarily show playing state
    await expect(page.locator('text=🔊 Oynatılıyor...')).toBeVisible({ timeout: 1000 });
    
    // Wait for audio to complete and button to return to normal
    await page.waitForTimeout(3000);
    await expect(page.locator('text=🔊 Dinle')).toBeVisible();
  });

  test('should handle auto-progress toggle', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    
    // Should be checked by default
    await expect(checkbox).toBeChecked();
    
    // Click to disable auto-progress
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
    
    // Complete correct syllable
    const letterE = page.locator('text=e').first();
    const letterL = page.locator('text=l').first();
    const dropZone1 = page.locator('[data-testid="drop-zone-1"]');
    const dropZone2 = page.locator('[data-testid="drop-zone-2"]');
    
    await letterE.click();
    await dropZone1.click();
    await letterL.click();
    await dropZone2.click();
    
    // Wait for feedback
    await page.waitForTimeout(2000);
    
    // Should show proceed button when auto-progress is disabled
    await expect(page.locator('[data-testid="proceed-button"]')).toBeVisible();
  });

  test('should navigate back to modules', async ({ page }) => {
    const backButton = page.locator('text=← Modüllere Dön');
    
    await backButton.click();
    
    // Should navigate away from literacy page
    await expect(page).not.toHaveURL(/literacy/);
    await expect(page).toHaveURL(/modules/);
  });

  test('should complete exercise and progress to next', async ({ page }) => {
    // First exercise: 'el'
    const letterE = page.locator('text=e').first();
    const letterL = page.locator('text=l').first();
    const dropZone1 = page.locator('[data-testid="drop-zone-1"]');
    const dropZone2 = page.locator('[data-testid="drop-zone-2"]');
    
    // Complete correct syllable
    await letterE.click();
    await dropZone1.click();
    await letterL.click();
    await dropZone2.click();
    
    // Wait for auto-progress (3 seconds)
    await page.waitForTimeout(4000);
    
    // Should progress to next exercise (should see 'a' and 'l' letters)
    await expect(page.locator('text=a').first()).toBeVisible();
    await expect(page.locator('text=l').first()).toBeVisible();
    
    // Progress bar should update
    // (This would be exercise 2 out of 5)
  });

  test('should handle voice input when supported', async ({ page }) => {
    const voiceButton = page.locator('text=🎙️ Söyle');
    
    // Voice button should be visible if speech recognition is supported
    if (await voiceButton.isVisible()) {
      await voiceButton.click();
      
      // Should show listening state
      await expect(page.locator('text=🎙️ Dinleniyor...')).toBeVisible({ timeout: 1000 });
    }
    // If not supported, the button won't be visible, which is expected
  });
}); 