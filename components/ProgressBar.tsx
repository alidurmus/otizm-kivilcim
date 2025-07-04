import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  className = ''
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-sm font-semibold text-text-color mb-2">
          <span>{label}</span>
          <span data-testid="progress-text">{current}/{total}</span>
        </div>
      )}
      
      <div className="w-full bg-neutral-gray rounded-full h-4 shadow-inner">
        <div 
          className="bg-gradient-to-r from-focus-blue to-success-green h-4 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>
      
      {/* Progress circles */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              index < current
                ? 'bg-success-green border-success-green'
                : index === current
                ? 'bg-focus-blue border-focus-blue animate-calm-pulse'
                : 'bg-white border-neutral-gray'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar; 