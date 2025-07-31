# Playwright UI Automation Setup - Complete Guide

## 🎯 Quick Start

Your Playwright automation framework is now ready! Here's how to get started:

### 1. Verify Installation
```bash
cd c:\Users\piyat\source\ui_playwright_piya_profile
npx playwright test example.test.ts --project chromium
```

### 2. View Test Results
```bash
npx playwright show-report
```

## 📋 Available Test Files

### 1. **example.test.ts** - Basic Setup Verification
- ✅ Verifies Playwright is working correctly
- ✅ Tests browser capabilities
- ✅ Template tests for your website (currently skipped)

### 2. **practical-examples.test.ts** - Real-world Examples
- ✅ GitHub profile testing example
- ✅ Mobile responsiveness tests
- ✅ Performance and SEO tests
- ✅ Contact form validation templates

### 3. **website-template.test.ts** - Your Website Template
- 🔧 Ready-to-customize tests for your profile website
- 🔧 Homepage, navigation, about, skills, projects tests
- 🔧 Contact form and social media link tests
- 🔧 Responsive design and accessibility tests

### 4. **Other Test Files** (Advanced)
- `homepage.test.ts` - Homepage-specific tests
- `contact.test.ts` - Contact form tests
- `performance-accessibility.test.ts` - Performance & accessibility
- `cross-browser-responsive.test.ts` - Cross-browser compatibility

## 🛠️ How to Customize for Your Website

### Step 1: Update the Website URL
Edit `tests/website-template.test.ts`:
```typescript
// Change this line:
const WEBSITE_URL = 'https://your-profile-website.com';
// To your actual website URL:
const WEBSITE_URL = 'https://yourname.github.io';
```

### Step 2: Update Expected Content
Modify the test assertions based on your website structure:
```typescript
// Update page title expectation:
await expect(page).toHaveTitle(/Your Actual Page Title/);

// Update section selectors if needed:
const aboutSection = page.locator('#about, .about-me, .bio');
```

### Step 3: Run Your Customized Tests
```bash
npx playwright test website-template.test.ts
```

## 🚀 Common Commands

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npx playwright test website-template.test.ts
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### Run Tests in Specific Browser
```bash
npx playwright test --project chromium
npx playwright test --project firefox
npx playwright test --project webkit
```

### Debug Mode
```bash
npx playwright test --debug
```

### UI Mode (Interactive Testing)
```bash
npx playwright test --ui
```

### Generate Test Code
```bash
npx playwright codegen https://your-website.com
```

## 📱 Testing Different Devices

The framework includes mobile device testing:
- iPhone 12
- Pixel 5
- iPad
- Desktop Chrome, Firefox, Safari

## 🎯 Test Categories Included

### ✅ Functional Tests
- Navigation functionality
- Form submissions
- Link verification
- Content loading

### ✅ Visual Tests
- Responsive design
- Element visibility
- Layout integrity

### ✅ Performance Tests
- Page load times
- Core Web Vitals
- Image optimization

### ✅ Accessibility Tests
- Keyboard navigation
- ARIA labels
- Color contrast
- Heading hierarchy

### ✅ Cross-browser Tests
- Chrome, Firefox, Safari compatibility
- Mobile responsiveness
- Feature compatibility

## 🔧 Configuration Files

### `playwright.config.ts`
- Browser configurations
- Test settings
- Reporting options

### `package.json`
- Dependencies
- Script commands
- Project metadata

### `tsconfig.json`
- TypeScript configuration
- Path mappings

## 📊 Reporting

Test results are available in multiple formats:
- **HTML Report**: `npx playwright show-report`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/results.xml`

## 🐛 Troubleshooting

### Tests Failing?
1. Check if your website URL is correct
2. Verify website is accessible
3. Update selectors to match your HTML structure

### Browsers Not Working?
```bash
npx playwright install
```

### Need to Skip Tests?
Add `.skip()` to any test:
```typescript
test.skip('Test name', async ({ page }) => {
  // This test will be skipped
});
```

## 📝 Next Steps

1. **Customize `website-template.test.ts`** with your website URL
2. **Update selectors** to match your HTML structure
3. **Add specific tests** for your unique features
4. **Run tests regularly** to catch issues early
5. **Set up CI/CD** using the included GitHub Actions workflow

## 🌟 Pro Tips

### Page Object Pattern
Use the page objects in `tests/pages/` for reusable code:
```typescript
import { HomePage } from '../pages/HomePage';

test('test with page object', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateToHome();
  await homePage.verifyHeroSectionVisible();
});
```

### Test Data
Use `tests/fixtures/testData.ts` for test data:
```typescript
import { testData } from '../fixtures/testData';

await page.fill('input[name="email"]', testData.user.validEmail);
```

### Screenshots
Take screenshots for debugging:
```typescript
await page.screenshot({ path: 'debug-screenshot.png' });
```

### Waiting for Elements
```typescript
// Wait for element to be visible
await expect(page.locator('.loading')).toBeHidden();

// Wait for network to be idle
await page.waitForLoadState('networkidle');
```

## 🎉 Ready to Test!

Your Playwright automation framework is fully set up and ready to test any website. Start with the example tests, then customize the templates for your specific needs.

**Happy Testing! 🚀**
