import { Page } from '@playwright/test';

export class TestUtils {
  static async waitForAnimation(page: Page, selector: string, timeout: number = 5000) {
    const element = page.locator(selector);
    await element.waitFor({ timeout });
    
    // Wait for any CSS animations to complete
    await page.waitForFunction(
      (sel) => {
        const el = document.querySelector(sel);
        if (!el) return true;
        
        const animations = el.getAnimations();
        return animations.every(animation => animation.playState === 'finished');
      },
      selector,
      { timeout }
    );
  }

  static async takeFullPageScreenshot(page: Page, name: string) {
    await page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  static async scrollToBottom(page: Page) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait for any lazy-loaded content
    await page.waitForTimeout(1000);
  }

  static async getPageLoadMetrics(page: Page) {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });
  }

  static async checkConsoleErrors(page: Page): Promise<string[]> {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    return errors;
  }

  static async simulateNetworkConditions(page: Page, condition: 'slow3g' | 'fast3g' | 'offline') {
    const conditions = {
      slow3g: { downloadThroughput: 50000, uploadThroughput: 50000, latency: 2000 },
      fast3g: { downloadThroughput: 150000, uploadThroughput: 150000, latency: 562.5 },
      offline: { downloadThroughput: 0, uploadThroughput: 0, latency: 0 }
    };
    
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Network.emulateNetworkConditions', {
      offline: condition === 'offline',
      ...conditions[condition]
    });
  }

  static async verifyNoJSErrors(page: Page): Promise<boolean> {
    const errors = await this.checkConsoleErrors(page);
    return errors.length === 0;
  }

  static generateRandomEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'test.com'];
    const randomString = Math.random().toString(36).substring(2, 10);
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    return `${randomString}@${randomDomain}`;
  }

  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
