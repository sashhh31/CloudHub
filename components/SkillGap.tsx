
import React from 'react';
import FeatureSection from './shared/FeatureSection';

const SkillGap = () => {
  return (
    <FeatureSection
      title="Tailored recommendations to bridge skill gaps and enhance your qualifications."
      description="Campsite has been instrumental in keeping designers aware of each others' work-in-progress in a way that was previously slowing us down. It's also one of the only channels where."
      bgColor="bg-white"
      imageComponent={
        <div className="rounded-xl overflow-hidden bg-brand-turquoise flex items-center justify-center p-16 shadow-lg transform transition-transform duration-500 hover:scale-[1.02]">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full w-32 h-32 -left-5 blur-xl opacity-20 animate-pulse"></div>
            <svg width="180" height="180" viewBox="0 0 256 255" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet">
              <defs>
                <linearGradient x1="12.959%" y1="12.039%" x2="79.639%" y2="78.201%" id="a">
                  <stop stopColor="#387EB8" offset="0%"/>
                  <stop stopColor="#366994" offset="100%"/>
                </linearGradient>
                <linearGradient x1="19.128%" y1="20.579%" x2="90.742%" y2="88.429%" id="b">
                  <stop stopColor="#FFE052" offset="0%"/>
                  <stop stopColor="#FFC331" offset="100%"/>
                </linearGradient>
              </defs>
              <path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" fill="url(#a)"/>
              <path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" fill="url(#b)"/>
            </svg>
          </div>
        </div>
      }
    />
  );
};

export default SkillGap;
