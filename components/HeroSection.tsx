import React from "react";
import { CareerForm } from "./career-form";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="relative bg-gray-100 min-h-screen w-full flex flex-col p-4 md:p-8 lg:p-10 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-8 lg:gap-12 max-w-7xl mx-auto w-full mb-8 md:mb-12">
        <h1 className="text-xl font-semibold text-black">
          Is Your Career AI-Proof?
          <span className="block text-gray-400">Find Out Now</span>
        </h1>
        
        <div className="order-3 md:order-2">
          <h1 className="text-xl font-semibold text-black">
            Start Free Assessment
          </h1>
          <h2 className="text-gray-400 text-lg font-semibold z-10">
            Backed by research from leading institutions
          </h2>
        </div>
        
        <h1 className="text-gray-900 text-xl font-semibold z-10 order-2 md:order-3">
          McKinsey, Harvard
        </h1>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto w-full justify-between">
        {/* Left Content */}
        <div className="flex flex-col gap-4 max-w-lg mx-auto lg:mx-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black leading-tight">
            Unlock Your Career <br className="hidden md:block" /> Potential with AI
          </h1>
          <h2 className="text-gray-400 text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed z-10">
            Get personalized feedback and course recommendations to boost your
            professional profile
          </h2>
        </div>
        
        {/* Right Form Card */}
        <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 w-full max-w-md mx-auto lg:mx-0 z-10 mb-8 lg:mb-0">
          <CareerForm />
        </div>
      </div>
      
      {/* Background Vector Image */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-0">
        <Image
          src="/Vector.png"
          alt="Vector"
          width={1500}
          height={1000}
          className="w-full opacity-80 object-cover object-bottom"
          priority
        />
      </div>
    </div>
  );
};

export default HeroSection;