"use client"
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className,
  ...props 
}: ButtonProps) => {
  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange";
  
  const variantStyles = {
    primary: "bg-brand-orange text-white hover:bg-opacity-90 focus:ring-brand-orange",
    outline: "border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white focus:ring-brand-orange",
    text: "text-brand-orange hover:bg-brand-orange/10 focus:ring-brand-orange"
  };
  
  const sizeStyles = {
    sm: "text-sm px-4 py-1",
    md: "text-base px-6 py-2",
    lg: "text-lg px-8 py-3"
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-orange/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
    </button>
  );
};

export default Button;
