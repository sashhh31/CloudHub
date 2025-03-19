import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';
import { Browser, BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright';
import { currentUser } from '@clerk/nextjs/server';


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

let cachedProfile: LinkedInProfile | null = null;

async function scrapeLinkedInProfile(url: string): Promise<LinkedInProfile> {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  
  try {
    // Normalize URL
    if (!url.includes('linkedin.com/in/')) {
      throw new Error('Invalid LinkedIn profile URL. Must include "linkedin.com/in/"');
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    // Check if credentials are available
    const email = process.env.LINKEDIN_EMAIL;
    const password = process.env.LINKEDIN_PASSWORD;
    
    if (!email || !password) {
      throw new Error("LinkedIn credentials are not configured in environment variables");
    }

    // Launch browser with headless mode in production
    const isProduction = process.env.NODE_ENV === "production";
    browser = await chromium.launch({ 
      headless: isProduction,
      args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox']
    });
    
    context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    // Add timeout for operations
    page.setDefaultTimeout(60000);
    
    console.log("Navigating to LinkedIn login page...");
    // Perform login steps
    await page.goto("https://www.linkedin.com/login", { waitUntil: 'networkidle' });
    
    console.log("Filling login credentials...");
    await page.fill('input[name="session_key"]', email);
    await page.fill('input[name="session_password"]', password);
    await page.click('button[type="submit"]');
    
    // Wait for login to complete and detect if there's a security check
    try {
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }),
        page.waitForSelector('text="Security verification"', { timeout: 20000 })
        .then(() => { throw new Error("Security verification detected. Please complete it manually."); })
      ]);
    } catch (error) {
      if ((error as Error).message.includes("Security verification")) {
        throw error;
      }
      // Otherwise, it might just be a timeout, which is okay
    }
    
    console.log("Login successful. Navigating to profile URL:", url);
    // Navigate to the LinkedIn profile
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    // Scroll down to load all content
    // await autoScroll(page);
    
    console.log("Extracting profile data...");
    // Extract profile data with more robust selectors
    const profileData = await extractProfileData(page);
    try {
      const contactInfo = await getContactInfo(page);
      profileData.email = contactInfo.email;
      // profileData.phoneNumber = contactInfo.phoneNumber;
    } catch (error) {
      console.log('Could not get contact info, continuing with main profile data');
    }   
    
    
    console.log("Profile data extracted successfully:", profileData);
    
    // const profileText:LinkedInProfile =  formatProfileForAI(profileData);
    return profileData;
  } catch (error) {
    console.error("Error during LinkedIn scraping:", error);
    throw error;
  } finally {
    // Always close the context and browser
    if (context) await context.close();
    if (browser) await browser.close();
  }
}


function formatProfileForAI(profile: LinkedInProfile): string {
  let profileText = `
  Name: ${profile.name}
  Current Role: ${profile.currentRole}
  Company: ${profile.company}
  Location: ${profile.location}
  Email: ${profile.email}
  Phone Number: ${profile.phoneNumber}
  
  About:
  ${profile.about}
  
  Experience:
  ${profile.experience.map(exp => `- ${exp.role} at ${exp.company} (${exp.duration})
    ${exp.description}`).join('\n\n')}
    
    Education:
    ${profile.education.map(edu => `- ${edu.degree} at ${edu.institution} (${edu.year})`).join('\n')}
    
    Skills:
    Technical: ${profile.technicalSkills.join(', ')}
    Soft: ${profile.softSkills.join(', ')}
    
    Tools: ${profile.tools.join(', ')}
    
    Achievements:
    ${profile.achievements.map(achievement => `- ${achievement}`).join('\n')}
    
    Courses:
    ${profile.courses.map(course => `- ${course.title}${course.description ? `: ${course.description}` : ''}`).join('\n')}
    `;

  return profileText;
}


