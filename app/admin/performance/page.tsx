'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  usePerformanceTracker,
  validateProductionBuild,
  logPerformanceMetrics,
  initializePerformanceMonitoring 
} from '@/lib/performance-simple';
import OptimizedButton from '@/components/OptimizedButton';

interface PerformanceMetric {
  name: string;
  average: number;
  min: number;
  max: number;
  count: number;
  latest: number;
}

interface CoreWebVital {
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: number;
}

interface CoreWebVitals {
  LCP: CoreWebVital;
  FID: CoreWebVital;
  CLS: CoreWebVital;
}

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<Record<string, PerformanceMetric>>({});
  const [coreWebVitals, setCoreWebVitals] = useState<CoreWebVitals | null>(null);
  const [isProductionBuild, setIsProductionBuild] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const { getMetrics, getCoreWebVitals } = usePerformanceTracker();

  // Initialize performance monitoring on mount
  useEffect(() => {
    initializePerformanceMonitoring();
    setIsProductionBuild(validateProductionBuild());
  }, []);

  // Memoized refresh function to prevent unnecessary re-renders
  const refreshMetrics = useCallback(() => {
    const currentMetrics = getMetrics();
    const currentCoreWebVitals = getCoreWebVitals();
    
    // Transform the metrics to match our interface
    const transformedMetrics: Record<string, PerformanceMetric> = {};
    Object.entries(currentMetrics).forEach(([key, value]) => {
      transformedMetrics[key] = {
        name: key,
        ...value
      };
    });
    
    setMetrics(transformedMetrics);
    setCoreWebVitals(currentCoreWebVitals);
  }, [getMetrics, getCoreWebVitals]);

  // Auto-refresh metrics
  useEffect(() => {
    refreshMetrics(); // Initial load
    
    const interval = setInterval(refreshMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshMetrics, refreshInterval]);

  // Memoized metrics array for performance
  const metricsArray = useMemo(() => {
    return Object.values(metrics);
  }, [metrics]);

  // Memoized component render count
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
  });

  // Memoized rating color getter
  const getRatingColor = useCallback((rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }, []);

  // Memoized format functions
  const formatDuration = useCallback((duration: number) => {
    return `${duration.toFixed(2)}ms`;
  }, []);

  const formatNumber = useCallback((num: number) => {
    return num.toFixed(3);
  }, []);

  // Memoized handlers
  const handleManualRefresh = useCallback(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  const handleLogMetrics = useCallback(() => {
    logPerformanceMetrics();
  }, []);

  const handleIntervalChange = useCallback((newInterval: number) => {
    setRefreshInterval(newInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Performance Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor React performance and Core Web Vitals for Kıvılcım platform
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isProductionBuild 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isProductionBuild ? '✅ Production Build' : '⚠️ Development Build'}
            </div>
            <div className="text-sm text-gray-500">
              Renders: {renderCount.current}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>
          <div className="flex items-center space-x-4">
            <OptimizedButton
              onClick={handleManualRefresh}
              variant="primary"
              size="medium"
            >
              Refresh Metrics
            </OptimizedButton>
            
            <OptimizedButton
              onClick={handleLogMetrics}
              variant="secondary"
              size="medium"
            >
              Log to Console
            </OptimizedButton>

            <div className="flex items-center space-x-2">
              <label htmlFor="refresh-interval" className="text-sm font-medium text-gray-700">
                Refresh Interval:
              </label>
              <select
                id="refresh-interval"
                value={refreshInterval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value={1000}>1s</option>
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
              </select>
            </div>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Core Web Vitals</h2>
          {coreWebVitals ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`inline-block px-4 py-2 rounded-lg font-medium ${getRatingColor(coreWebVitals.LCP.rating)}`}>
                  {coreWebVitals.LCP.rating.replace('-', ' ')}
                </div>
                <h3 className="font-semibold mt-2">LCP (Largest Contentful Paint)</h3>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(coreWebVitals.LCP.value)}</p>
                <p className="text-sm text-gray-500">Threshold: {formatDuration(coreWebVitals.LCP.threshold)}</p>
              </div>
              
              <div className="text-center">
                <div className={`inline-block px-4 py-2 rounded-lg font-medium ${getRatingColor(coreWebVitals.FID.rating)}`}>
                  {coreWebVitals.FID.rating.replace('-', ' ')}
                </div>
                <h3 className="font-semibold mt-2">FID (First Input Delay)</h3>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(coreWebVitals.FID.value)}</p>
                <p className="text-sm text-gray-500">Threshold: {formatDuration(coreWebVitals.FID.threshold)}</p>
              </div>
              
              <div className="text-center">
                <div className={`inline-block px-4 py-2 rounded-lg font-medium ${getRatingColor(coreWebVitals.CLS.rating)}`}>
                  {coreWebVitals.CLS.rating.replace('-', ' ')}
                </div>
                <h3 className="font-semibold mt-2">CLS (Cumulative Layout Shift)</h3>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(coreWebVitals.CLS.value)}</p>
                <p className="text-sm text-gray-500">Threshold: {formatNumber(coreWebVitals.CLS.threshold)}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading Core Web Vitals...</div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          {metricsArray.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Latest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metricsArray.map((metric) => (
                    <tr key={metric.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {metric.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(metric.latest)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(metric.average)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(metric.min)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(metric.max)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {metric.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">No performance metrics available yet</div>
              <p className="text-sm text-gray-400 mt-2">
                Interact with the application to generate metrics
              </p>
            </div>
          )}
        </div>

        {/* Performance Tips */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            React Performance Optimization Tips Applied
          </h2>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✅ <strong>React.memo</strong>: Used to prevent unnecessary re-renders</li>
            <li>✅ <strong>useCallback</strong>: Memoized functions to prevent recreation</li>
            <li>✅ <strong>useMemo</strong>: Expensive calculations cached</li>
            <li>✅ <strong>Production Build</strong>: Minified and optimized bundle</li>
            <li>✅ <strong>Bundle Splitting</strong>: Code split by route and features</li>
            <li>✅ <strong>Core Web Vitals</strong>: LCP, FID, CLS monitoring</li>
            <li>✅ <strong>Performance Tracking</strong>: Component render tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 