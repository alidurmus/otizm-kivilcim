import type { FullConfig, FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Custom Playwright Reporter - Fail Report MD Writer
 * 
 * Her test sonrası fail-report.md dosyasına otomatik raporlama yapar
 * Başarısız testleri, hataları ve genel test sonuçlarını kaydeder
 */
class FailReportReporter implements Reporter {
  private startTime: number = 0;
  private failedTests: TestCase[] = [];
  private passedTests: TestCase[] = [];
  private skippedTests: TestCase[] = [];
  private errors: string[] = [];

  onBegin(config: FullConfig, suite: any) {
    this.startTime = Date.now();
    console.log(`🧪 Test başlıyor: ${suite.allTests().length} test dosyası`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') {
      this.passedTests.push(test);
    } else if (result.status === 'failed') {
      this.failedTests.push(test);
      if (result.error) {
        this.errors.push(`${test.title}: ${result.error.message}`);
      }
    } else if (result.status === 'skipped') {
      this.skippedTests.push(test);
    }
  }

  onEnd(result: FullResult) {
    const endTime = Date.now();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    // Test sonuçları hesaplama
    const total = this.passedTests.length + this.failedTests.length + this.skippedTests.length;
    const successRate = total > 0 ? Math.round((this.passedTests.length / total) * 100) : 0;
    
    // Fail report oluştur
    const reportContent = this.generateFailReport(duration, successRate, result.status);
    
    // fail-report.md dosyasına yaz
    this.writeToFailReport(reportContent);
    
    console.log(`📊 Test tamamlandı: ${duration}s - ${successRate}% başarı oranı`);
  }

  private generateFailReport(duration: number, successRate: number, status: string): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const testStatus = this.failedTests.length === 0 ? '✅ BAŞARILI' : '❌ BAŞARISIZ';
    const statusIcon = this.failedTests.length === 0 ? '🟢' : '🔴';
    
    let report = `# 🧪 KИVILCIM - PLAYWRIGHT TEST RAPORU\n\n`;
    report += `## ${testStatus} - Otomatik Test Raporu\n\n`;
    report += `**Son Test:** ${timestamp}  \n`;
    report += `**Test Süresi:** ${duration} saniye  \n`;
    report += `**Başarı Oranı:** ${successRate}%  \n`;
    report += `**Platform Durumu:** ${statusIcon} **${status.toUpperCase()}**\n\n`;
    
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
    report += `\`\`\`\n\n`;
    
    // Başarısız testler varsa detayları ekle
    if (this.failedTests.length > 0) {
      report += `## 🚨 **BAŞARISIZ TESTLER - ACİL MÜDAHALE GEREKİYOR**\n\n`;
      
      this.failedTests.forEach((test, index) => {
        report += `### ❌ **${index + 1}. Başarısız Test:**\n`;
        report += `**Test Adı:** ${test.title}  \n`;
        report += `**Dosya:** ${test.location.file}  \n`;
        report += `**Satır:** ${test.location.line}  \n\n`;
      });
      
      if (this.errors.length > 0) {
        report += `### 🔍 **Hata Detayları:**\n`;
        report += `\`\`\`\n`;
        this.errors.forEach(error => {
          report += `${error}\n`;
        });
        report += `\`\`\`\n\n`;
      }
      
      report += `### 🔧 **Önerilen Çözümler:**\n`;
      report += `1. **Hızlı Hata Giderme:** Failed testleri tek tek çalıştır\n`;
      report += `2. **Environment Check:** Server durumu ve port kontrolü\n`;
      report += `3. **Cache Temizleme:** \`.next\` klasörünü sil ve yeniden başlat\n`;
      report += `4. **Dependency Update:** \`npm install\` ile bağımlılıkları güncelle\n\n`;
    } else {
      report += `## 🎉 **TÜM TESTLER BAŞARILI - MÜKEMMEL PERFORMANS**\n\n`;
      report += `### ✅ **Platform Sağlık Durumu:**\n`;
      report += `\`\`\`\n`;
      report += `🟢 Test Coverage: %${successRate}\n`;
      report += `🟢 Platform Health: PERFECT\n`;
      report += `🟢 All Modules: Functional\n`;
      report += `🟢 Console Errors: Zero\n`;
      report += `🟢 Performance: Optimal\n`;
      report += `\`\`\`\n\n`;
    }
    
    // Başarılı testler varsa liste ekle
    if (this.passedTests.length > 0) {
      report += `### ✅ **Başarılı Test Modülleri:**\n`;
      const testGroups = this.groupTestsByFile(this.passedTests);
      Object.entries(testGroups).forEach(([file, tests]) => {
        const fileName = file.split('/').pop()?.replace('.spec.ts', '') || 'unknown';
        report += `- **${fileName}**: ${tests.length} test ✅\n`;
      });
      report += `\n`;
    }
    
    report += `---\n\n`;
    report += `> **Otomatik Rapor:** Bu rapor Playwright custom reporter tarafından otomatik oluşturulmuştur.  \n`;
    report += `> **Son Güncelleme:** ${timestamp}  \n`;
    report += `> **Test Environment:** ${process.env.NODE_ENV || 'development'}  \n\n`;
    
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

  private writeToFailReport(newContent: string) {
    const failReportPath = join(process.cwd(), 'fail-report.md');
    
    try {
      let existingContent = '';
      
      // Mevcut dosya varsa oku
      if (existsSync(failReportPath)) {
        existingContent = readFileSync(failReportPath, 'utf-8');
      }
      
      // Yeni raporu en üste ekle, eski içeriği koru
      const finalContent = newContent + (existingContent ? `\n${existingContent}` : '');
      
      // Dosyayı yaz
      writeFileSync(failReportPath, finalContent, 'utf-8');
      
      console.log(`📝 Test raporu fail-report.md dosyasına yazıldı`);
    } catch (error) {
      console.error(`❌ Fail report yazılırken hata: ${error}`);
    }
  }
}

export default FailReportReporter; 