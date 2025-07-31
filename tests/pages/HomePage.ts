import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly pageTitle: Locator;
  readonly navigationMenu: Locator;
  readonly heroSection: Locator;
  readonly aboutSection: Locator;
  readonly skillsSection: Locator;
  readonly projectsSection: Locator;
  readonly contactSection: Locator;
  readonly footerSection: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('title');
    this.navigationMenu = page.locator('nav, .navigation, .navbar');
    this.heroSection = page.locator('.hero, #hero, [data-testid="hero"]');
    this.aboutSection = page.locator('.about, #about, [data-testid="about"]');
    this.skillsSection = page.locator('.skills, #skills, [data-testid="skills"]');
    this.projectsSection = page.locator('.projects, #projects, [data-testid="projects"]');
    this.contactSection = page.locator('.contact, #contact, [data-testid="contact"]');
    this.footerSection = page.locator('footer, .footer');
  }

  async navigateToHome() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  async verifyPageTitle(expectedTitle: string) {
    await this.page.waitForFunction(
      (title) => document.title.includes(title),
      expectedTitle
    );
  }

  async verifyNavigationMenuVisible() {
    await this.waitForElement(this.navigationMenu);
    return await this.navigationMenu.isVisible();
  }

  async verifyHeroSectionVisible() {
    await this.waitForElement(this.heroSection);
    return await this.heroSection.isVisible();
  }

  async scrollToSection(section: 'about' | 'skills' | 'projects' | 'contact') {
    const sectionMap = {
      about: this.aboutSection,
      skills: this.skillsSection,
      projects: this.projectsSection,
      contact: this.contactSection
    };
    
    await this.scrollToElement(sectionMap[section]);
  }

  async getNavigationLinks() {
    return await this.navigationMenu.locator('a').all();
  }
}
