import { test, expect } from '@playwright/test';

const WEBSITE_URL = 'https://san-aoun.github.io/personal-site-monorepo';

test.describe('Cross-Browser Compatibility Tests', () => {
  const routes = [
    { path: '/', name: 'Home' },
    { path: '/#/blog', name: 'Blog' },
    { path: '/#/cv', name: 'CV' },
    { path: '/#/admin', name: 'Admin' }
  ];

  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    routes.forEach(route => {
      test(`${route.name} page should work correctly in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
        // Skip if not the current browser being tested
        test.skip(currentBrowser !== browserName, `This test is for ${browserName} only`);
        
        await page.goto(`${WEBSITE_URL}${route.path}`);
        await page.waitForLoadState('networkidle');
        
        // Basic functionality should work across all browsers
        await expect(page).toHaveURL(`${WEBSITE_URL}${route.path}`);
        
        // Check if page has meaningful content
        const pageContent = await page.textContent('body');
        expect(pageContent!.length).toBeGreaterThan(50);
        
        // Check if CSS is loaded properly
        const bodyStyles = await page.locator('body').evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            fontFamily: styles.fontFamily,
            backgroundColor: styles.backgroundColor,
          };
        });
        
        expect(bodyStyles.fontFamily).toBeTruthy();
        
        console.log(`✓ ${route.name} page works in ${browserName}`);
      });
    });
  });
});

test.describe('Mobile Responsiveness Tests', () => {
  const devices = [
    { name: 'iPhone 13', viewport: { width: 390, height: 844 } },
    { name: 'Samsung Galaxy S21', viewport: { width: 384, height: 854 } },
    { name: 'iPad', viewport: { width: 768, height: 1024 } },
    { name: 'iPad Pro', viewport: { width: 1024, height: 1366 } },
  ];

  const routes = [
    { path: '/', name: 'Home' },
    { path: '/#/blog', name: 'Blog' },
    { path: '/#/cv', name: 'CV' },
    { path: '/#/admin', name: 'Admin' }
  ];

  devices.forEach(device => {
    routes.forEach(route => {
      test(`${route.name} page should be responsive on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        await page.goto(`${WEBSITE_URL}${route.path}`);
        await page.waitForLoadState('networkidle');
        
        // Check if content is properly visible
        await expect(page.locator('body')).toBeVisible();
        
        // Verify no horizontal scroll on mobile
        if (device.viewport.width < 768) {
          const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
          expect(bodyWidth).toBeLessThanOrEqual(device.viewport.width + 20); // Small tolerance
        }
        
        // Check if main content is accessible
        const mainContent = page.locator('h1, h2, main, [role="main"]');
        if (await mainContent.count() > 0) {
          await expect(mainContent.first()).toBeVisible();
        }
        
        // Check if navigation is accessible (might be hamburger menu)
        const nav = page.locator('nav, .navigation, .navbar, .menu-toggle');
        if (await nav.count() > 0) {
          await expect(nav.first()).toBeVisible();
        }
        
        console.log(`✓ ${route.name} responsive on ${device.name}`);
      });
    });
  });
});

test.describe('SEO and Meta Tags Tests', () => {
  const routes = [
    { path: '/', name: 'Home', expectedTitle: /Piyathida San-aoun/ },
    { path: '/#/blog', name: 'Blog', expectedTitle: /Blog|Piyathida/ },
    { path: '/#/cv', name: 'CV', expectedTitle: /CV|Resume|Piyathida/ },
    { path: '/#/admin', name: 'Admin', expectedTitle: /Admin|Piyathida/ }
  ];

  routes.forEach(route => {
    test(`${route.name} page should have proper meta tags`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      // Check title
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(5);
      expect(title.length).toBeLessThan(60); // SEO best practice
      
      // Check if title matches expected pattern
      if (route.expectedTitle) {
        expect(title).toMatch(route.expectedTitle);
      }
      
      // Check viewport meta tag
      const viewport = page.locator('meta[name="viewport"]');
      if (await viewport.count() > 0) {
        const content = await viewport.getAttribute('content');
        expect(content).toContain('width=device-width');
      }
      
      // Check for meta description (if present)
      const metaDescription = page.locator('meta[name="description"]');
      if (await metaDescription.count() > 0) {
        const description = await metaDescription.getAttribute('content');
        expect(description).toBeTruthy();
        expect(description!.length).toBeGreaterThan(20);
        expect(description!.length).toBeLessThan(160); // SEO best practice
      }
      
      console.log(`✓ ${route.name} has proper meta tags`);
    });

    test(`${route.name} page should have proper Open Graph tags`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      // Check for Open Graph tags (optional but good for social sharing)
      const ogTitle = page.locator('meta[property="og:title"]');
      const ogDescription = page.locator('meta[property="og:description"]');
      const ogType = page.locator('meta[property="og:type"]');
      const ogUrl = page.locator('meta[property="og:url"]');
      
      if (await ogTitle.count() > 0) {
        const title = await ogTitle.getAttribute('content');
        expect(title).toBeTruthy();
        expect(title!.length).toBeGreaterThan(5);
      }
      
      if (await ogType.count() > 0) {
        const type = await ogType.getAttribute('content');
        expect(type).toBeTruthy();
      }
      
      if (await ogUrl.count() > 0) {
        const url = await ogUrl.getAttribute('content');
        expect(url).toMatch(/^https?:\/\//);
      }
    });
  });
});

