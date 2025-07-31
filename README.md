# Playwright UI Automation Tests

This repository contains comprehensive Playwright automation tests for UI testing of web applications.

## Project Structure

```
├── tests/
│   ├── pages/                 # Page Object Model classes
│   │   ├── BasePage.ts       # Base page with common functionality
│   │   ├── HomePage.ts       # Homepage specific methods
│   │   └── ContactPage.ts    # Contact page specific methods
│   ├── fixtures/             # Test fixtures and data
│   │   ├── pageObjects.ts    # Page object fixtures
│   │   └── testData.ts       # Test data constants
│   ├── utils/                # Utility functions
│   │   └── testUtils.ts      # Common test utilities
│   ├── homepage.test.ts      # Homepage functionality tests
│   ├── contact.test.ts       # Contact form tests
│   ├── performance-accessibility.test.ts  # Performance & A11y tests
│   └── cross-browser-responsive.test.ts   # Cross-browser & responsive tests
├── playwright.config.ts      # Playwright configuration
└── package.json             # Project dependencies
```

## Installation

1. Install Node.js dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npm run install:browsers
```

## Running Tests

### All Tests
```bash
npm test
```

### Headed Mode (Browser Visible)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### UI Mode (Interactive)
```bash
npm run test:ui
```

### Specific Test File
```bash
npx playwright test homepage.test.ts
```

### Specific Browser
```bash
npx playwright test --project chromium
```

## Test Categories

### 1. Homepage Tests (`homepage.test.ts`)
- Page loading verification
- Navigation menu functionality
- Hero section display
- Section scrolling
- Responsive design validation

### 2. Contact Form Tests (`contact.test.ts`)
- Form display and accessibility
- Valid form submission
- Email validation
- Required field validation
- Social media links verification

### 3. Performance & Accessibility Tests (`performance-accessibility.test.ts`)
- Page load time measurements
- Core Web Vitals assessment
- Image optimization checks
- Heading hierarchy validation
- ARIA labels verification
- Keyboard navigation testing

### 4. Cross-browser & Responsive Tests (`cross-browser-responsive.test.ts`)
- Multi-browser compatibility
- Mobile device responsiveness
- SEO meta tags verification
- Open Graph tags validation
- Form validation across devices

## Configuration

The `playwright.config.ts` file includes:
- Multiple browser support (Chrome, Firefox, Safari, Edge)
- Mobile device testing
- Screenshot and video recording on failures
- HTML and JSON reporting
- Parallel test execution

## Test Data

Test data is centralized in `tests/fixtures/testData.ts` and includes:
- User information for form testing
- Expected navigation elements
- Performance thresholds
- Accessibility requirements
- Responsive breakpoints

## Page Object Model

The project uses the Page Object Model pattern:
- `BasePage.ts`: Common functionality for all pages
- `HomePage.ts`: Homepage-specific methods
- `ContactPage.ts`: Contact page-specific methods

## Utilities

Common utilities in `tests/utils/testUtils.ts`:
- Animation waiting
- Screenshot capture
- Performance metrics collection
- Console error checking
- Network condition simulation
- Random data generation

## Reporting

Test results are available in multiple formats:
- HTML report: `npx playwright show-report`
- JSON results: `test-results/results.json`
- JUnit XML: `test-results/results.xml`

## Best Practices

1. **Test Organization**: Tests are organized by functionality and feature
2. **Data Management**: Test data is externalized and reusable
3. **Page Objects**: UI elements are abstracted into page object classes
4. **Assertions**: Meaningful assertions with proper error messages
5. **Waiting**: Proper waits for dynamic content and animations
6. **Screenshots**: Automatic screenshots on test failures
7. **Parallel Execution**: Tests run in parallel for faster execution

## Customization

To adapt these tests for your specific website:

1. Update the `baseURL` in `playwright.config.ts`
2. Modify page object selectors in `tests/pages/` directory
3. Adjust test data in `tests/fixtures/testData.ts`
4. Update expected content and functionality in test files
5. Configure performance thresholds based on your requirements

## Troubleshooting

### Common Issues

1. **Test Timeout**: Increase timeout values in config if tests are timing out
2. **Element Not Found**: Verify selectors in page objects match your website
3. **Network Issues**: Check if the website URL is accessible
4. **Browser Issues**: Ensure browsers are installed with `npm run install:browsers`

### Debug Mode

Use debug mode to step through tests:
```bash
npm run test:debug
```

This opens the Playwright Inspector for interactive debugging.

## CI/CD Integration

The configuration includes CI-friendly settings:
- Retry logic for flaky tests
- Optimized worker configuration
- Multiple output formats for integration with CI tools

For GitHub Actions, add the Playwright action to your workflow:
```yaml
- name: Run Playwright tests
  run: npx playwright test
```

## Contributing

When adding new tests:
1. Follow the existing page object pattern
2. Add appropriate test data to fixtures
3. Include proper error handling and assertions
4. Test across multiple browsers and devices
5. Update documentation as needed
