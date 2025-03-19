
import React from 'react';
import Logo from './ui/logo';
import Button from './shared/Button';

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 text-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-md mx-auto mb-12">
          <div className="flex justify-center mb-8">
            <Logo type="icon" size="lg" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            Increase your visibility and alignment
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Start for free, flexible for all teams.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Button variant="outline">
              Request a demo
            </Button>
            
            <Button>
              Start for free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
