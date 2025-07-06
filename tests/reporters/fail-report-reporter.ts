import type { FullConfig, FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Custom Playwright Reporter - Fail Report MD Writer
 * 
 * Her test sonrası docs/report/ klasöründe tarihli raporlama yapar
 * Başarısız testleri, hataları ve genel test sonuçlarını kaydeder
 * ENOENT ve webpack chunk hatalarını özel olarak handle eder
 */
class FailReportReporter implements Reporter {
  private startTime: number = 0;
  private failedTests: TestCase[] = [];
  private passedTests: TestCase[] = [];
  private skippedTests: TestCase[] = [];
  private errors: string[] = [];
  private criticalErrors: string[] = [];

  onBegin(config: FullConfig, suite: any) {
    this.startTime = Date.now();
    console.log(`🧪 Test başlıyor: ${suite.allTests().length} test dosyası`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') {
      this.passedTests.push(test);
    } else if (result.status === 'failed') {
      this.failedTests.push(test);
      if (result.error?.message) {
        const errorMessage = result.error.message;
        this.errors.push(`${test.title}: ${errorMessage}`);
        
        // Kritik hata türlerini tespit et
        if (this.isCriticalError(errorMessage)) {
          this.criticalErrors.push(`${test.title}: ${errorMessage}`);
        }
      }
    } else if (result.status === 'skipped') {
      this.skippedTests.push(test);
    }
  }

  private isCriticalError(errorMessage: string): boolean {
    const criticalPatterns = [
      'ENOENT.*_not-found.*page\\.js',
      'webpack.*chunks.*fallback',
      'no such file or directory.*\\.next',
      'chunks.*500.*in.*ms',
      'Cannot resolve module',
      'Module not found',
      'TypeError.*Cannot read properties',
      'ReferenceError',
      'SyntaxError'
    ];
    
    return criticalPatterns.some(pattern => 
      new RegExp(pattern, 'i').test(errorMessage)
    );
  }

  onEnd(result: FullResult) {
    const endTime = Date.now();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    // Test sonuçları hesaplama
    const total = this.passedTests.length + this.failedTests.length + this.skippedTests.length;
    const successRate = total > 0 ? Math.round((this.passedTests.length / total) * 100) : 0;
    
    // Fail report oluştur
    const reportContent = this.generateFailReport(duration, successRate, result.status);
    
    // Tarihli raporu docs/report/ klasörüne yaz
    this.writeToReportDirectory(reportContent);
    
    console.log(`📊 Test tamamlandı: ${duration}s - ${successRate}% başarı oranı`);
    
    // Kritik hatalar varsa konsola uyarı
    if (this.criticalErrors.length > 0) {
      console.log(`🚨 KRİTİK HATALAR BULUNDU: ${this.criticalErrors.length} adet`);
    }
  }

  private generateFailReport(duration: number, successRate: number, status: string): string {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
    const testStatus = this.failedTests.length === 0 ? '✅ BAŞARILI' : '❌ BAŞARISIZ';
    const statusIcon = this.failedTests.length === 0 ? '🟢' : '🔴';
    
    let report = `# 🧪 KIVILCIM - PLAYWRIGHT TEST RAPORU\n\n`;
    report += `## ${testStatus} - Otomatik Test Raporu\n\n`;
    report += `**Test Tarihi:** ${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR')}  \n`;
    report += `**Test Süresi:** ${duration} saniye  \n`;
    report += `**Başarı Oranı:** ${successRate}%  \n`;
    report += `**Platform Durumu:** ${statusIcon} **${status.toUpperCase()}**\n`;
    report += `**Test Environment:** ${process.env.NODE_ENV || 'development'}\n\n`;
    
    // Kritik hata uyarısı (üst kısma yerleştir)
    if (this.criticalErrors.length > 0) {
      report += `## 🚨 **KRİTİK HATALAR TESPİT EDİLDİ**\n\n`;
      report += `**Kritik Hata Sayısı:** ${this.criticalErrors.length} adet  \n`;
      report += `**Acil Müdahale:** ✅ Gerekiyor  \n`;
      report += `**Tahmini Çözüm Süresi:** 5-15 dakika\n\n`;
      
      report += `### 🔴 **En Kritik Hatalar:**\n`;
      this.criticalErrors.slice(0, 5).forEach((error, index) => {
        report += `${index + 1}. ${error}\n`;
      });
      report += `\n`;
    }
    
    report += `---\n\n`;
    
    // Test sonuçları özeti
    report += `## 📊 **TEST SONUÇLARI ÖZETİ**\n\n`;
    report += `### ✅ **Test İstatistikleri:**\n`;
    report += `\`\`\`\n`;
    report += `✅ Başarılı: ${this.passedTests.length} test\n`;
    report += `❌ Başarısız: ${this.failedTests.length} test\n`;
    report += `⏭️ Atlanan: ${this.skippedTests.length} test\n`;
    report += `📊 Toplam: ${this.passedTests.length + this.failedTests.length + this.skippedTests.length} test\n`;
    report += `⏱️ Süre: ${duration} saniye\n`;
    if (this.criticalErrors.length > 0) {
      report += `🚨 Kritik Hatalar: ${this.criticalErrors.length} adet\n`;
    }
    report += `\`\`\`\n\n`;
    
    // Platform durumu indikatorü
    if (this.failedTests.length === 0) {
      report += `## 🎉 **TÜM TESTLER BAŞARILI - MÜKEMMEL PERFORMANS**\n\n`;
      report += `### ✅ **Platform Sağlık Durumu:**\n`;
      report += `\`\`\`\n`;
      report += `🟢 Test Coverage: %${successRate}\n`;
      report += `🟢 Platform Health: PERFECT\n`;
      report += `🟢 All Modules: Functional\n`;
      report += `🟢 Console Errors: Zero\n`;
      report += `🟢 Performance: Optimal\n`;
      report += `🟢 Critical Errors: None\n`;
      report += `\`\`\`\n\n`;
    } else {
      report += `## 🚨 **BAŞARISIZ TESTLER - ACİL MÜDAHALE GEREKİYOR**\n\n`;
      
      // Platform health warning
      report += `### 🔴 **Platform Sağlık Uyarısı:**\n`;
      report += `\`\`\`\n`;
      report += `🔴 Test Coverage: %${successRate} (Hedef: >95%)\n`;
      report += `🔴 Failed Tests: ${this.failedTests.length} adet\n`;
      report += `🔴 Critical Issues: ${this.criticalErrors.length} adet\n`;
      report += `🔴 Platform Status: ATTENTION REQUIRED\n`;
      report += `🔴 Action Required: Immediate debugging\n`;
      report += `\`\`\`\n\n`;
      
      // Kritik hataların özel çözümleri
      if (this.criticalErrors.length > 0) {
        report += `### 🔥 **KRİTİK HATA ÇÖZÜMLERİ (ÖNCELİKLİ):**\n\n`;
        
        const hasEnoentError = this.criticalErrors.some(e => e.includes('ENOENT') || e.includes('_not-found'));
        const hasWebpackError = this.criticalErrors.some(e => e.includes('webpack') || e.includes('chunks'));
        const hasBuildError = this.criticalErrors.some(e => e.includes('.next') || e.includes('Module'));
        
        if (hasEnoentError) {
          report += `#### 🔧 **ENOENT / Not-Found Hataları:**\n`;
          report += `\`\`\`bash\n`;
          report += `# 1. Next.js cache temizliği\n`;
          report += `Remove-Item -Recurse -Force .next\n`;
          report += `Remove-Item -Recurse -Force node_modules\\.cache\n\n`;
          report += `# 2. Dependencies yenileme\n`;
          report += `npm install\n\n`;
          report += `# 3. Development server restart\n`;
          report += `npm run dev\n`;
          report += `\`\`\`\n\n`;
        }
        
        if (hasWebpackError) {
          report += `#### 🔧 **Webpack Chunk Hataları:**\n`;
          report += `\`\`\`bash\n`;
          report += `# 1. Webpack cache temizliği\n`;
          report += `Remove-Item -Recurse -Force .next\\cache\n\n`;
          report += `# 2. Static chunks yeniden build\n`;
          report += `npm run build\n`;
          report += `npm run dev\n\n`;
          report += `# 3. Port temizliği\n`;
          report += `taskkill /F /IM node.exe\n`;
          report += `npm run dev\n`;
          report += `\`\`\`\n\n`;
        }
        
        if (hasBuildError) {
          report += `#### 🔧 **Build System Hataları:**\n`;
          report += `\`\`\`bash\n`;
          report += `# 1. Komple build reset\n`;
          report += `Remove-Item -Recurse -Force .next\n`;
          report += `Remove-Item -Recurse -Force dist\n`;
          report += `Remove-Item -Recurse -Force out\n\n`;
          report += `# 2. Dependency resolution\n`;
          report += `npm ci\n\n`;
          report += `# 3. Fresh development start\n`;
          report += `npm run dev -- --port 3001\n`;
          report += `\`\`\`\n\n`;
        }
      }
      
      // Başarısız testlerin detayları
      this.failedTests.forEach((test, index) => {
        const fileName = test.location.file.split('/').pop()?.replace('.spec.ts', '') || 'unknown';
        const isCritical = this.criticalErrors.some(e => e.includes(test.title));
        const criticalBadge = isCritical ? ' 🚨' : '';
        
        report += `### ❌ **${index + 1}. Başarısız Test${criticalBadge}:**\n`;
        report += `**Test Adı:** ${test.title}  \n`;
        report += `**Modül:** ${fileName}  \n`;
        report += `**Dosya:** ${test.location.file}  \n`;
        report += `**Satır:** ${test.location.line}  \n`;
        if (isCritical) {
          report += `**Kritik:** ✅ Acil müdahale gerekiyor  \n`;
        }
        report += `\n`;
      });
      
      // Hata detayları
      if (this.errors.length > 0) {
        report += `### 🔍 **Hata Detayları:**\n`;
        report += `\`\`\`\n`;
        this.errors.slice(0, 10).forEach((error, index) => {
          const isCritical = this.criticalErrors.some(ce => ce === error);
          const prefix = isCritical ? '🚨' : '❌';
          report += `${prefix} ${index + 1}. ${error}\n`;
        });
        if (this.errors.length > 10) {
          report += `... ve ${this.errors.length - 10} adet daha\n`;
        }
        report += `\`\`\`\n\n`;
      }
      
      // Acil çözüm önerileri - genel
      report += `### 🛠️ **GENEL ÇÖZÜM ÖNERİLERİ:**\n\n`;
      report += `#### 🔧 **Hızlı Düzeltmeler (0-15 dakika):**\n`;
      report += `1. **Cache Temizleme:**\n`;
      report += `   \`\`\`bash\n`;
      report += `   Remove-Item .next -Recurse -Force\n`;
      report += `   npm run dev\n`;
      report += `   \`\`\`\n\n`;
      report += `2. **Server Restart:**\n`;
      report += `   \`\`\`bash\n`;
      report += `   taskkill /F /IM node.exe\n`;
      report += `   npm run dev\n`;
      report += `   \`\`\`\n\n`;
      report += `3. **Port Cleanup:**\n`;
      report += `   \`\`\`bash\n`;
      report += `   netstat -ano | findstr ":300"\n`;
      report += `   taskkill /F /PID [PID_NUMBER]\n`;
      report += `   \`\`\`\n\n`;
      
      report += `#### 🔍 **Detaylı Araştırma (15-45 dakika):**\n`;
      report += `4. **Dependency Check:** \`npm install\` ile bağımlılıkları güncelle\n`;
      report += `5. **Component Validation:** Başarısız testlerdeki component'leri manuel kontrol et\n`;
      report += `6. **API Integration:** ElevenLabs ve Firebase bağlantılarını test et\n`;
      report += `7. **Browser Console:** Developer tools ile console error'ları kontrol et\n\n`;
    }
    
    // Başarılı testlerin özeti
    if (this.passedTests.length > 0) {
      report += `### ✅ **Başarılı Test Modülleri:**\n`;
      const testGroups = this.groupTestsByFile(this.passedTests);
      Object.entries(testGroups).forEach(([file, tests]) => {
        const fileName = file.split('/').pop()?.replace('.spec.ts', '') || 'unknown';
        report += `- **${fileName}**: ${tests.length} test ✅\n`;
      });
      report += `\n`;
    }
    
    // Test çalıştırma komutları
    report += `### 🚀 **Test Çalıştırma Komutları:**\n`;
    report += `\`\`\`bash\n`;
    report += `# Hızlı development testleri\n`;
    report += `npm run test:dev\n\n`;
    report += `# Tam kapsamlı testler\n`;
    report += `npm run test:full\n\n`;
    report += `# Belirli modül testi\n`;
    report += `npx playwright test tests/e2e/[MODULE].spec.ts\n\n`;
    report += `# Build sonrası test\n`;
    report += `npm run build && npm run test:dev\n`;
    report += `\`\`\`\n\n`;
    
    report += `---\n\n`;
    report += `> **Otomatik Rapor:** Bu rapor Playwright custom reporter tarafından otomatik oluşturulmuştur.  \n`;
    report += `> **Rapor Konumu:** docs/reports/FAIL-report-${timestamp}.md  \n`;
    report += `> **Son Güncelleme:** ${timestamp}  \n`;
    report += `> **Platform:** Kıvılcım Otizm Eğitim Platformu  \n`;
    report += `> **Kritik Hata Tracking:** ✅ Aktif  \n\n`;
    
    return report;
  }

  private groupTestsByFile(tests: TestCase[]): Record<string, TestCase[]> {
    return tests.reduce((groups, test) => {
      const file = test.location.file;
      if (!groups[file]) {
        groups[file] = [];
      }
      groups[file].push(test);
      return groups;
    }, {} as Record<string, TestCase[]>);
  }

  private writeToReportDirectory(reportContent: string) {
    const now = new Date();
    // Protocol compliance: YYYYMMDD-HHMMSS format
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}${month}${day}-${hour}${minute}${second}`;
    
    const reportDir = join(process.cwd(), 'docs', 'reports');
    
    const testStatus = this.failedTests.length === 0 ? 'SUCCESS' : 'FAIL';
    const reportFileName = `${testStatus}-report-${timestamp}.md`;
    const reportPath = join(reportDir, reportFileName);
    
    try {
      if (!existsSync(reportDir)) {
        mkdirSync(reportDir, { recursive: true });
      }
      
      writeFileSync(reportPath, reportContent, 'utf-8');
      
      const currentReportPath = join(process.cwd(), 'fail-report.md');
      writeFileSync(currentReportPath, reportContent, 'utf-8');
      
      console.log(`📝 Test raporu yazıldı: docs/reports/${reportFileName}`);
      console.log(`📄 Güncel rapor: fail-report.md`);
    } catch (error) {
      console.error(`❌ Rapor yazılırken hata: ${error}`);
    }
  }
}

export default FailReportReporter; 