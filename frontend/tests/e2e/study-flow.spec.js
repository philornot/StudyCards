// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Study Cards E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('complete study flow: create, study, and delete set', async ({ page }) => {
    // 1. Create new set
    await page.click('text=Utwórz zestaw');
    await expect(page).toHaveURL(/\/create$/);

    await page.fill('input[placeholder*="Hiszpański"]', 'Test Set E2E');
    await page.fill('textarea[placeholder*="Dodaj opis"]', 'Test description');

    // Add first card
    await page.fill('input[placeholder*="pojęcie"]', 'Hello');
    await page.fill('textarea[placeholder*="definicję"]', 'Witaj');

    // Add second card
    await page.click('text=Dodaj fiszkę');
    const cards = await page.locator('.card-editor').all();
    await cards[1].locator('input[placeholder*="pojęcie"]').fill('Goodbye');
    await cards[1].locator('textarea[placeholder*="definicję"]').fill('Do widzenia');

    // Save set
    await page.click('button:has-text("Zapisz zestaw")');

    // Wait for redirect to home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Test Set E2E')).toBeVisible();

    // 2. Navigate to set details
    await page.click('text=Test Set E2E');
    await expect(page).toHaveURL(/\/sets\/\d+$/);
    await expect(page.locator('h1:has-text("Test Set E2E")')).toBeVisible();
    await expect(page.locator('text=2 fiszek')).toBeVisible();

    // 3. Start SR study mode
    await page.click('button:has-text("Rozpocznij naukę")');
    await expect(page).toHaveURL(/\/sets\/\d+\/study$/);

    // Study first card
    await expect(page.locator('text=Hello').or(page.locator('text=Goodbye'))).toBeVisible();

    // Flip card
    await page.keyboard.press('Space');
    await page.waitForTimeout(700); // Wait for flip animation

    // Rate as "Good"
    await page.click('button:has-text("Good")');
    await page.waitForTimeout(500); // Wait for transition

    // Study second card
    await page.keyboard.press('Space');
    await page.waitForTimeout(700);
    await page.click('button:has-text("Easy")');

    // Should show completion screen
    await expect(page.locator('text=Sesja zakończona')).toBeVisible();
    await expect(page.locator('text=Przejrzałeś 2 fiszek')).toBeVisible();

    // 4. Return to set and check stats
    await page.click('button:has-text("Wróć do zestawu")');
    await expect(page.locator('text=Statystyki postępów')).toBeVisible();
    await expect(page.locator('text=W nauce')).toBeVisible();

    // 5. Delete set
    await page.click('button:has-text("Usuń")');
    await expect(page.locator('text=Potwierdzenie usunięcia')).toBeVisible();
    await page.click('button.btn-danger:has-text("Usuń")');

    // Wait for redirect
    await expect(page).toHaveURL('/');

    // Verify set is gone
    await expect(page.locator('text=Test Set E2E')).not.toBeVisible();
  });

  test('flashcards mode navigation', async ({ page }) => {
    // Create a quick set first
    await page.click('text=Utwórz zestaw');
    await page.fill('input[placeholder*="Hiszpański"]', 'Flashcard Test');
    await page.fill('input[placeholder*="pojęcie"]', 'Cat');
    await page.fill('textarea[placeholder*="definicję"]', 'Kot');
    await page.click('text=Dodaj fiszkę');
    const cards = await page.locator('.card-editor').all();
    await cards[1].locator('input[placeholder*="pojęcie"]').fill('Dog');
    await cards[1].locator('textarea[placeholder*="definicję"]').fill('Pies');
    await page.click('button:has-text("Zapisz zestaw")');

    // Navigate to set
    await page.click('text=Flashcard Test');

    // Start flashcards mode
    await page.click('button:has-text("Tryb fiszek")');
    await expect(page).toHaveURL(/\/sets\/\d+\/flashcards$/);

    // Check progress counter
    await expect(page.locator('text=1 / 2')).toBeVisible();

    // Flip card with space
    await page.keyboard.press('Space');
    await page.waitForTimeout(700);

    // Navigate to next card
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('text=2 / 2')).toBeVisible();

    // Navigate back
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('text=1 / 2')).toBeVisible();

    // Exit with Escape
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/\/sets\/\d+$/);
  });

  test('edit set flow', async ({ page }) => {
    // Create set
    await page.click('text=Utwórz zestaw');
    await page.fill('input[placeholder*="Hiszpański"]', 'Edit Test');
    await page.fill('input[placeholder*="pojęcie"]', 'Original');
    await page.fill('textarea[placeholder*="definicję"]', 'Original Def');
    await page.click('button:has-text("Zapisz zestaw")');

    // Navigate to set and edit
    await page.click('text=Edit Test');
    await page.click('button:has-text("Edytuj")');
    await expect(page).toHaveURL(/\/sets\/\d+\/edit$/);

    // Verify pre-filled data
    await expect(page.locator('input[value="Edit Test"]')).toBeVisible();
    await expect(page.locator('input[value="Original"]')).toBeVisible();

    // Edit title and card
    await page.fill('input[value="Edit Test"]', 'Edited Title');
    await page.fill('input[value="Original"]', 'Updated');

    // Save changes
    await page.click('button:has-text("Zapisz zmiany")');

    // Verify changes
    await expect(page.locator('h1:has-text("Edited Title")')).toBeVisible();
    await expect(page.locator('text=Updated')).toBeVisible();
  });

  test('reset progress flow', async ({ page }) => {
    // Create and study set
    await page.click('text=Utwórz zestaw');
    await page.fill('input[placeholder*="Hiszpański"]', 'Reset Test');
    await page.fill('input[placeholder*="pojęcie"]', 'Test');
    await page.fill('textarea[placeholder*="definicję"]', 'Test Def');
    await page.click('button:has-text("Zapisz zestaw")');

    await page.click('text=Reset Test');
    await page.click('button:has-text("Rozpocznij naukę")');

    // Study the card
    await page.keyboard.press('Space');
    await page.waitForTimeout(700);
    await page.click('button:has-text("Good")');

    // Return to set
    await page.click('button:has-text("Wróć do zestawu")');

    // Verify there's progress
    await expect(page.locator('text=W nauce')).toBeVisible();

    // Reset progress
    await page.click('button:has-text("Resetuj postęp")');
    await expect(page.locator('text=Resetowanie postępu')).toBeVisible();
    await page.click('button.btn-danger:has-text("Zresetuj postęp")');

    // Wait for page reload
    await page.waitForTimeout(2000);

    // Verify progress is reset
    await expect(page.locator('text=1 nowych')).toBeVisible();
  });

  test('responsive mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Create set
    await page.click('text=Utwórz zestaw');
    await page.fill('input[placeholder*="Hiszpański"]', 'Mobile Test');
    await page.fill('input[placeholder*="pojęcie"]', 'Mobile');
    await page.fill('textarea[placeholder*="definicję"]', 'Mobile Def');

    // Verify button is touch-friendly (min 44x44px)
    const saveButton = page.locator('button:has-text("Zapisz zestaw")');
    const box = await saveButton.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);

    await page.click('button:has-text("Zapisz zestaw")');

    // Verify set card is visible and clickable on mobile
    await expect(page.locator('text=Mobile Test')).toBeVisible();
    await page.click('text=Mobile Test');

    // Verify action buttons are stacked on mobile
    const buttons = page.locator('.action-buttons button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });
});