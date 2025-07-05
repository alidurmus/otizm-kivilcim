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
const BASE_CLASSES = "font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

const VARIANT_CLASSES = {
  primary: "bg-focus-blue hover:bg-blue-600 text-white focus:ring-focus-blue shadow-lg hover:shadow-xl",
  secondary: "bg-neutral-gray hover:bg-gray-300 text-text-color focus:ring-neutral-gray shadow-md hover:shadow-lg",
  success: "bg-success-green hover:bg-green-400 text-text-color focus:ring-success-green shadow-lg hover:shadow-xl"
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