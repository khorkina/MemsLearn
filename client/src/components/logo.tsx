import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Graduation cap - more prominent and clear */}
      <path 
        d="M20 40 L50 30 L80 40 L80 48 L75 50 L50 42 L25 50 L20 48 Z" 
        fill="#8B7355" 
        stroke="#6B5B47" 
        strokeWidth="1.5"
      />
      
      {/* Graduation cap board (mortarboard) */}
      <rect x="35" y="28" width="30" height="30" rx="2" 
        fill="#8B7355" 
        stroke="#6B5B47" 
        strokeWidth="1.5"
        transform="rotate(45 50 43)"
      />
      
      {/* Graduation cap tassel */}
      <line x1="65" y1="35" x2="70" y2="28" stroke="#8B7355" strokeWidth="2"/>
      <circle cx="70" cy="28" r="2" fill="#8B7355"/>
      
      {/* Minimalist clown face */}
      <circle cx="50" cy="60" r="22" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1.5"/>
      
      {/* Simple eyes */}
      <circle cx="44" cy="54" r="2" fill="#8B7355"/>
      <circle cx="56" cy="54" r="2" fill="#8B7355"/>
      
      {/* Small minimalist nose */}
      <circle cx="50" cy="60" r="2.5" fill="#D2B48C" stroke="#8B7355" strokeWidth="1"/>
      
      {/* Simple smile */}
      <path 
        d="M42 68 Q50 76 58 68" 
        fill="none" 
        stroke="#8B7355" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* Minimalist hair tufts */}
      <circle cx="32" cy="48" r="4" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1"/>
      <circle cx="68" cy="48" r="4" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1"/>
    </svg>
  );
};

export default Logo;