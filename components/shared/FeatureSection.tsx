"use client"
import React, { useEffect, useRef } from 'react';
import { Check, Play } from 'lucide-react';
import Button from './Button';
import { cn } from '@/lib/utils';

interface FeatureSectionProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  reversed?: boolean;
  className?: string;
  bgColor?: string;
  imageComponent?: React.ReactNode;
}

const FeatureSection = ({ 
  title, 
  description, 
  image, 
  imageAlt, 
  children,
  reversed = false,
  className,
  bgColor = "bg-white",
  imageComponent
}: FeatureSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={cn(
        "py-16 md:py-24 opacity-0", 
        bgColor,
        className
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex">
              <Button variant="primary" size="sm" className="cursor-default">
                Share
              </Button>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              {title}
            </h2>
            
            <p className="text-lg text-gray-600">
              {description}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Check size={18} className="text-gray-700" />
                <span className="text-gray-700">Coded</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} className="text-gray-700" />
                <span className="text-gray-700">100% Secure</span>
              </div>
            </div>
            
            <div>
              <Button className="group">
                <Play size={16} className="mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                See how it works
              </Button>
            </div>
            
            {children}
          </div>
          
          <div className="w-full lg:w-1/2 rounded-xl overflow-hidden transition-all duration-500 ease-in-out">
            {imageComponent ? (
              imageComponent
            ) : (
              image && (
                <img 
                  src={image} 
                  alt={imageAlt || "Feature illustration"} 
                  className="w-full h-auto object-cover rounded-xl shadow-lg"
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
