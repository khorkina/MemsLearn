import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <div 
      className={`flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-lg font-bold text-amber-800">🤡</span>
    </div>
  );
};

export default Logo;