import { test, expect } from '@playwright/test';

const WEBSITE_URL = 'https://san-aoun.github.io/personal-site-monorepo';
const CV_URL = `${WEBSITE_URL}/#/cv`;

test.describe('CV Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CV_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should load CV page successfully', async ({ page }) => {
    // Verify page loads without errors
    await expect(page).toHaveURL(/.*#\/cv$/);
  });

  test('should display PDF download link', async ({ page }) => {
    // Check for PDF download link
    const pdfDownloadLink = page.locator('a[href*=".pdf"], a:has-text("Download PDF")');
    await expect(pdfDownloadLink).toBeVisible();
    
    // Verify the link points to the correct PDF file
    await expect(pdfDownloadLink).toHaveAttribute('href', /.*Piyathida.*San-aoun.*\.pdf$/);
    
    // Verify link text
    await expect(pdfDownloadLink).toContainText('Download PDF');
  });

  test('should display CV images', async ({ page }) => {
    // Check for CV page 1 image
    const cvPage1Image = page.locator('img[alt*="CV Page 1"], img[src*="cv1.png"]');
    await expect(cvPage1Image).toBeVisible();
    await expect(cvPage1Image).toHaveAttribute('src', /.*cv1\.png$/);
    
    // Check for CV page 2 image
    const cvPage2Image = page.locator('img[alt*="CV Page 2"], img[src*="cv2.png"]');
    await expect(cvPage2Image).toBeVisible();
    await expect(cvPage2Image).toHaveAttribute('src', /.*cv2\.png$/);
  });

  test('should verify CV images load properly', async ({ page }) => {
    // Wait for images to load and verify they're not broken
    const cvImages = page.locator('img[src*="cv"]');
    
    for (let i = 0; i < await cvImages.count(); i++) {
      const image = cvImages.nth(i);
      
      // Check if image is visible
      await expect(image).toBeVisible();
      
      // Verify image has loaded (naturalWidth > 0 indicates successful load)
      const isLoaded = await image.evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalWidth > 0;
      });
      
      expect(isLoaded).toBe(true);
    }
  });

  test('should be accessible and readable', async ({ page }) => {
    // Verify CV images have proper alt text for accessibility
    const cvPage1 = page.locator('img[src*="cv1.png"]');
    const cvPage2 = page.locator('img[src*="cv2.png"]');
    
    if (await cvPage1.count() > 0) {
      const alt1 = await cvPage1.getAttribute('alt');
      expect(alt1).toBeTruthy();
    }
    
    if (await cvPage2.count() > 0) {
      const alt2 = await cvPage2.getAttribute('alt');
      expect(alt2).toBeTruthy();
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Verify CV images are still visible and properly sized
    const cvImages = page.locator('img[src*="cv"]');
    
    if (await cvImages.count() > 0) {
      await expect(cvImages.first()).toBeVisible();
      
      // Check if images scale properly on mobile
      const imageWidth = await cvImages.first().evaluate((img: HTMLImageElement) => {
        return img.getBoundingClientRect().width;
      });
      
      // Image should not exceed mobile viewport width
      expect(imageWidth).toBeLessThanOrEqual(375);
    }
    
    // Verify download link is still accessible
    const downloadLink = page.locator('a:has-text("Download PDF")');
    if (await downloadLink.count() > 0) {
      await expect(downloadLink).toBeVisible();
    }
  });

  test('should be responsive on tablet devices', async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    // Verify CV layout adapts to tablet size
    const cvImages = page.locator('img[src*="cv"]');
    await expect(cvImages.first()).toBeVisible();
    
    // Verify images are properly displayed side by side or stacked
    if (await cvImages.count() >= 2) {
      await expect(cvImages.nth(1)).toBeVisible();
    }
  });

  test('should maintain navigation functionality', async ({ page }) => {
    // Test navigation back to home
    const homeLink = page.locator('a[href*="#/"]').first();
    if (await homeLink.count() > 0) {
      await homeLink.click();
      await expect(page).toHaveURL(/.*#\/$/);
      
      // Navigate back to CV
      await page.goBack();
      await expect(page).toHaveURL(/.*#\/cv$/);
    }
    
    // Test navigation to blog
    const blogLink = page.locator('a[href*="#/blog"]');
    if (await blogLink.count() > 0) {
      await blogLink.click();
      await expect(page).toHaveURL(/.*#\/blog$/);
      
      // Navigate back to CV
      await page.goBack();
      await expect(page).toHaveURL(/.*#\/cv$/);
    }
  });

  test('should handle PDF download interaction', async ({ page }) => {
    // Test PDF download link functionality
    const downloadLink = page.locator('a[href*=".pdf"]');
    
    if (await downloadLink.count() > 0) {
      // Get the href attribute
      const pdfUrl = await downloadLink.getAttribute('href');
      expect(pdfUrl).toBeTruthy();
      
      // Verify the PDF URL is accessible (should not be a 404)
      const response = await page.request.get(pdfUrl!);
      expect(response.status()).toBe(200);
      
      // Verify content type is PDF
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('pdf');
    }
  });

  test('should display CV content in high quality', async ({ page }) => {
    // Verify CV images are displayed in good quality
    const cvImages = page.locator('img[src*="cv"]');
    
    for (let i = 0; i < await cvImages.count(); i++) {
      const image = cvImages.nth(i);
      
      // Check image dimensions to ensure it's high quality
      const { width, height } = await image.evaluate((img: HTMLImageElement) => ({
        width: img.naturalWidth,
        height: img.naturalHeight
      }));
      
      // CV images should have reasonable dimensions (not too small)
      expect(width).toBeGreaterThan(500);
      expect(height).toBeGreaterThan(600);
    }
  });

  test('should load page without JavaScript errors', async ({ page }) => {
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

  test('should provide good user experience for CV viewing', async ({ page }) => {
    // Test that users can easily view and interact with CV
    
    // Check if there's any zoom functionality
    const cvImages = page.locator('img[src*="cv"]');
    
    if (await cvImages.count() > 0) {
      // Click on first image to see if it supports zoom/fullscreen
      await cvImages.first().click();
      
      // Wait a moment for any zoom behavior
      await page.waitForTimeout(500);
      
      // Test that the image is still visible (whether zoomed or not)
      await expect(cvImages.first()).toBeVisible();
    }
    
    // Verify scroll behavior works properly with long CV content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
  });
});
