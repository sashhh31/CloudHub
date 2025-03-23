import React from 'react';
import { useProfile } from '../context/ProfileContext';


export function ProfileAnalysisSection() {

  const { profileData } = useProfile();
  const data: string = profileData?.analysis || '';
  let parsedData:any;

  try {
    parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  } catch (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded">
        <h2 className="font-bold mb-2">Error Processing Profile Data</h2>
        <p>There was an error processing the profile data. Please check the data format.</p>
        <p className="mt-2 text-sm text-red-600">{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }

  // Extract basic information

  
  // Extract other sections
  const summary = parsedData.Summary || '';
 
  const topSkills = Array.isArray(parsedData.TopSkills) ? parsedData.TopSkills : [];
  const bestAchievements = Array.isArray(parsedData.BestAchievements) ? parsedData.BestAchievements : [];
  
  // Skills assessment
  const skillsAssessment = parsedData.SkillsAssessment || {};
  const softSkills = parseSkills(skillsAssessment.SoftSkills);
  const technicalSkills = parseSkills(skillsAssessment.TechnicalSkills);
  
  // Career analysis
  const careerAnalysis = parsedData.CareerTrajectoryAnalysis || '';
  const remarks = parsedData.Remarks || '';
  
  // Strengths and gaps
  const strengths:any = parsedData.Strengths || [ {skill: '', rating: 0} ];
  const skillGaps = parseSkills(parsedData.SkillGaps);
 
  // AI impact
  const aiImpact = parsedData.AIImpactAssessment?.Impact || '';

  // Helper function to parse skills (handle both string and array)
  function parseSkills(skills: string | string[] | undefined): string[] {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills.split(',').map(skill => skill.trim());
  }

  // Function to get initials for avatar
  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Function to format date
  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const dates = dateStr.split('-').map(d => d.trim());
    if (dates.length === 2) {
      return dates[0] + ' - ' + dates[1];
    }
    return dateStr;
  }

  // Function to get background color based on name/string
  function getBackgroundColor(str: string): string {
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 'bg-yellow-600'];
    const hash = Array.from(str).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  // Function to render star rating
  const positiveMod = (n: number, m: number) => ((n % m) + m) % m;

  // @ts-ignore
  function renderStarRating(rating: number | string): JSX.Element {
    // If rating is a number, convert it to stars
    if (typeof rating === "number") {
      const maxRating = 5; // Assuming 5-star rating system
      const filledStars = rating;
      const emptyStars = maxRating - filledStars;
      const percentage = (filledStars / maxRating) * 100;
      
      // Create a string representation for display
      const starString = '★'.repeat(filledStars) + '☆'.repeat(emptyStars);
      
      return (
        <div className="flex items-center">
        <div className="text-yellow-600 mr-2">{starString}</div>
        <div className="h-2 w-full max-w-24 overflow-hidden rounded-full text-yellow-800">
          <div 
            className="h-full rounded-full bg-yellow-400" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      );
    }
    
    // Original logic for string ratings
    if (typeof rating === 'string') {
      const filledStars = (rating.match(/★/g) || []).length;
      const emptyStars = (rating.match(/☆/g) || []).length;
      const total = filledStars + emptyStars;
      const percentage = total > 0 ? (filledStars / total) * 100 : 0;
      
      return (
        <div className="flex items-center">
        <div className="text-yellow-600 mr-2">{rating}</div>
        <div className="h-2 w-full max-w-24 overflow-hidden rounded-full text-yellow-800">
          <div 
            className="h-full rounded-full bg-yellow-400" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      );
    }
    
    // Fallback for any other type
    return (
      <div className="flex items-center">
      <div className="text-yellow-600 mr-2">N/A</div>
      <div className="h-2 w-full max-w-24 overflow-hidden rounded-full text-yellow-800">
        <div className="h-full rounded-full bg-gray-300" style={{ width: '0%' }}></div>
      </div>
    </div>
    );
  }
    return (
  <div className="w-full">
      
      
      {/* Main Content */}
      <section className="bg-white p-4 sm:p-6 rounded-b-lg shadow-md px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="container mx-auto">
          {/* Grid Layout */}
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6 md:space-y-8">
      
              
              {/* Career Analysis */}
              {summary && (
                <div>
                  <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-bold border-b pb-2">Summary</h2>
                  <div className="bg-purple-100 p-3 md:p-4 rounded-lg">
                    <p className="text-sm md:text-base">{summary}</p>
                  </div>
                </div>
              )}
              {remarks && (
                <div>
                  <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-bold border-b pb-2">Remarks</h2>
                  <div className="bg-yellow-100 p-3 md:p-4 rounded-lg">
                    <p className="text-sm md:text-base">{remarks}</p>
                  </div>
                </div>
              )}
            {strengths.length > 0 && (
              <div>
                <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-bold border-b pb-2">Strengths</h2>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="space-y-2 md:space-y-3">
                    {strengths.map((strength: any, index: number) => (
                      <div key={index} className="flex flex-col">
                        <div className="font-medium text-sm md:text-base">{strength.skill}</div>
                        {renderStarRating(strength.rating)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
              {careerAnalysis && (
                <div>
                  <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-bold border-b pb-2">Career Trajectory</h2>
                  <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
                    <p className="text-sm md:text-base">{careerAnalysis}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column */}
            <div className="space-y-6 md:space-y-8">
              {/* Skills Section */}
              <div>
                
                {/* Top Skills */}
                {topSkills.length > 0 && (
                  <div className="mb-3 md:mb-4">
                    <h3 className="mb-2 text-base md:text-lg font-medium">Top Skills</h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {topSkills.map((skill:any, index:number) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Technical Skills */}
                {technicalSkills.length > 0 && (
                  <div className="mb-3 md:mb-4">
                    <h3 className="mb-2 text-base md:text-lg font-medium">Technical Skills</h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {technicalSkills.map((skill:any, index:number) => (
                        <div key={index} className="bg-yellow-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Soft Skills */}
                {softSkills.length > 0 && (
                  <div className="mb-3 md:mb-4">
                    <h3 className="mb-2 text-base md:text-lg font-medium">Soft Skills</h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {softSkills.map((skill:any, index:number) => (
                        <div key={index} className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                
              </div>
              
              {/* Strengths */}
            
              
              {/* Skill Gaps */}
              {skillGaps.length > 0 && (
                <div>
                  <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-semibold border-b pb-2">Skill Gaps</h2>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <ul className="list-disc pl-4 md:pl-5 space-y-1">
                      {skillGaps.map((gap, index) => (
                        <li key={index} className="text-sm md:text-base">{gap}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
         
              
              {/* Achievements */}
              {bestAchievements.length > 0 && (
                <div>
                  <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-bold border-b pb-2">Best Achievements</h2>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 md:space-y-2">
                      {bestAchievements.map((achievement:any, index:number) => (
                        <li key={index} className="text-sm md:text-base">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
