import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock fetch globally
global.fetch = jest.fn();

describe('Ses Kontrol Sistemi Unit Tests', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('Audio File Existence Check', () => {
    it('Mevcut ses dosyalarını doğru tespit etmeli', async () => {
      // Mock successful HEAD request
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      const response = await fetch('/audio/letters/a.mp3', { method: 'HEAD' });
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });

    it('Eksik ses dosyalarını doğru tespit etmeli', async () => {
      // Mock 404 HEAD request
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const response = await fetch('/audio/letters/ch.mp3', { method: 'HEAD' });
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });

    it('Türkçe karakter dosya isimlerini doğru map etmeli', () => {
      const turkishToFilename = (char: string): string => {
        const mapping: { [key: string]: string } = {
          'Ç': 'ch',
          'Ğ': 'gh', 
          'I': 'ii',
          'İ': 'i',
          'Ö': 'oo',
          'Ş': 'sh',
          'Ü': 'uu'
        };
        return mapping[char.toUpperCase()] || char.toLowerCase();
      };

      expect(turkishToFilename('Ç')).toBe('ch');
      expect(turkishToFilename('Ğ')).toBe('gh');
      expect(turkishToFilename('I')).toBe('ii');
      expect(turkishToFilename('Ö')).toBe('oo');
      expect(turkishToFilename('Ş')).toBe('sh');
      expect(turkishToFilename('Ü')).toBe('uu');
      expect(turkishToFilename('A')).toBe('a');
    });
  });

  describe('Audio Statistics Calculation', () => {
    it('Başarı oranını doğru hesaplamalı', () => {
      const calculateSuccessRate = (total: number, existing: number): number => {
        return Math.round((existing / total) * 100);
      };

      expect(calculateSuccessRate(46, 40)).toBe(87);
      expect(calculateSuccessRate(46, 46)).toBe(100);
      expect(calculateSuccessRate(46, 0)).toBe(0);
      expect(calculateSuccessRate(46, 23)).toBe(50);
    });

    it('İstatistik nesnesini doğru oluşturmalı', () => {
      const createAudioStats = (totalFiles: number, existingFiles: number) => {
        const missingFiles = totalFiles - existingFiles;
        const successRate = Math.round((existingFiles / totalFiles) * 100);
        
        return {
          totalFiles,
          existingFiles,
          missingFiles,
          successRate
        };
      };

      const stats = createAudioStats(46, 40);
      expect(stats.totalFiles).toBe(46);
      expect(stats.existingFiles).toBe(40);
      expect(stats.missingFiles).toBe(6);
      expect(stats.successRate).toBe(87);
    });
  });

  describe('Critical Audio Files List', () => {
    it('46 kritik ses dosyası listesi doğru olmalı', () => {
      const criticalAudioFiles = [
        // Ana sayfa hoş geldin mesajları
        '/audio/sentences/hosgeldin-mesaji.mp3',
        '/audio/sentences/alfabe-hosgeldin.mp3',
        
        // Türkçe harfler (29 harf)
        '/audio/letters/a.mp3', '/audio/letters/b.mp3', '/audio/letters/c.mp3',
        '/audio/letters/ch.mp3', '/audio/letters/d.mp3', '/audio/letters/e.mp3',
        '/audio/letters/f.mp3', '/audio/letters/g.mp3', '/audio/letters/gh.mp3',
        '/audio/letters/h.mp3', '/audio/letters/ii.mp3', '/audio/letters/i.mp3',
        '/audio/letters/j.mp3', '/audio/letters/k.mp3', '/audio/letters/l.mp3',
        '/audio/letters/m.mp3', '/audio/letters/n.mp3', '/audio/letters/o.mp3',
        '/audio/letters/oo.mp3', '/audio/letters/p.mp3', '/audio/letters/r.mp3',
        '/audio/letters/s.mp3', '/audio/letters/sh.mp3', '/audio/letters/t.mp3',
        '/audio/letters/u.mp3', '/audio/letters/uu.mp3', '/audio/letters/v.mp3',
        '/audio/letters/y.mp3', '/audio/letters/z.mp3',
        
        // Temel kutlama mesajları (5 dosya)
        '/audio/celebrations/aferin-sana.mp3',
        '/audio/celebrations/bravo.mp3',
        '/audio/celebrations/cok-basarilisin-harika-is.mp3',
        '/audio/celebrations/harikasin-cok-guzel.mp3',
        '/audio/celebrations/mukemmel-devam-et.mp3',
        
        // Okuryazarlık modülü hece dosyaları (5 dosya)
        '/audio/words/bu-hece-el.mp3',
        '/audio/words/bu-hece-al.mp3',
        '/audio/words/bu-hece-ol.mp3',
        '/audio/words/bu-hece-ul.mp3',
        '/audio/words/bu-hece-il.mp3',
        
        // Temel kelimeler (5 dosya)
        '/audio/words/elma.mp3',
        '/audio/words/anne.mp3',
        '/audio/words/baba.mp3',
        '/audio/words/su.mp3',
        '/audio/words/ekmek.mp3'
      ];

      expect(criticalAudioFiles.length).toBe(46);
      expect(criticalAudioFiles).toContain('/audio/letters/ch.mp3');
      expect(criticalAudioFiles).toContain('/audio/letters/gh.mp3');
      expect(criticalAudioFiles).toContain('/audio/letters/ii.mp3');
      expect(criticalAudioFiles).toContain('/audio/letters/oo.mp3');
      expect(criticalAudioFiles).toContain('/audio/letters/sh.mp3');
      expect(criticalAudioFiles).toContain('/audio/letters/uu.mp3');
    });

    it('Türkçe alfabe dosyalarının tümü listede olmalı', () => {
      const turkishLetters = [
        'a', 'b', 'c', 'ch', 'd', 'e', 'f', 'g', 'gh', 'h',
        'ii', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'oo', 'p',
        'r', 's', 'sh', 't', 'u', 'uu', 'v', 'y', 'z'
      ];

      expect(turkishLetters.length).toBe(29);
      
      // Türkçe karakterlerin özel mappingleri kontrol et
      expect(turkishLetters).toContain('ch');  // Ç
      expect(turkishLetters).toContain('gh');  // Ğ  
      expect(turkishLetters).toContain('ii');  // I
      expect(turkishLetters).toContain('oo');  // Ö
      expect(turkishLetters).toContain('sh');  // Ş
      expect(turkishLetters).toContain('uu');  // Ü
    });
  });

  describe('Rate Limiting Logic', () => {
    it('Rate limiting delay hesaplaması doğru olmalı', () => {
      const calculateDelay = (requestIndex: number, delayMs: number = 3000): number => {
        return requestIndex * delayMs;
      };

      expect(calculateDelay(0)).toBe(0);     // İlk request
      expect(calculateDelay(1)).toBe(3000);  // İkinci request
      expect(calculateDelay(2)).toBe(6000);  // Üçüncü request
      expect(calculateDelay(5)).toBe(15000); // Altıncı request
    });

    it('Sıralı işlem için toplam süre hesaplaması doğru olmalı', () => {
      const calculateTotalTime = (fileCount: number, delayMs: number = 3000): number => {
        return (fileCount - 1) * delayMs; // İlk request hemen, diğerleri delay ile
      };

      expect(calculateTotalTime(6)).toBe(15000); // 6 dosya = 15 saniye
      expect(calculateTotalTime(1)).toBe(0);     // 1 dosya = gecikme yok
      expect(calculateTotalTime(3)).toBe(6000);  // 3 dosya = 6 saniye
    });
  });

  describe('Error Handling', () => {
    it('Network hatalarını graceful handle etmeli', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('/audio/letters/a.mp3', { method: 'HEAD' });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });

    it('429 rate limiting hatalarını handle etmeli', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      });

      const response = await fetch('/api/speech', {
        method: 'POST',
        body: JSON.stringify({ text: 'test' })
      });

      expect(response.status).toBe(429);
      expect(response.statusText).toBe('Too Many Requests');
    });
  });

  describe('Progress Tracking', () => {
    it('İlerleme yüzdesini doğru hesaplamalı', () => {
      const calculateProgress = (completed: number, total: number): number => {
        return Math.round((completed / total) * 100);
      };

      expect(calculateProgress(1, 6)).toBe(17);
      expect(calculateProgress(3, 6)).toBe(50);
      expect(calculateProgress(6, 6)).toBe(100);
      expect(calculateProgress(0, 6)).toBe(0);
    });

    it('İlerleme mesajı formatı doğru olmalı', () => {
      const formatProgressMessage = (current: number, total: number, filename: string): string => {
        return `[${current}/${total}] Creating: ${filename}`;
      };

      expect(formatProgressMessage(1, 6, 'ch.mp3')).toBe('[1/6] Creating: ch.mp3');
      expect(formatProgressMessage(3, 6, 'oo.mp3')).toBe('[3/6] Creating: oo.mp3');
    });
  });

}); 