import { test, expect } from '@playwright/test';

// Piyathida San-aoun's personal website
const WEBSITE_URL = 'https://san-aoun.github.io/personal-site-monorepo';

test.describe('Profile Website Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to your website before each test
    await page.goto(WEBSITE_URL);
  });

  test('Homepage loads successfully', async ({ page }) => {
    // Verify page loads without errors
    await expect(page).toHaveURL(WEBSITE_URL);
    
    // Check page title (update expected title)
    await expect(page).toHaveTitle(/Your Name - Portfolio/);
    
    // Verify main navigation is visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Check hero section is present
    const heroSection = page.locator('.hero, #hero, [data-testid="hero"]');
    await expect(heroSection).toBeVisible();
  });

  test('Navigation menu works correctly', async ({ page }) => {
    // Test navigation links
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    
    expect(linkCount).toBeGreaterThan(0);
    
    // Test each navigation link
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      
      if (href && !href.startsWith('http')) {
        // Internal link
        await link.click();
        await page.waitForLoadState('networkidle');
        
        // Verify page changed or scrolled
        const currentUrl = page.url();
        expect(currentUrl).toBeTruthy();
        
        // Go back to home for next iteration
        await page.goto(WEBSITE_URL);
      }
    }
  });

  test('About section is visible and informative', async ({ page }) => {
    // Scroll to about section
    const aboutSection = page.locator('#about, .about, [data-testid="about"]');
    await aboutSection.scrollIntoViewIfNeeded();
    
    // Verify about section is visible
    await expect(aboutSection).toBeVisible();
    
    // Check if about section has content
    const aboutText = await aboutSection.textContent();
    expect(aboutText?.length).toBeGreaterThan(50);
  });

  test('Skills section displays properly', async ({ page }) => {
    // Find skills section
    const skillsSection = page.locator('#skills, .skills, [data-testid="skills"]');
    await skillsSection.scrollIntoViewIfNeeded();
    
    // Verify skills section is visible
    await expect(skillsSection).toBeVisible();
    
    // Check for skill items
    const skillItems = skillsSection.locator('.skill, .skill-item, [data-testid="skill"]');
    const skillCount = await skillItems.count();
    
    expect(skillCount).toBeGreaterThan(0);
  });

  test('Projects section shows work', async ({ page }) => {
    // Navigate to projects section
    const projectsSection = page.locator('#projects, .projects, [data-testid="projects"]');
    await projectsSection.scrollIntoViewIfNeeded();
    
    // Verify projects section is visible
    await expect(projectsSection).toBeVisible();
    
    // Check for project cards/items
    const projectItems = projectsSection.locator('.project, .project-card, [data-testid="project"]');
    const projectCount = await projectItems.count();
    
    expect(projectCount).toBeGreaterThan(0);
    
    // Test project links if they exist
    const projectLinks = projectItems.locator('a');
    if (await projectLinks.count() > 0) {
      // Verify first project link
      const firstLink = projectLinks.first();
      await expect(firstLink).toHaveAttribute('href');
    }
  });

  test('Contact form functionality', async ({ page }) => {
    // Navigate to contact section or page
    const contactSection = page.locator('#contact, .contact, [data-testid="contact"]');
    await contactSection.scrollIntoViewIfNeeded();
    
    // Check if contact form exists
    const contactForm = page.locator('form');
    if (await contactForm.count() > 0) {
      // Test form fields
      const nameField = contactForm.locator('input[name="name"], input[id="name"]');
      const emailField = contactForm.locator('input[name="email"], input[id="email"]');
      const messageField = contactForm.locator('textarea[name="message"], textarea[id="message"]');
      
      // Fill out form
      if (await nameField.count() > 0) {
        await nameField.fill('Test User');
      }
      if (await emailField.count() > 0) {
        await emailField.fill('test@example.com');
      }
      if (await messageField.count() > 0) {
        await messageField.fill('This is a test message from Playwright automation.');
      }
      
      // Note: Don't actually submit in tests unless you want to send test emails
      // await page.click('button[type="submit"]');
    }
  });

  test('Social media links work', async ({ page }) => {
    // Look for social media links
    const socialLinks = page.locator('.social a, .social-links a, [data-testid="social-link"]');
    const socialCount = await socialLinks.count();
    
    if (socialCount > 0) {
      // Verify each social link has proper href
      for (let i = 0; i < socialCount; i++) {
        const link = socialLinks.nth(i);
        const href = await link.getAttribute('href');
        
        expect(href).toBeTruthy();
        expect(href).toMatch(/^https?:\/\//);
      }
    }
  });

  test('Website is responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Verify navigation is still accessible (may be hamburger menu)
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check if mobile menu toggle exists
    const mobileMenuToggle = page.locator('.menu-toggle, .hamburger, [data-testid="mobile-menu"]');
    if (await mobileMenuToggle.count() > 0) {
      await mobileMenuToggle.click();
      // Verify mobile menu opens
      await page.waitForTimeout(500); // Wait for animation
    }
    
    // Verify content is not horizontally scrolling
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(395); // 375 + some tolerance
  });

  test('Website has good accessibility', async ({ page }) => {
    // Check for main heading
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Verify images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Images should have alt text or be marked as decorative
      expect(alt !== null || role === 'presentation').toBe(true);
    }
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('Page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(WEBSITE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('Images are optimized', async ({ page }) => {
    await page.goto(WEBSITE_URL);
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check if images have proper loading attributes
      for (let i = 0; i < Math.min(imageCount, 5); i++) { // Check first 5 images
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        const loading = await img.getAttribute('loading');
        
        expect(src).toBeTruthy();
        
        // Optionally check for lazy loading
        if (i > 0) { // First image usually shouldn't be lazy loaded
          expect(loading).toBe('lazy');
        }
      }
    }
  });
});
