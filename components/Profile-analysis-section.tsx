import React from 'react';

interface ProfileData {
  AIImpactAssessment?: {
    Impact?: string;
    [key: string]: any;
  };
  AIScore?: {
    Total?: number;
    High?: number;
    Medium?: number;
    Low?: number;
  };
  BasicProfileInformation?: {
    Name?: string;
    CurrentRole?: string;
    Company?: string;
    [key: string]: any;
  };
  BestAchievements?: string[];
  CareerTrajectoryAnalysis?: string;
  Education?: {
    Degree?: string;
    Institution?: string;
    Year?: string;
    [key: string]: any;
  };
  Experience?: Array<{
    Title?: string;
    Company?: string;
    Dates?: string;
    Location?: string;
    [key: string]: any;
  }>;
  RecommendedCoursesOrSkillsToDevelop?: string[];
  RelevantCourses?: string[];
  RemarksAboutTheProfile?: string;
  SkillGaps?: string | string[];
  SkillsAssessment?: {
    SoftSkills?: string | string[];
    TechnicalSkills?: string | string[];
    Relevance?: string;
    [key: string]: any;
  };
  Strengths?: Record<string, string>;
  Summary?: string;
  Superpowers?: string[];
  Tools?: string[];
  TopSkills?: string[];
  [key: string]: any;
}



export function ProfileAnalysisSection() {

  const data: string = localStorage.getItem('profileAnalysis') || '';
  // Parse the data if it's a string
  let profileData: ProfileData;
  
  try {
    profileData = typeof data === 'string' ? JSON.parse(data) : data;
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
  const summary = profileData.Summary || '';
 
  const topSkills = Array.isArray(profileData.TopSkills) ? profileData.TopSkills : [];
  const bestAchievements = Array.isArray(profileData.BestAchievements) ? profileData.BestAchievements : [];
  
  // Skills assessment
  const skillsAssessment = profileData.SkillsAssessment || {};
  const softSkills = parseSkills(skillsAssessment.SoftSkills);
  const technicalSkills = parseSkills(skillsAssessment.TechnicalSkills);
  
  // Career analysis
  const careerAnalysis = profileData.CareerTrajectoryAnalysis || '';
  const remarks = profileData.Remarks || '';
  
  // Strengths and gaps
  const strengths:any = profileData.Strengths || [ {skill: '', rating: 0} ];
  const skillGaps = parseSkills(profileData.SkillGaps);
 
  // AI impact
  const aiImpact = profileData.AIImpactAssessment?.Impact || '';

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
      <section className="bg-white p-6 rounded-b-lg shadow-md px-32 py-24">
        <div className="container mx-auto">
          {/* Grid Layout */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-8">
      
              
              {/* Career Analysis */}
              {summary && (
                <div>
                  <h2 className="mb-4 text-xl font-bold border-b pb-2">Summary</h2>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p>{summary}</p>
                  </div>
                </div>
              )}
              {remarks && (
                <div>
                  <h2 className="mb-4 text-xl font-bold border-b pb-2">Remarks</h2>
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <p>{remarks}</p>
                  </div>
                </div>
              )}
            {strengths.length > 0 && (
  <div>
    <h2 className="mb-4 text-xl font-bold border-b pb-2">Strengths</h2>
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="space-y-3">
        {strengths.map((strength: any, index: number) => (
          <div key={index} className="flex flex-col">
            <div className="font-medium">{strength.skill}</div>
            {renderStarRating(strength.rating)}
          </div>
        ))}
      </div>
    </div>
  </div>
)}
              {careerAnalysis && (
                <div>
                  <h2 className="mb-4 text-xl font-bold border-b pb-2">Career Trajectory</h2>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p>{careerAnalysis}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              {/* Skills Section */}
              <div>
                
                {/* Top Skills */}
                {topSkills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-lg font-medium">Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {topSkills.map((skill, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Technical Skills */}
                {technicalSkills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-lg font-medium">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {technicalSkills.map((skill, index) => (
                        <div key={index} className="bg-yellow-200 px-3 py-1 rounded-full">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Soft Skills */}
                {softSkills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-lg font-medium">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {softSkills.map((skill, index) => (
                        <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
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
                  <h2 className="mb-4 text-xl font-semibold border-b pb-2">Skill Gaps</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc pl-5 space-y-1">
                      {skillGaps.map((gap, index) => (
                        <li key={index}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
         
              
              {/* Achievements */}
              {bestAchievements.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-bold border-b pb-2">Best Achievements</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc pl-5 space-y-2">
                      {bestAchievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
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
