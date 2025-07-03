import React from 'react';

interface KivilcimIconProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export const KivilcimIcon: React.FC<KivilcimIconProps> = ({ 
  size = 120, 
  className = "", 
  animate = false 
}) => {
  return (
    <div className={`${className} ${animate ? 'animate-gentle-bounce' : ''}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Glow effect */}
        <defs>
          <radialGradient id="sparkGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.2"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Glow circle */}
        <circle 
          cx="60" 
          cy="60" 
          r="50" 
          fill="url(#sparkGlow)" 
          className={animate ? 'animate-calm-pulse' : ''}
        />
        
        {/* Main spark body */}
        <path 
          d="M60 10 L75 40 L90 35 L70 55 L80 75 L60 65 L40 75 L50 55 L30 35 L45 40 Z" 
          fill="#FDBA74" 
          stroke="#F97316" 
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Eyes */}
        <circle cx="50" cy="45" r="4" fill="#1F2937"/>
        <circle cx="70" cy="45" r="4" fill="#1F2937"/>
        <circle cx="51" cy="43" r="1.5" fill="white"/>
        <circle cx="71" cy="43" r="1.5" fill="white"/>
        
        {/* Smile */}
        <path 
          d="M50 55 Q60 65 70 55" 
          stroke="#1F2937" 
          strokeWidth="3" 
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Small sparkles around */}
        <g className={animate ? 'animate-calm-pulse' : ''}>
          <circle cx="25" cy="25" r="2" fill="#86EFAC"/>
          <circle cx="95" cy="25" r="2" fill="#3B82F6"/>
          <circle cx="25" cy="95" r="2" fill="#A5D8FF"/>
          <circle cx="95" cy="95" r="2" fill="#86EFAC"/>
        </g>
      </svg>
    </div>
  );
};

export default KivilcimIcon; 