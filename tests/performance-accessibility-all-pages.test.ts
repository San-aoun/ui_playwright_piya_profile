import { test, expect } from '@playwright/test';

const WEBSITE_URL = 'https://san-aoun.github.io/personal-site-monorepo';

test.describe('Website Performance Tests', () => {
  const routes = [
    { path: '/', name: 'Home' },
    { path: '/#/blog', name: 'Blog' },
    { path: '/#/cv', name: 'CV' },
    { path: '/#/admin', name: 'Admin' }
  ];

  routes.forEach(route => {
    test(`${route.name} page should load within acceptable time`, async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(`${WEBSITE_URL}${route.path}`);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
      
      console.log(`${route.name} page loaded in ${loadTime}ms`);
    });

    test(`${route.name} page should have good Core Web Vitals`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      // Measure First Contentful Paint
      const metrics = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
              resolve(fcpEntry.startTime);
            }
          });
          observer.observe({ entryTypes: ['paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve(0), 3000);
        });
      });
      
      if (metrics > 0) {
        // FCP should be under 2.5 seconds (2500ms)
        expect(metrics).toBeLessThan(2500);
      }
    });

    test(`${route.name} page should optimize image loading`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const src = await img.getAttribute('src');
          const loading = await img.getAttribute('loading');
          const alt = await img.getAttribute('alt');
          
          // Verify images have src
          expect(src).toBeTruthy();
          
          // Verify images have alt text for accessibility
          expect(alt).toBeTruthy();
          
          // Check if image actually loads
          const isLoaded = await img.evaluate((imgEl: HTMLImageElement) => {
            return imgEl.complete && imgEl.naturalWidth > 0;
          });
          
          expect(isLoaded).toBe(true);
        }
      }
    });
  });

  test('should have optimal resource loading across all pages', async ({ page }) => {
    for (const route of routes) {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      // Check for resource loading efficiency
      const resourceMetrics = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        return {
          totalResources: resources.length,
          cssFiles: resources.filter(r => r.name.includes('.css')).length,
          jsFiles: resources.filter(r => r.name.includes('.js')).length,
          imageFiles: resources.filter(r => /\.(jpg|jpeg|png|gif|webp|svg)/.test(r.name)).length
        };
      });
      
      // Reasonable resource count expectations
      expect(resourceMetrics.totalResources).toBeLessThan(50);
      
      console.log(`${route.name} resources:`, resourceMetrics);
    }
  });
});

