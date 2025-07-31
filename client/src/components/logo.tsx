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
      {/* Graduation cap background */}
      <path 
        d="M15 35 L50 25 L85 35 L85 45 L50 35 L15 45 Z" 
        fill="#1e40af" 
        stroke="#1e3a8a" 
        strokeWidth="1"
      />
      
      {/* Graduation cap tassel */}
      <circle cx="85" cy="40" r="3" fill="#fbbf24"/>
      <line x1="85" y1="43" x2="88" y2="50" stroke="#fbbf24" strokeWidth="2"/>
      <circle cx="88" cy="50" r="2" fill="#f59e0b"/>
      
      {/* Clown face base */}
      <circle cx="50" cy="55" r="25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
      
      {/* Big red clown nose */}
      <circle cx="50" cy="55" r="4" fill="#dc2626"/>
      
      {/* Eyes */}
      <circle cx="42" cy="48" r="3" fill="white"/>
      <circle cx="58" cy="48" r="3" fill="white"/>
      <circle cx="42" cy="48" r="1.5" fill="black"/>
      <circle cx="58" cy="48" r="1.5" fill="black"/>
      
      {/* Big smile */}
      <path 
        d="M38 62 Q50 72 62 62" 
        fill="none" 
        stroke="#dc2626" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      
      {/* Clown hair/curls on sides */}
      <circle cx="28" cy="45" r="6" fill="#ef4444"/>
      <circle cx="72" cy="45" r="6" fill="#ef4444"/>
      <circle cx="25" cy="55" r="4" fill="#ef4444"/>
      <circle cx="75" cy="55" r="4" fill="#ef4444"/>
      
      {/* Book/brain replacement */}
      <rect x="40" y="25" width="20" height="15" rx="2" fill="#f97316" stroke="#ea580c" strokeWidth="1"/>
      <line x1="42" y1="28" x2="58" y2="28" stroke="white" strokeWidth="1"/>
      <line x1="42" y1="32" x2="55" y2="32" stroke="white" strokeWidth="1"/>
      <line x1="42" y1="36" x2="58" y2="36" stroke="white" strokeWidth="1"/>
      
      {/* Small sparkles around the logo */}
      <circle cx="20" cy="25" r="1" fill="#fbbf24"/>
      <circle cx="80" cy="25" r="1" fill="#fbbf24"/>
      <circle cx="15" cy="70" r="1" fill="#fbbf24"/>
      <circle cx="85" cy="70" r="1" fill="#fbbf24"/>
    </svg>
  );
};

export default Logo;