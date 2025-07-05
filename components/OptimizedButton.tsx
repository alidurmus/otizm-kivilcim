'use client';

import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { usePerformanceTracker } from '@/lib/performance';

interface OptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  'data-testid'?: string;
  ariaLabel?: string;
}

// Memoized button component that only re-renders when props actually change
const OptimizedButton = memo<OptimizedButtonProps>(({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  className = '',
  'data-testid': testId,
  ariaLabel
}) => {
  const { trackRender } = usePerformanceTracker();
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Memoize computed styles to prevent unnecessary recalculations
  const buttonStyles = useMemo(() => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    };

    const sizeStyles = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-4 py-2 text-base',
      large: 'px-6 py-3 text-lg'
    };

    return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  }, [variant, size, className]);

  // Memoize the click handler to prevent unnecessary re-renders of child components
  const handleClick = useCallback(() => {
    if (disabled || loading || !onClick) return;
    
    // Track button click performance
    trackRender('OptimizedButton_click', () => {
      onClick();
    });
  }, [disabled, loading, onClick, trackRender]);

  // Memoize keyboard event handlers
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsPressed(true);
    }
  }, []);

  const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsPressed(false);
      handleClick();
    }
  }, [handleClick]);

  // Memoize mouse event handlers
  const handleMouseDown = useCallback(() => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  }, [disabled, loading]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false);
  }, []);

  // Memoize the loading spinner to prevent unnecessary re-renders
  const loadingSpinner = useMemo(() => {
    if (!loading) return null;
    
    return (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }, [loading]);

  // Memoize the button content to prevent unnecessary re-renders
  const buttonContent = useMemo(() => {
    return (
      <>
        {loadingSpinner}
        {typeof children === 'string' ? (
          <span className="truncate">{children}</span>
        ) : (
          children
        )}
      </>
    );
  }, [children, loadingSpinner]);

  // Effect for performance tracking
  useEffect(() => {
    trackRender('OptimizedButton_render', () => {
      // Component rendered
    });
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${buttonStyles} ${isPressed ? 'transform scale-95' : ''}`}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-pressed={isPressed}
      aria-disabled={disabled || loading}
    >
      {buttonContent}
    </button>
  );
});

// Display name for debugging
OptimizedButton.displayName = 'OptimizedButton';

// Custom comparison function for memo (like shouldComponentUpdate)
const OptimizedButtonWithCustomComparison = memo(OptimizedButton, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.loading === nextProps.loading &&
    prevProps.variant === nextProps.variant &&
    prevProps.size === nextProps.size &&
    prevProps.className === nextProps.className &&
    prevProps.children === nextProps.children &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.ariaLabel === nextProps.ariaLabel &&
    prevProps['data-testid'] === nextProps['data-testid']
  );
});

OptimizedButtonWithCustomComparison.displayName = 'OptimizedButtonWithCustomComparison';

export default OptimizedButton;
export { OptimizedButtonWithCustomComparison };

// Example usage with performance tracking
export const ExampleUsage = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the increment function to prevent unnecessary re-renders
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // Memoize the async action to prevent unnecessary re-renders
  const handleAsyncAction = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCount(prev => prev + 10);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-x-4">
      <OptimizedButton
        onClick={handleIncrement}
        variant="primary"
        size="medium"
        data-testid="increment-button"
        ariaLabel="Increment counter"
      >
        Count: {count}
      </OptimizedButton>
      
      <OptimizedButton
        onClick={handleAsyncAction}
        loading={isLoading}
        variant="secondary"
        size="medium"
        data-testid="async-button"
        ariaLabel="Perform async action"
      >
        {isLoading ? 'Loading...' : 'Async Action'}
      </OptimizedButton>
    </div>
  );
}; 