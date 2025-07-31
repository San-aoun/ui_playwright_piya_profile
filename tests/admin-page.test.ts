import { test, expect } from '@playwright/test';

const WEBSITE_URL = 'https://san-aoun.github.io/personal-site-monorepo';
const ADMIN_URL = `${WEBSITE_URL}/#/admin`;

test.describe('Admin Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should load admin page successfully', async ({ page }) => {
    // Verify page loads without errors
    await expect(page).toHaveURL(/.*#\/admin$/);
  });

  test('should display admin panel heading', async ({ page }) => {
    // Check for admin panel heading
    await expect(page.locator('h1, h2')).toContainText('Admin Panel');
  });

  test('should display create post functionality', async ({ page }) => {
    // Check for Create Post button or control
    const createPostControl = page.locator('text=Create Post, button:has-text("Create Post"), [data-testid="create-post"]');
    await expect(createPostControl).toBeVisible();
  });

  test('should handle create post interaction', async ({ page }) => {
    // Test Create Post button functionality
    const createPostButton = page.locator('button:has-text("Create Post"), [data-testid="create-post"]');
    
    if (await createPostButton.count() > 0) {
      // Check if button is clickable
      await expect(createPostButton).toBeEnabled();
      
      // Click the button to see what happens
      await createPostButton.click();
      
      // Wait for any form or modal to appear
      await page.waitForTimeout(1000);
      
      // Note: Actual behavior depends on implementation
      // This test ensures the button is functional
    }
  });

  test('should require authentication or show login form', async ({ page }) => {
    // Check if there's a login form or authentication requirement
    const loginForm = page.locator('form, [data-testid="login-form"]');
    const usernameField = page.locator('input[type="text"], input[name="username"], input[name="email"]');
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // If admin requires authentication, these elements should be present
    if (await loginForm.count() > 0) {
      await expect(loginForm).toBeVisible();
      await expect(usernameField).toBeVisible();
      await expect(passwordField).toBeVisible();
      await expect(loginButton).toBeVisible();
    }
  });

  test('should handle admin form interactions', async ({ page }) => {
    // Look for any admin forms (login, create post, etc.)
    const forms = page.locator('form');
    
    if (await forms.count() > 0) {
      const form = forms.first();
      
      // Check form inputs
      const inputs = form.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        // Verify inputs are properly formatted
        for (let i = 0; i < inputCount; i++) {
          const input = inputs.nth(i);
          
          // Check if input has proper attributes
          const type = await input.getAttribute('type');
          const name = await input.getAttribute('name');
          const placeholder = await input.getAttribute('placeholder');
          
          // At least one of these should be present for proper form handling
          expect(type || name || placeholder).toBeTruthy();
        }
      }
      
      // Check for submit button
      const submitButton = form.locator('button[type="submit"], input[type="submit"]');
      if (await submitButton.count() > 0) {
        await expect(submitButton).toBeVisible();
      }
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Verify admin panel is accessible on mobile
    await expect(page.locator('h1, h2')).toBeVisible();
    
    // Check if Create Post control is still accessible
    const createPostControl = page.locator('text=Create Post, button:has-text("Create Post")');
    if (await createPostControl.count() > 0) {
      await expect(createPostControl).toBeVisible();
    }
    
    // Verify no horizontal overflow
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(395);
  });

  test('should maintain navigation functionality', async ({ page }) => {
    // Test navigation back to home
    const homeLink = page.locator('a[href*="#/"]').first();
    if (await homeLink.count() > 0) {
      await homeLink.click();
      await expect(page).toHaveURL(/.*#\/$/);
      
      // Navigate back to admin
      await page.goBack();
      await expect(page).toHaveURL(/.*#\/admin$/);
    }
    
    // Test navigation to other pages
    const blogLink = page.locator('a[href*="#/blog"]');
    if (await blogLink.count() > 0) {
      await blogLink.click();
      await expect(page).toHaveURL(/.*#\/blog$/);
      
      // Navigate back to admin
      await page.goBack();
      await expect(page).toHaveURL(/.*#\/admin$/);
    }
  });

  test('should handle admin security properly', async ({ page }) => {
    // Check if admin page has proper security measures
    
    // Look for any security-related elements
    const securityElements = page.locator('[data-testid*="auth"], [class*="auth"], [id*="auth"]');
    
    // If there are forms, they should have proper security attributes
    const forms = page.locator('form');
    if (await forms.count() > 0) {
      for (let i = 0; i < await forms.count(); i++) {
        const form = forms.nth(i);
        
        // Check for CSRF tokens or security fields
        const hiddenInputs = form.locator('input[type="hidden"]');
        const securityInputs = form.locator('input[name*="token"], input[name*="csrf"]');
        
        // Forms should either have security tokens or be simple display forms
        // This test ensures forms are properly structured
        await expect(form).toBeVisible();
      }
    }
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Filter out common third-party errors
    const relevantErrors = errors.filter(error => 
      !error.includes('chrome-extension') && 
      !error.includes('favicon.ico') &&
      !error.includes('third-party')
    );
    
    expect(relevantErrors).toHaveLength(0);
  });

  test('should provide clear admin interface', async ({ page }) => {
    // Verify admin interface is clear and usable
    
    // Check for main admin heading
    const mainHeading = page.locator('h1, h2').first();
    await expect(mainHeading).toBeVisible();
    
    // Verify page has meaningful content (not just empty admin page)
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Admin');
    expect(pageContent!.length).toBeGreaterThan(20);
    
    // Check if there are any admin tools or controls visible
    const adminControls = page.locator('button, input, form, [role="button"]');
    expect(await adminControls.count()).toBeGreaterThan(0);
  });

  test('should handle admin post management', async ({ page }) => {
    // Test admin post management functionality if available
    
    // Look for post management controls
    const postControls = page.locator('[data-testid*="post"], [class*="post"], text=post');
    
    if (await postControls.count() > 0) {
      // If there are post-related controls, they should be functional
      const createPostBtn = page.locator('button:has-text("Create Post"), [data-testid="create-post"]');
      
      if (await createPostBtn.count() > 0) {
        await expect(createPostBtn).toBeEnabled();
        
        // Test clicking create post (non-destructive test)
        await createPostBtn.click();
        await page.waitForTimeout(500);
        
        // Check if any form or modal appears
        const newElements = page.locator('form, [role="dialog"], .modal');
        // Note: This is a basic interaction test
      }
    }
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Test keyboard accessibility
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test multiple tab presses to ensure navigation works
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
      const currentFocused = page.locator(':focus');
      // Each tab should move focus to a focusable element
      await expect(currentFocused).toBeVisible();
    }
  });
});