test.describe('Security and Privacy Tests', () => {
  const routes = [
    { path: '/', name: 'Home' },
    { path: '/#/blog', name: 'Blog' },
    { path: '/#/cv', name: 'CV' },
    { path: '/#/admin', name: 'Admin' }
  ];

  routes.forEach(route => {
    test(`${route.name} page should use HTTPS`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      const url = page.url();
      expect(url).toMatch(/^https:\/\//);
    });

    test(`${route.name} page should not expose sensitive information`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      // Check that no sensitive data is exposed in page source
      const pageContent = await page.content();
      
      // Should not contain common sensitive patterns
      expect(pageContent).not.toMatch(/password\s*[:=]\s*["'][^"']+["']/i);
      expect(pageContent).not.toMatch(/api[_-]?key\s*[:=]\s*["'][^"']+["']/i);
      expect(pageContent).not.toMatch(/secret\s*[:=]\s*["'][^"']+["']/i);
      
      // Admin page might have forms, but should not expose credentials
      if (route.path.includes('admin')) {
        expect(pageContent).not.toMatch(/admin.*password.*[a-zA-Z0-9]{8,}/i);
      }
    });
  });
});

test.describe('Content Quality Tests', () => {
  test('Home page should have comprehensive professional information', async ({ page }) => {
    await page.goto(`${WEBSITE_URL}/`);
    
    // Check for key professional information
    await expect(page.locator('text=Piyathida San-aoun')).toBeVisible();
    await expect(page.locator('text=Software Development Engineer in Test')).toBeVisible();
    await expect(page.locator('text=10 years of experience')).toBeVisible();
    await expect(page.locator('text=automation QA')).toBeVisible();
    await expect(page.locator('text=London Stock Exchange Group')).toBeVisible();
    
    // Check for contact/social links
    const githubLink = page.locator('a[href*="github.com"]');
    const linkedinLink = page.locator('a[href*="linkedin.com"]');
    const mediumLink = page.locator('a[href*="medium.com"]');
    
    await expect(githubLink).toBeVisible();
    await expect(linkedinLink).toBeVisible();
    await expect(mediumLink).toBeVisible();
  });

  test('Blog page should have quality content', async ({ page }) => {
    await page.goto(`${WEBSITE_URL}/#/blog`);
    
    // Check for blog posts with proper metadata
    await expect(page.locator('text=My Blog Posts')).toBeVisible();
    
    // Check for specific blog posts
    await expect(page.locator('text=React Automation Testing')).toBeVisible();
    await expect(page.locator('text=CI/CD Pipeline Best Practices')).toBeVisible();
    await expect(page.locator('text=Quality Assurance in Agile Development')).toBeVisible();
    
    // Check for proper date formatting
    await expect(page.locator('text=📅 2024-01-15')).toBeVisible();
    await expect(page.locator('text=👁️ 120 views')).toBeVisible();
    
    // Check for working Medium links
    const mediumLinks = page.locator('a[href*="medium.com"]');
    expect(await mediumLinks.count()).toBeGreaterThan(0);
  });

  test('CV page should provide downloadable resume', async ({ page }) => {
    await page.goto(`${WEBSITE_URL}/#/cv`);
    
    // Check for PDF download
    const downloadLink = page.locator('a[href*=".pdf"]');
    await expect(downloadLink).toBeVisible();
    await expect(downloadLink).toContainText('Download PDF');
    
    // Check for CV images
    const cvImages = page.locator('img[src*="cv"]');
    expect(await cvImages.count()).toBeGreaterThanOrEqual(2);
    
    // Verify images load properly
    for (let i = 0; i < await cvImages.count(); i++) {
      const img = cvImages.nth(i);
      await expect(img).toBeVisible();
      
      const isLoaded = await img.evaluate((imgEl: HTMLImageElement) => {
        return imgEl.complete && imgEl.naturalWidth > 0;
      });
      expect(isLoaded).toBe(true);
    }
  });

  test('Admin page should have proper functionality', async ({ page }) => {
    await page.goto(`${WEBSITE_URL}/#/admin`);
    
    // Check for admin panel
    await expect(page.locator('text=Admin Panel')).toBeVisible();
    
    // Check for admin controls
    const createPostControl = page.locator('text=Create Post');
    await expect(createPostControl).toBeVisible();
    
    // Verify admin functionality is protected or properly structured
    const forms = page.locator('form');
    if (await forms.count() > 0) {
      // If there are forms, they should have proper structure
      const firstForm = forms.first();
      const inputs = firstForm.locator('input, textarea, select');
      
      if (await inputs.count() > 0) {
        // Forms should have proper input types and attributes
        for (let i = 0; i < await inputs.count(); i++) {
          const input = inputs.nth(i);
          const type = await input.getAttribute('type');
          const name = await input.getAttribute('name');
          
          expect(type || name).toBeTruthy();
        }
      }
    }
  });
});
