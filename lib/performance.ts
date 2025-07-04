// Performance monitoring and Core Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

// Performance metrics interface
interface PerformanceMetric {
  name: string
  value: number
  delta: number
  id: string
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

// Performance thresholds based on Google's Core Web Vitals
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
}

// Performance event handlers
type PerformanceHandler = (metric: PerformanceMetric) => void

class PerformanceMonitor {
  private handlers: PerformanceHandler[] = []
  private metrics: Map<string, PerformanceMetric> = new Map()

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeWebVitals()
      this.setupPerformanceObserver()
    }
  }

  // Add handler for performance metrics
  onMetric(handler: PerformanceHandler) {
    this.handlers.push(handler)
  }

  // Initialize Web Vitals tracking
  private initializeWebVitals() {
    getCLS(this.handleMetric.bind(this))
    getFID(this.handleMetric.bind(this))
    getFCP(this.handleMetric.bind(this))
    getLCP(this.handleMetric.bind(this))
    getTTFB(this.handleMetric.bind(this))
  }

  // Handle individual metrics
  private handleMetric(metric: any) {
    const rating = this.getRating(metric.name, metric.value)
    
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      rating,
      timestamp: Date.now(),
    }

    this.metrics.set(metric.name, performanceMetric)
    this.handlers.forEach(handler => handler(performanceMetric))
    
    // Log performance issues in development
    if (process.env.NODE_ENV === 'development') {
      this.logPerformanceIssue(performanceMetric)
    }
  }

  // Determine performance rating
  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS]
    if (!thresholds) return 'good'
    
    if (value <= thresholds.good) return 'good'
    if (value <= thresholds.needsImprovement) return 'needs-improvement'
    return 'poor'
  }

  // Log performance issues for debugging
  private logPerformanceIssue(metric: PerformanceMetric) {
    if (metric.rating === 'poor') {
      console.warn(`🚨 Performance Issue: ${metric.name}`, {
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        recommendations: this.getRecommendations(metric.name)
      })
    } else if (metric.rating === 'needs-improvement') {
      console.log(`⚠️ Performance Warning: ${metric.name}`, {
        value: metric.value,
        rating: metric.rating,
      })
    }
  }

  // Get performance recommendations
  private getRecommendations(metricName: string): string[] {
    const recommendations: Record<string, string[]> = {
      LCP: [
        'Optimize images with next/image',
        'Implement code splitting',
        'Use CDN for static assets',
        'Preload critical resources'
      ],
      FID: [
        'Reduce JavaScript execution time',
        'Code split large bundles',
        'Use React.memo for expensive components',
        'Defer non-critical JavaScript'
      ],
      CLS: [
        'Set explicit dimensions for images',
        'Reserve space for dynamic content',
        'Use CSS transforms instead of changing layout properties',
        'Preload fonts with font-display: swap'
      ],
      FCP: [
        'Optimize critical rendering path',
        'Reduce server response time',
        'Eliminate render-blocking resources',
        'Minify CSS and JavaScript'
      ],
      TTFB: [
        'Optimize server response time',
        'Use CDN',
        'Enable HTTP/2',
        'Optimize database queries'
      ]
    }

    return recommendations[metricName] || []
  }

  // Setup Performance Observer for additional metrics
  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Monitor navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.trackNavigationTiming(entry as PerformanceNavigationTiming)
          }
        }
      })
      navObserver.observe({ type: 'navigation', buffered: true })

      // Monitor resource timing for large resources
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.trackResourceTiming(entry as PerformanceResourceTiming)
          }
        }
      })
      resourceObserver.observe({ type: 'resource', buffered: true })
    }
  }

  // Track navigation timing
  private trackNavigationTiming(entry: PerformanceNavigationTiming) {
    const metrics = {
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      domComplete: entry.domComplete - entry.domInteractive,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Navigation Timing:', metrics)
    }
  }

  // Track resource timing for optimization opportunities
  private trackResourceTiming(entry: PerformanceResourceTiming) {
    const duration = entry.duration
    const size = entry.transferSize

    // Flag slow resources (>1MB or >2 seconds)
    if (size > 1024 * 1024 || duration > 2000) {
      console.warn('🐌 Slow Resource Detected:', {
        name: entry.name,
        duration: Math.round(duration),
        size: size ? Math.round(size / 1024) + 'KB' : 'unknown',
        type: entry.initiatorType
      })
    }
  }

  // Get current performance summary
  getPerformanceSummary() {
    const summary = {
      metrics: Object.fromEntries(this.metrics),
      overallScore: this.calculateOverallScore(),
      timestamp: Date.now(),
    }

    return summary
  }

  // Calculate overall performance score
  private calculateOverallScore(): number {
    const coreMetrics = ['LCP', 'FID', 'CLS']
    const scores = coreMetrics.map(name => {
      const metric = this.metrics.get(name)
      if (!metric) return 100 // Default good score if not measured yet
      
      switch (metric.rating) {
        case 'good': return 100
        case 'needs-improvement': return 70
        case 'poor': return 30
        default: return 100
      }
    })

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }
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
      window.gtag('event', 'web_vitals', {
        custom_parameter: metric.name,
        value: Math.round(metric.value),
        metric_rating: metric.rating,
      })
    })
  }

  console.log('📈 Performance Summary:', summary)
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Report performance metrics after page load
  window.addEventListener('load', () => {
    setTimeout(reportPerformanceMetrics, 5000) // Report after 5 seconds
  })
} 