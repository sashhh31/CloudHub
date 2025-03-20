import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { prisma } from "@/lib/prisma";
import { currentUser } from '@clerk/nextjs/server';
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
    // Get current user's email
    const user = await currentUser();
    const userEmail = user?.emailAddresses.find(
      email => email.id === user.primaryEmailAddressId
    )?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 401 });
    }
    
    // Validate OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 });
    }
    
    const openai = new OpenAI({ apiKey: openaiApiKey });
    const formData = await request.formData();
    
    const text = formData.get("extractedText");
    const linkedinUrl = formData.get("linkedinUrl");
    const fileType = formData.get("fileType");
    
    console.log("Request received with file type:", fileType);
    
    // Process the data based on the file type
    let profileText: string;
    
    if (fileType === 'linkedin') {
      if (!linkedinUrl || typeof linkedinUrl !== 'string') {
        return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 });
      }

      console.log("Processing LinkedIn URL:", linkedinUrl);
      
      try {
        const username = extractLinkedInUsername(linkedinUrl);
        if (!username) {
          return NextResponse.json({ error: 'Could not extract LinkedIn username' }, { status: 400 });
        }
      const apiKey= process.env.SCRAPPING_DOG_API_KEY
        const url = 'https://api.scrapingdog.com/linkedin/';
        const params = {
          api_key:apiKey ,
          type: 'profile',
          linkId: username
        };
        
        const response = await axios.get(url, { params });
        profileText = JSON.stringify(response.data);
      } catch (error) {
        console.error('Error processing LinkedIn profile:', error);
        return NextResponse.json(
          {
            error: 'Failed to process LinkedIn profile',
            details: error instanceof Error ? error.message : 'Unknown error',
          },
          { status: 500 }
        );
      }
    } else {
      // Handle text-based resume
      if (!text || typeof text !== 'string') {
        return NextResponse.json({ error: 'No text provided for analysis' }, { status: 400 });
      }
      profileText = text;
    }
    
    // Process the profile with OpenAI
    const analysisResult = await processProfileWithAI(openai, profileText);
    
    if (!analysisResult.success) {
      return analysisResult;
    }

    // console.log(analysisResult)
    
    const dbPromise = storeProfileInDatabase(userEmail, analysisResult.analysis);
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
        "Total": 0, // 0-100 give a number it's mandatory
        "Assessment": "" // "high", "medium", or "low"
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
      "Superpowers": [], // list atleast 3 superpowers
      "Experience": [
        {"Role": "", "Company": "", "Duration": "", "Description": ""}
      ],
      "Education": [
        {"Degree": "", "Institution": "", "Year": "", "CGPA": ""}
      ],
      "TimelineBeforeSignificantAIImpact": 0 // Number of years it will take to have a significant impact with AI just number
    }
  `;

  try {
    console.log("Calling OpenAI API...");
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

    const messageContent = (completion as any).choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error('No content received from OpenAI');
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

async function storeProfileInDatabase(email: string, analysisData: any) {
  try {
    if (!email) {
      throw new Error("Email is required to identify the user");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profileAssessment: true,
        skills: true,
        courses: true,
        strengths: true,
        recommendedCourses: true,
        experience: true,
        education: true,
      }
    });
    
    // If user doesn't exist, create a new user
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          email,
        },
        include: {
          profileAssessment: true,
          skills: true,
          courses: true,
          strengths: true,
          recommendedCourses: true,
          experience: true,
          education: true,
        }
      });
    }
      const existingUser: any = await prisma.user.findUnique({
        where: { email },
      });
      

    // Destructure analysis data
    const {
      BasicProfileInformation,
      AIScore,
      SkillsAssessment,
      CareerTrajectory,
      Courses,
      Strengths,
      SkillGaps,
      Remark,
      AIAssessment,
      Achievements,
      Tools,
      TopSkills,
      RecommendedCoursesFromCoursera,
      Summary,
      Superpowers,
      Experience,
      Education,
      TimelineBeforeSignificantAIImpact
    } = analysisData;

    // Use transaction for data consistency
    return await prisma.$transaction(async (tx) => {
      // 1. Update basic user info
      if (BasicProfileInformation) {
        await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: BasicProfileInformation.Name || existingUser.name,
            currentRole: BasicProfileInformation.CurrentRole || existingUser.currentRole,
            company: BasicProfileInformation.Company || existingUser.company,
            phoneNumber: BasicProfileInformation.PhoneNumber || existingUser.phoneNumber,
            location: BasicProfileInformation.Location || existingUser.location,
          },
        });
      }

      // 2. Update or create profile assessment
      await upsertProfileAssessment(tx, existingUser, {
        AIScore,
        SkillsAssessment,
        CareerTrajectory,
        SkillGaps,
        Remark,
        AIAssessment,
        Achievements,
        Tools,
        TopSkills,
        Summary,
        Superpowers,
        TimelineBeforeSignificantAIImpact
      });

      // 3. Process skills
      if (SkillsAssessment) {
        await processSkills(tx, existingUser, SkillsAssessment);
      }

      // 4. Process courses
      if (Courses && Courses.length > 0) {
        await processCourses(tx, existingUser, Courses);
      }

      // 5. Process strengths
      if (Strengths && Strengths.length > 0) {
        await processStrengths(tx, existingUser, Strengths);
      }

      // 6. Process recommended courses
      if (RecommendedCoursesFromCoursera && RecommendedCoursesFromCoursera.length > 0) {
        await processRecommendedCourses(tx, existingUser, RecommendedCoursesFromCoursera);
      }

      // 7. Process experience
      if (Experience && Experience.length > 0) {
        await processExperience(tx, existingUser, Experience);
      }

      // 8. Process education
      if (Education && Education.length > 0) {
        await processEducation(tx, existingUser, Education);
      }

      // Return the updated user with all relations
      return tx.user.findUnique({
        where: { id: existingUser.id },
        include: {
          profileAssessment: true,
          skills: true,
          courses: true,
          strengths: true,
          recommendedCourses: true,
          experience: true,
          education: true,
        },
      });
    },{ timeout: 15000 });
  } catch (error) {
    console.error('Error storing profile data:', error);
    throw error;
  }
}

// Helper functions for database operations
async function upsertProfileAssessment(tx: any, user: any, data: any) {
  const {
    AIScore,
    SkillsAssessment,
    CareerTrajectory,
    SkillGaps,
    Remark,
    AIAssessment,
    Achievements,
    Tools,
    TopSkills,
    Summary,
    Superpowers,
    TimelineBeforeSignificantAIImpact
  } = data;

  const updateData: any = {};
  
  if (AIScore) {
    updateData.aiScoreTotal = AIScore.Total;
    updateData.aiScoreAssessment = AIScore.Assessment;
  }
  
  if (SkillsAssessment?.Relevance) updateData.skillsRelevance = SkillsAssessment.Relevance;
  if (CareerTrajectory) updateData.careerTrajectory = CareerTrajectory;
  if (Remark) updateData.remark = Remark;
  if (AIAssessment?.analysis) updateData.aiAnalysis = AIAssessment.analysis;
  if (AIAssessment?.impactScore) updateData.aiImpactScore = AIAssessment.impactScore;
  if (Achievements?.Description) updateData.achievementsDescription = Achievements.Description;
  if (Summary) updateData.summary = Summary;
  if (TimelineBeforeSignificantAIImpact) updateData.timelineBeforeAIImpact = TimelineBeforeSignificantAIImpact;

  // For array fields, append new values without duplicates
  if (SkillGaps && SkillGaps.length > 0) {
    const currentGaps = user.profileAssessment?.skillGaps || [];
    updateData.skillGaps = [...new Set([...currentGaps, ...SkillGaps])];
  }
  
  if (Tools && Tools.length > 0) {
    const currentTools = user.profileAssessment?.tools || [];
    updateData.tools = [...new Set([...currentTools, ...Tools])];
  }
  
  if (TopSkills && TopSkills.length > 0) {
    const currentTopSkills = user.profileAssessment?.topSkills || [];
    updateData.topSkills = [...new Set([...currentTopSkills, ...TopSkills])];
  }
  
  if (Superpowers && Superpowers.length > 0) {
    const currentSuperpowers = user.profileAssessment?.superpowers || [];
    updateData.superpowers = [...new Set([...currentSuperpowers, ...Superpowers])];
  }

  // If profile assessment exists, update it
  if (user.profileAssessment) {
    if (Object.keys(updateData).length > 0) {
      await tx.profileAssessment.update({
        where: { userId: user.id },
        data: updateData,
      });
    }
  } 
}

async function processSkills(tx: any, user: any, skillsAssessment: any) {
  const existingSkillNames = (user?.skills ?? []).map((skill: any) => skill.name);
  
  // Process technical skills
  if (skillsAssessment.TechnicalSkills && skillsAssessment.TechnicalSkills.length > 0) {
    const newTechSkills = skillsAssessment.TechnicalSkills.filter(
      (skill: string) => !existingSkillNames.includes(skill)
    );
    
    // Batch create for improved performance
    if (newTechSkills.length > 0) {
      await tx.userSkill.createMany({
        data: newTechSkills.map((skill: string) => ({
          userId: user.id,
          name: skill,
          category: 'TechnicalSkill',
        })),
        skipDuplicates: true,
      });
    }
  }
  
  // Process soft skills
  if (skillsAssessment.SoftSkills && skillsAssessment.SoftSkills.length > 0) {
    const newSoftSkills = skillsAssessment.SoftSkills.filter(
      (skill: string) => !existingSkillNames.includes(skill)
    );
    
    // Batch create for improved performance
    if (newSoftSkills.length > 0) {
      await tx.userSkill.createMany({
        data: newSoftSkills.map((skill: string) => ({
          userId: user.id,
          name: skill,
          category: 'SoftSkill',
        })),
        skipDuplicates: true,
      });
    }
  }
}

async function processCourses(tx: any, user: any, courses: any[]) {
  const existingCourseTitles = (user?.courses ?? []).map((course: any) => course.title);
  
  const coursesToAdd = courses.filter(
    (course: any) => !existingCourseTitles.includes(course.Title)
  );

  if (coursesToAdd.length > 0) {
    await tx.course.createMany({
      data: coursesToAdd.map((course: any) => ({
        userId: user.id,
        title: course.Title,
        description: course.Description,
      })),
      skipDuplicates: true,
    });
  }
}

async function processStrengths(tx: any, user: any, strengths: any[]) {
  for (const strength of strengths) {
    const existingStrength = (user?.strengths ?? []).find(
      (s: any) => s.skill === strength.skill
    );

    if (existingStrength) {
      if (existingStrength.rating !== strength.rating) {
        await tx.strength.update({
          where: { id: existingStrength.id },
          data: { rating: strength.rating },
        });
      }
    } else {
      await tx.strength.create({
        data: {
          userId: user.id,
          skill: strength.skill,
          rating: strength.rating,
        },
      });
    }
  }
}

async function processRecommendedCourses(tx: any, user: any, recommendedCourses: any[]) {
  const existingCourseTitles = (user?.recommendedCourses ?? []).map(
    (course: any) => course.title
  );

  const coursesToAdd = recommendedCourses.filter(
    (course: any) => !existingCourseTitles.includes(course.Title)
  );

  if (coursesToAdd.length > 0) {
    await tx.recommendedCourse.createMany({
      data: coursesToAdd.map((course: any) => ({
        userId: user.id,
        title: course.Title,
        link: course.Link,
        description: course.Description,
      })),
      skipDuplicates: true,
    });
  }
}

async function processExperience(tx: any, user: any, experiences: any[]) {
  const getExpKey = (exp: any) => `${exp.Role}|${exp.Company}|${exp.Duration}`;
  const existingExpKeys = (user?.experience ?? []).map(
    (exp: any) => `${exp.role}|${exp.company}|${exp.duration}`
  );

  const experiencesToAdd = experiences.filter(
    (exp: any) => !existingExpKeys.includes(getExpKey(exp))
  );

  if (experiencesToAdd.length > 0) {
    await tx.experience.createMany({
      data: experiencesToAdd.map((exp: any) => ({
        userId: user.id,
        role: exp.Role,
        company: exp.Company,
        duration: exp.Duration,
        description: exp.Description,
      })),
      skipDuplicates: true,
    });
  }
}

async function processEducation(tx: any, user: any, educations: any[]) {
  const getEduKey = (edu: any) => `${edu.Degree}|${edu.Institution}|${edu.Year}`;
  const existingEduKeys = (user?.education ?? []).map(
    (edu: any) => `${edu.degree}|${edu.institution}|${edu.year}`
  );

  const educationToAdd = educations.filter(
    (edu: any) => !existingEduKeys.includes(getEduKey(edu))
  );

  if (educationToAdd.length > 0) {
    await tx.education.createMany({
      data: educationToAdd.map((edu: any) => ({
        userId: user.id,
        degree: edu.Degree,
        institution: edu.Institution,
        year: edu.Year,
        cgpa: edu.CGPA,
      })),
      skipDuplicates: true,
    });
  }
}
