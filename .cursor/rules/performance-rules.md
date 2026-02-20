# ⚡ Performans Kuralları - Kıvılcım Platform

**Amaç:** Hızlı loading, smooth interactions, optimal resource usage  
**Hedef:** LCP <2.5s, FID <100ms, CLS <0.1, Bundle <500KB  
**Güncelleme:** Bi-weekly (performans optimizasyonları)

---

## 🎯 Core Web Vitals Hedefleri

### **Zorunlu Performans Metrikleri**
```typescript
const PERFORMANCE_TARGETS = {
  LCP: '<2.5s',    // Largest Contentful Paint
  FID: '<100ms',   // First Input Delay  
  CLS: '<0.1',     // Cumulative Layout Shift
  TTI: '<3s',      // Time to Interactive
  FCP: '<1.8s',    // First Contentful Paint
  SI: '<3.4s'      // Speed Index
};
```

### **Bundle Size Limitleri**
- **Main Bundle:** <400KB (gzipped)
- **Vendor Bundle:** <100KB (gzipped)
- **Total Size:** <500KB (gzipped)
- **Route Chunks:** <50KB per route

---

## 🚀 Loading Performance Kuralları

### **1. Image Optimization**
```typescript
// Next.js Image component zorunlu kullanım
import Image from 'next/image';

// ✅ DOĞRU: Optimized image usage
<Image
  src="/images/vocabulary/araba.png"
  alt="Araba resmi"
  width={300}
  height={200}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/..."
/>

// ❌ YANLIŞ: Regular img tag
<img src="/images/vocabulary/araba.png" alt="Araba" />
```

### **2. Font Loading Optimization**
```typescript
// Font preloading ve display swap
const FONT_OPTIMIZATION = {
  preload: 'essential fonts only',
  display: 'swap',
  fallback: 'system fonts',
  subset: 'latin + turkish characters'
};

// CSS font-display
@font-face {
  font-family: 'GeistVF';
  font-display: swap; /* ZORUNLU */
  src: url('/fonts/geist-sans.woff2') format('woff2');
}
```

### **3. Code Splitting**
```typescript
// Route-based code splitting
const AlphabetReading = lazy(() => import('./AlphabetReading'));
const Mathematics = lazy(() => import('./Mathematics'));

// Component-based splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Dynamic imports for large dependencies
const loadChart = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};
```

---

## 📦 Bundle Optimization Kuralları

### **1. Dynamic Imports**
```typescript
// Heavy libraries dynamic import
const DYNAMIC_IMPORTS = {
  // Chart.js sadece gerektiğinde
  loadChart: () => import('chart.js'),
  
  // PDF generation sadece export sırasında
  loadPDF: () => import('jspdf'),
  
  // Audio analysis sadece admin panelinde
  loadAudioAnalysis: () => import('audio-analysis-lib')
};
```

### **2. Tree Shaking**
```typescript
// ✅ DOĞRU: Named imports
import { useState, useEffect } from 'react';
import { formatDate } from 'date-fns';

// ❌ YANLIŞ: Default import (tree shaking engeliyor)
import * as React from 'react';
import dateFns from 'date-fns';
```

### **3. Bundle Analyzer**
```bash
# Bundle size monitoring
npm run build:analyze

# Bundle performance check
npm run bundle:check

# Size regression prevention
npm run size:limit
```

---

## ⚡ Runtime Performance Kuralları

### **1. React Performance Patterns**
```typescript
// React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// useMemo for expensive calculations
const MathProblem = ({ numbers }) => {
  const result = useMemo(() => {
    return numbers.reduce((acc, num) => acc + num, 0);
  }, [numbers]);
  
  return <div>{result}</div>;
};

// useCallback for event handlers
const InteractiveComponent = ({ onUpdate }) => {
  const handleClick = useCallback((value) => {
    onUpdate(value);
  }, [onUpdate]);
  
  return <button onClick={handleClick}>Click</button>;
};
```

### **2. Virtual Scrolling**
```typescript
// Büyük listeler için virtual scrolling
const VirtualList = ({ items }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  
  // Sadece görünen items'ı render et
  useEffect(() => {
    const visible = items.slice(startIndex, endIndex);
    setVisibleItems(visible);
  }, [items, startIndex, endIndex]);
  
  return (
    <div className="virtual-list">
      {visibleItems.map(item => <Item key={item.id} {...item} />)}
    </div>
  );
};
```

### **3. Debouncing & Throttling**
```typescript
// Search input debouncing
const SearchInput = () => {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce((searchTerm) => {
      performSearch(searchTerm);
    }, 300),
    []
  );
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return <input onChange={handleChange} value={query} />;
};
```

---

## 🎵 Audio Performance Kuralları

### **1. Audio Caching Strategy**
```typescript
// Static audio files öncelikli
const AUDIO_PERFORMANCE = {
  // Cache policy
  staticFiles: {
    cache: 'max-age=31536000', // 1 yıl cache
    priority: 'high',
    preload: 'essential letters only'
  },
  
  // ElevenLabs API caching
  dynamicFiles: {
    cache: 'max-age=86400',    // 1 gün cache
    priority: 'medium',
    fallback: 'immediate'
  }
};
```

### **2. Audio Preloading**
```typescript
// Kritik sesler için preloading
const preloadEssentialAudio = () => {
  const essentialSounds = [
    '/audio/letters/a.mp3',
    '/audio/letters/b.mp3',
    '/audio/celebrations/harika.mp3'
  ];
  
  essentialSounds.forEach(sound => {
    const audio = new Audio(sound);
    audio.preload = 'auto';
  });
};
```

