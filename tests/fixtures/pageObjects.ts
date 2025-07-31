import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContactPage } from '../pages/ContactPage';

type PageObjects = {
  homePage: HomePage;
  contactPage: ContactPage;
};

export const test = base.extend<PageObjects>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  contactPage: async ({ page }, use) => {
    const contactPage = new ContactPage(page);
    await use(contactPage);
  },
});

export { expect } from '@playwright/test';
