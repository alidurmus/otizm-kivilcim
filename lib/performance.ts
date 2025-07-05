// Performance monitoring for Next.js apps
'use client';

import { useCallback, useMemo, useState, useRef, useEffect, startTransition, useTransition } from 'react';
import * as React from 'react';

// Google Analytics gtag type declaration
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Performance metrics interface
interface PerformanceMetric {
  name: string
  value: number
  delta: number
  id: string
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

interface PerformanceSummary {
  overallScore: number
  metrics: Record<string, PerformanceMetric>
  recommendations: string[]
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput?: boolean;
  value?: number;
}

// Performance thresholds based on Google's Core Web Vitals
const _PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
}

// Performance utilities for Kıvılcım platform
// Based on React Performance Best Practices

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Core Web Vitals monitoring
  initCoreWebVitals() {
    if (typeof window === 'undefined') return;

    try {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.recordMetric('LCP', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const eventEntry = entry as PerformanceEventTiming;
          this.recordMetric('FID', eventEntry.processingStart - eventEntry.startTime);
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as LayoutShiftEntry;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
          }
        });
        this.recordMetric('CLS', clsValue);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('Performance observers not supported:', error);
    }
  }

  // React-specific performance monitoring
  measureComponentRender(componentName: string, renderFn: () => void) {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    this.recordMetric(`${componentName}_render`, endTime - startTime);
  }

  // Audio performance monitoring (ElevenLabs specific)
  async measureAudioGeneration(text: string, type: string, generateFn: () => Promise<void>) {
    const startTime = performance.now();
    try {
      await generateFn();
      const endTime = performance.now();
      this.recordMetric(`audio_${type}`, endTime - startTime);
      return { success: true, duration: endTime - startTime };
    } catch (error) {
      const endTime = performance.now();
      this.recordMetric(`audio_${type}_error`, endTime - startTime);
      return { success: false, duration: endTime - startTime, error };
    }
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getMetrics() {
    const result: Record<string, {
      average: number;
      min: number;
      max: number;
      count: number;
      latest: number;
    }> = {};

    this.metrics.forEach((values, name) => {
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const latest = values[values.length - 1];
      
      result[name] = { average, min, max, count: values.length, latest };
    });

    return result;
  }

  // Core Web Vitals assessment
  assessCoreWebVitals() {
    const metrics = this.getMetrics();
    return {
      LCP: {
        value: metrics.LCP?.latest || 0,
        rating: this.getLCPRating(metrics.LCP?.latest || 0),
        threshold: 2500 // Good: < 2.5s
      },
      FID: {
        value: metrics.FID?.latest || 0,
        rating: this.getFIDRating(metrics.FID?.latest || 0),
        threshold: 100 // Good: < 100ms
      },
      CLS: {
        value: metrics.CLS?.latest || 0,
        rating: this.getCLSRating(metrics.CLS?.latest || 0),
        threshold: 0.1 // Good: < 0.1
      }
    };
  }

  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  // Add required methods for usePerformanceMonitoring
  onMetric(callback: (metric: PerformanceMetric) => void) {
    // Implementation for metric callbacks
    const handleMetric = (name: string, value: number) => {
      const metric: PerformanceMetric = {
        name,
        value,
        delta: value,
        id: `${name}-${Date.now()}`,
        rating: this.getRating(name, value),
        timestamp: Date.now()
      };
      callback(metric);
    };
    
    // Store the callback for future use
    this.metricCallback = handleMetric;
  }

  private metricCallback?: (name: string, value: number) => void;

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    if (name === 'LCP') return this.getLCPRating(value);
    if (name === 'FID') return this.getFIDRating(value);
    if (name === 'CLS') return this.getCLSRating(value);
    return 'good';
  }

  getPerformanceSummary(): PerformanceSummary {
    const _metrics = this.getMetrics();
    const coreWebVitals = this.assessCoreWebVitals();
    
    const performanceMetrics: Record<string, PerformanceMetric> = {};
    Object.entries(coreWebVitals).forEach(([name, data]) => {
      performanceMetrics[name] = {
        name,
        value: data.value,
        delta: data.value,
        id: `${name}-${Date.now()}`,
        rating: data.rating,
        timestamp: Date.now()
      };
    });

    const overallScore = this.calculateOverallScore(coreWebVitals);
    const recommendations = this.generateRecommendations(coreWebVitals);

    return {
      overallScore,
      metrics: performanceMetrics,
      recommendations
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private calculateOverallScore(coreWebVitals: any): number {
    const weights = { LCP: 0.4, FID: 0.3, CLS: 0.3 };
    let totalScore = 0;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(coreWebVitals).forEach(([metric, data]: [string, any]) => {
      const score = data.rating === 'good' ? 100 : data.rating === 'needs-improvement' ? 75 : 50;
      totalScore += score * (weights[metric as keyof typeof weights] || 0);
    });
    
    return Math.round(totalScore);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private generateRecommendations(coreWebVitals: any): string[] {
    const recommendations: string[] = [];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(coreWebVitals).forEach(([metric, data]: [string, any]) => {
      if (data.rating !== 'good') {
        recommendations.push(`Optimize ${metric}: Current ${data.value}, Target: < ${data.threshold}`);
      }
    });
    
    return recommendations;
  }
}

// React performance hooks
export function usePerformanceTracker() {
  const monitor = PerformanceMonitor.getInstance();
  
  const trackRender = useCallback((componentName: string, renderFn: () => void) => {
    monitor.measureComponentRender(componentName, renderFn);
  }, [monitor]);

  const trackAudio = useCallback(async (text: string, type: string, generateFn: () => Promise<void>) => {
    return monitor.measureAudioGeneration(text, type, generateFn);
  }, [monitor]);

  const getMetrics = useCallback(() => {
    return monitor.getMetrics();
  }, [monitor]);

  const getCoreWebVitals = useCallback(() => {
    return monitor.assessCoreWebVitals();
  }, [monitor]);

  return { trackRender, trackAudio, getMetrics, getCoreWebVitals };
}

// Optimization utilities based on React documentation
export function useOptimizedState<T>(
  initialValue: T,
  isEqual: (a: T, b: T) => boolean = (a, b) => a === b
) {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);

  const optimizedSetState = useCallback((newValue: T | ((prev: T) => T)) => {
    const nextValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(stateRef.current)
      : newValue;

    if (!isEqual(stateRef.current, nextValue)) {
      stateRef.current = nextValue;
      setState(nextValue);
    }
  }, [isEqual]);

  return [state, optimizedSetState] as const;
}

// Memoization utilities
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!deepEqual((a as any)[key], (b as any)[key])) return false;
  }
  
  return true;
}

