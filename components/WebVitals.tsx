'use client';
 
import { useReportWebVitals } from 'next/web-vitals';
 
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Sadece development ortamında konsola yazdır veya özel bir loglama servisine gönder (örn: Sentry/Analytics)
    if (process.env.NODE_ENV === 'development') {
        console.log(metric);
    }
    
    // Core Web Vitals metriklerini dış bir servise göndermek isterseniz buraya logic eklenebilir.
    // Örnek: CLS, FID, LCP vs.
  });
 
  return null;
}
