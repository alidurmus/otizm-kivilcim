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
  return (
    <div
      className={`
        relative p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105
        ${isActive 
          ? 'bg-white border-2 border-focus-blue cursor-pointer' 
          : 'bg-neutral-gray border-2 border-gray-300 opacity-70'
        }
        ${className}
      `}
      onClick={isActive ? onClick : undefined}
      role={isActive ? "button" : "presentation"}
      tabIndex={isActive ? 0 : -1}
    >
      {/* Icon */}
      <div className="text-4xl mb-4 text-center">
        {icon}
      </div>
      
      {/* Title */}
      <h3 className={`text-xl font-bold mb-2 text-center ${isActive ? 'text-text-color' : 'text-gray-500'}`}>
        {title}
      </h3>
      
      {/* Description */}
      <p className={`text-sm mb-4 text-center ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
        {description}
      </p>
      
      {/* Action Button or Coming Soon */}
      <div className="text-center">
        {isActive ? (
          <Button 
            variant="primary" 
            size="medium"
            onClick={onClick}
          >
            BAŞLA
          </Button>
        ) : (
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold">
            🔒 YAKINDA
          </div>
        )}
      </div>
      
      {/* Lock overlay for inactive modules */}
      {!isActive && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-2xl flex items-center justify-center">
          <div className="text-6xl text-gray-400">
            🔒
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard; 