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
      {/* Academic graduation cap base */}
      <ellipse cx="50" cy="42" rx="18" ry="6" 
        fill="#2C2C2C" 
        stroke="#1F1F1F" 
        strokeWidth="1"
      />
      
      {/* Mortarboard (square academic board) */}
      <rect x="32" y="30" width="36" height="36" 
        fill="#2C2C2C" 
        stroke="#1F1F1F" 
        strokeWidth="1"
        transform="rotate(10 50 48)"
      />
      
      {/* Academic tassel */}
      <line x1="50" y1="30" x2="50" y2="20" stroke="#DAA520" strokeWidth="2"/>
      <circle cx="50" cy="20" r="1" fill="#DAA520"/>
      
      {/* Clown face */}
      <circle cx="50" cy="65" r="20" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1"/>
      
      {/* Eyes */}
      <circle cx="45" cy="60" r="2" fill="#8B7355"/>
      <circle cx="55" cy="60" r="2" fill="#8B7355"/>
      
      {/* Nose */}
      <circle cx="50" cy="65" r="2" fill="#D2B48C"/>
      
      {/* Smile */}
      <path 
        d="M43 72 Q50 78 57 72" 
        fill="none" 
        stroke="#8B7355" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* Hair */}
      <circle cx="35" cy="55" r="3" fill="#F5F5DC"/>
      <circle cx="65" cy="55" r="3" fill="#F5F5DC"/>
    </svg>
  );
};

export default Logo;