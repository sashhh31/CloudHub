
import React from 'react';
import Button from './shared/Button';

const LoopSection = () => {
  return (
    <section className="bg-brand-orange text-white py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight animate-fade-in">
            Keep every one in the loop
          </h2>
          
          <p className="text-xl opacity-90 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            All good things starts with a homepage. Get inspired without breaking your wallet.
          </p>
          
          <Button className="bg-white text-brand-orange hover:bg-opacity-90 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            Start for free
          </Button>
        </div>
        
        <div className="mt-16 relative animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="bg-black rounded-t-xl overflow-hidden shadow-2xl">
            <div className="h-8 bg-black flex items-center px-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <img 
              src="/lovable-uploads/dd9f023d-5e12-4b3f-aacf-794e7eb502eb.png" 
              alt="Dashboard Interface" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-orange to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-brand-orange to-transparent"></div>
    </section>
  );
};

export default LoopSection;
