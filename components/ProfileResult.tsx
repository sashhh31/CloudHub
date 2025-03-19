// components/ProfileResults.tsx
"use client"
import { useEffect, useState } from 'react';

interface Strength {
  name: string;
  rating: number;
}

interface Course {
  title: string;
  description: string;
  url?: string;
}

interface AIImpact {
  percentage: number;
  description: string;
}

interface ProfileAnalysis {
  name: string;
  currentRole: string;
  company: string;
  aiScore: number;
  skills: {
    softSkills: number;
    technicalSkills: number;
    relevance: number;
  };
  careerTrajectory: string;
  strengths: Strength[];
  skillGaps: string[];
  recommendedCourses: Course[];
  remarks: string;
  aiImpact: AIImpact;
}

export default function ProfileResults() {
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      const storedAnalysis = localStorage.getItem('profileAnalysis');
      if (storedAnalysis) {
        setAnalysis(JSON.parse(storedAnalysis));
      } else {
        setError('No analysis data found');
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
      setError('Failed to load analysis data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Loading analysis...</div>;
  }

  if (error || !analysis) {
    return <div className="text-center py-10 text-red-500">{error || 'No data available'}</div>;
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{analysis?.name}</h1>
      <div className="mb-6">
        <p className="text-lg">{analysis?.currentRole} at {analysis?.company}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">AI Score</h2>
          <div className="flex items-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{analysis?.aiScore}</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="10" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="10" 
                  strokeDasharray={`${analysis?.aiScore * 2.83} 283`}
                  strokeDashoffset="0" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">
                {analysis.aiImpact?.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Skills Assessment</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Soft Skills</span>
                <span>{analysis.skills?.softSkills}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${analysis.skills?.softSkills}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Technical Skills</span>
                <span>{analysis.skills?.technicalSkills}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${analysis.skills?.technicalSkills}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Relevance</span>
                <span>{analysis?.skills?.relevance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${analysis?.skills?.relevance}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Strengths</h2>
          <div className="space-y-4">
            {analysis?.strengths?.map((strength, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span>{strength.name}</span>
                  <span>{strength.rating}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${strength.rating}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Skill Gaps</h2>
          <ul className="list-disc pl-5 space-y-2">
            {analysis?.skillGaps?.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Career Trajectory</h2>
        <p className="text-gray-700">{analysis?.careerTrajectory}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">AI Impact Assessment</h2>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span>Potential Impact</span>
            <span>{analysis?.aiImpact?.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${analysis?.aiImpact?.percentage}%` }}
            ></div>
          </div>
        </div>
        <p className="text-gray-700">{analysis?.aiImpact?.description}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recommended Courses</h2>
        <div className="space-y-4">
          {analysis?.recommendedCourses?.map((course, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-gray-700 mb-2">{course.description}</p>
              {course.url && (
                <a 
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Go to course
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}