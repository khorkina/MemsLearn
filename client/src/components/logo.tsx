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
      {/* Clown face - main circle */}
      <circle cx="50" cy="55" r="22" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1"/>
      
      {/* Academic cap sitting ON the head */}
      <ellipse cx="50" cy="38" rx="20" ry="8" 
        fill="#2C2C2C" 
        stroke="#1F1F1F" 
        strokeWidth="1"
      />
      
      {/* Mortarboard (square board) positioned on top */}
      <rect x="32" y="25" width="36" height="36" 
        fill="#2C2C2C" 
        stroke="#1F1F1F" 
        strokeWidth="1"
        transform="rotate(8 50 43)"
      />
      
      {/* Academic tassel hanging from corner */}
      <line x1="62" y1="32" x2="68" y2="25" stroke="#DAA520" strokeWidth="2"/>
      <circle cx="68" cy="25" r="1.5" fill="#DAA520"/>
      
      {/* Eyes positioned properly on face */}
      <circle cx="44" cy="50" r="2" fill="#8B7355"/>
      <circle cx="56" cy="50" r="2" fill="#8B7355"/>
      
      {/* Nose in center of face */}
      <circle cx="50" cy="55" r="2.5" fill="#D2B48C" stroke="#8B7355" strokeWidth="1"/>
      
      {/* Smile */}
      <path 
        d="M42 62 Q50 70 58 62" 
        fill="none" 
        stroke="#8B7355" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* Hair peeking out from under cap */}
      <circle cx="32" cy="45" r="4" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1"/>
      <circle cx="68" cy="45" r="4" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1"/>
    </svg>
  );
};

export default Logo;