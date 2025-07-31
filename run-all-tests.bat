@echo off
echo 🚀 Running Complete Test Suite for Piyathida San-aoun's Website
echo ================================================================

echo 📱 Testing Home Page...
npx playwright test home-page.test.ts --project chromium

echo 📝 Testing Blog Page...
npx playwright test blog-page.test.ts --project chromium

echo 📄 Testing CV Page...
npx playwright test cv-page.test.ts --project chromium

echo ⚡ Testing Admin Page...
npx playwright test admin-page.test.ts --project chromium

echo 🔄 Testing End-to-End Navigation...
npx playwright test e2e-navigation.test.ts --project chromium

echo ⚡ Testing Performance & Accessibility...
npx playwright test performance-accessibility-all-pages.test.ts --project chromium

echo 🌐 Testing Cross-Browser Compatibility...
npx playwright test comprehensive-quality.test.ts --project chromium

echo ✅ All tests completed! View the HTML report:
echo npx playwright show-report
pause
