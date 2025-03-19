
import React from 'react';
import Button from './shared/Button';
import { Play } from 'lucide-react';

const FeedbackSection = () => {
  return (
    <section className="bg-brand-orange text-white py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-brand-orange/80 to-brand-orange rounded-xl p-8 shadow-lg">
            <div className="bg-gray-900 rounded-lg overflow-hidden w-full">
              <div className="relative p-6 bg-black rounded-t-lg">
                <div className="flex items-center space-x-2 absolute top-3 left-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-white text-center pt-5">
                  <h3 className="text-lg font-medium">Looking for feedback?</h3>
                </div>
              </div>
              
              <div className="bg-gray-900 p-6 space-y-4">
                <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                      <img 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Buzz Usborne" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white">Buzz Usborne</span>
                  </div>
                  <span className="text-gray-400">Pending</span>
                </div>
                
                <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                      <img 
                        src="https://randomuser.me/api/portraits/women/44.jpg" 
                        alt="Gabriel Valdivia" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white">Gabriel Valdivia</span>
                  </div>
                  <span className="text-gray-400">Done</span>
                </div>
                
                <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                      <img 
                        src="https://randomuser.me/api/portraits/men/22.jpg" 
                        alt="Jochem Dierx" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white">Jochem Dierx</span>
                  </div>
                  <span className="text-gray-400">Requested</span>
                </div>
                
                <div className="flex items-center justify-center">
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-orange text-white">
                    <span className="text-xl">+</span>
                  </button>
                  <span className="ml-3 text-white">Add More</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-block px-4 py-1 bg-black bg-opacity-20 rounded-full text-white">
              Feedback
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight leading-tight">
              Objective scoring to gauge your CV alignment with industry standards.
            </h2>
            
            <p className="text-lg opacity-90">
              Campsite has been instrumental in keeping designers aware of each others' work-in-progress in a way that was previously slowing us down. It's also one of the only channels where.
            </p>
            
            <div>
              <Button className="bg-white text-brand-orange hover:bg-opacity-90 group">
                <Play size={16} className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                See how it works
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
