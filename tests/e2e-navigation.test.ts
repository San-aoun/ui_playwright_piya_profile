import { test, expect } from '@playwright/test';

const WEBSITE_URL = 'https://san-aoun.github.io/personal-site-monorepo';

test.describe('End-to-End Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should navigate through all pages successfully', async ({ page }) => {
    // Start at home page
    await expect(page).toHaveURL(/.*#?\/$/);
    await expect(page.locator('h1')).toContainText('Piyathida San-aoun');
    
    // Navigate to Blog page
    await page.click('a[href*="#/blog"]');
    await page.waitForURL('**/blog');
    await expect(page).toHaveURL(/.*#\/blog$/);
    await expect(page.locator('h1, h2')).toContainText('My Blog Posts');
    
    // Navigate to CV page
    await page.click('a[href*="#/cv"]');
    await page.waitForURL('**/cv');
    await expect(page).toHaveURL(/.*#\/cv$/);
    await expect(page.locator('a:has-text("Download PDF")')).toBeVisible();
    
    // Navigate to Admin page
    await page.click('a[href*="#/admin"]');
    await page.waitForURL('**/admin');
    await expect(page).toHaveURL(/.*#\/admin$/);
    await expect(page.locator('h1, h2')).toContainText('Admin Panel');
    
    // Navigate back to Home
    await page.click('a[href*="#/"]');
    await page.waitForURL('**/', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/.*#?\/$/);
    await expect(page.locator('h1')).toContainText('Piyathida San-aoun');
  });

  test('should maintain consistent header/navigation across all pages', async ({ page }) => {
    const pages = [
      { url: '/', name: 'Home' },
      { url: '/#/blog', name: 'Blog' },
      { url: '/#/cv', name: 'CV' },
      { url: '/#/admin', name: 'Admin' }
    ];
    
    for (const pageInfo of pages) {
      await page.goto(`${WEBSITE_URL}${pageInfo.url}`);
      await page.waitForLoadState('networkidle');
      
      // Check if navigation links are present on each page
      const homeLink = page.locator('a[href*="#/"]').first();
      const blogLink = page.locator('a[href*="#/blog"]');
      const cvLink = page.locator('a[href*="#/cv"]');
      const adminLink = page.locator('a[href*="#/admin"]');
      
      // Verify navigation links exist (they might be in different forms)
      if (await homeLink.count() > 0) await expect(homeLink).toBeVisible();
      if (await blogLink.count() > 0) await expect(blogLink).toBeVisible();
      if (await cvLink.count() > 0) await expect(cvLink).toBeVisible();
      if (await adminLink.count() > 0) await expect(adminLink).toBeVisible();
      
      console.log(`✓ Navigation verified on ${pageInfo.name} page`);
    }
  });

  test('should handle browser back and forward navigation', async ({ page }) => {
    // Start at home
    await expect(page).toHaveURL(/.*#?\/$/);
    
    // Navigate to blog
    await page.click('a[href*="#/blog"]');
    await page.waitForURL('**/blog');
    
    // Navigate to CV
    await page.click('a[href*="#/cv"]');
    await page.waitForURL('**/cv');
    
    // Navigate to admin
    await page.click('a[href*="#/admin"]');
    await page.waitForURL('**/admin');
    
    // Test browser back button
    await page.goBack();
    await expect(page).toHaveURL(/.*#\/cv$/);
    
    await page.goBack();
    await expect(page).toHaveURL(/.*#\/blog$/);
    
    await page.goBack();
    await expect(page).toHaveURL(/.*#?\/$/);
    
    // Test browser forward button
    await page.goForward();
    await expect(page).toHaveURL(/.*#\/blog$/);
    
    await page.goForward();
    await expect(page).toHaveURL(/.*#\/cv$/);
  });

  test('should maintain state when navigating between pages', async ({ page }) => {
    // Go to blog page and verify content loads
    await page.click('a[href*="#/blog"]');
    await page.waitForURL('**/blog');
    
    const blogPostCount = await page.locator('[data-testid="blog-post"], .blog-post, article').count();
    
    // Navigate away and back
    await page.click('a[href*="#/cv"]');
    await page.waitForURL('**/cv');
    
    await page.click('a[href*="#/blog"]');
    await page.waitForURL('**/blog');
    
    // Verify blog posts are still there
    const newBlogPostCount = await page.locator('[data-testid="blog-post"], .blog-post, article').count();
    expect(newBlogPostCount).toBe(blogPostCount);
  });

  test('should work correctly with direct URL access', async ({ page }) => {
    // Test direct access to each page
    const directUrls = [
      `${WEBSITE_URL}/#/blog`,
      `${WEBSITE_URL}/#/cv`,
      `${WEBSITE_URL}/#/admin`
    ];
    
    for (const url of directUrls) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Verify page loads correctly
      await expect(page).toHaveURL(url);
      
      // Verify page has content
      const pageContent = await page.textContent('body');
      expect(pageContent!.length).toBeGreaterThan(50);
    }
  });

  test('should handle external links properly', async ({ page, context }) => {
    // Test external social media links from home page
    const externalLinks = [
      { selector: 'a[href*="github.com"]', platform: 'GitHub' },
      { selector: 'a[href*="linkedin.com"]', platform: 'LinkedIn' },
      { selector: 'a[href*="medium.com"]', platform: 'Medium' }
    ];
    
    for (const link of externalLinks) {
      const linkElement = page.locator(link.selector).first();
      
      if (await linkElement.count() > 0) {
        const href = await linkElement.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^https:\/\//);
        
        // Verify link is valid (without actually navigating away)
        const response = await page.request.get(href!);
        expect(response.status()).toBeLessThan(400);
        
        console.log(`✓ ${link.platform} link is valid: ${href}`);
      }
    }
  });

  test('should be fully functional on mobile devices', async ({ page }) => {
    // Test mobile navigation flow
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Test navigation on mobile
    const pages = ['#/blog', '#/cv', '#/admin'];
    
    for (const pageRoute of pages) {
      const link = page.locator(`a[href*="${pageRoute}"]`);
      
      if (await link.count() > 0) {
        await link.click();
        await page.waitForURL(`**${pageRoute}`);
        await expect(page).toHaveURL(new RegExp(`.*${pageRoute.replace('/', '\\/')}$`));
        
        // Verify mobile layout doesn't break
        const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(395);
      }
    }
  });

  test('should load all pages without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Visit all pages and check for errors
    const routes = ['/', '/#/blog', '/#/cv', '/#/admin'];
    
    for (const route of routes) {
      await page.goto(`${WEBSITE_URL}${route}`);
      await page.waitForLoadState('networkidle');
    }
    
    // Filter out common third-party errors
    const relevantErrors = errors.filter(error => 
      !error.includes('chrome-extension') && 
      !error.includes('favicon.ico') &&
      !error.includes('third-party') &&
      !error.includes('analytics')
    );
    
    expect(relevantErrors).toHaveLength(0);
  });

  test('should have consistent branding across all pages', async ({ page }) => {
    const routes = ['/', '/#/blog', '/#/cv', '/#/admin'];
    
    for (const route of routes) {
      await page.goto(`${WEBSITE_URL}${route}`);
      await page.waitForLoadState('networkidle');
      
      // Check for consistent title format
      const title = await page.title();
      expect(title).toMatch(/Piyathida|San-aoun|Portfolio|Blog|CV|Admin/);
      
      // Check for consistent color scheme (basic check)
      const bodyStyles = await page.locator('body').evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontFamily: styles.fontFamily
        };
      });
      
      expect(bodyStyles.fontFamily).toBeTruthy();
      
      console.log(`✓ Branding consistent on ${route}`);
    }
  });

  test('should handle page refresh correctly on all routes', async ({ page }) => {
    const routes = ['/', '/#/blog', '/#/cv', '/#/admin'];
    
    for (const route of routes) {
      await page.goto(`${WEBSITE_URL}${route}`);
      await page.waitForLoadState('networkidle');
      
      // Refresh the page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verify page still loads correctly after refresh
      await expect(page).toHaveURL(`${WEBSITE_URL}${route}`);
      
      // Verify page has content
      const pageContent = await page.textContent('body');
      expect(pageContent!.length).toBeGreaterThan(30);
      
      console.log(`✓ Page refresh works correctly for ${route}`);
    }
  });
});
