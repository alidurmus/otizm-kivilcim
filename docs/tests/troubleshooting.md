# 🛠️ Test Troubleshooting Guide - Kıvılcım Platform

**Son Güncelleme:** 2025-01-06  
**Test Framework:** Playwright + Jest + React Testing Library  
**Platform:** Windows + PowerShell

---

## 🚨 Kritik Test Sorunları ve Çözümleri

### **1. Browser Spawn UNKNOWN Hatası**

**Hata Mesajı:**
```bash
Error: browserType.launch: spawn UNKNOWN
Call log:
- <launching> C:\Users\hp\AppData\Local\ms-playwright\chromium_headless_shell-1179\chrome-win\headless_shell.exe
```

**Kök Sebep:** Playwright browser binary'lerinin doğru yüklenmemesi veya permissions sorunu

**Çözüm Adımları:**
```bash
# 1. Browser binary'lerini temizle ve yeniden yükle
npx playwright uninstall
npx playwright install

# 2. Dependencies ile birlikte yükle (Windows için önemli)
npx playwright install --with-deps

# 3. Specific browser için test et
npx playwright install chromium
npx playwright test --project=chromium --headed

# 4. PowerShell admin olarak çalıştır (gerekirse)
# Run as Administrator → PowerShell
npx playwright install

# 5. User temp directory temizle
Remove-Item -Recurse -Force $env:TEMP\playwright*
```

**Verifikasyon:**
```bash
# Browser kurulumunu kontrol et
npx playwright --version
npx playwright install --dry-run

# Test çalıştır
npm run test:dev:headed
```

---

### **2. Worker Process Crashes**

**Hata Mesajı:**
```bash
Error: worker process exited unexpectedly (code=3221226505, signal=null)
```

**Kök Sebep:** Memory/CPU pressure veya test parallelization issues

**Çözüm Adımları:**
```bash
# 1. Worker sayısını azalt
npm run test:dev -- --workers=1

# 2. Sequential test çalıştır
npm run test:dev -- --workers=1 --max-failures=1

# 3. Memory limit artır
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run test:dev

# 4. Timeout'ları artır
npm run test:dev -- --timeout=60000

# 5. Cache temizle
Remove-Item -Recurse -Force test-results-dev/
Remove-Item -Recurse -Force .next/
npm run dev
```

**PowerShell Specific Fix:**
```powershell
# Memory ve process monitoring
Get-Process | Where-Object {$_.ProcessName -like "*chrome*" -or $_.ProcessName -like "*playwright*"} | Stop-Process -Force

# Environment variables set
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:PLAYWRIGHT_BROWSERS_PATH = "C:\ms-playwright"
```

---

### **3. Element Visibility Timeouts**

**Hata Mesajı:**
```bash
Timed out 5000ms waiting for expect(locator).toBeVisible()
Locator: getByText('💡 İpucu: Harflere tıklayarak seslerini dinleyebilirsin')
Expected: visible
Received: <element(s) not found>
```

**Kök Sebep:** DOM rendering delays, server response issues, veya incorrect selectors

**Çözüm Stratejileri:**

#### **A. Timeout İyileştirmeleri**
```typescript
// Specific timeout artırma
await expect(element).toBeVisible({ timeout: 10000 });

// Global timeout ayarı
// playwright.config.dev.ts
timeout: 60000  // 60 seconds
```

#### **B. Robust Element Selection**
```typescript
// Text-based selectors yerine data-testid kullan
// BAD
await expect(page.getByText('💡 İpucu: Harflere tıklayarak seslerini dinleyebilirsin')).toBeVisible();

// GOOD
await expect(page.getByTestId('hint-message')).toBeVisible();
await expect(page.getByTestId('letter-pronunciation-hint')).toBeVisible();
```

#### **C. Wait Strategies**
```typescript
// Network idle bekle
await page.waitForLoadState('networkidle');

// Specific element için bekle
await page.waitForSelector('[data-testid="hint-message"]');

// Function-based wait
await page.waitForFunction(() => 
  document.querySelector('[data-testid="hint-message"]') !== null
);
```

