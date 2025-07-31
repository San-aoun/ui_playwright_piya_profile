import { test, expect } from '@playwright/test';

// Example test that can be run immediately to verify setup
test.describe('Basic Setup Verification', () => {
  test('should verify Playwright is working', async ({ page }) => {
    // Test with a public website to ensure Playwright is working
    await page.goto('https://playwright.dev');
    
    // Verify the page loads
    await expect(page).toHaveTitle(/Playwright/);
    
    // Verify we can interact with elements
    const getStartedLink = page.locator('text=Get started');
    if (await getStartedLink.count() > 0) {
      await expect(getStartedLink.first()).toBeVisible();
    }
  });
  
  test('should verify browser capabilities', async ({ page, browserName }) => {
    console.log(`Testing with browser: ${browserName}`);
    
    // Test basic browser functionality
    await page.goto('https://httpbin.org/html');
    await expect(page.locator('h1')).toHaveText('Herman Melville - Moby-Dick');
    
    // Test JavaScript execution
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toBeTruthy(); // Just verify we can execute JavaScript
  });
});

// Template test for your actual website
test.describe('Your Website Tests (Template)', () => {
  test.skip('Template: Homepage functionality', async ({ page }) => {
    // TODO: Replace with your actual website URL
    await page.goto('https://your-website.com');
    
    // TODO: Add your specific tests here
    await expect(page).toHaveTitle(/Your Expected Title/);
    
    // Example assertions you might want to modify:
    // await expect(page.locator('nav')).toBeVisible();
    // await expect(page.locator('h1')).toContainText('Your Expected Heading');
    // await expect(page.locator('.hero-section')).toBeVisible();
  });
  
  test.skip('Template: Contact form functionality', async ({ page }) => {
    // TODO: Replace with your contact page URL
    await page.goto('https://your-website.com/contact');
    
    // TODO: Add your contact form tests here
    // Example:
    // await page.fill('input[name="name"]', 'Test User');
    // await page.fill('input[name="email"]', 'test@example.com');
    // await page.fill('textarea[name="message"]', 'Test message');
    // await page.click('button[type="submit"]');
    // await expect(page.locator('.success-message')).toBeVisible();
  });
});
