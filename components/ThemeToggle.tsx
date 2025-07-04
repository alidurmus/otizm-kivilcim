'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ 
  size = 'medium', 
  showLabel = false,
  className = '' 
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder or null until the component is mounted
  // This prevents hydration mismatch errors
  if (!mounted) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-600">
            Yükleniyor...
          </span>
        )}
        <div 
          className={`relative w-12 h-7 bg-gray-200 rounded-full transition-all duration-300 opacity-50`}
          title="Tema değiştirici yükleniyor..."
        />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const sizeClasses = {
    small: 'w-10 h-6',
    medium: 'w-12 h-7',
    large: 'w-14 h-8'
  };

  const iconSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-adaptive">
          {theme === 'light' ? '☀️ Açık' : '🌙 Koyu'}
        </span>
      )}
      
      <button
        onClick={toggleTheme}
        className={`relative ${sizeClasses[size]} bg-gray-200 dark:bg-dark-surface rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-focus-blue focus:ring-opacity-50 hover:shadow-md`}
        aria-label={`${theme === 'light' ? 'Koyu' : 'Açık'} temaya geç`}
        title={`${theme === 'light' ? 'Koyu' : 'Açık'} temaya geç`}
      >
        {/* Toggle Circle */}
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center ${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        >
          {/* Icon inside circle */}
          <span className={`${iconSizes[size]} transition-all duration-300`}>
            {theme === 'light' ? '☀️' : '🌙'}
          </span>
        </div>
        
        {/* Background Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <span className={`${iconSizes[size]} transition-opacity duration-300 ${theme === 'light' ? 'opacity-60' : 'opacity-30'}`}>
            ☀️
          </span>
          <span className={`${iconSizes[size]} transition-opacity duration-300 ${theme === 'dark' ? 'opacity-60' : 'opacity-30'}`}>
            🌙
          </span>
        </div>
      </button>
      
      {showLabel && (
        <span className="text-xs text-adaptive-secondary">
          Tema
        </span>
      )}
    </div>
  );
}