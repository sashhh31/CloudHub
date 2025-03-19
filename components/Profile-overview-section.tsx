import {  Mail, Phone } from "lucide-react"
import React from 'react';
import { parseProfileData } from "../utils/parseProfileData";
import Link from "next/link";

export function ProfileOverviewSection() {
  const message: string = localStorage.getItem('profileAnalysis') || '';
  let parsedData:any;
  
  try {
    parsedData = parseProfileData(message);
    console.log(parsedData);
  } catch (error) {
    return (
      <section className="w-full py-12 md:py-24 bg-white px-4 md:px-6">
        <div className="container px-4 md:px-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> Failed to parse profile data. Please try again.</span>
          </div>
        </div>
      </section>
    );
  }
  // Extract data from the parsed object
 const BasicProfileInformation= Array.isArray(parsedData.BasicProfileInformation) ? parsedData.BasicProfileInformation : 
                  parsedData.BasicProfileInformation ? [parsedData.BasicProfileInformation] : [];
  const name = BasicProfileInformation[0].Name || 'No name data available';
  const currentRole = BasicProfileInformation[0].CurrentRole || 'No current role data available';
  const company = BasicProfileInformation[0].Company || 'No company data available';
  const email = BasicProfileInformation[0].Email || 'No email data available';
  const phone = BasicProfileInformation[0].PhoneNumber || 'No phone number data available';
  
  const aiScore = parsedData.AIScore || 80;
  
  const SkillsAssessment= Array.isArray(parsedData.SkillsAssessment) ? parsedData.SkillsAssessment : 
                  parsedData.SkillsAssessment ? [parsedData.SkillsAssessment] : [];

  const relevance = SkillsAssessment[0].Relevance || 'No relevance data available';
  
  const strengths = parsedData.Strengths || {};
  
  // Ensure skillGaps is always an array
  const topSkills = Array.isArray(parsedData.TopSkills) ? parsedData.TopSkills : [];

   const education = parsedData.Education || {};

  const remarks = parsedData.RemarksAboutProfile || 'No remarks available';
  
const aiImpact= parsedData.AIAssessment || 'No AI impact assessment available';
const bestAchievements = Array.isArray(parsedData.Achievements.Description) ? parsedData.Achievements.Description : ['No best achievements data available'];
const tools = Array.isArray(parsedData.Tools) ? parsedData.Tools : ['No tools data available'];
  // Extract technical skills as an array

  const superpowers = Array.isArray(parsedData.Superpowers) ? parsedData.Superpowers : ['No superpowers data available'];

  // Calculate percentages for skill bars
  const softSkillsScore = 75; 
  const technicalSkillsScore = 80; 
  const relevanceScore = relevance?.includes('highly relevant') ? 90 : 70;
const timelinePrediction= parsedData.TimelineBeforeSignificantAIImpact || '0';
  // Extract AI impact percentage
  const aiImpactPattern = /(\d+)%/;
  const aiImpactText = typeof aiImpact === 'string' ? aiImpact : '';
  const aiImpactMatch = aiImpactText.match(aiImpactPattern);
  const aiImpactPercentage = aiImpactMatch ? parseInt(aiImpactMatch[1]) : 80;
  const experience = Array.isArray(parsedData.Experience) ? parsedData.Experience : 
  parsedData.Experience ? [parsedData.Experience] : ['No experience data available'];
  // Extract strength percentages
  const strengthPercentages: Record<string, number> = {};
  Object.entries(strengths).forEach(([key, value]) => {
    const percentMatch = String(value).match(/(\d+)%/);
    if (percentMatch) {
      strengthPercentages[key] = parseInt(percentMatch[1]);
    } else if (String(value).includes('★')) {
      // Convert star ratings to percentages
      const starCount = (String(value).match(/★/g) || ['No star count data available']).length;
      strengthPercentages[key] = starCount * 20; // 5 stars = 100%
    } else {
      strengthPercentages[key] = 70; // Default value
    }
  });

  return (
    <section className="w-full py-12 md:py-16 bg-white px-36 md:px-36">
      <div className="container px-4 md:px-6 ">
        <div className="grid gap-8 md:grid-cols-2 ">
          {/* Left Column - Profile Info */}
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-gray-500">{currentRole}</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Mail className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div>{email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Contact</div>
                  <div>{phone}</div>
                </div>
              </div>
            </div>

            {/* AI Score */}
            <div className="mt-8 rounded-2xl bg-gray-100 p-6 w-[250px] h-[200px]">
              <div className="flex flex-col items-center">
                <div className="relative h-40 w-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center mt-3">
                      <div className="text-4xl font-semi-bold mb-2">{aiScore.Total}</div>
                  <div className=" text-center font-bold">AI Score - {aiScore.Assessment}</div>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path
    d="M 10,50 A 40,40 0 0,1 90,50"
    fill="none"
    stroke="#ffffff"
    strokeWidth="12"
    strokeLinecap="round"
  />
  
  <path
    d="M 10,50 A 40,40 0 0,1 90,50"
    fill="none"
    stroke="#0066ff"
    strokeWidth="12"
    strokeLinecap="round"
    strokeDasharray="125.6"
    strokeDashoffset={125.6 - ((aiScore.Total / 100) * 125.6)}
    transform="rotate(0 50 50)"
  />
</svg>
                </div>
              </div>
            </div>

            {/* Skills Bars */}
            <div className="mt-8 space-y-4">
              <div className="flex">
                <div className=" ">
                  <span>Soft Skills</span>
                </div>
                <div className="h-3 w-[300px] overflow-hidden rounded-full bg-gray-200 ml-[50px] mt-1">
                  <div className="h-full rounded-full bg-blue-800" style={{ width: `${softSkillsScore}%` }}></div>
                </div>
              </div>

              <div className="flex">
                <div className="">
                  <span>Technical Skills</span>
                </div>
                <div className="h-3 w-[300px] overflow-hidden rounded-full bg-gray-200 ml-4 mt-1">
                  <div className="h-full rounded-full bg-blue-800" style={{ width: `${technicalSkillsScore}%` }}></div>
                </div>
              </div>

              <div className="flex ">
                <div className="">
                  <span>Relevance</span>
                </div>
                <div className="h-3 w-[300px] overflow-hidden rounded-full bg-gray-200 ml-[50px]  mt-1">
                  <div className="h-full rounded-full bg-blue-800" style={{ width: `${relevanceScore}%` }}></div>
                </div>
              </div>
            </div>

            {/* AI Impact */}
            <div className="mt-8 rounded-lg bg-gray-100 p-4 text-center">
              <span className="font-medium">{aiImpact.impactScore}%</span> chance that AI will impact this career 
            </div>

          </div>

          {/* Right Column - Profile Details */}
          <div className="bg-gradient-to-br from-blue-50 from-10% to-pink-50 rounded-xl shadow-sm">

          <div className="rounded-lg p-8 h-fit grid grid-cols-2 gap-4 border-b-2 border-gray-200 ">
            <div>

            <h1 className="text-3xl font-bold">{name || "Anonymus"}</h1>

            <div className="mt-4 gap-8">
              <div className="font-medium mb-3">{experience.Role || "No role data available"}</div>
              <div>{experience.Company || education[0].Institution || "No company data available"}</div>
            </div>
            <div className="mt-4 ">
              <div className="font-medium mb-3">{education[0].Degree || "Computer Science Student"}</div>
              <div>{education[0].Institution || "University"}</div>
            </div>
              <div className="h-32 mt-4 w-fit bg-white border-2 border-gray-300 p-4 rounded-lg justify-evenly flex flex-col items-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="mr-2">

                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50"
strokeWidth="fill:#228BE6;">
<path d="M 25 2 C 12.264481 2 2 12.264481 2 25 C 2 37.735519 12.264481 48 25 48 C 37.735519 48 48 37.735519 48 25 C 48 12.264481 37.735519 2 25 2 z M 25 4 C 36.664481 4 46 13.335519 46 25 C 46 36.664481 36.664481 46 25 46 C 13.335519 46 4 36.664481 4 25 C 4 13.335519 13.335519 4 25 4 z M 24.984375 6.9863281 A 1.0001 1.0001 0 0 0 24 8 L 24 22.173828 C 22.81904 22.572762 22 23.655572 22 25 C 22 25.471362 22.108361 25.906202 22.289062 26.296875 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 23.703125 27.710938 C 24.093798 27.891639 24.528638 28 25 28 C 26.7 28 28 26.7 28 25 C 28 23.655572 27.18096 22.572762 26 22.173828 L 26 8 A 1.0001 1.0001 0 0 0 24.984375 6.9863281 z"></path>
</svg>
  </div>
                <h2 className="text-center font-bold">Timeline Prediction</h2>
                </div>
                <h1 className="text-center text-2xl font-bold">{timelinePrediction} Years</h1>
                <h2 className="text-center text-sm text-gray-500">Before Significant AI Impact</h2>
              </div>
            </div>
         <div className="mt-7">

            <div className="mt-6">
            {superpowers && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold text-gray-400">Superpowers</h2>
                  <div className=" rounded-lg">
                    <ul className="ml-4 list-disc space-y-2 text-bold text-black">
                      {superpowers.map((power: string, index: number) => (
                        <li key={index}>{power}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div className="text-lg font-medium text-gray-400 mt-12">Top Skills</div>
              <div className="mt-1 flex flex-wrap gap-1">
                  {topSkills.length > 0 && (
                    <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {topSkills.map((skill: string, index: number) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            </div>

        </div>

        </div>
        {bestAchievements.length > 0 && (
                <div className="pr-8 pl-8 pt-8 pb-4 ">
                  <h2 className="mb-4 text-lg font-semibold text-gray-400">Best Achievements</h2>
                  <div className="bg-gray-50 rounded-lg">
                    <ul className="list-disc  space-y-2 text-bold text-black">
                      {bestAchievements.map((achievement: string, index: number) => (
                        <p key={index}>{achievement}</p>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
               <div className=" pr-8 pl-8 pb-8 ">
              <div className="mb-4 text-lg font-semibold text-gray-400">Tools</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {tools.slice(0, 4).map((skill: string, i: number) => (
                  <div key={i} className="rounded bg-purple-200 px-3 py-1 text-sm">
                    {String(skill).split('(')[0].trim()}
                  </div>
                ))}
              </div>
            </div>
            <div className="ml-52 pr-2 pl-8 pb-8 ">

   Get your profile analysis at 
                <Link href="https://cubehub.com" >
   <span className="font-bold"> cubehub.com</span>
  </Link>
  </div>
</div>
            </div>
        </div>
    </section>
  );
}