export function shallowEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!keysB.includes(key) || (a as any)[key] !== (b as any)[key]) return false;
  }
  
  return true;
}

// Performance-optimized component wrapper
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const MemoizedComponent = React.memo((props: P) => {
    const { trackRender } = usePerformanceTracker();
    
    return useMemo(() => {
      let result: React.ReactElement;
      trackRender(componentName, () => {
        result = React.createElement(Component, props);
      });
      return result!;
    }, [props, trackRender]);
  }, shallowEqual);
  
  MemoizedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return MemoizedComponent;
}

// Bundle size optimization
export function useLazyImport<T>(
  importFn: () => Promise<{ default: T }>,
  deps: React.DependencyList = []
) {
  const [component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    importFn()
      .then(module => {
        setComponent(module.default);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importFn, ...deps]);

  return { component, loading, error };
}

// React Concurrent Features
export function useOptimizedTransition() {
  const [isPending, _startOptimizedTransition] = useTransition();
  
  const deferredUpdate = useCallback((updateFn: () => void) => {
    startTransition(() => {
      updateFn();
    });
  }, []);

  return { isPending, deferredUpdate };
}

// Production build check
export function isProductionBuild(): boolean {
  return process.env.NODE_ENV === 'production';
}

// Performance debugging in development
export function logPerformanceMetrics() {
  if (isProductionBuild()) return;
  
  const monitor = PerformanceMonitor.getInstance();
  const _metrics = monitor.getMetrics();
  const _coreWebVitals = monitor.assessCoreWebVitals();
  
  // Performance metrics would be logged here in development
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  const monitor = PerformanceMonitor.getInstance();
  monitor.initCoreWebVitals();
  
  // Log metrics every 30 seconds in development
  if (!isProductionBuild()) {
    setInterval(() => {
      logPerformanceMetrics();
    }, 30000);
  }
}

// Production build validation
export function validateProductionBuild() {
  if (!isProductionBuild()) {
    // Application running in development mode
    return false;
  }
  
  // Check for React DevTools
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    // React DevTools detected in production
    return false;
  }
  
  // Production build validation passed
  return true;
}

// Create global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<Map<string, PerformanceMetric>>(new Map())
  const [score, setScore] = React.useState<number>(100)

  React.useEffect(() => {
    const handleMetric = (metric: PerformanceMetric) => {
      setMetrics(prev => new Map(prev.set(metric.name, metric)))
      setScore(performanceMonitor.getPerformanceSummary().overallScore)
    }

    performanceMonitor.onMetric(handleMetric)
  }, [])

  return {
    metrics: Object.fromEntries(metrics),
    score,
    summary: performanceMonitor.getPerformanceSummary(),
  }
}

// Performance analytics reporting
export function reportPerformanceMetrics() {
  if (typeof window === 'undefined') return

  // Report to analytics service (replace with your analytics)
  const summary = performanceMonitor.getPerformanceSummary()
  
  // Example: Send to Google Analytics or custom analytics
  if (window.gtag) {
    Object.values(summary.metrics).forEach(metric => {
      window.gtag?.('event', 'web_vitals', {
        custom_parameter: metric.name,
        value: Math.round(metric.value),
        metric_rating: metric.rating,
      })
    })
  }

  // Performance summary would be logged here
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Report performance metrics after page load
  window.addEventListener('load', () => {
    setTimeout(reportPerformanceMetrics, 5000) // Report after 5 seconds
  })
} 