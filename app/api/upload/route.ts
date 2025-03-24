import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { prisma } from "@/lib/prisma";
import axios from 'axios';

// Initialize Prisma client

interface LinkedInProfile {
  // Basic information
  name: string;
  headline: string;
  location: string;
  currentRole: string;
  company: string;
  email: string;
  phoneNumber: string;
  
  // Detailed information
  about: string;
  experience: Array<{ 
    role: string; 
    company: string; 
    duration: string; 
    description: string 
  }>;
  education: Array<{ 
    degree: string; 
    institution: string; 
    year: string; 
    cgpa: string 
  }>;
  skills: string[];
  technicalSkills: string[];
  softSkills: string[];
  tools: string[];
  achievements: string[];
  courses: Array<{ title: string; description: string }>;
}

function extractLinkedInUsername(url: string): string | null {
  const match = url.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

export async function POST(request: Request) {
  try {
    // Validate OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 });
    }
    
    const openai = new OpenAI({ apiKey: openaiApiKey });
    const formData = await request.formData();
    
    const extractedText = formData.get("extractedText");
    const linkedinUrl = formData.get("linkedinUrl");
    const fileType = formData.get("fileType");
    
    
    // Initialize profileText as an array to collect data from both sources
    let profileData = [];
    
    // Process extracted text if available
    if (extractedText && typeof extractedText === 'string' && extractedText.trim() !== '') {
      profileData.push({
        source: "resume",
        content: extractedText
      });
    }
    
    // Process LinkedIn URL if available
    if (linkedinUrl && typeof linkedinUrl === 'string' && linkedinUrl.trim() !== '') {
      
      try {
        const username = extractLinkedInUsername(linkedinUrl);
        if (!username) {
          return NextResponse.json({ error: 'Could not extract LinkedIn username' }, { status: 400 });
        }
        
        const apiKey = process.env.SCRAPPING_DOG_API_KEY;
        const url = 'https://api.scrapingdog.com/linkedin/';
        const params = {
          api_key: apiKey,
          type: 'profile',
          linkId: username
        };
        
        const response = await axios.get(url, { params: params });
        profileData.push({
          source: "linkedin",
          content: response.data
        });
      } catch (error) {
        console.error('Error processing LinkedIn profile:', error);
        // Don't return error here, continue with any extracted text if available
      }
    }
    
    // Check if we have any data to process
    if (profileData.length === 0) {
      return NextResponse.json({ 
        error: 'No valid data provided for analysis. Please provide extracted text or a valid LinkedIn URL.' 
      }, { status: 400 });
    }
    
    // Combine data for AI processing
    const combinedProfileText = JSON.stringify(profileData);
    
    // Process the combined profile with OpenAI
    const analysisResult = await processProfileWithAI(openai, combinedProfileText);
    
    if (!analysisResult.success) {
      return analysisResult;
    }
    
    // Store in database asynchronously
    storeProfileInDatabase(analysisResult.analysis);
    // Don't await - let it run in the background
    
    return NextResponse.json({ 
      success: true, 
      analysis: analysisResult,
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
async function processProfileWithAI(openai: OpenAI, profileText: string) {
  // Build the prompt for OpenAI
  const prompt = `
    Analyze the following professional profile and provide a detailed assessment:
    ${profileText}

    Please provide your assessment in the following EXACT JSON format without any deviation:
    {
      "BasicProfileInformation": {
        "Name": "",
        "CurrentRole": "",
        "Company": "",
        "Email": "",
        "PhoneNumber": "",
        "Location": ""
      },
      "AIScore": {
        "Total": 0, // 0-100 give a number according to the profile and it's mandatory
        "Assessment": "" // "high", "medium", or "low"
      },
      "Article": { //Article which is relevant from AI score, linkedin and resume from mckensky or Harvard 
        "Title": "", 
        "Description": "" ,
        "Link": ""
      },
      "SkillsAssessment": {
        "SoftSkills": [],
        "TechnicalSkills": [],
        "Relevance": ""
      },
      "CareerTrajectory": "", // 3-4 sentences
      "Courses": [
        {
          "Title": "",
          "Description": ""
        }
      ],
      "Strengths": [
        {"skill": "", "rating": 0}, // 0-5
        {"skill": "", "rating": 0}, // 0-5
        {"skill": "", "rating": 0} // 0-5
      ],
      "SkillGaps": [], // list atleast 3 skill gaps
      "Remark": "", // 3-4 sentences
      "AIAssessment": {
        "analysis": "",
        "impactScore": 0
      },
      "Achievements": {
        "Description": ""
      },
      "Tools": [], // list atleast 3 tools
      "TopSkills": [], // list atleast 3 top skills
      "RecommendedCoursesFromCoursera": [
        {"Title": "", "Link": "", "Description": ""}
      ],
      "Summary": "", // 3-4 sentences
      "Superpowers": [], // list atleast 2 lines of superpowers
      "Experience": [
        {"Role": "", "Company": "", "Duration": "", "Description": ""}
      ],
      "Education": [
        {"Degree": "", "Institution": "", "Year": "", "CGPA": ""}
      ],
      "TimelineBeforeSignificantAIImpact": 0 // By which year AI will have a significant impact on the career of the person with skills data provided
      "PercentageOfWorkAutomable":0 //Take reference from TimelineBeforeSignificantAIImpact and predict how much percentage of work will be replaced by ai that year
      "CurrentAutomableTask":0 //Currently how much work can be automated in percentage of the person data provided
    }
  `;

  try {
    // Call OpenAI API with error handling and timeout
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert career advisor and resume analyst. Provide a detailed professional assessment in JSON format.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OpenAI API request timed out')), 60000)
      )
    ]);

    if (!completion || typeof completion === 'string') {
      throw new Error('Invalid response from OpenAI');
    }

    let messageContent = (completion as any).choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error('No content received from OpenAI');
    }
    if (typeof messageContent=='string'){
      messageContent=JSON.parse(messageContent)
    }

    // Parse and validate the JSON response
    try {
      const analysis = messageContent
     
      return { success: true, analysis };
    } catch (jsonError) {
      console.error('Error parsing OpenAI response as JSON:', jsonError);
      return { 
        success: false,
        error: 'Failed to parse AI response', 
        details: 'The AI response was not valid JSON' 
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return { 
      success: false,
      error: 'Failed to process with AI', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function storeProfileInDatabase(analysisData: any) {
  try {
    // Ensure analysisData exists and is an object
    if (!analysisData || typeof analysisData !== 'object') {
      console.warn('Invalid analysisData provided:', analysisData);
      analysisData = {}; // Set to empty object to prevent further errors
    }

    // Safely destructure analysis data with defaults
    const {
      BasicProfileInformation = {},
      AIScore = {},
      SkillsAssessment = {},
      CareerTrajectory = null,
      Courses = [],
      Strengths = [],
      SkillGaps = [],
      Remark = null,
      AIAssessment = {},
      Achievements = {},
      Tools = [],
      TopSkills = [],
      RecommendedCoursesFromCoursera = [],
      Summary = null,
      Superpowers = [],
      Experience = [],
      Education = [],
      TimelineBeforeSignificantAIImpact = null,
      PercentageOfWorkAutomable=null,
      CurrentAutomableTask= null
    } = analysisData;

    // Use transaction for data consistency
    return await prisma.$transaction(async (tx: any) => {
      // 1. Create a new profile with data, safely accessing nested properties
      const newProfile = await tx.profile.create({
        data: {
          // Basic info with null fallbacks
          name: BasicProfileInformation?.Name || null,
          currentRole: BasicProfileInformation?.CurrentRole || null,
          company: BasicProfileInformation?.Company || null,
          email: BasicProfileInformation?.Email || null,
          phoneNumber: BasicProfileInformation?.PhoneNumber || null,
          location: BasicProfileInformation?.Location || null,
          
          // Required fields with safe defaults
          aiScoreTotal: typeof AIScore?.Total === 'number' ? AIScore.Total : 0,
          aiScoreAssessment: AIScore?.Assessment || "not assessed",
          
          // Optional profile fields
          skillsRelevance: SkillsAssessment?.Relevance || null,
          careerTrajectory: CareerTrajectory || null,
          skillGaps: Array.isArray(SkillGaps) ? SkillGaps : [],
          remark: Remark || null,
          aiAnalysis: AIAssessment?.analysis || null,
          aiImpactScore: typeof AIAssessment?.impactScore === 'number' ? AIAssessment.impactScore : null,
          achievementsDescription: Achievements?.Description || null,
          tools: Array.isArray(Tools) ? Tools : [],
          topSkills: Array.isArray(TopSkills) ? TopSkills : [],
          summary: Summary || null,
          superpowers: Array.isArray(Superpowers) ? Superpowers : [],
          timelineBeforeAIImpact: TimelineBeforeSignificantAIImpact || null,
          PercentageOfWorkAutomable: PercentageOfWorkAutomable || null,
          CurrentAutomableTask:CurrentAutomableTask || null
        }
      });
      
      // 2. Process skills (if any) - with additional validation
      if (SkillsAssessment && typeof SkillsAssessment === 'object') {
        await processSkills(tx, newProfile.id, SkillsAssessment);
      }

      // 3. Process courses (if any) - with array validation
      if (Array.isArray(Courses) && Courses.length > 0) {
        await processCourses(tx, newProfile.id, Courses);
      }

      // 4. Process strengths (if any) - with array validation
      if (Array.isArray(Strengths) && Strengths.length > 0) {
        await processStrengths(tx, newProfile.id, Strengths);
      }

      // 5. Process recommended courses (if any) - with array validation
      if (Array.isArray(RecommendedCoursesFromCoursera) && RecommendedCoursesFromCoursera.length > 0) {
        await processRecommendedCourses(tx, newProfile.id, RecommendedCoursesFromCoursera);
      }

      // 6. Process experience (if any) - with array validation
      if (Array.isArray(Experience) && Experience.length > 0) {
        await processExperience(tx, newProfile.id, Experience);
      }

      // 7. Process education (if any) - with array validation
      if (Array.isArray(Education) && Education.length > 0) {
        await processEducation(tx, newProfile.id, Education);
      }

      // Return the created profile with all relations
      return tx.profile.findUnique({
        where: { id: newProfile.id },
        include: {
          skills: true,
          courses: true,
          strengths: true,
          recommendedCourses: true,
          experiences: true,
          education: true,
        },
      });
    }, { timeout: 15000 });
  } catch (error) {
    console.error('Error storing profile data:', error);
    throw error;
  }
}

// Helper functions with robust error handling
async function processSkills(tx: any, profileId: string, skillsAssessment: any) {
  try {  
    // Process technical skills with validation
    if (Array.isArray(skillsAssessment.TechnicalSkills) && skillsAssessment.TechnicalSkills.length > 0) {
      await tx.skill.createMany({
        data: skillsAssessment.TechnicalSkills
          .filter((skill: any) => typeof skill === 'string' && skill.trim() !== '')
          .map((skill: string) => ({
            profileId: profileId,
            name: skill,
            category: 'TechnicalSkill',
          })),
        skipDuplicates: true,
      });
    }
    
    // Process soft skills with validation
    if (Array.isArray(skillsAssessment.SoftSkills) && skillsAssessment.SoftSkills.length > 0) {
      await tx.skill.createMany({
        data: skillsAssessment.SoftSkills
          .filter((skill: any) => typeof skill === 'string' && skill.trim() !== '')
          .map((skill: string) => ({
            profileId: profileId,
            name: skill,
            category: 'SoftSkill',
          })),
        skipDuplicates: true,
      });
    }
  } catch (error) {
    console.error('Error processing skills:', error);
    // Continue execution instead of throwing
  }
}

async function processCourses(tx: any, profileId: string, courses: any[]) {
  try {
    await tx.course.createMany({
      data: courses
        .filter((course: any) => course && typeof course === 'object')
        .map((course: any) => ({
          profileId: profileId,
          title: course.Title || 'Untitled Course',
          description: course.Description || null,
        })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error('Error processing courses:', error);
    // Continue execution instead of throwing
  }
}

async function processStrengths(tx: any, profileId: string, strengths: any[]) {
  try {
    await tx.strength.createMany({
      data: strengths
        .filter((strength: any) => strength && typeof strength === 'object' && strength.skill)
        .map((strength: any) => ({
          profileId: profileId,
          skill: strength.skill || 'Unnamed Strength',
          rating: typeof strength.rating === 'number' ? strength.rating : null,
        })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error('Error processing strengths:', error);
    // Continue execution instead of throwing
  }
}

async function processRecommendedCourses(tx: any, profileId: string, recommendedCourses: any[]) {
  try {
    await tx.recommendedCourse.createMany({
      data: recommendedCourses
        .filter((course: any) => course && typeof course === 'object')
        .map((course: any) => ({
          profileId: profileId,
          title: course.Title || 'Untitled Recommended Course',
          link: course.Link || null,
          description: course.Description || null,
        })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error('Error processing recommended courses:', error);
    // Continue execution instead of throwing
  }
}

async function processExperience(tx: any, profileId: string, experiences: any[]) {
  try {
    await tx.experience.createMany({
      data: experiences
        .filter((exp: any) => exp && typeof exp === 'object')
        .map((exp: any) => ({
          profileId: profileId,
          role: exp.Role || 'Untitled Role',
          company: exp.Company || null,
          duration: exp.Duration || null,
          description: exp.Description || null,
        })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error('Error processing experiences:', error);
    // Continue execution instead of throwing
  }
}

async function processEducation(tx: any, profileId: string, educations: any[]) {
  try {
    await tx.education.createMany({
      data: educations
        .filter((edu: any) => edu && typeof edu === 'object')
        .map((edu: any) => ({
          profileId: profileId,
          degree: edu.Degree || 'Untitled Degree',
          institution: edu.Institution || null,
          year: edu.Year || null,
          cgpa: typeof edu.CGPA === 'number' ? edu.CGPA : null,
        })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error('Error processing education:', error);
    // Continue execution instead of throwing
  }
}