import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = "font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variantClasses = {
    primary: "bg-focus-blue hover:bg-blue-600 text-white focus:ring-focus-blue shadow-lg hover:shadow-xl",
    secondary: "bg-neutral-gray hover:bg-gray-300 text-text-color focus:ring-neutral-gray shadow-md hover:shadow-lg",
    success: "bg-success-green hover:bg-green-400 text-text-color focus:ring-success-green shadow-lg hover:shadow-xl"
  };
  
  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      // Accessibility improvements
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </button>
  );
};

export default Button; 