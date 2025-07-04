import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Loading component for better UX during dynamic imports
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-focus-blue"></div>
    <span className="ml-2 text-text-color">Yükleniyor...</span>
  </div>
)

// Error boundary for dynamic imports
export const DynamicError = ({ error, retry }: { error?: Error; retry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-error-red mb-4">
      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-text-color mb-2">Yükleme Hatası</h3>
    <p className="text-text-secondary mb-4">Bu bölüm yüklenirken bir hata oluştu.</p>
    {retry && (
      <button
        onClick={retry}
        className="px-4 py-2 bg-focus-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Tekrar Dene
      </button>
    )}
  </div>
)

// Utility function to create dynamic imports with consistent loading states
export function createDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loading?: ComponentType
    error?: ComponentType<{ error?: Error; retry?: () => void }>
    ssr?: boolean
  }
) {
  return dynamic(importFn, {
    loading: options?.loading || LoadingSpinner,
    ssr: options?.ssr ?? true,
  })
}

// Pre-defined dynamic imports for major modules
export const DynamicModuleCard = createDynamicImport(
  () => import('../components/ModuleCard'),
  { ssr: true }
)

export const DynamicProgressBar = createDynamicImport(
  () => import('../components/ProgressBar'),
  { ssr: false } // Progress bars are interactive, can load client-side
)

export const DynamicThemeToggle = createDynamicImport(
  () => import('../components/ThemeToggle'),
  { ssr: false } // Theme toggle is interactive, can load client-side
)

// Dynamic imports for larger sections that aren't immediately needed
export const DynamicElevenLabsIntegration = createDynamicImport(
  () => import('../lib/elevenlabs'),
  { ssr: false } // Audio functionality is client-side only
)

// Route-based dynamic imports for better code splitting
export const DynamicExercisePage = createDynamicImport(
  () => import('../app/exercise/page'),
  { ssr: true }
)

export const DynamicParentPanel = createDynamicImport(
  () => import('../app/parent/page'),
  { ssr: true }
)

export const DynamicSensorySettings = createDynamicImport(
  () => import('../app/sensory-settings/page'),
  { ssr: true }
)

export const DynamicAdminPanel = createDynamicImport(
  () => import('../app/admin/page'),
  { ssr: true }
)

// Preload important routes for better performance
export const preloadRoutes = () => {
  if (typeof window !== 'undefined') {
    // Preload critical routes after initial page load
    const criticalRoutes = [
      () => import('../app/exercise/page'),
      () => import('../components/ModuleCard'),
    ]
    
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      criticalRoutes.forEach(route => {
        window.requestIdleCallback(() => route())
      })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        criticalRoutes.forEach(route => route())
      }, 1000)
    }
  }
}

// Progressive enhancement - load features based on user interaction
export const loadFeatureOnDemand = (featureName: string) => {
  const featureLoaders = {
    'audio': () => import('../lib/elevenlabs'),
    'admin': () => import('../app/admin/page'),
    'analytics': () => import('../lib/analytics'),
  }
  
  return featureLoaders[featureName as keyof typeof featureLoaders]?.()
} 