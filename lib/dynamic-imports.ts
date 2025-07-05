import dynamic from 'next/dynamic';
import React, { ComponentType } from 'react';
import { ComponentSkeleton } from '@/components/LazyLoadWrapper';

// Type-safe dynamic import utility with loading states
interface DynamicImportOptions {
  fallback?: ComponentType;
  errorBoundaryProps?: {
    exerciseName?: string;
    onBackToMenu?: () => void;
    onRetry?: () => void;
  };
  ssr?: boolean;
}

/**
 * Creates a dynamically imported component with lazy loading
 * @param importFn - Function that returns the dynamic import
 * @param options - Configuration options for loading behavior
 */
export function createDynamicComponent<T = unknown>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = {}
) {
  const {
    fallback = ComponentSkeleton,
    ssr = false
  } = options;

  return dynamic(importFn, {
    loading: () => React.createElement(fallback),
    ssr,
  });
}

/**
 * Lazy-loaded exercise pages with error boundaries
 */
export const LazyLiteracyPage = createDynamicComponent(
  () => import('@/app/exercise/literacy/page'),
  {
    errorBoundaryProps: {
      exerciseName: 'Okuryazarlık Modülü',
      onBackToMenu: () => window.location.href = '/modules'
    }
  }
);

export const LazyVocabularyPage = createDynamicComponent(
  () => import('@/app/exercise/vocabulary/page'),
  {
    errorBoundaryProps: {
      exerciseName: 'Anlam ve Kelime Dağarcığı',
      onBackToMenu: () => window.location.href = '/modules'
    }
  }
);

export const LazySocialPage = createDynamicComponent(
  () => import('@/app/exercise/social-communication/page'),
  {
    errorBoundaryProps: {
      exerciseName: 'Sosyal İletişim',
      onBackToMenu: () => window.location.href = '/modules'
    }
  }
);

export const LazyWritingPage = createDynamicComponent(
  () => import('@/app/exercise/writing-expression/page'),
  {
    errorBoundaryProps: {
      exerciseName: 'Yazma ve İfade',
      onBackToMenu: () => window.location.href = '/modules'
    }
  }
);

export const LazyBasicConceptsPage = createDynamicComponent(
  () => import('@/app/exercise/basic-concepts/page'),
  {
    errorBoundaryProps: {
      exerciseName: 'Temel Kavramlar',
      onBackToMenu: () => window.location.href = '/modules'
    }
  }
);

/**
 * Lazy-loaded admin and parent features
 */
export const LazyParentPage = createDynamicComponent(
  () => import('@/app/parent/page'),
  {
    errorBoundaryProps: {
      exerciseName: 'Ebeveyn Paneli',
      onBackToMenu: () => window.location.href = '/'
    }
  }
);

export const LazyAdminPage = createDynamicComponent(
  () => import('@/app/admin/page'),
  {
    errorBoundaryProps: {
      exerciseName: 'Admin Paneli',
      onBackToMenu: () => window.location.href = '/'
    }
  }
);

export const LazySensorySettingsPage = createDynamicComponent(
  () => import('@/app/sensory-settings/page'),
  {
    errorBoundaryProps: {
      exerciseName: 'Duyusal Ayarlar',
      onBackToMenu: () => window.location.href = '/'
    }
  }
);

/**
 * Lazy-loaded exercise components (for vocabulary module)
 */
export const LazyWordMatchingGame = createDynamicComponent(
  () => import('@/app/exercise/vocabulary/WordMatchingGame'),
  {
    errorBoundaryProps: {
      exerciseName: 'Kelime Eşleştirme Oyunu'
    }
  }
);

export const LazyMemoryGame = createDynamicComponent(
  () => import('@/app/exercise/vocabulary/HafizaOyunu'),
  {
    errorBoundaryProps: {
      exerciseName: 'Hafıza Oyunu'
    }
  }
);

/**
 * Utility function for preloading components
 * Call this to preload components before they're needed
 */
export function preloadComponents() {
  // Preload the most commonly used components
  const importPromises = [
    import('@/app/exercise/literacy/page'),
    import('@/app/exercise/vocabulary/page'),
    import('@/app/parent/page'),
  ];

  // Return promise that resolves when all components are preloaded
  return Promise.allSettled(importPromises);
}

/**
 * Preload component based on user interaction
 * Useful for link hover states
 */
export function preloadComponentOnHover(
  importFn: () => Promise<unknown>,
  delay: number = 100
) {
  let timeoutId: NodeJS.Timeout;
  let hasPreloaded = false;

  return {
    onMouseEnter: () => {
      if (hasPreloaded) return;
      
      timeoutId = setTimeout(() => {
        importFn().then(() => {
          hasPreloaded = true;
        });
      }, delay);
    },
    onMouseLeave: () => {
      clearTimeout(timeoutId);
    }
  };
}

// Performance monitoring for dynamic imports
export function trackComponentLoadTime(_componentName: string) {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const _loadTime = endTime - startTime;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      // Component loaded successfully
    }
    
    // In production, you could send this to your analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendAnalytics('component_load_time', { component: componentName, time: loadTime });
    }
  };
} 