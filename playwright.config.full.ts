import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration - Full Coverage (CI/CD)
 * 
 * Bu config CI/CD ve production testing için optimize edilmiştir:
 * - Tüm tarayıcıları kapsar (Chromium, Firefox, WebKit)
 * - Mobile ve desktop testleri
 * - Comprehensive reporting
 * - Production-ready settings
 * 
 * Kullanım: npm run test:full
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* CI/CD için production settings */
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // CI'da test.only yasak
  retries: process.env.CI ? 3 : 1, // CI'da daha fazla retry
  workers: process.env.CI ? 2 : undefined, // CI'da kontrollü parallellik
  
  /* Comprehensive reporting + fail report */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['./tests/reporters/fail-report-reporter.ts'],
    process.env.CI ? ['github'] : ['list']
  ],
  
  /* Extended timeout for comprehensive testing */
  timeout: 60000, // 1 dakika
  expect: {
    timeout: 10000 // 10 saniye expect timeout
  },
  
  /* Base settings */
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* Production-like settings */
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: false, // Production'da HTTPS errors'ları ignore etme
    
    /* Comprehensive test headers */
    extraHTTPHeaders: {
      'X-Test-Environment': 'full-coverage',
      'X-Test-Mode': 'comprehensive'
    },
  },

  /* Full browser coverage */
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome' // Real Chrome kullan
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile Browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Edge Browser (Windows)
    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge' 
      },
    },
    
    // Tablet Testing
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  /* CI/CD server setup */
  webServer: process.env.CI ? {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 120 * 1000, // 2 dakika build time
  } : {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 60 * 1000,
  },
}); 