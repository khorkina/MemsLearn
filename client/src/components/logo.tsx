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
      {/* Academic graduation cap base (skull cap) */}
      <ellipse cx="50" cy="45" rx="20" ry="8" 
        fill="#2C2C2C" 
        stroke="#1F1F1F" 
        strokeWidth="1"
      />
      
      {/* Mortarboard (square academic board) */}
      <rect x="30" y="35" width="40" height="40" rx="1" 
        fill="#2C2C2C" 
        stroke="#1F1F1F" 
        strokeWidth="1.5"
        transform="rotate(15 50 40)"
      />
      
      {/* Academic tassel - hanging from center */}
      <line x1="50" y1="35" x2="52" y2="25" stroke="#DAA520" strokeWidth="2"/>
      <line x1="52" y1="25" x2="54" y2="20" stroke="#DAA520" strokeWidth="1.5"/>
      <line x1="52" y1="25" x2="50" y2="20" stroke="#DAA520" strokeWidth="1.5"/>
      <line x1="52" y1="25" x2="48" y2="20" stroke="#DAA520" strokeWidth="1.5"/>
      
      {/* Button on top of mortarboard */}
      <circle cx="50" cy="35" r="1.5" fill="#1F1F1F"/>
      
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