#### **D. Server Health Check**
```bash
# Server çalıştığını kontrol et
curl http://localhost:3000
curl http://localhost:3001
curl http://localhost:3002

# Multiple port check
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002
```

---

### **4. Audio System Test Failures**

**Hata:** ElevenLabs API entegrasyon testleri başarısız

**Kök Sebep:** 
- API key eksikliği
- Network connectivity issues
- ElevenLabs service unavailability

**Çözüm Adımları:**

#### **A. API Key Verification**
```bash
# .env.local kontrol et
if (Test-Path .env.local) {
    Write-Host ".env.local exists"
    Get-Content .env.local | Select-String "ELEVENLABS"
} else {
    Write-Host ".env.local missing!"
}

# Environment variable check
echo $env:ELEVENLABS_API_KEY
```

#### **B. Mock Strategy for Testing**
```typescript
// tests/mocks/elevenlabs-mock.ts
export const mockElevenLabsAPI = {
  speak: jest.fn().mockResolvedValue({ success: true }),
  getVoices: jest.fn().mockResolvedValue([
    { voice_id: 'test', name: 'Test Voice' }
  ])
};

// Test file'da
import { mockElevenLabsAPI } from '../mocks/elevenlabs-mock';
jest.mock('@/lib/elevenlabs', () => mockElevenLabsAPI);
```

#### **C. Network Fallback Testing**
```typescript
// Offline durumunu test et
await context.setOffline(true);
await expect(page.getByText('Web Speech API fallback active')).toBeVisible();

// Online'a geri dön
await context.setOffline(false);
```

---

### **5. Module-Specific Issues**

#### **Exercise Module Tests**
**Problem:** `getByText('Hece Oluşturma İlerlemen')` bulunamıyor

**Çözüm:**
```typescript
// Current text'i kontrol et
await page.screenshot({ path: 'debug-exercise.png' });
const content = await page.content();
console.log('Page content includes:', content.includes('Hece'));

// Dynamic content için wait
await page.waitForFunction(() => 
  document.body.textContent?.includes('Hece Oluşturma') || false
);
```

#### **Admin ElevenLabs Tests**
**Problem:** Gender filtering interface sorunları

**Çözüm:**
```typescript
// Step-by-step debug
await page.goto('/admin/elevenlabs-test');
await page.waitForLoadState('networkidle');
await expect(page.getByRole('heading', { name: 'ElevenLabs Test' })).toBeVisible();

// Gender filter test
await page.getByRole('button', { name: 'Male Voices' }).click();
await page.waitForTimeout(1000); // API response bekle
```

---

## 🔧 Debug Tools ve Techniques

### **1. Visual Debugging**
```bash
# Browser ile görsel test
npm run test:dev:headed

# Specific test file with visual
npm run test:dev:headed tests/e2e/homepage.spec.ts

# Screenshot debugging
npm run test:dev:debug
```

### **2. Playwright Test UI**
```bash
# Modern UI test runner
npm run test:dev:ui

# Specific test ile UI
npx playwright test --ui tests/e2e/admin-elevenlabs.spec.ts
```

### **3. Trace Analysis**
```bash
# Trace recording enable
npm run test:dev -- --trace on

# Trace viewer
npx playwright show-trace test-results/trace.zip
```

### **4. Real-time Debugging**
```typescript
// Test içinde debug point
await page.pause(); // Browser'ı durdurur, manual kontrol

// Console logging
page.on('console', msg => console.log('BROWSER:', msg.text()));

// Network request monitoring
page.on('request', request => console.log('REQUEST:', request.url()));
page.on('response', response => console.log('RESPONSE:', response.url(), response.status()));
```

---

## 📊 Test Health Monitoring

