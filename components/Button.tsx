import React, { memo, useMemo } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

// Memoized static objects - computed once outside component
const BASE_CLASSES = "font-bold rounded-2xl transition-all duration-500 ease-out focus:outline-none focus:ring-4 focus:ring-opacity-50 transform hover:-translate-y-1 active:scale-95 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden";

const VARIANT_CLASSES = {
  primary: "bg-gradient-to-br from-focus-blue to-blue-500 hover:from-blue-600 hover:to-focus-blue text-white focus:ring-focus-blue premium-shadow",
  secondary: "glass-panel text-adaptive hover:bg-white/90 dark:hover:bg-slate-800/90 focus:ring-neutral-gray shadow-md",
  success: "bg-gradient-to-br from-success-green to-green-400 hover:from-green-400 hover:to-green-300 text-text-color focus:ring-success-green premium-shadow"
} as const;

const SIZE_CLASSES = {
  small: "px-4 py-2 text-sm",
  medium: "px-6 py-3 text-base",
  large: "px-8 py-4 text-lg"
} as const;

export const Button: React.FC<ButtonProps> = memo(({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  type = 'button',
  ariaLabel
}) => {
  // Memoize className calculation to prevent unnecessary re-renders
  const buttonClassName = useMemo(() => 
    `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`,
    [variant, size, className]
  );
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClassName}
      // Accessibility improvements
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 