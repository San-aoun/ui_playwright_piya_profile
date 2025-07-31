import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  readonly contactForm: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly socialLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.contactForm = page.locator('form, .contact-form, [data-testid="contact-form"]');
    this.nameInput = page.locator('input[name="name"], input[id="name"], #name');
    this.emailInput = page.locator('input[name="email"], input[id="email"], #email');
    this.messageTextarea = page.locator('textarea[name="message"], textarea[id="message"], #message');
    this.submitButton = page.locator('button[type="submit"], input[type="submit"], .submit-btn');
    this.successMessage = page.locator('.success, .success-message, [data-testid="success"]');
    this.errorMessage = page.locator('.error, .error-message, [data-testid="error"]');
    this.socialLinks = page.locator('.social-links a, .social a');
  }

  async navigateToContact() {
    await this.goto('/contact');
    await this.waitForPageLoad();
  }

  async fillContactForm(name: string, email: string, message: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.messageTextarea.fill(message);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async verifyFormSubmission() {
    await this.waitForElement(this.successMessage);
    return await this.successMessage.isVisible();
  }

  async verifyFormError() {
    await this.waitForElement(this.errorMessage);
    return await this.errorMessage.isVisible();
  }

  async getSocialLinks() {
    return await this.socialLinks.all();
  }

  async clickSocialLink(platform: string) {
    const link = this.socialLinks.filter({ hasText: platform }).first();
    await link.click();
  }
}