### **Performance Checkpoints**
```bash
# Memory usage monitoring
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*chrome*"} | Select-Object ProcessName, WorkingSet, PagedMemorySize

# Disk space check
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, @{Name="Size(GB)";Expression={[math]::Round($_.Size/1GB,2)}}, @{Name="FreeSpace(GB)";Expression={[math]::Round($_.FreeSpace/1GB,2)}}

# Test artifact cleanup
Remove-Item -Recurse -Force test-results-dev/ -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force test-results/ -ErrorAction SilentlyContinue
```

### **Success Rate Monitoring**
```bash
# Test sonuçlarını analiz et
npm run test:dev 2>&1 | Tee-Object -FilePath "docs/tests/latest-run.log"

# Başarı oranını hesapla
$testOutput = Get-Content "docs/tests/latest-run.log"
$passed = ($testOutput | Select-String "passed").Count
$failed = ($testOutput | Select-String "failed").Count
$total = $passed + $failed
if ($total -gt 0) {
    $successRate = [math]::Round(($passed / $total) * 100, 2)
    Write-Host "Success Rate: $successRate% ($passed/$total)"
}
```

---

## 🎯 Prevention Strategies

### **1. Pre-Test Health Check**
```bash
# Test öncesi sistem kontrolü
function Test-SystemHealth {
    # Browser installation
    npx playwright install --dry-run
    
    # Server health
    try {
        Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
        Write-Host "✅ Server responding"
    } catch {
        Write-Host "❌ Server not responding"
    }
    
    # Environment variables
    if ($env:ELEVENLABS_API_KEY) {
        Write-Host "✅ ElevenLabs API key set"
    } else {
        Write-Host "⚠️ ElevenLabs API key missing"
    }
    
    # Memory check
    $memory = Get-WmiObject -Class Win32_ComputerSystem
    $freeMemoryGB = [math]::Round($memory.TotalPhysicalMemory / 1GB - (Get-WmiObject -Class Win32_OperatingSystem).TotalVisibleMemorySize / 1MB / 1024, 2)
    if ($freeMemoryGB -gt 2) {
        Write-Host "✅ Sufficient memory: $freeMemoryGB GB free"
    } else {
        Write-Host "⚠️ Low memory: $freeMemoryGB GB free"
    }
}

# Çalıştır
Test-SystemHealth
```

### **2. Automated Recovery**
```bash
# Test başarısızlığında otomatik recovery
function Recover-TestEnvironment {
    # Browser processes temizle
    Get-Process | Where-Object {$_.ProcessName -like "*chrome*" -or $_.ProcessName -like "*playwright*"} | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Cache temizle
    Remove-Item -Recurse -Force test-results-dev/ -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force .next/ -ErrorAction SilentlyContinue
    
    # Browser yeniden yükle
    npx playwright install chromium
    
    # Server restart
    # npm run dev (manual restart gerekebilir)
}
```

---

## 📞 Escalation Path

### **Level 1: Quick Fixes (5 dakika)**
1. Browser reinstall: `npx playwright install`
2. Cache clear: `Remove-Item -Recurse -Force test-results-dev/`
3. Worker reduction: `npm run test:dev -- --workers=1`

### **Level 2: Deep Debugging (30 dakika)**
1. Visual debugging: `npm run test:dev:headed`
2. Trace analysis: `npm run test:dev -- --trace on`
3. Network monitoring: Browser DevTools

### **Level 3: Environment Reset (2 saat)**
1. Complete Node.js reinstall
2. Playwright complete reinstall
3. Project dependency refresh: `Remove-Item node_modules; npm install`

### **Level 4: Development Support**
- Document detailed error logs
- Create minimal reproduction case
- Escalate to senior developer with full context

---

> **Quick Reference:** Bu guide'daki çözümlerin %80'i Level 1 quick fixes'de çözülmektedir.  
> **Emergency Contact:** Critical production issues için immediate escalation path provided.  
> **Update Frequency:** Bu guide test infrastructure değişiklikleri ile birlikte güncellenmektedir. 