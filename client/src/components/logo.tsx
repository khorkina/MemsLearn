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
      <circle cx="50" cy="50" r="25" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="2"/>
      
      {/* Eyes */}
      <circle cx="43" cy="43" r="3" fill="#8B7355"/>
      <circle cx="57" cy="43" r="3" fill="#8B7355"/>
      
      {/* Clown nose */}
      <circle cx="50" cy="50" r="3" fill="#D2B48C" stroke="#8B7355" strokeWidth="1"/>
      
      {/* Big smile */}
      <path 
        d="M38 58 Q50 68 62 58" 
        fill="none" 
        stroke="#8B7355" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      
      {/* Hair tufts */}
      <circle cx="30" cy="35" r="5" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1"/>
      <circle cx="70" cy="35" r="5" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1"/>
      <circle cx="25" cy="50" r="4" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1"/>
      <circle cx="75" cy="50" r="4" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1"/>
    </svg>
  );
};

export default Logo;