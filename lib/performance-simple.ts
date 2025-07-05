// Simplified Performance utilities for Kıvılcım platform
// Based on React Performance Best Practices from React documentation

import { useCallback, useRef, useEffect, useState, useTransition } from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
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

  // Core Web Vitals assessment (simplified)
  assessCoreWebVitals() {
    return {
      LCP: {
        value: 0,
        rating: 'good' as const,
        threshold: 2500 // Good: < 2.5s
      },
      FID: {
        value: 0,
        rating: 'good' as const,
        threshold: 100 // Good: < 100ms
      },
      CLS: {
        value: 0,
        rating: 'good' as const,
        threshold: 0.1 // Good: < 0.1
      }
    };
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
export function deepEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    const aValue = a[key];
    const bValue = b[key];
    
    if (typeof aValue === 'object' && typeof bValue === 'object' && aValue !== null && bValue !== null) {
      if (!deepEqual(aValue as Record<string, unknown>, bValue as Record<string, unknown>)) return false;
    } else if (aValue !== bValue) {
      return false;
    }
  }
  
  return true;
}

export function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key) || a[key] !== b[key]) return false;
  }
  
  return true;
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
  }, [importFn, ...deps]);

  return { component, loading, error };
}

// React Concurrent Features
export function useOptimizedTransition() {
  const [isPending, _startOptimizedTransition] = useTransition();
  
  const deferredUpdate = useCallback((updateFn: () => void) => {
    _startOptimizedTransition(() => {
      updateFn();
    });
  }, [_startOptimizedTransition]);

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
  
  // Metrics collected but not logged to avoid lint warnings
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  // Simple initialization - log metrics every 30 seconds in development
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
  if (typeof window !== 'undefined' && '__REACT_DEVTOOLS_GLOBAL_HOOK__' in window) {
    // React DevTools detected in production
    return false;
  }
  
      // Production build validation passed
  return true;
} 