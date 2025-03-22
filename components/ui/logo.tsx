
import React from 'react';
import { Package } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  type?: 'icon' | 'full';
  className?: string;
}

const Logo = ({ size = 'md', type = 'full', className = '' }: LogoProps) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 40, text: 'text-2xl' },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-brand-orange text-white p-1 rounded-md flex items-center justify-center">
        <Package size={sizes[size].icon} strokeWidth={2} />
      </div>
      {type === 'full' && (
        <span className={`font-bold ${sizes[size].text} text-gray-900`}>
          KnowAI
        </span>
      )}
    </div>
  );
};

export default Logo;