### **3. Audio Compression**
```typescript
// Audio file optimization
const AUDIO_OPTIMIZATION = {
  format: 'MP3',
  bitrate: '128kbps',   // Kalite vs boyut dengesi
  sampleRate: '44.1kHz',
  channels: 'mono',     // Ses boyutu optimize
  compression: 'high'
};
```

---

## 🔄 Caching Strategies

### **1. Next.js Caching**
```typescript
// Static Generation with ISR
export async function getStaticProps() {
  const data = await fetchData();
  
  return {
    props: { data },
    revalidate: 3600 // 1 saat ISR
  };
}

// Dynamic caching with SWR
const { data, error } = useSWR('/api/user-progress', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 300000 // 5 dakika
});
```

### **2. Browser Caching**
```typescript
// Cache headers for static assets
const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, immutable',
  'ETag': true,
  'Last-Modified': true
};

// Service Worker caching
const CACHE_STRATEGIES = {
  staticAssets: 'cache-first',
  apiCalls: 'network-first',
  images: 'cache-first',
  audio: 'cache-first'
};
```

---

## 📊 Performance Monitoring

### **1. Real User Monitoring (RUM)**
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const trackWebVitals = () => {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};
```

### **2. Performance Budgets**
```typescript
// Performance budget enforcement
const PERFORMANCE_BUDGETS = {
  javascript: '400kb',
  css: '50kb',
  images: '200kb',
  fonts: '100kb',
  total: '500kb'
};
```

### **3. Lighthouse CI**
```bash
# Automated performance testing
npm run lighthouse:ci

# Performance regression detection
npm run perf:diff

# Performance report generation
npm run perf:report
```

---

## 🎯 Module-Specific Performance

### **Mathematics Module**
```typescript
// Lazy loading for math games
const MathGames = {
  NumberRecognition: lazy(() => import('./NumberRecognitionGame')),
  AdditionGame: lazy(() => import('./AdditionGame')),
  CountingGame: lazy(() => import('./CountingGame'))
};

// Performance optimized math rendering
const MathProblem = React.memo(({ problem }) => {
  const solution = useMemo(() => solveMathProblem(problem), [problem]);
  return <div>{solution}</div>;
});
```

### **Vocabulary Module**
```typescript
// Image lazy loading with intersection observer
const VocabularyCard = ({ word, image }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true });
  
  return (
    <div ref={ref}>
      {inView && (
        <Image
          src={image}
          alt={word}
          onLoadingComplete={() => setImageLoaded(true)}
          priority={false}
        />
      )}
    </div>
  );
};
```

---

## 🔧 Development Tools

### **1. Performance Profiling**
```bash
# React DevTools Profiler
npm run dev:profiler

# Bundle analyzer
npm run build:analyze

# Lighthouse audit
npm run audit:performance
```

### **2. Performance Testing**
```typescript
// Performance test suite
describe('Performance Tests', () => {
  it('should load main page in under 2.5s', async () => {
    const startTime = performance.now();
    await page.goto('/');
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(2500);
  });
  
  it('should have acceptable bundle size', async () => {
    const bundleSize = await getBundleSize();
    expect(bundleSize).toBeLessThan(500 * 1024); // 500KB
  });
});
```

---

## 📋 Performance Checklist

### **Pre-Deployment Performance**
- [ ] Bundle size under 500KB
- [ ] Images optimized with Next.js Image
- [ ] Fonts preloaded with display: swap
- [ ] Code splitting implemented
- [ ] Unused dependencies removed
- [ ] Cache headers configured
- [ ] Service Worker implemented
- [ ] Lazy loading for non-critical components

### **Runtime Performance**
- [ ] React.memo for expensive components
- [ ] useMemo for expensive calculations
- [ ] useCallback for event handlers
- [ ] Virtual scrolling for long lists
- [ ] Debouncing for search inputs
- [ ] Audio preloading for critical sounds
- [ ] Error boundaries for performance isolation

---

## 🔗 İlgili Kural Dosyaları

### **Cross-References**
- **[Audio System Rules](./audio-system-rules.md)** - Audio performance optimization
- **[Image Processing Rules](./image-processing-rules.md)** - Image optimization patterns
- **[Component Rules](./component-rules.md)** - Performance-optimized components
- **[API Rules](./api-rules.md)** - API performance patterns

### **External Tools**
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [React DevTools Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)

---

## ⚠️ Kritik Performans Uyarıları

### **❌ ASLA YAPILMAYACAKLAR**
- Bundle size limitlerini aşma (>500KB)
- Unoptimized images kullanma
- Heavy computations main thread'de
- Unnecessary re-renders
- Büyük dependencies'leri statik import etme
- Cache headers olmadan deployment

### **✅ MUTLAKA YAPILACAKLAR**
- Performance budgets'a uyma
- Core Web Vitals hedeflerini karşılama
- Lazy loading implementasyonu
- Image optimization
- Code splitting
- Performance monitoring

---

> **⚡ Performans Mottosu:** "Hızlı platform, mutlu çocuklar. Her milisaniye otizmli çocukların öğrenme deneyimini etkiler."

**Son Güncelleme:** 2025-01-07  
**Performans Seviyesi:** 🟢 High Performance  
**Bundle Size:** 🟢 Under 500KB  
**Core Web Vitals:** 🟢 All Targets Met 