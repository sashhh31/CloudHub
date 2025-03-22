import React from 'react';
import { useProfile } from '../context/ProfileContext';


export function ExperienceSkillsSection() {
  // Parse the message string into an object
  const { profileData } = useProfile();
  const message: string = profileData?.analysis || '';
  let parsedData: any;
  try {
    parsedData = typeof message === 'string' ? JSON.parse(message) : message;
  } catch (error) {
    return (
      <section className="w-full py-12 md:py-4">
        <div className="container px-4 md:px-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> Failed to parse profile data. Please try again.</span>
          </div>
        </div>
      </section>
    );
  }

  // Ensure experiences is always an array
  const experiences = Array.isArray(parsedData.Experience) ? parsedData.Experience : 
                      parsedData.Experience ? [parsedData.Experience] : ['No experience data available'];
  const education = parsedData.Education || [ {Degree: '', Institution: '', Year: '', CGPA: '' } ];

  const courses = Array.isArray(parsedData.RelevantCourses) ? parsedData.RelevantCourses : 
                  parsedData.RelevantCourses ? [parsedData.RelevantCourses] : ['No relevant courses data available'];
  
  const tools = Array.isArray(parsedData.Tools) ? parsedData.Tools : 
                parsedData.Tools ? parsedData.Tools.split(', ').map((t: string) => t.trim()) : ['No tools data available'];
  
  const topSkills = Array.isArray(parsedData.TopSkills) ? parsedData.TopSkills : 
                    parsedData.TopSkills ? parsedData.TopSkills.split(', ').map((s: string) => s.trim()) : ['No top skills data available'];
  

  
  // Convert technical skills to array if it's a string
  const technicalSkillsArray = parsedData.SkillsAssessment?.TechnicalSkills || 'No technical skills data available';
  
  // Convert soft skills to array if it's a string
  const softSkillsArray = parsedData.SkillsAssessment?.SoftSkills || 'No soft skills data available';
  
  
  // Get the first letter of company name for the icon
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };
  // Format date to readable format
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    // Handle various date formats
    const dates = dateStr.split('-').map(d => d.trim());
    if (dates.length === 2) {
      return dates[0] + ' - ' + dates[1];
    }
    return dateStr;
  };

  // Determine background color based on company name
  const getBackgroundColor = (company: string) => {
    const colors = ['bg-black', 'bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-yellow-600'];
    const hash = Array.from(company || '').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <section className="w-full py-12 md:py-24 px-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Experience Section */}
          <div>
            <h2 className="mb-6 text-xl font-bold">• Experience</h2>
            <div className="space-y-px">
              {experiences.map((exp: any, index: number) => (
                <div key={index} className="grid grid-cols-[auto_1fr] gap-4 bg-gray-100 p-4">
                  <div className={`flex h-6 w-6 items-center justify-center rounded mt-2 ${getBackgroundColor(exp.Company)} text-white`}>
                    <span className="text-xs">{getInitial(exp.Company)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-black">
                    <div>
                      <div className="text-gray-600">{exp.Role}</div>
                      <div className=" font-medium">{exp.Company}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-800">{exp.Location}</div>
                      <div>{formatDate(exp.Dates)}</div>
                      <div className="text-gray-800">{exp.Duration}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {experiences.length === 0 && (
                <div className="bg-gray-100 p-4 text-gray-500 text-center">No experience data available</div>
              )}
            </div>

            <h2 className="mb-6 mt-5 text-xl font-bold">• Education</h2>
            <div className="rounded bg-gray-100 p-4 mb-4 ">
                {education[0].Degree && (
                <div className='flex items-center gap-4 justify-between'>
                  <div className='flex items-center gap-4'>
                  <div className=" flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
                    <span className="text-xs">{getInitial(education[0].Institution)}</span>
                  </div>
                  <div className='flex flex-col'>
                    <div className="font-medium">{education[0].Institution}</div>
                    <div>{education[0].Degree}</div>
                  </div>
                  </div>
                  <div>
                    <div className="text-gray-800">{education[0].Year}</div>
                    <div className="text-gray-800">CGPA: {education[0].CGPA}</div>
                  </div>
                </div>
              )}
              
            </div>
            
            {courses.length > 0 && (
              <>
                <h3 className="mb-4 text-lg font-medium">Relevant Courses</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {courses.map((course: string, index: number) => (
                    <div key={index} className="rounded bg-gray-100 p-4">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded bg-gray-800 text-white">
                        <span className="text-xs">C</span>
                      </div>
                      <div className="font-medium">{course}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="mb-6 text-xl font-bold">• Skills</h2>
            
            {topSkills.length > 0 && (
              <>
                <h3 className="mb-2 text-lg font-medium">Top Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {topSkills.map((skill: string, index: number) => (
                    <div key={index} className="rounded bg-blue-100 px-3 py-1">
                      {skill}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {technicalSkillsArray.length > 0 && (
              <>
                <h3 className="mb-2 text-lg font-medium">Technical Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {technicalSkillsArray.map((skill: string, index: number) => (
                    <div key={index} className="rounded bg-gray-100 px-3 py-1">
                      {skill}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {softSkillsArray.length > 0 && (
              <>
                <h3 className="mb-2 text-lg font-medium">Soft Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {softSkillsArray.map((skill: string, index: number) => (
                    <div key={index} className="rounded bg-green-100 px-3 py-1">
                      {skill}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {tools.length > 0 && (
              <>
                <h3 className="mb-2 text-lg font-medium">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool: string, index: number) => (
                    <div key={index} className="rounded bg-gray-200 px-3 py-1">
                      {tool}
                    </div>
                  ))}
                </div>
              </>
            )}
            
          </div>
        </div>
      </div>
    </section>
  );
}