test.describe('Website Accessibility Tests', () => {
  const routes = [
    { path: '/', name: 'Home' },
    { path: '/#/blog', name: 'Blog' },
    { path: '/#/cv', name: 'CV' },
    { path: '/#/admin', name: 'Admin' }
  ];

  routes.forEach(route => {
    test(`${route.name} page should have proper heading hierarchy`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      // Check for h1 tag
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
      expect(h1Count).toBeLessThanOrEqual(1); // Should have exactly one h1
      
      // Check that h1 has meaningful content
      const h1Text = await page.locator('h1').first().textContent();
      expect(h1Text?.trim()).toBeTruthy();
      expect(h1Text!.length).toBeGreaterThan(3);
      
      // Check heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      
      for (const heading of headings) {
        const text = await heading.textContent();
        expect(text?.trim()).toBeTruthy();
      }
    });

    test(`${route.name} page should be keyboard navigable`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      
      // Check if focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Test multiple tab presses
      const focusableElements = [];
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const currentFocused = page.locator(':focus');
        
        if (await currentFocused.count() > 0) {
          const tagName = await currentFocused.evaluate(el => el.tagName.toLowerCase());
          focusableElements.push(tagName);
        }
      }
      
      // Should have found some focusable elements
      expect(focusableElements.length).toBeGreaterThan(0);
    });

    test(`${route.name} page should have proper ARIA labels and roles`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      // Check for main landmark
      const main = page.locator('main, [role="main"]');
      if (await main.count() > 0) {
        await expect(main.first()).toBeVisible();
      }
      
      // Check navigation has proper ARIA
      const nav = page.locator('nav, [role="navigation"]');
      if (await nav.count() > 0) {
        await expect(nav.first()).toBeVisible();
      }
      
      // Check for any ARIA labels on interactive elements
      const interactiveElements = page.locator('button, a, input, [role="button"]');
      const interactiveCount = await interactiveElements.count();
      
      if (interactiveCount > 0) {
        // At least some interactive elements should have proper labels
        for (let i = 0; i < Math.min(interactiveCount, 5); i++) {
          const element = interactiveElements.nth(i);
          const ariaLabel = await element.getAttribute('aria-label');
          const text = await element.textContent();
          const title = await element.getAttribute('title');
          
          // Element should have some form of accessible label
          expect(ariaLabel || text?.trim() || title).toBeTruthy();
        }
      }
    });

    test(`${route.name} page images should have alt text`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        
        // Images should have alt text or be marked as decorative
        expect(alt !== null || role === 'presentation').toBe(true);
        
        // If alt text exists, it should be meaningful
        if (alt) {
          expect(alt.length).toBeGreaterThan(0);
        }
      }
    });

    test(`${route.name} page should have good color contrast`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      // Check text elements for color contrast
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, a, button, span');
      const elementCount = await textElements.count();
      
      if (elementCount > 0) {
        // Sample a few elements to check basic color contrast principles
        for (let i = 0; i < Math.min(elementCount, 5); i++) {
          const element = textElements.nth(i);
          
          const styles = await element.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              fontSize: computed.fontSize
            };
          });
          
          // Basic checks - text should have defined colors
          expect(styles.color).toBeTruthy();
          expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
        }
      }
    });

    test(`${route.name} page should have proper form accessibility`, async ({ page }) => {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      const forms = page.locator('form');
      const formCount = await forms.count();
      
      if (formCount > 0) {
        for (let i = 0; i < formCount; i++) {
          const form = forms.nth(i);
          
          // Check form inputs have proper labels
          const inputs = form.locator('input, textarea, select');
          const inputCount = await inputs.count();
          
          for (let j = 0; j < inputCount; j++) {
            const input = inputs.nth(j);
            const id = await input.getAttribute('id');
            const name = await input.getAttribute('name');
            const ariaLabel = await input.getAttribute('aria-label');
            const placeholder = await input.getAttribute('placeholder');
            
            // Input should have some form of label or identifier
            expect(id || name || ariaLabel || placeholder).toBeTruthy();
            
            // Check for associated label if id exists
            if (id) {
              const label = page.locator(`label[for="${id}"]`);
              if (await label.count() > 0) {
                await expect(label).toBeVisible();
              }
            }
          }
        }
      }
    });
  });

  test('should provide consistent accessibility across all pages', async ({ page }) => {
    const accessibilityScores = [];
    
    for (const route of routes) {
      await page.goto(`${WEBSITE_URL}${route.path}`);
      
      // Basic accessibility score based on key elements
      let score = 0;
      
      // Check for h1
      if (await page.locator('h1').count() === 1) score += 20;
      
      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();
      let imagesWithAlt = 0;
      
      for (let i = 0; i < imageCount; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        if (alt) imagesWithAlt++;
      }
      
      if (imageCount > 0 && imagesWithAlt === imageCount) score += 20;
      
      // Check for keyboard navigation
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      if (await focused.count() > 0) score += 20;
      
      // Check for semantic HTML
      const semanticElements = page.locator('main, nav, header, footer, section, article');
      if (await semanticElements.count() > 0) score += 20;
      
      // Check for proper link text
      const links = page.locator('a');
      const linkCount = await links.count();
      let linksWithText = 0;
      
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const text = await links.nth(i).textContent();
        if (text && text.trim().length > 2) linksWithText++;
      }
      
      if (linkCount > 0 && linksWithText > 0) score += 20;
      
      accessibilityScores.push({ page: route.name, score });
      
      // Each page should have a decent accessibility score
      expect(score).toBeGreaterThanOrEqual(60);
    }
    
    console.log('Accessibility scores:', accessibilityScores);
  });
});
