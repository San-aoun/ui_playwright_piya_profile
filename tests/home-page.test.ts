import { test, expect } from '@playwright/test';

const WEBSITE_URL = 'https://san-aoun.github.io/personal-site-monorepo';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Verify page loads without errors
    await expect(page).toHaveURL(WEBSITE_URL + '/');
    
    // Check page title (this is a Vite React app)
    await expect(page).toHaveTitle('Vite + React + TS');
  });

  test('should display main heading and job title', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toContainText('Piyathida San-aoun');
    
    // Check job title
    await expect(page.locator('h2')).toContainText('Software Development Engineer in Test');
  });

  test('should display profile image', async ({ page }) => {
    // Check if profile image is visible
    const profileImage = page.locator('img[alt*="Piyathida"], img[src*="profile"]');
    await expect(profileImage).toBeVisible();
    
    // Verify image has proper src attribute
    await expect(profileImage).toHaveAttribute('src', /.*profile\.jpg$/);
  });

  test('should display professional summary', async ({ page }) => {
    // Check if professional summary is present
    const summaryText = page.locator('text=I am a highly skilled Software Engineer');
    await expect(summaryText).toBeVisible();
    
    // Verify key experience details are mentioned
    await expect(page.locator('text=over 10 years of experience')).toBeVisible();
    await expect(page.locator('text=7 years specializing in automation QA')).toBeVisible();
    await expect(page.locator('text=London Stock Exchange Group')).toBeVisible();
  });

  test('should display social media links', async ({ page }) => {
    // Check GitHub link
    const githubLink = page.locator('a[href*="github.com/San-aoun"]');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/San-aoun');
    
    // Check LinkedIn link
    const linkedinLink = page.locator('a[href*="linkedin.com"]');
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute('href', /.*linkedin\.com.*piyathida-san-aoun.*/);
    
    // Check Medium link
    const mediumLink = page.locator('a[href*="medium.com"]');
    await expect(mediumLink).toBeVisible();
    await expect(mediumLink).toHaveAttribute('href', 'https://piyathida-sanaoun01.medium.com/');
  });

  test('should have working navigation menu', async ({ page }) => {
    // Check navigation links
    const homeLink = page.locator('a[href*="#/"]').first();
    await expect(homeLink).toBeVisible();
    
    const blogLink = page.locator('a[href*="#/blog"]');
    await expect(blogLink).toBeVisible();
    
    const cvLink = page.locator('a[href*="#/cv"]');
    await expect(cvLink).toBeVisible();
    
    const adminLink = page.locator('a[href*="#/admin"]');
    await expect(adminLink).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    // Test Blog navigation
    await page.click('a[href*="#/blog"]');
    await page.waitForURL('**/blog');
    await expect(page).toHaveURL(/.*#\/blog$/);
    
    // Navigate back to home using the home link in the page
    await page.goto(WEBSITE_URL);
    await expect(page).toHaveURL(/.*\/$/);
    
    // Test CV navigation
    await page.click('a[href*="#/cv"]');
    await page.waitForURL('**/cv');
    await expect(page).toHaveURL(/.*#\/cv$/);
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Verify main content is still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toBeVisible();
    
    // Check if content doesn't overflow horizontally
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(395); // 375 + tolerance
  });

  test('should be responsive on tablet devices', async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    // Verify layout adapts properly
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('img[src*="profile"]')).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check title (Vite React app has default title)
    const title = await page.title();
    expect(title).toBe('Vite + React + TS');
    
    // Check if viewport meta tag exists
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
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
    
    // Filter out common third-party errors that don't affect functionality
    const relevantErrors = errors.filter(error => 
      !error.includes('chrome-extension') && 
      !error.includes('favicon.ico') &&
      !error.includes('third-party')
    );
    
    expect(relevantErrors).toHaveLength(0);
  });

  test('should have good performance metrics', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(WEBSITE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
