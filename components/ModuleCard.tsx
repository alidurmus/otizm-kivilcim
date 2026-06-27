import React from 'react';
import Button from './Button';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  isActive,
  onClick,
  className = ''
}) => {
  const handleClick = () => {
    if (isActive && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        relative p-6 rounded-[2rem] transition-all duration-500 ease-out transform hover:-translate-y-2 w-full
        ${isActive 
          ? 'glass-panel premium-shadow' 
          : 'bg-gray-100/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 opacity-70 shadow-sm'
        }
        ${className}
      `}
      role={isActive ? "article" : "presentation"}
    >
      {/* Icon */}
      <div className="text-4xl mb-4 text-center">
        {icon}
      </div>
      
      {/* Title */}
      <h3 className={`text-xl font-bold mb-2 text-center ${
        isActive 
          ? 'text-gray-900 dark:text-white' 
          : 'text-gray-500 dark:text-gray-400'
      }`}>
        {title}
      </h3>
      
      {/* Description */}
      <p className={`text-sm mb-6 text-center ${
        isActive 
          ? 'text-gray-600 dark:text-gray-300' 
          : 'text-gray-400 dark:text-gray-500'
      }`}>
        {description}
      </p>
      
      {/* Action Button or Coming Soon */}
      <div className="text-center">
        {isActive ? (
          <Button 
            variant="primary" 
            size="medium"
            onClick={handleClick}
            className="w-full font-bold text-white"
          >
            BAŞLA
          </Button>
        ) : (
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm font-semibold w-full">
            🔒 YAKINDA
          </div>
        )}
      </div>
      
      {/* Lock overlay for inactive modules */}
      {!isActive && (
        <div className="absolute inset-0 bg-gray-100/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-[2rem] flex items-center justify-center transition-opacity duration-300">
          <div className="text-6xl text-gray-400 dark:text-gray-500 drop-shadow-md">
            🔒
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard; 