async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });
  });
  
  // Wait a bit after scrolling to ensure all content is loaded
  await new Promise(resolve => setTimeout(resolve, 2000));
}
async function extractProfileData(page: Page): Promise<LinkedInProfile> {
  // Scroll through the page to ensure all content is loaded
  await autoScroll(page);
  
  return await page.evaluate(() => {
    // Helper function to get text from selectors with fallbacks
    const getTextContent = (selectors: string[]): string => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent?.trim() || "";
          if (text) return text;
        }
      }
      return "";
    };
    
    // Helper function to get multiple elements
    const getAllElements = (selectors: string[]): Element[] => {
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          return Array.from(elements);
        }
      }
      return [];
    };
    
    // Basic information
    const name = getTextContent([
      ".text-heading-xlarge",
      ".pv-text-details__left-panel h1",
      "h1.text-heading-xlarge"
    ]);
    
    const headline = getTextContent([
      ".text-body-medium",
      ".pv-text-details__left-panel .text-body-medium",
      ".ph5 .pv-text-details__left-panel div.text-body-medium"
    ]);
    
    const location = getTextContent([
      ".text-body-small.inline.t-black--light.break-words",
      ".pv-text-details__left-panel .text-body-small",
      ".ph5 span.text-body-small.inline"
    ]);
    
    // Try to extract current role and company from headline
    let currentRole = "";
    let company = "";
    
    if (headline) {
      const parts = headline.split(" at ");
      if (parts.length > 1) {
        currentRole = parts[0].trim();
        company = parts[1].trim();
      } else {
        currentRole = headline;
      }
    }
    
    // Contact info - may require visiting the contact info page
    const email = getTextContent([
      ".ci-email .pv-contact-info__contact-link",
      "section.pv-contact-info__contact-type a.pv-contact-info__contact-link"
    ]);
    
    const phoneNumber = getTextContent([
      ".ci-phone .pv-contact-info__contact-link",
      "section.pv-contact-info__contact-type span.t-black--light"
    ]);
    
    // About section
    const about = getTextContent([
      ".display-flex.ph5.pv3 .pv-shared-text-with-see-more span",
      "#about ~ .pvs-list__outer-container .pv-shared-text-with-see-more span",
      "section.pv-about-section div.inline-show-more-text"
    ]);
    
    // Experience
    const experienceElements = getAllElements([
      "#experience ~ .pvs-list__outer-container > ul > li",
      "section#experience ~ div ul.pvs-list li",
      "section[data-section='experience'] li.pvs-list__item"
    ]);
    
    const experience = experienceElements.map(item => {
      const role = item.querySelector(".t-bold span, .t-heading")?.textContent?.trim() || "";
      const company = item.querySelector(".t-normal.t-black--light span, .t-normal")?.textContent?.trim() || "";
      const duration = item.querySelector(".t-normal.t-black--light .pvs-entity__caption-wrapper span, .date-range")?.textContent?.trim() || "";
      const description = item.querySelector(".pvs-list__outer-container .pvs-entity__description span, .description")?.textContent?.trim() || "";
      
      return { role, company, duration, description };
    }).filter(exp => exp.role || exp.company);
    
    // Education
    const educationElements = getAllElements([
      "#education ~ .pvs-list__outer-container > ul > li",
      "section#education ~ div ul.pvs-list li",
      "section[data-section='education'] li.pvs-list__item"
    ]);
    
    const education = educationElements.map(item => {
      const institution = item.querySelector(".t-bold span, .t-heading")?.textContent?.trim() || "";
      const degree = item.querySelector(".t-normal.t-black--light span, .education__item--degree-info")?.textContent?.trim() || "";
      const year = item.querySelector(".pvs-entity__caption-wrapper span, .date-range")?.textContent?.trim() || "";
      const cgpa = ""; // LinkedIn typically doesn't show CGPA, would need to parse from description
      
      return { degree, institution, year, cgpa };
    }).filter(edu => edu.institution || edu.degree);
    
    // Skills
    const skillElements = getAllElements([
      "#skills ~ .pvs-list__outer-container > ul > li",
      "section#skills ~ div ul.pvs-list li",
      "section[data-section='skills'] li.pvs-list__item"
    ]);
    
    const skills = skillElements.map(item => 
      item.querySelector(".t-bold span, .t-heading")?.textContent?.trim() || ""
    ).filter(Boolean);
    
    // Separating technical and soft skills (basic heuristic)
    const technicalKeywords = [
      "python", "javascript", "java", "c++", "sql", "aws", "azure", "react", "node", "docker", 
      "kubernetes", "machine learning", "ai", "data", "analytics", "algorithms", "engineering", 
      "development", "programming", "software", "systems", "architecture", "devops", "cloud", 
      "infrastructure", "security", "network", "database", "full-stack", "frontend", "backend",
      "react", "node", "express", "django", "flask", "sql", "nosql", "mongodb", "mysql", "postgresql",
      "redis", "elasticsearch", "kafka", "rabbitmq", "docker", "kubernetes", "machine learning", "ai", "data", "analytics", "algorithms", "engineering", 
      "development", "programming", "software", "systems", "architecture", "devops", "cloud", 
      "infrastructure", "security", "network", "database", "full-stack", "frontend", "backend",  
    ];
    
    const softKeywords = [
      "leadership", "communication", "teamwork", "management", "problem solving", "critical thinking",
      "creativity", "collaboration", "adaptability", "time management", "negotiation", "presentation",
      "organization", "decision making", "emotional intelligence", "conflict resolution", "mentoring",
      "coaching", "project management", "interpersonal", "strategic thinking", "customer service", 
      "leadership", "communication", "teamwork", "management", "problem solving", "critical thinking",
      "creativity", "collaboration", "adaptability", "time management", "negotiation", "presentation",
      "organization", "decision making", "emotional intelligence", "conflict resolution", "mentoring",
      "coaching", "project management", "interpersonal", "strategic thinking", "customer service", 
    ];
    
    const technicalSkills = skills.filter(skill => 
      technicalKeywords.some(keyword => skill.toLowerCase().includes(keyword))
    );
    
    const softSkills = skills.filter(skill => 
      softKeywords.some(keyword => skill.toLowerCase().includes(keyword))
    );
    
    // Extract tools (heuristic based on common tools)
    const toolKeywords = [
      "excel", "word", "powerpoint", "photoshop", "illustrator", "figma", "sketch", "jira", 
      "confluence", "slack", "teams", "github", "gitlab", "bitbucket", "salesforce", "tableau", 
      "power bi", "sap", "oracle", "adobe", "asana", "trello", "notion", "airtable", "jenkins",
      "aws", "azure", "docker", "kubernetes", "machine learning", "ai", "data", "analytics", "algorithms", "engineering", 
      "development", "programming", "software", "systems", "architecture", "devops", "cloud", 
      "infrastructure", "security", "network", "database", "full-stack", "frontend", "backend" ,
      "react", "node", "express", "django", "flask", "sql", "nosql", "mongodb", "mysql", "postgresql",
      "redis", "elasticsearch", "kafka", "rabbitmq", "docker", "kubernetes", "machine learning", "ai", "data", "analytics", "algorithms", "engineering", 
      "development", "programming", "software", "systems", "architecture", "devops", "cloud", 
      "infrastructure", "security", "network", "database", "full-stack", "frontend", "backend", 
    ];
    
    const tools = skills.filter(skill => 
      toolKeywords.some(keyword => skill.toLowerCase().includes(keyword))
    );
    
    // Achievements (try to extract from About section or Experience descriptions)
    const achievements = [];
    
    // Look for achievement indicators in the about section
    const aboutText = about.toLowerCase();
    if (aboutText.includes("achiev") || aboutText.includes("award") || aboutText.includes("recogn")) {
      const sentences = about.split(/[.!?]+/);
      for (const sentence of sentences) {
        if (/achieve|award|recognise|honour|won|success|accomplish/i.test(sentence)) {
          achievements.push(sentence.trim());
        }
      }
    }
    
    // Look for achievements in experience descriptions
    for (const exp of experience) {
      if (exp.description) {
        const sentences = exp.description.split(/[.!?]+/);
        for (const sentence of sentences) {
          if (/achieve|award|recognise|honour|won|success|accomplish|increase|improve|reduce|grow|lead|manage|deliver/i.test(sentence)) {
            achievements.push(sentence.trim());
          }
        }
      }
    }
    
    // Courses (from Accomplishments section)
    const courseElements = getAllElements([
      "#certifications ~ .pvs-list__outer-container > ul > li",
      "section#certifications ~ div ul.pvs-list li",
      "section[data-section='certifications'] li.pvs-list__item",
      "#courses ~ .pvs-list__outer-container > ul > li",
      "section#courses ~ div ul.pvs-list li",
      "section[data-section='courses'] li.pvs-list__item"
    ]);
    
    const courses = courseElements.map(item => {
      const title = item.querySelector(".t-bold span, .t-heading")?.textContent?.trim() || "";
      const description = item.querySelector(".t-normal.t-black--light span, .t-normal")?.textContent?.trim() || "";
      
      return { title, description };
    }).filter(course => course.title);
    
    return {
      name: name || "N/A",
      headline: headline || "N/A",
      currentRole: currentRole || "N/A",
      company: company || "N/A",
      location: location || "N/A",
      email: email || "N/A",
      // phoneNumber: phoneNumber || "N/A",
      about: about || "N/A",
      experience: experience,
      education: education,
      skills: skills,
      technicalSkills: technicalSkills,
      softSkills: softSkills,
      tools: tools,
      achievements: achievements,
      courses: courses
    };
  });
}
async function getContactInfo(page: Page): Promise<{ email: string, phoneNumber: string }> {
  try {
    // Find and click the contact info button
    await page.click('a[href*="contact-info"]');
    
    // Wait for the contact info modal to appear
    await page.waitForSelector('.pv-contact-info');
    
    // Extract email and phone
    const email = await page.evaluate(() => {
      const emailElement = document.querySelector('.ci-email .pv-contact-info__contact-link');
      return emailElement ? emailElement.textContent?.trim() || "" : "";
    });
    
    const phoneNumber = await page.evaluate(() => {
      const phoneElement = document.querySelector('.ci-phone .pv-contact-info__contact-link');
      return phoneElement ? phoneElement.textContent?.trim() || "" : "";
    });
    
    // Close the modal
    await page.click('.artdeco-modal__dismiss');
    
    return { email, phoneNumber };
  } catch (error) {
    console.error('Error getting contact info:', error);
    return { email: "", phoneNumber: "" };
  }
}

