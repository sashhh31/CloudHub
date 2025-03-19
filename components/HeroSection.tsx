import React from "react";
import { CareerForm } from "./career-form";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="relative bg-gray-100 h-[110vh] w-full flex items-center justify-evenly ">
      {/* Left Content */}
      <div className="flex flex-col gap-4 max-w-lg">
        <h1 className="text-5xl font-semibold text-black leading-tight">
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

      {/* Background Vector Image */}
      <Image
        src="/vector.png"
        alt="Vector"
        width={1000}
        height={1000}
        className="absolute bottom-0 left-0 w-[1500px] opacity-80"
      />
    </div>
  );
};

export default HeroSection;
