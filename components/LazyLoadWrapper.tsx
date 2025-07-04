'use client';

import React, { Suspense } from 'react';
import { ExerciseErrorBoundary } from './ErrorBoundary';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  errorBoundaryProps?: {
    exerciseName?: string;
    onBackToMenu?: () => void;
    onRetry?: () => void;
  };
}

// Default loading component with child-friendly design
const DefaultFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-border transition-colors duration-500 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-warm-orange mb-4"></div>
      <h2 className="text-xl font-semibold text-adaptive mb-2">Hazırlanıyor...</h2>
      <p className="text-adaptive-secondary">Eğlenceli aktiviteler yükleniyor! 🎮</p>
    </div>
  </div>
);

// Skeleton component for faster perceived loading
const ComponentSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-border transition-colors duration-500 p-4">
    <div className="container mx-auto">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </div>
      
      {/* Main content skeleton */}
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4 mx-auto"></div>
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8 mx-auto"></div>
        
        {/* Cards skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg">
              <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function LazyLoadWrapper({ 
  children, 
  fallback: CustomFallback = DefaultFallback,
  errorBoundaryProps = {}
}: LazyLoadWrapperProps) {
  return (
    <ExerciseErrorBoundary
      exerciseName={errorBoundaryProps.exerciseName || 'Modül'}
      onBackToMenu={errorBoundaryProps.onBackToMenu}
      onRetry={errorBoundaryProps.onRetry || (() => window.location.reload())}
    >
      <Suspense fallback={<CustomFallback />}>
        {children}
      </Suspense>
    </ExerciseErrorBoundary>
  );
}

// Export skeleton for specific use cases
export { ComponentSkeleton }; 