export async function POST(request: Request) {
  async function getUserEmailAppRouter() {
   // Get the current user
   const user = await currentUser();
   
   if (!user) {
     return null;
   }
  
   // Get primary email address
   const primaryEmail = user.emailAddresses.find(
     email => email.id === user.primaryEmailAddressId
   )?.emailAddress;
  
   console.log("Primary email:", primaryEmail);
   
   return primaryEmail || null;
  }
  getUserEmailAppRouter();
  try {
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
    
    // Handle LinkedIn profile URL
    if (fileType === 'linkedin') {
      try {
        if (!linkedinUrl || typeof linkedinUrl !== 'string') {
          return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 });
        }

        console.log("Processing LinkedIn URL:", linkedinUrl);
        
        // Try to get the profile data
        let profileData;
        try {
          profileData = await scrapeLinkedInProfile(linkedinUrl);
          cachedProfile = profileData; // Cache the profile for potential reuse
        } catch (error) {
          console.error("Error scraping LinkedIn profile:", error);
          return NextResponse.json({ 
            error: 'Failed to scrape LinkedIn profile', 
            details: error instanceof Error ? error.message : 'Unknown error' 
          }, { status: 500 });
        }
        
        if (!profileData) {
          return NextResponse.json({ error: "Failed to extract profile data" }, { status: 500 });
        }
        
        const profileText = JSON.stringify(profileData);
        return await processProfileWithAI(openai, profileText);
        
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
    }

    // Handle text-based resume
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'No text provided for analysis' }, { status: 400 });
    }
    
    return await processProfileWithAI(openai, text);
    
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
        "Total": 0,
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
      "TimelineBeforeSignificantAIImpact": "" // Number of years it will take to have a significant impact with AI just number
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
      const analysis = JSON.parse(messageContent);
      return NextResponse.json({ success: true, analysis });
    } catch (jsonError) {
      console.error('Error parsing OpenAI response as JSON:', jsonError);
      return NextResponse.json({ 
        error: 'Failed to parse AI response', 
        details: 'The AI response was not valid JSON' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json({ 
      error: 'Failed to process with AI', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}



const prisma = new PrismaClient();

/**
 * Append new data to an existing user profile without overwriting current data
 * @param email User's email to identify the profile
 * @param newData New data to append to the user's profile
 * @returns The updated user with all related data
 */
export async function appendUserProfileData(email: string, newData: any) {
  try {
    if (!email) {
      throw new Error("Email is required to identify the user");
    }

    // Find the existing user
    const existingUser = await prisma.user.findUnique({
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

    if (!existingUser) {
      throw new Error(`User with email ${email} not found`);
    }

    // Destructure new data
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
    } = newData;

    // Use a transaction for data consistency
    return await prisma.$transaction(async (tx: any) => {
      // 1. Update basic user info (only if provided)
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

      // 2. Update profile assessment (only if it exists and values are provided)
      if (existingUser.profileAssessment) {
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
          const currentGaps = existingUser.profileAssessment.skillGaps || [];
          updateData.skillGaps = [...new Set([...currentGaps, ...SkillGaps])];
        }
        
        if (Tools && Tools.length > 0) {
          const currentTools = existingUser.profileAssessment.tools || [];
          updateData.tools = [...new Set([...currentTools, ...Tools])];
        }
        
        if (TopSkills && TopSkills.length > 0) {
          const currentTopSkills = existingUser.profileAssessment.topSkills || [];
          updateData.topSkills = [...new Set([...currentTopSkills, ...TopSkills])];
        }
        
        if (Superpowers && Superpowers.length > 0) {
          const currentSuperpowers = existingUser.profileAssessment.superpowers || [];
          updateData.superpowers = [...new Set([...currentSuperpowers, ...Superpowers])];
        }

        // Only update if we have data to update
        if (Object.keys(updateData).length > 0) {
          await tx.profileAssessment.update({
            where: { userId: existingUser.id },
            data: updateData,
          });
        }
      } else if (AIScore || SkillsAssessment || CareerTrajectory || SkillGaps || Remark || 
                AIAssessment || Achievements || Tools || TopSkills || Summary || 
                Superpowers || TimelineBeforeSignificantAIImpact) {
        // Create profile assessment if it doesn't exist but we have data for it
        await tx.profileAssessment.create({
          data: {
            userId: existingUser.id,
            aiScoreTotal: AIScore?.Total || 0,
            aiScoreAssessment: AIScore?.Assessment || "medium",
            skillsRelevance: SkillsAssessment?.Relevance || "",
            careerTrajectory: CareerTrajectory || "",
            skillGaps: SkillGaps || [],
            remark: Remark || "",
            aiAnalysis: AIAssessment?.analysis || "",
            aiImpactScore: AIAssessment?.impactScore || 0,
            achievementsDescription: Achievements?.Description || "",
            tools: Tools || [],
            topSkills: TopSkills || [],
            summary: Summary || "",
            superpowers: Superpowers || [],
            timelineBeforeAIImpact: TimelineBeforeSignificantAIImpact || 0,
          },
        });
      }

      // 3. Add new skills (avoiding duplicates)
      if (SkillsAssessment) {
        const existingSkillNames = existingUser.skills.map((skill: any) => skill.name);
        
        // Add new technical skills
        if (SkillsAssessment.TechnicalSkills) {
          const newTechSkills = SkillsAssessment.TechnicalSkills.filter(
            (skill: string) => !existingSkillNames.includes(skill)
          );
          
          for (const skill of newTechSkills) {
            await tx.userSkill.create({
              data: {
                userId: existingUser.id,
                name: skill,
                category: 'TechnicalSkill',
              },
            });
          }
        }
        
        // Add new soft skills
        if (SkillsAssessment.SoftSkills) {
          const newSoftSkills = SkillsAssessment.SoftSkills.filter(
            (skill: string) => !existingSkillNames.includes(skill)
          );
          
          for (const skill of newSoftSkills) {
            await tx.userSkill.create({
              data: {
                userId: existingUser.id,
                name: skill,
                category: 'SoftSkill',
              },
            });
          }
        }
      }

      // 4. Add new courses
      if (Courses && Courses.length > 0) {
        const existingCourseTitles = existingUser.courses.map((course: any) => course.title);
        
        const coursesToAdd = Courses.filter(
          (course: any) => !existingCourseTitles.includes(course.Title)
        );
        
        for (const course of coursesToAdd) {
          await tx.course.create({
            data: {
              userId: existingUser.id,
              title: course.Title,
              description: course.Description,
            },
          });
        }
      }

      // 5. Add or update strengths
      if (Strengths && Strengths.length > 0) {
        for (const strength of Strengths) {
          const existingStrength = existingUser.strengths.find((s: any) => s.skill === strength.skill);
          
          if (existingStrength) {
            // Update existing strength if rating changed
            if (existingStrength.rating !== strength.rating) {
              await tx.strength.update({
                where: { id: existingStrength.id },
                data: { rating: strength.rating },
              });
            }
          } else {
            // Create new strength
            await tx.strength.create({
              data: {
                userId: existingUser.id,
                skill: strength.skill,
                rating: strength.rating,
              },
            });
          }
        }
      }

      // 6. Add new recommended courses
      if (RecommendedCoursesFromCoursera && RecommendedCoursesFromCoursera.length > 0) {
        const existingRecCourseTitles = existingUser.recommendedCourses.map((course: any) => course.title);
        
        const coursesToAdd = RecommendedCoursesFromCoursera.filter(
          (course: any) => !existingRecCourseTitles.includes(course.Title)
        );
        
        for (const course of coursesToAdd) {
          await tx.recommendedCourse.create({
            data: {
              userId: existingUser.id,
              title: course.Title,
              link: course.Link,
              description: course.Description,
            },
          });
        }
      }

      // 7. Add new experience entries
      if (Experience && Experience.length > 0) {
        // Create a unique key for each experience to check duplicates
        const getExpKey = (exp: any) => `${exp.Role}|${exp.Company}|${exp.Duration}`;
        const existingExpKeys = existingUser.experience.map((exp: any) => 
          `${exp.role}|${exp.company}|${exp.duration}`
        );
        
        const experiencesToAdd = Experience.filter(
          (exp: any) => !existingExpKeys.includes(getExpKey(exp))
        );
        
        for (const exp of experiencesToAdd) {
          await tx.experience.create({
            data: {
              userId: existingUser.id,
              role: exp.Role,
              company: exp.Company,
              duration: exp.Duration,
              description: exp.Description,
            },
          });
        }
      }

      // 8. Add new education entries
      if (Education && Education.length > 0) {
        // Create a unique key for each education to check duplicates
        const getEduKey = (edu: any) => `${edu.Degree}|${edu.Institution}|${edu.Year}`;
        const existingEduKeys = existingUser.education.map((edu: any)  => 
          `${edu.degree}|${edu.institution}|${edu.year}`
        );
        
        const educationToAdd = Education.filter(
          (edu: any) => !existingEduKeys.includes(getEduKey(edu))
        );
        
        for (const edu of educationToAdd) {
          await tx.education.create({
            data: {
              userId: existingUser.id,
              degree: edu.Degree,
              institution: edu.Institution,
              year: edu.Year,
              cgpa: edu.CGPA,
            },
          });
        }
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
    });
  } catch (error) {
    console.error('Error appending user profile data:', error);
    throw error;
  }
}