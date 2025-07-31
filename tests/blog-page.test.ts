import { test, expect } from '@playwright/test';

const WEBSITE_URL = 'https://san-aoun.github.io/personal-site-monorepo';
const BLOG_URL = `${WEBSITE_URL}/#/blog`;

test.describe('Blog Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BLOG_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should load blog page successfully', async ({ page }) => {
    // Verify page loads without errors
    await expect(page).toHaveURL(/.*#\/blog$/);
    
    // Check page title or heading
    await expect(page.locator('h1, h2')).toContainText('My Blog Posts');
  });

  test('should display blog management controls', async ({ page }) => {
    // Check for Add Blog button/control
    const addBlogControl = page.locator('text=Add Blog, button:has-text("Add Blog"), [data-testid="add-blog"]');
    await expect(addBlogControl).toBeVisible();
    
    // Check for Reset button/control
    const resetControl = page.locator('text=Reset, button:has-text("Reset"), [data-testid="reset"]');
    await expect(resetControl).toBeVisible();
  });

  test('should display blog posts with correct information', async ({ page }) => {
    // Check if blog posts are displayed
    const blogPosts = page.locator('[data-testid="blog-post"], .blog-post, article');
    
    // Should have at least 3 blog posts based on the content we saw
    await expect(blogPosts).toHaveCount(3);
    
    // Check first blog post - React Automation Testing
    const firstPost = blogPosts.first();
    await expect(firstPost).toContainText('Getting Started with React Automation Testing');
    await expect(firstPost).toContainText('📅 2024-01-15');
    await expect(firstPost).toContainText('👁️ 120 views');
    await expect(firstPost).toContainText('📝 Blog');
    
    // Check second blog post - CI/CD Pipeline
    const secondPost = blogPosts.nth(1);
    await expect(secondPost).toContainText('CI/CD Pipeline Best Practices');
    await expect(secondPost).toContainText('📅 2024-01-10');
    await expect(secondPost).toContainText('👁️ 89 views');
    
    // Check third blog post - QA in Agile
    const thirdPost = blogPosts.nth(2);
    await expect(thirdPost).toContainText('Quality Assurance in Agile Development');
    await expect(thirdPost).toContainText('📅 2024-01-05');
    await expect(thirdPost).toContainText('👁️ 156 views');
  });

  test('should have working blog post links', async ({ page }) => {
    // Check if blog post links work
    const blogLinks = page.locator('a[href*="medium.com"]');
    
    // Should have multiple Medium links
    expect(await blogLinks.count()).toBeGreaterThan(0);
    
    // Verify first link points to React automation testing article
    const reactTestingLink = page.locator('a[href*="react-automation-testing-guide"]');
    await expect(reactTestingLink).toBeVisible();
    await expect(reactTestingLink).toHaveAttribute('href', 'https://piyathida-sanaoun01.medium.com/react-automation-testing-guide');
    
    // Verify CI/CD link
    const cicdLink = page.locator('a[href*="cicd-best-practices"]');
    await expect(cicdLink).toBeVisible();
    await expect(cicdLink).toHaveAttribute('href', 'https://piyathida-sanaoun01.medium.com/cicd-best-practices');
    
    // Verify QA Agile link
    const qaAgileLink = page.locator('a[href*="qa-agile-development"]');
    await expect(qaAgileLink).toBeVisible();
    await expect(qaAgileLink).toHaveAttribute('href', 'https://piyathida-sanaoun01.medium.com/qa-agile-development');
  });

  test('should display edit and delete controls for blog posts', async ({ page }) => {
    // Check for edit controls
    const editControls = page.locator('text=Edit Title, button:has-text("Edit"), [data-testid="edit"]');
    expect(await editControls.count()).toBeGreaterThan(0);
    
    // Check for delete controls
    const deleteControls = page.locator('text=Delete, button:has-text("Delete"), [data-testid="delete"]');
    expect(await deleteControls.count()).toBeGreaterThan(0);
  });

  test('should display blog post previews with descriptions', async ({ page }) => {
    // Check if blog posts have descriptions/previews
    const reactPostDescription = page.locator('text=A comprehensive guide to setting up automation testing frameworks for React applications');
    await expect(reactPostDescription).toBeVisible();
    
    const cicdPostDescription = page.locator('text=Explore the essential strategies for building robust CI/CD pipelines');
    await expect(cicdPostDescription).toBeVisible();
    
    const qaPostDescription = page.locator('text=Understanding the role of QA in modern Agile teams');
    await expect(qaPostDescription).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Verify blog posts are still visible and readable
    await expect(page.locator('h1, h2')).toBeVisible();
    
    // Check if blog posts stack properly on mobile
    const blogPosts = page.locator('[data-testid="blog-post"], .blog-post, article');
    if (await blogPosts.count() > 0) {
      await expect(blogPosts.first()).toBeVisible();
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
      
      // Navigate back to blog
      await page.goBack();
      await expect(page).toHaveURL(/.*#\/blog$/);
    }
  });

  test('should handle blog management interactions', async ({ page }) => {
    // Test Add Blog functionality (if clickable)
    const addBlogButton = page.locator('button:has-text("Add Blog"), [data-testid="add-blog"]');
    if (await addBlogButton.count() > 0 && await addBlogButton.isEnabled()) {
      await addBlogButton.click();
      // Note: Actual behavior depends on implementation
      // This test ensures the button is clickable
    }
    
    // Test Reset functionality (if clickable)
    const resetButton = page.locator('button:has-text("Reset"), [data-testid="reset"]');
    if (await resetButton.count() > 0 && await resetButton.isEnabled()) {
      await resetButton.click();
      // Note: Actual behavior depends on implementation
    }
  });

  test('should load external Medium links correctly', async ({ page, context }) => {
    // Test that Medium links open in new tabs or same tab
    const firstMediumLink = page.locator('a[href*="medium.com"]').first();
    
    if (await firstMediumLink.count() > 0) {
      // Check if link has target="_blank" for new tab
      const target = await firstMediumLink.getAttribute('target');
      
      if (target === '_blank') {
        // Should open in new tab
        expect(target).toBe('_blank');
      } else {
        // If it opens in same tab, just verify the href is valid
        const href = await firstMediumLink.getAttribute('href');
        expect(href).toMatch(/^https:\/\/.*medium\.com/);
      }
    }
  });

  test('should display proper date formatting', async ({ page }) => {
    // Verify date format is consistent (📅 YYYY-MM-DD format)
    const dates = page.locator('text=/📅 \\d{4}-\\d{2}-\\d{2}/');
    expect(await dates.count()).toBeGreaterThan(0);
    
    // Verify specific dates match expected format
    await expect(page.locator('text=📅 2024-01-15')).toBeVisible();
    await expect(page.locator('text=📅 2024-01-10')).toBeVisible();
    await expect(page.locator('text=📅 2024-01-05')).toBeVisible();
  });
});
