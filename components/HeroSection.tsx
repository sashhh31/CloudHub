import React from "react";
import { CareerForm } from "./career-form";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="relative bg-gray-100 h-[110vh] w-full  flex flex-col   ">
      {/* Left Content */}

      <div className="flex flex-row gap-44 ml-40 mt-10 max-w-full justify-center ">
        <h1 className="text-xl font-semibold text-black leading-tight">
          Is Your Career AI-Proof?
        <h1 className="text-xl font-semibold text-gray-400 leading-tight">
          Find Out Now
        </h1>
        </h1>
      <div>
        <h1 className="text-xl font-semibold text-black leading-tight">
          Start Free Assessment
        </h1>
        <h2 className="text-gray-400 text-lg font-semibold leading-relaxed z-10">
          Backed by research from leading institutions
        </h2>
      </div>
        <h1 className="text-gray-900 text-xl font-semibold leading-relaxed z-10">
          McKinsey , Harvard
       </h1>



      <div>
      </div>
</div>
<div className="flex flex-row gap-60 max-w-full mt-10  justify-center ">

      <div className="flex flex-col gap-4 max-w-lg">
        <h1 className="text-5xl font-semibold text-black leading-tight mt-20">
          Unlock Your Career <br /> Potential with AI
        </h1>
        <h2 className="text-gray-400 text-3xl font-semibold leading-relaxed z-10">
          Get personalized feedback and course recommendations to boost your
          professional profile
        </h2>
      </div>

      {/* Right Form Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-auto border z-10">
        <CareerForm />
      </div>
      </div>

      {/* Background Vector Image */}
      <Image
        src="/Vector.png"
        alt="Vector"
        width={1000}
        height={1000}
        className="absolute bottom-0 left-0 w-[1500px] opacity-80"
      />
    </div>
  );
};

export default HeroSection;
