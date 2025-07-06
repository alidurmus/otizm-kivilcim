import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration - Development (Fast Testing)
 * 
 * Bu config development sırasında hızlı test yapmak için optimize edilmiştir:
 * - Sadece Chromium tarayıcısı kullanır
 * - Paralel test çalıştırma
 * - Bölümlere ayrılmış test organizasyonu
 * 
 * Kullanım: npm run test:dev
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Development için hızlı paralel çalıştırma */
  fullyParallel: true,
  forbidOnly: false, // Development'ta test.only kullanımına izin ver
  retries: 1, // Minimum retry
  workers: 4, // Paralel worker sayısı
  
  /* Development için basit reporter + fail report */
  reporter: [
    ['line'],
    ['html', { outputFolder: 'test-results-dev' }],
    ['./tests/reporters/fail-report-reporter.ts']
  ],
  
  /* Test timeout settings - development için daha kısa */
  timeout: 30000, // 30 saniye
  expect: {
    timeout: 5000 // 5 saniye expect timeout
  },
  
  /* Base settings */
  use: {
    baseURL: 'http://localhost:3001', // Development server
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* Development için optimizasyonlar */
    headless: true, // Hızlı çalıştırma için headless
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    /* Test environment headers */
    extraHTTPHeaders: {
      'X-Test-Environment': 'development',
      'X-Test-Mode': 'fast'
    },
  },

  /* Development için sadece Chromium */
  projects: [
    {
      name: 'dev-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Development için ekstra ayarlar
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
        }
      },
    }
  ],

  /* Development server ayarları - devre dışı */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3001',
  //   reuseExistingServer: true, // Mevcut server'ı kullan
  //   timeout: 60 * 1000, // 1 dakika timeout
  //   stdout: 'ignore',
  //   stderr: 'pipe'
  // },

  /* Global test setup */
  // globalSetup: require.resolve('./tests/setup/global-setup.ts'),
  // globalTeardown: require.resolve('./tests/setup/global-teardown.ts'),
}); 